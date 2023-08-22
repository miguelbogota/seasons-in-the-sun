import { type ThemeDerivedSizeOption } from './utils';

export class ThemeSize {
  /** Size values to use in the project. */
  static values = Object.freeze({
    1: '4rem',
    2: '3rem',
    3: '2.3rem',
    4: '1.5rem',
    5: '1.25rem',
    6: '1rem',
    7: '0.88rem',
    8: '0.7rem',
  });

  /** Return the value of a size using css variables. */
  get(size: ThemeSizeOption, config?: GetSizeConfig) {
    const defaultConfig: Required<GetSizeConfig> = {
      xs: 8,
      sm: 7,
      md: 6,
      lg: 3,
      xl: 2,
      xxl: 1,
      value: false,
    };

    // Uses default config along side passed config.
    const { value, ...sizesPassed } = { ...defaultConfig, ...config };

    if (typeof size !== 'string') {
      return this.#resolveValue(size, value);
    }

    const fontSize = Object.entries(sizesPassed).find(([key]) => key === size)?.[1];

    if (!fontSize) {
      throw new Error(`The size "${size}" was not found.`);
    }

    return this.#resolveValue(fontSize, value);
  }

  /** Resolves the value to return in the `get` method. */
  #resolveValue(size: ThemeRawSizeOption, value: boolean) {
    return value ? ThemeSize.values[size] : `var(--size-${size})`;
  }
}

/** Configuration for the sizeResolver function. */
export type GetSizeConfig = {
  /**
   * If true it will return the value of the size instead of the css variable (Defaults to false).
   */
  value?: boolean;
  xs?: ThemeRawSizeOption;
  sm?: ThemeRawSizeOption;
  md?: ThemeRawSizeOption;
  lg?: ThemeRawSizeOption;
  xl?: ThemeRawSizeOption;
  xxl?: ThemeRawSizeOption;
};

/** Values for the raw sizes. */
export type ThemeRawSizeOption = keyof typeof ThemeSize.values;

/** All allowed sizes to use in the project. */
export type ThemeSizeOption = ThemeRawSizeOption | ThemeDerivedSizeOption;
