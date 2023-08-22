import { ThemeSize } from './size';

describe('ThemeSize', () => {
  const size = new ThemeSize();

  it('should return the value of a size using css variables', () => {
    const size1 = size.get(1);
    expect(size1).toBe('var(--size-1)');

    const size2 = size.get(2);
    expect(size2).toBe('var(--size-2)');

    const size3 = size.get('xs');
    expect(size3).toBe('var(--size-8)');
  });

  it('should return the value of a size using css variables with config', () => {
    const size1 = size.get('xs', { xs: 1 });
    expect(size1).toBe('var(--size-1)');

    const size2 = size.get('sm', { sm: 2 });
    expect(size2).toBe('var(--size-2)');
  });

  it('should return the value of the size instead of the css variable', () => {
    const size1 = size.get('xs', { xs: 1, value: true });
    expect(size1).toBe('4rem');

    const size2 = size.get('sm', { sm: 2, value: true });
    expect(size2).toBe('3rem');

    const size3 = size.get(2, { value: true });
    expect(size3).toBe('3rem');
  });
});
