import { kebabCase } from 'lodash';

import { type GetColorConfig, ThemeColor, type ThemeColorOption } from './color';

/** Palette to use across all the project. */
export class ThemePalette {
  /** Palette values to use in the project. */
  static values = Object.freeze({
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
  static lightValues = Object.freeze({
    'text.primary': 'light',
    'text.secondary': 'scale-4',
    'text.disabled': 'scale-3',
    'text.inverted': 'dark',
    'background.main': 'white',
    'background.sheet': 'scale-1',
  });

  /** Palette values to use in the project in the dark theme. */
  static darkValues = Object.freeze({
    'text.primary': 'dark',
    'text.secondary': 'scale-4',
    'text.disabled': 'scale-5',
    'text.inverted': 'light',
    'background.main': 'black',
    'background.sheet': 'scale-7',
  });

  /** Global variables to pass the css engine. */
  static vars = Object.fromEntries(
    Object.entries(ThemePalette.values).map(([key, value]) => [
      `--${kebabCase(key)}`,
      `var(--${value})`,
    ]),
  );

  /** Global light variables to pass the css engine. */
  static lightVars = Object.fromEntries(
    Object.entries(ThemePalette.lightValues).map(([key, value]) => [
      `--${kebabCase(key)}`,
      `var(--${value})`,
    ]),
  );

  /** Global dark variables to pass the css engine. */
  static darkVars = Object.fromEntries(
    Object.entries(ThemePalette.darkValues).map(([key, value]) => [
      `--${kebabCase(key)}`,
      `var(--${value})`,
    ]),
  );

  /** Base colors. */
  private _colors = new ThemeColor();

  /** Return the value of a color/palette using css variables. */
  get(colorName: ThemeFullColorOption, config?: GetColorConfig) {
    const defaultConfig: Required<GetColorConfig> = {
      value: false,
      alpha: 1,
    };

    const { value, alpha } = { ...defaultConfig, ...config };

    if (alpha !== 1) {
      const color = value ? this.#resolveValue(colorName) : `var(--${kebabCase(colorName)})`;

      const colorStrength = 100 - alpha * 100;
      const transparentStrength = alpha * 100;
      return `color-mix(in srgb, ${color} ${colorStrength}%, transparent ${transparentStrength}%)`;
    }

    if (value) {
      return this.#resolveValue(colorName);
    }

    return `var(--${kebabCase(colorName)})`;
  }

  /** Returns the value of the color/palette optimized for three.js (Just the value). */
  three(colorName: ThemeFullColorOption) {
    return this.#resolveValue(colorName, true);
  }

  /** Resolves the value to return in the `get` method. */
  #resolveValue(colorName: ThemeFullColorOption, ignoreDarkMode = false) {
    if (colorName in ThemeColor.values) {
      return this._colors.get(colorName as ThemeColorOption, { value: true });
    }

    if (colorName in ThemePalette.values) {
      const key = colorName as keyof typeof ThemePalette.values;
      const color = ThemePalette.values[key];
      return this._colors.get(color as ThemeColorOption, { value: true });
    }

    const isDarkMode = ignoreDarkMode ? false : this.#isClientDarkMode();

    if (isDarkMode && colorName in ThemePalette.darkValues) {
      const key = colorName as keyof typeof ThemePalette.darkValues;
      const color = ThemePalette.darkValues[key];
      return this._colors.get(color as ThemeColorOption, { value: true });
    }

    if (!isDarkMode && colorName in ThemePalette.lightValues) {
      const key = colorName as keyof typeof ThemePalette.lightValues;
      const color = ThemePalette.lightValues[key];
      return this._colors.get(color as ThemeColorOption, { value: true });
    }
  }

  /** Returns if the client is in dark mode. */
  #isClientDarkMode() {
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
