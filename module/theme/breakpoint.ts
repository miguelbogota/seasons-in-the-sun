/** Breakpoints to use across all the project. */
export class ThemeBreakpoint {
  /**
   * Values for the breakpoints.
   * The breakpoint **start** at this value.
   * For instance with the first breakpoint xs: [xs, sm).
   */
  public static values = Object.freeze({
    /** Phone. */
    xs: 0,
    /** Tablet. */
    sm: 550,
    /** Small Laptop */
    md: 900,
    /** Desktop. */
    lg: 1200,
    /** Large Screen. */
    xl: 1530,
  });

  /** Keys of the breakpoints. */
  private keys = Object.keys(ThemeBreakpoint.values) as ThemeBreakpointOption[];

  /**
   * Returns a media query string which matches screen widths greater than the screen size given by
   * the breakpoint key (inclusive).
   */
  public up(key: ThemeBreakpointOption) {
    const value = typeof key === 'string' ? ThemeBreakpoint.values[key] : key;
    return `(min-width: ${value}px)`;
  }

  /**
   * Returns a media query string which matches screen widths less than the screen size given by the
   * breakpoint key (exclusive).
   */
  public down(key: ThemeBreakpointOption) {
    const value = typeof key === 'string' ? ThemeBreakpoint.values[key] : key;
    return `(max-width: ${value - 1}px)`;
  }

  /**
   * Returns a media query string which matches screen widths greater than the screen size given by
   * the breakpoint key in the first argument (inclusive) and less than the screen size given by the
   * breakpoint key in the second argument (exclusive).
   */
  public between(start: ThemeBreakpointOption, end: ThemeBreakpointOption) {
    const startValue = typeof start === 'string' ? ThemeBreakpoint.values[start] : start;
    const endValue = typeof end === 'string' ? ThemeBreakpoint.values[end] : end;

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
  public only(key: ThemeBreakpointOption) {
    const isNumber = typeof key === 'number';

    if (isNumber) {
      return this.between(key, key + 2);
    }

    if (this.keys.indexOf(key) + 1 < this.keys.length) {
      return this.between(key, this.keys[this.keys.indexOf(key) + 1]);
    }

    return this.up(key);
  }

  /**
   * Returns a media query string which matches screen widths stopping at the screen size given by
   * the breakpoint key (exclusive) and starting at the screen size given by the next breakpoint
   * key (inclusive).
   */
  public not(key: ThemeBreakpointOption) {
    const isNumber = typeof key === 'number';

    if (isNumber) {
      return 'not all and ' + this.between(key - 1, key + 1);
    }

    const keyIndex = this.keys.indexOf(key);

    if (keyIndex === 0) {
      return this.up(this.keys[1]);
    }
    if (keyIndex === this.keys.length - 1) {
      return this.down(this.keys[keyIndex]);
    }

    return 'not all and ' + this.between(key, this.keys[this.keys.indexOf(key) + 1]);
  }
}

/**
 * Values that can be use as a breakpoint, you can also use numbers to use a customer breakpoint.
 */
export type ThemeBreakpointOption = keyof typeof ThemeBreakpoint.values | number;
