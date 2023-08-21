import { renderHook } from '@testing-library/react-hooks';

import { useHandleMenu } from './use-handle-menu';

describe('useHandleMenu', () => {
  it('should return a loading state and a menu component', () => {
    const { result } = renderHook(() => useHandleMenu());

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toBe(false);
    expect(result.current[1]).toBeDefined();
  });
});
