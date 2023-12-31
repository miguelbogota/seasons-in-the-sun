import { type DependencyList, useEffect } from 'react';

/**
 * Creates a typesafe custom event listener for React.
 */
export function createCustomEvent<const T extends string, TData>(config?: CustomEventConfig) {
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
   * Payload dispatched by the custom event.
   */
  type Payload<E> = [event: E extends string[] ? E[number] : E, data: TData];

  /**
   * Creates a custom event listener hook to be used in React.
   */
  function useCustomEventListener<const E extends T | T[]>(
    eventNames: E,
    eventHandler: (payload: Payload<E>) => void,
    deps?: DependencyList,
  ) {
    let element: HTMLElement | null;

    useEffect(() => {
      element ??= getElement();

      const handleEvent = (event: CustomEvent | Event, eventName: string) => {
        const payload = [eventName, (event as CustomEvent).detail] as Payload<E>;
        eventHandler(payload);

        if (debug) {
          console.warn(`[${name} triggered] "${eventName}" - ${JSON.stringify(payload)}.`);
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
