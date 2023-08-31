import { kebabCase } from 'lodash';

/** Colors to use across all the project. */
export class ThemeColor {
  constructor(
    /** Custom values for the colors. */
    _customValues?: CustomThemeColor,
  ) {
    this.values = { ...ThemeColor.defaultValues, ..._customValues?.values };
    this.vars = Object.fromEntries(
      Object.entries(this.values).map(([key, value]) => [`--${kebabCase(key)}`, value]),
    );
  }

  /**
   * Default values for the colors.
   */
  static defaultValues = {
    white: '#ffffff',
    light: '#c7c7c7',
    dark: '#4b4b4b',
    black: '#000000',
    scale1: '#f6f6f6',
    scale2: '#d8d8d8',
    scale3: '#bbbbbb',
    scale4: '#8f8f8f',
    scale5: '#5a5a5a',
    scale6: '#3b3b3b',
    scale7: '#212121',
    red: '#d32f2f',
    pink: '#c2185b',
    purple: '#7b1fa2',
    deeppurple: '#512da8',
    indigo: '#303f9f',
    blue: '#1976d2',
    lightblue: '#0288d1',
    cyan: '#0097a7',
    teal: '#00796b',
    green: '#388e3c',
    lightgreen: '#689f38',
    lime: '#afb42b',
    yellow: '#fdd835',
    amber: '#ffb300',
    orange: '#f57c00',
    deeporange: '#e64a19',
    brown: '#5d4037',
    grey: '#616161',
    bluegrey: '#455a64',
    transparent: 'transparent',
  };

  /**
   * Global variables to pass the css engine.
   */
  vars: Record<string, string>;

  /**
   * Color values to use in the project.
   */
  values: typeof ThemeColor.defaultValues;

  /**
   * Return the value of a color using css variables.
   */
  get(colorName: ThemeColorOption, config?: GetColorConfig) {
    const defaultConfig: Required<GetColorConfig> = {
      value: false,
      alpha: 1,
    };

    const { value, alpha } = { ...defaultConfig, ...config };

    if (alpha !== 1) {
      const color = value ? this.values[colorName] : `var(--${kebabCase(colorName)})`;

      const colorStrength = 100 - alpha * 100;
      const transparentStrength = alpha * 100;
      return `color-mix(in srgb, ${color} ${colorStrength}%, transparent ${transparentStrength}%)`;
    }

    if (value) {
      return this.values[colorName];
    }

    return `var(--${kebabCase(colorName)})`;
  }
}

/**
 * Configuration for the get method.
 */
export type GetColorConfig = {
  /**
   * If true it will return the value of the color instead of the css variable (Defaults to false).
   */
  value?: boolean;
  /** Alpha value of the color (Defaults to 1). */
  alpha?: number;
};

/**
 * Union type with the allowed colors of the theme.
 */
export type ThemeColorOption = keyof typeof ThemeColor.defaultValues;

/**
 * When creating the ThemeColor class allows to pass custom values for the values.
 */
export type CustomThemeColor = {
  values?: Partial<typeof ThemeColor.defaultValues>;
};
