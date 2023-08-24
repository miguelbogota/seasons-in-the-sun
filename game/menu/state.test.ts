import { act, renderHook } from '@testing-library/react';

import { useGameMenuState } from './state';

describe('Game / Menu / State', () => {
  it('should have the correct initial state', () => {
    const { result } = renderHook(() => useGameMenuState());
    expect(result.current.isOpen).toBe(true);
  });

  it('should toggle the menu', () => {
    const { result } = renderHook(() => useGameMenuState());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
  });

  it('should return the selector with and without the prefix', () => {
    const { result } = renderHook(() => useGameMenuState());
    expect(result.current.selector()).toBe('play-button');
    expect(result.current.selector(true)).toBe('#play-button');
  });
});
