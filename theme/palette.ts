import { kebabCase } from 'lodash';

import {
  type CustomThemeColor,
  type GetColorConfig,
  ThemeColor,
  type ThemeColorOption,
} from './color';

/** Palette to use across all the project. */
export class ThemePalette {
  constructor(
    /** Custom values for the palette. */
    _customValues?: CustomThemePalette,
  ) {
    const defaultValues = ThemePalette.defaultValues;
    const customValues = _customValues?.values;

    this.values = {
      base: { ...defaultValues.base, ...customValues?.base },
      light: { ...defaultValues.light, ...customValues?.light },
      dark: { ...defaultValues.dark, ...customValues?.dark },
    };

    this.vars = {
      base: this.#mapToCssVar(this.values.base),
      light: this.#mapToCssVar(this.values.light),
      dark: this.#mapToCssVar(this.values.dark),
    };

    this.#colors = new ThemeColor(_customValues?.colors);
  }

  /**
   * Default values for the palette.
   */
  static defaultValues = {
    base: {
      primary: 'teal',
      secondary: 'pink',
      info: 'blue',
      success: 'green',
      warning: 'amber',
      error: 'red',
      divider: 'teal',

      'text.light': 'scale1',
      'text.dark': 'scale7',
    },
    light: {
      'text.primary': 'light',
      'text.secondary': 'scale4',
      'text.disabled': 'scale3',
      'text.inverted': 'dark',
      'background.main': 'white',
      'background.sheet': 'scale1',
    },
    dark: {
      'text.primary': 'dark',
      'text.secondary': 'scale4',
      'text.disabled': 'scale5',
      'text.inverted': 'light',
      'background.main': 'black',
      'background.sheet': 'scale7',
    },
  };

  /**
   * Global variables to pass the css engine.
   */
  vars: {
    base: Record<string, string>;
    light: Record<string, string>;
    dark: Record<string, string>;
  };

  /**
   * Color values to use in the project.
   */
  values: typeof ThemePalette.defaultValues;

  /**
   * Base colors.
   */
  #colors: ThemeColor;

  /**
   * Return the value of a color/palette using css variables.
   */
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

  /**
   * Returns the value of the color/palette optimized for three.js (Just the value).
   */
  three(colorName: ThemeFullColorOption) {
    return this.#resolveValue(colorName, true);
  }

  /**
   * Resolves the value to return in the `get` method.
   */
  #resolveValue(colorName: ThemeFullColorOption, ignoreDarkMode = false) {
    if (colorName in this.#colors.values) {
      return this.#colors.get(colorName as ThemeColorOption, { value: true });
    }

    if (colorName in this.values.base) {
      const key = colorName as ThemePaletteBaseOption;
      const color = this.values.base[key];
      return this.#colors.get(color as ThemeColorOption, { value: true });
    }

    const isDarkMode = ignoreDarkMode ? false : this.#isClientDarkMode();

    if (isDarkMode && colorName in this.values.dark) {
      const key = colorName as ThemePaletteModeOptions;
      const color = this.values.dark[key];
      return this.#colors.get(color as ThemeColorOption, { value: true });
    }

    if (!isDarkMode && colorName in this.values.light) {
      const key = colorName as ThemePaletteModeOptions;
      const color = this.values.light[key];
      return this.#colors.get(color as ThemeColorOption, { value: true });
    }
  }

  /**
   * Returns if the client is in dark mode.
   */
  #isClientDarkMode() {
    return typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  }

  /**
   * Internal method to map the values to css variables.
   */
  #mapToCssVar(vars: Record<string, string>) {
    return Object.fromEntries(
      Object.entries(vars).map(([key, value]) => [
        `--${kebabCase(key)}`,
        `var(--${kebabCase(value)})`,
      ]),
    );
  }
}

/**
 * Keys of the base palette values.
 */
export type ThemePaletteBaseOption = keyof (typeof ThemePalette.defaultValues)['base'];

/**
 * Keys of the palette values that depends on the user mode.
 */
export type ThemePaletteModeOptions = keyof (typeof ThemePalette.defaultValues)['light'];

/**
 * Keys of the palette values.
 */
export type ThemePaletteOption = ThemePaletteBaseOption | ThemePaletteModeOptions;

/**
 * Keys of the palette and color values.
 */
export type ThemeFullColorOption = ThemePaletteOption | ThemeColorOption;

/**
 * When creating the ThemePalette class allows to pass custom values for the values.
 */
export type CustomThemePalette = {
  colors?: CustomThemeColor;
  values?: {
    base?: Partial<Record<ThemePaletteBaseOption, ThemeColorOption>>;
    light?: Partial<Record<ThemePaletteModeOptions, ThemeColorOption>>;
    dark?: Partial<Record<ThemePaletteModeOptions, ThemeColorOption>>;
  };
};
