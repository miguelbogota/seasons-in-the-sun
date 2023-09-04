import { fireEvent, render, renderHook, screen } from '@testing-library/react';

import { createCustomEvent } from './index';

const useCustomEventListener = createCustomEvent<['test-1' | 'test-2' | 'test-3'], string>({
  name: 'testing-event',
});
const emitCustomEvent = useCustomEventListener.emit;
const newCustomEventEmitter = useCustomEventListener.emitter;

describe('Lib / Custom Events', () => {
  it('should run the callback when an event is triggered', () => {
    const callback = vi.fn();
    renderHook(() => useCustomEventListener('test-1', callback));
    emitCustomEvent('test-1', 'test-1-data');
    expect(callback).toHaveBeenCalledWith('test-1-data');
  });

  it('should not run the callback when an event is triggered with a different name', () => {
    const callback = vi.fn();
    renderHook(() => useCustomEventListener('test-1', callback));
    emitCustomEvent('test-2', 'test-2-data');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should subscribe to multiple events', () => {
    const callback = vi.fn();
    renderHook(() => useCustomEventListener(['test-1', 'test-2'], callback));

    emitCustomEvent('test-1', 'test-1-data');
    expect(callback).toHaveBeenCalledWith('test-1-data');

    emitCustomEvent('test-2', 'test-2-data');
    expect(callback).toHaveBeenCalledWith('test-2-data');
  });

  it('should allow to make an emitter', () => {
    const callback = vi.fn();
    render(<TestParent callback={callback} />);
    const trigger = screen.getByTestId('trigger');

    expect(callback).not.toHaveBeenCalled();

    fireEvent.click(trigger);

    expect(callback).toHaveBeenCalledWith('test-data-1');
  });
});

/**
 * Testing component for the emitter.
 */
function TestParent({ callback }: { callback: (data: string) => void }) {
  const listener = useCustomEventListener('test-1', callback);
  const emitter = newCustomEventEmitter();
  const trigger = () => emitter.emit('test-1', 'test-data-1');

  return (
    <div ref={listener}>
      <button data-testid="trigger" ref={emitter} onClick={trigger}>
        Trigger
      </button>
    </div>
  );
}
