# Custom Events lib.

## Why

React way of handling events is to pass callbacks to child components.
Although this is a good way, it becomes difficult to pass callbacks to deep nested components or
three.js components which are not part of React ecosystem.

This is where Custom Events come in handy. They can be used to send events to any component in DOM
tree, no matter how deep it is nested.

## How to use

#### Create Custom Event Emitter

```tsx
import { createCustomEvent } from '@lib/custom-events';

type CustomEventTypes = ['test-1' | 'test-2' | 'test-3'];
type CustomEventDataType = string;

const useCustomEventListener = createCustomEvent<CustomEventTypes, CustomEventDataType>();
```

#### Listen Event

```tsx
function Component() {
  useCustomEventListener('test-1', (data) => {
    // Do something with data...
  });

  return <div>Hello World</div>;
}
```

If using state in listener handler, it's recommended to provide dependency list (same as second
parameter of `useEffect`)

```tsx
useCustomEventListener(
  'test-1',
  (data) => {
    doSomethingWithDataAndStates(data, state1, state2);
  },
  [state1, state2],
);
```

No need to remove event listener, it uses react's useEffect hook to remove listener on component
unmount

And no need to worry about where component is present in dom, these events can be sent and listened
to anywhere

#### Emit Event

To emit an event, use `emit` method of `useCustomEventListener`. It takes two parameters, first is
the event name and second one is the data to be sent with the event.

```tsx
useCustomEventListener.emit('test-1', 'Hello World');
```

## Event Bubbling

If you want to listen events from child elements only (ignoring events from non-child elements),
then need to attach listener and emitter to elements.

#### Emit Event in Child component

```tsx
function ChildComponent() {
  const emitter = useCustomEventListener.emitter();

  const handler = () => emitter.emit('test-1', 'Hello World');

  return (
    <button ref={emitter} onClick={handler}>
      Fire Event
    </button>
    // or <button ref={el => emitter(el)} />
  );
}
```

#### Listen Event in Parent Component

```jsx
function ParentComponent() {
  const listener = useCustomEventListener('test-1', (data) => {
    // Do something with data...
  });

  return (
    <div ref={listener}>
      <ChildComponent />
    </div>
    // or <div ref={el => listener(el)} />
  );
}
```

This uses bubble feature of DOM Events, so make sure listener element is parent of emitter element
in your DOM
