import { ThemeBreakpoint } from './breakpoint';
import { ThemePalette } from './palette';

export { type ThemeBreakpoint, type ThemeBreakpointOption } from './breakpoint';
export { type GetColorConfig, type ThemeColor, type ThemeColorOption } from './color';
export { type ThemeFullColorOption, type ThemePalette, type ThemePaletteOption } from './palette';

/** Theme object with all the values to use in the project styling. */
export const theme = Object.freeze({
  get breakpoints() {
    return new ThemeBreakpoint();
  },
  get palette() {
    const palette = new ThemePalette();
    return palette.get;
  },
});

/** Type of the theme. */
export type Theme = typeof theme;
