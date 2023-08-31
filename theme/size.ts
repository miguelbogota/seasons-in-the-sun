export class ThemeSize {
  constructor(_customValues?: CustomThemeSize) {
    this.values = {
      base: { ...ThemeSize.defaultValues.base, ..._customValues?.values?.base },
      derived: { ...ThemeSize.defaultValues.derived, ..._customValues?.values?.derived },
    };

    this.vars = Object.fromEntries(
      Object.entries(this.values.base).map(([key, value]) => [`--size-${key}`, value]),
    );
  }

  /**
   * Default values for the sizes.
   */
  static defaultValues = {
    base: {
      1: '4rem',
      2: '3rem',
      3: '2.3rem',
      4: '1.5rem',
      5: '1.25rem',
      6: '1rem',
      7: '0.88rem',
      8: '0.7rem',
    },
    derived: {
      xs: 8,
      sm: 7,
      md: 6,
      lg: 3,
      xl: 2,
      xxl: 1,
    },
  };

  /**
   * Size values to use in the project.
   */
  values: typeof ThemeSize.defaultValues;

  /**
   * Global variables to pass the css engine.
   */
  vars: Record<string, string>;

  /**
   * Return the value of a size using css variables.
   */
  get(size: ThemeSizeOption, config?: GetSizeConfig) {
    const defaultConfig: Required<GetSizeConfig> = {
      value: false,
    };

    // Uses default config along side passed config.
    const { value } = { ...defaultConfig, ...config };

    if (typeof size !== 'string') {
      return this.#resolveValue(size, value);
    }

    const derrivedSize = Object.entries(this.values.derived).find(([key]) => key === size)?.[1] as
      | ThemeRawSizeOption
      | undefined;

    if (!derrivedSize) {
      throw new Error(`The size "${size}" was not found.`);
    }

    return this.#resolveValue(derrivedSize, value);
  }

  /**
   * Resolves the value to return in the `get` method.
   */
  #resolveValue(size: ThemeRawSizeOption, value: boolean) {
    return value ? this.values.base[size] : `var(--size-${size})`;
  }
}

/**
 * Configuration for the sizeResolver function.
 */
export type GetSizeConfig = {
  /**
   * If true it will return the value of the size instead of the css variable (Defaults to false).
   */
  value?: boolean;
};

/**
 * Values for the raw sizes.
 */
export type ThemeRawSizeOption = keyof typeof ThemeSize.defaultValues.base;

/**
 * All allowed sizes to use in the project.
 */
export type ThemeSizeOption = ThemeRawSizeOption | keyof typeof ThemeSize.defaultValues.derived;

/**
 * When creating the ThemeSize class allows to pass custom values for the values.
 */
export type CustomThemeSize = {
  values?: {
    base?: {
      1?: string;
      2?: string;
      3?: string;
      4?: string;
      5?: string;
      6?: string;
      7?: string;
      8?: string;
    };
    derived?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      xxl?: number;
    };
  };
};
