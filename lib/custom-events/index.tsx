import { type DependencyList, useEffect } from 'react';

/**
 * Creates a typesafe custom event listener for React.
 */
export function customCustomEvent<const T extends string[], TData>(config?: CustomEventConfig) {
  const defaultConfig: Required<CustomEventConfig> = {
    name: 'unnamed',
    debug: false,
  };

  const { name, debug } = { ...defaultConfig, ...config };

  let targetElement: undefined | HTMLDivElement;

  /**
   * Returns the target element if it exists, otherwise creates it.
   */
  function getElement() {
    if (!targetElement) {
      targetElement = document.createElement('div');
    }
    return targetElement;
  }

  /**
   * Creates a custom event listener hook to be used in React.
   */
  function useCustomEventListener(
    eventNames: T[number] | T[number][],
    eventHandler: (data: TData) => void,
    deps?: DependencyList,
  ) {
    let element: HTMLElement | null;

    useEffect(() => {
      // Rule disabled since the function will always return the latest value.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      element ??= getElement();

      const handleEvent = (event: CustomEvent | Event, eventName: T[number]) => {
        const data = (event as CustomEvent).detail;
        eventHandler(data);

        if (debug) {
          console.warn(`[${name} triggered] "${eventName}" - ${JSON.stringify(data)}.`);
        }
      };

      // If the eventNames is an array, we need to add the event listener for each event name.
      if (eventNames instanceof Array) {
        eventNames.forEach((eventName) => {
          element?.addEventListener(eventName, (e) => handleEvent(e, eventName), false);
        });
        return () => {
          eventNames.forEach((eventName) => {
            element?.removeEventListener(eventName, (e) => handleEvent(e, eventName), false);
          });
        };
      }

      element.addEventListener(eventNames, (e) => handleEvent(e, eventNames), false);
      return () => {
        element?.removeEventListener(eventNames, (e) => handleEvent(e, eventNames), false);
      };
    }, deps);

    // Returns a ref since we need to attach the event listener to an element.
    // It's important to attach it to a parent element, otherwise the event won't bubble up.
    return (el: HTMLElement | null) => {
      element = el;
    };
  }

  /**
   * Emits a custom event (usefull to emit events from outside React).
   */
  function emitCustomEvent(eventName: T[number], data: TData): void {
    const element = getElement();
    const event = new CustomEvent(eventName, { detail: data });
    element.dispatchEvent(event);
  }

  /**
   * Creates an emitter to be used within React.
   */
  function emitter() {
    let element: HTMLElement | null;

    /**
     * Sets the ref element to be used as an emitter.
     */
    const setElement = (el: HTMLElement | null) => (element = el);

    /**
     * Emits a custom event (usefull to emit events from within React).
     */
    function emit(eventName: T[number], data: TData) {
      const event = new CustomEvent(eventName, { bubbles: true, detail: data });
      element?.dispatchEvent(event);
    }

    setElement.emit = emit;
    return setElement;
  }

  useCustomEventListener.emit = emitCustomEvent;
  useCustomEventListener.emitter = emitter;

  return useCustomEventListener;
}

/**
 * Configuration for the custom event.
 */
export type CustomEventConfig = {
  /**
   * Name of the custom event (Usefull for debugging).
   */
  name?: string;
  /**
   * If true, will log the event data to the console.
   */
  debug?: boolean;
};
