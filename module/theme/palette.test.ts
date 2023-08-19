import { ThemePalette } from './palette';

describe('ThemePalette', () => {
  const palette = new ThemePalette();

  it('should return the value of a palette/color using css variables', () => {
    const color1 = palette.get('primary');
    expect(color1).toBe('var(--primary)');

    const color2 = palette.get('white');
    expect(color2).toBe('var(--white)');
  });

  it('should return the value of the color/palette', () => {
    const color1 = palette.get('primary', { value: true });
    expect(color1).toBe('#00796b');

    const white = palette.get('white', { value: true });
    expect(white).toBe('#ffffff');
  });

  it('should return the value of a palette/color using css variables with alpha', () => {
    const color1 = palette.get('primary', { alpha: 0.5 });
    expect(color1).toBe('color-mix(in srgb, var(--primary) 50%, transparent 50%)');

    const color2 = palette.get('white', { alpha: 0.5 });
    expect(color2).toBe('color-mix(in srgb, var(--white) 50%, transparent 50%)');
  });

  it('should return the value of the color/palette with alpha', () => {
    const color1 = palette.get('primary', { value: true, alpha: 0.5 });
    expect(color1).toBe('color-mix(in srgb, #00796b 50%, transparent 50%)');

    const color2 = palette.get('white', { value: true, alpha: 0.5 });
    expect(color2).toBe('color-mix(in srgb, #ffffff 50%, transparent 50%)');
  });
});
