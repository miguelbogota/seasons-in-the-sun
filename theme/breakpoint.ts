/** Breakpoints to use across all the project. */
export class ThemeBreakpoint {
  constructor(
    /** Custom values for the breakpoints. */
    _customValues?: CustomThemeBreakpoint,
  ) {
    this.values = { ...ThemeBreakpoint.defaultValues, ..._customValues?.values };
    this.#keys = Object.keys(this.values) as ThemeBreakpointOption[];
  }

  /**
   * Default values for the breakpoints.
   */
  static defaultValues = {
    xs: 0,
    sm: 550,
    md: 900,
    lg: 1200,
    xl: 1530,
    xxl: 1800,
  };

  /**
   * Values for the breakpoints.
   * The breakpoint **start** at this value.
   * For instance with the first breakpoint xs: [xs, sm).
   */
  values: Record<ThemeBreakpointOption, number>;

  /**
   * Keys of the breakpoints.
   */
  #keys: ThemeBreakpointOption[];

  /**
   * Returns a media query string which matches screen widths greater than the screen size given by
   * the breakpoint key (inclusive).
   */
  up(key: ThemeBreakpointOption) {
    const value = typeof key === 'string' ? this.values[key] : key;
    return `(min-width: ${value}px)`;
  }

  /**
   * Returns a media query string which matches screen widths less than the screen size given by the
   * breakpoint key (exclusive).
   */
  down(key: ThemeBreakpointOption) {
    const value = typeof key === 'string' ? this.values[key] : key;
    return `(max-width: ${value - 1}px)`;
  }

  /**
   * Returns a media query string which matches screen widths greater than the screen size given by
   * the breakpoint key in the first argument (inclusive) and less than the screen size given by the
   * breakpoint key in the second argument (exclusive).
   */
  between(start: ThemeBreakpointOption, end: ThemeBreakpointOption) {
    const startValue = typeof start === 'string' ? this.values[start] : start;
    const endValue = typeof end === 'string' ? this.values[end] : end;

    if (startValue > endValue) {
      throw new Error(
        `The start breakpoint (${start}) must be less than the end breakpoint (${end}).`,
      );
    }

    return `(min-width: ${startValue}px) and (max-width:${endValue - 1}px)`;
  }

  /**
   * Returns a media query string which matches screen widths starting from the screen size given by
   * the breakpoint key (inclusive) and stopping at the screen size given by the next breakpoint
   * key (exclusive).
   */
  only(key: ThemeBreakpointOption) {
    const isNumber = typeof key === 'number';

    if (isNumber) {
      return this.between(key, key + 2);
    }

    if (this.#keys.indexOf(key) + 1 < this.#keys.length) {
      return this.between(key, this.#keys[this.#keys.indexOf(key) + 1]);
    }

    return this.up(key);
  }

  /**
   * Returns a media query string which matches screen widths stopping at the screen size given by
   * the breakpoint key (exclusive) and starting at the screen size given by the next breakpoint
   * key (inclusive).
   */
  not(key: ThemeBreakpointOption) {
    const isNumber = typeof key === 'number';

    if (isNumber) {
      return 'not all and ' + this.between(key - 1, key + 1);
    }

    const keyIndex = this.#keys.indexOf(key);

    if (keyIndex === 0) {
      return this.up(this.#keys[1]);
    }
    if (keyIndex === this.#keys.length - 1) {
      return this.down(this.#keys[keyIndex]);
    }

    return 'not all and ' + this.between(key, this.#keys[this.#keys.indexOf(key) + 1]);
  }
}

/**
 * Values that can be use as a breakpoint, you can also use numbers to use a customer breakpoint.
 */
export type ThemeBreakpointOption = keyof typeof ThemeBreakpoint.defaultValues | number;

/**
 * When creating the ThemeBreakpoint class allows to pass custom values for the values.
 */
export type CustomThemeBreakpoint = {
  values?: {
    /** Phone. */
    xs?: number;
    /** Tablet. */
    sm?: number;
    /** Small Laptop */
    md?: number;
    /** Desktop. */
    lg?: number;
    /** Large Screen. */
    xl?: number;
    /** Extra Large Screen. */
    xxl?: number;
  };
};
