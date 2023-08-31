import { ThemeColor } from './color';

describe('Theme / ThemeColor', () => {
  const color = new ThemeColor();

  it('should return the value of a color using css variables', () => {
    const colorVale = color.get('green');
    expect(colorVale).toBe('var(--green)');
  });

  it('should return the value of the color', () => {
    const colorVale = color.get('green', { value: true });
    expect(colorVale).toBe('#388e3c');
  });

  it('should return the value of a color using css variables with alpha', () => {
    const colorVale = color.get('green', { alpha: 0.5 });
    expect(colorVale).toBe('color-mix(in srgb, var(--green) 50%, transparent 50%)');
  });

  it('should return the value of the color with alpha', () => {
    const colorVale = color.get('green', { value: true, alpha: 0.5 });
    expect(colorVale).toBe('color-mix(in srgb, #388e3c 50%, transparent 50%)');
  });

  it('should allow  custom colors', () => {
    const customColor = new ThemeColor({
      values: {
        green: '#00ff00',
      },
    });

    const colorVale = customColor.get('green');
    expect(colorVale).toBe('var(--green)');

    const colorVale2 = customColor.get('green', { value: true });
    expect(colorVale2).toBe('#00ff00');
  });
});
