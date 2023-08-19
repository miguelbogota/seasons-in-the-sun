import { kebabCase } from 'lodash';

import { type GetColorConfig, ThemeColor, type ThemeColorOption } from './color';

/** Palette to use across all the project. */
export class ThemePalette {
  /** Palette values to use in the project. */
  public static values = Object.freeze({
    primary: 'teal',
    secondary: 'pink',
    info: 'blue',
    success: 'green',
    warning: 'amber',
    error: 'red',
    divider: 'teal',

    'text.light': 'scale1',
    'text.dark': 'scale7',
  });

  /** Palette values to use in the project in the light theme. */
  public static lightValues = Object.freeze({
    'text.primary': 'light',
    'text.secondary': 'scale4',
    'text.disabled': 'scale3',
    'text.inverted': 'dark',
    'background.main': 'white',
    'background.sheet': 'scale1',
  });

  /** Palette values to use in the project in the dark theme. */
  public static darkValues = Object.freeze({
    'text.primary': 'dark',
    'text.secondary': 'scale4',
    'text.disabled': 'scale5',
    'text.inverted': 'light',
    'background.main': 'black',
    'background.sheet': 'scale7',
  });

  /** Global variables to pass the css engine. */
  public static vars = Object.fromEntries(
    Object.entries(ThemePalette.values).map(([key, value]) => [
      `--${kebabCase(key)}`,
      `var(--${value})`,
    ]),
  );

  /** Global light variables to pass the css engine. */
  public static lightVars = Object.fromEntries(
    Object.entries(ThemePalette.lightValues).map(([key, value]) => [
      `--${kebabCase(key)}`,
      `var(--${value})`,
    ]),
  );

  /** Global dark variables to pass the css engine. */
  public static darkVars = Object.fromEntries(
    Object.entries(ThemePalette.darkValues).map(([key, value]) => [
      `--${kebabCase(key)}`,
      `var(--${value})`,
    ]),
  );

  /** Base colors. */
  private colors = new ThemeColor();

  /** Return the value of a color/palette using css variables. */
  public get(colorName: ThemeFullColorOption, config?: GetColorConfig) {
    const defaultConfig: Required<GetColorConfig> = {
      value: false,
      alpha: 1,
    };

    const { value, alpha } = { ...defaultConfig, ...config };

    if (alpha !== 1) {
      const color = value ? this.resolveColorValue(colorName) : `var(--${kebabCase(colorName)})`;

      const colorStrength = 100 - alpha * 100;
      const transparentStrength = alpha * 100;
      return `color-mix(in srgb, ${color} ${colorStrength}%, transparent ${transparentStrength}%)`;
    }

    if (value) {
      return this.resolveColorValue(colorName);
    }

    return `var(--${kebabCase(colorName)})`;
  }

  private resolveColorValue(colorName: ThemeFullColorOption) {
    if (colorName in ThemeColor.values) {
      return this.colors.get(colorName as ThemeColorOption, { value: true });
    }

    if (colorName in ThemePalette.values) {
      const key = colorName as keyof typeof ThemePalette.values;
      const color = ThemePalette.values[key];
      return this.colors.get(color as ThemeColorOption, { value: true });
    }

    const isDarkMode = this.isClientDarkMode();

    if (isDarkMode && colorName in ThemePalette.darkValues) {
      const key = colorName as keyof typeof ThemePalette.darkValues;
      const color = ThemePalette.darkValues[key];
      return this.colors.get(color as ThemeColorOption, { value: true });
    }

    if (!isDarkMode && colorName in ThemePalette.lightValues) {
      const key = colorName as keyof typeof ThemePalette.lightValues;
      const color = ThemePalette.lightValues[key];
      return this.colors.get(color as ThemeColorOption, { value: true });
    }
  }

  private isClientDarkMode() {
    return typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  }
}

/** Keys of the palette values. */
export type ThemePaletteOption = keyof (typeof ThemePalette.values &
  typeof ThemePalette.lightValues);

/** Keys of the palette and color values. */
export type ThemeFullColorOption = ThemePaletteOption | ThemeColorOption;
