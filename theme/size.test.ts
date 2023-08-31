import { ThemeSize } from './size';

describe('Theme / ThemeSize', () => {
  const size = new ThemeSize();

  it('should return the value of a size using css variables', () => {
    const size1 = size.get(1);
    expect(size1).toBe('var(--size-1)');

    const size2 = size.get(2);
    expect(size2).toBe('var(--size-2)');

    const size3 = size.get('xs');
    expect(size3).toBe('var(--size-8)');
  });

  it('should allow custom values', () => {
    const customSize = new ThemeSize({
      values: {
        base: {
          1: '1px',
          2: '2px',
        },
        derived: {
          xs: 1,
          sm: 2,
        },
      },
    });

    const size1 = customSize.get('xs');
    expect(size1).toBe('var(--size-1)');

    const size2 = customSize.get('sm');
    expect(size2).toBe('var(--size-2)');
  });
});
