import { ThemeBreakpoint, type ThemeBreakpointOption } from './breakpoint';

describe('Theme / ThemeBreakpoint', () => {
  const breakpoint = new ThemeBreakpoint();

  it('should match `up` queries (inclusive)', () => {
    expect(breakpoint.up('sm')).toBe(`(min-width: ${value('sm')}px)`);
    expect(breakpoint.up('md')).toBe(`(min-width: ${value('md')}px)`);
    expect(breakpoint.up('lg')).toBe(`(min-width: ${value('lg')}px)`);
    expect(breakpoint.up('xl')).toBe(`(min-width: ${value('xl')}px)`);
    expect(breakpoint.up(300)).toBe(`(min-width: ${value(300)}px)`);
  });

  it('should match `down` queries (exclusive)', () => {
    expect(breakpoint.down('sm')).toBe(`(max-width: ${value('sm') - 1}px)`);
    expect(breakpoint.down('md')).toBe(`(max-width: ${value('md') - 1}px)`);
    expect(breakpoint.down('lg')).toBe(`(max-width: ${value('lg') - 1}px)`);
    expect(breakpoint.down('xl')).toBe(`(max-width: ${value('xl') - 1}px)`);
    expect(breakpoint.down(300)).toBe(`(max-width: ${value(300) - 1}px)`);
  });

  it('should match `between` queries where the start (inclusive) is less than the end (exclusive)', () => {
    expect(breakpoint.between('sm', 'md')).toBe(
      `(min-width: ${value('sm')}px) and (max-width:${value('md') - 1}px)`,
    );
    expect(breakpoint.between('md', 'lg')).toBe(
      `(min-width: ${value('md')}px) and (max-width:${value('lg') - 1}px)`,
    );
    expect(breakpoint.between('lg', 'xl')).toBe(
      `(min-width: ${value('lg')}px) and (max-width:${value('xl') - 1}px)`,
    );
    expect(breakpoint.between('xl', 1900)).toBe(
      `(min-width: ${value('xl')}px) and (max-width:${value(1900) - 1}px)`,
    );

    const thrown = () => breakpoint.between('md', 300);
    expect(thrown).toThrowError(
      'The start breakpoint (md) must be less than the end breakpoint (300).',
    );
  });

  it('should match `only` queries where the start (inclusive) is less than the end (exclusive)', () => {
    expect(breakpoint.only('sm')).toBe(
      `(min-width: ${value('sm')}px) and (max-width:${value('md') - 1}px)`,
    );
    expect(breakpoint.only('md')).toBe(
      `(min-width: ${value('md')}px) and (max-width:${value('lg') - 1}px)`,
    );
    expect(breakpoint.only('lg')).toBe(
      `(min-width: ${value('lg')}px) and (max-width:${value('xl') - 1}px)`,
    );
    expect(breakpoint.only('xxl')).toBe(`(min-width: ${value('xxl')}px)`);
    expect(breakpoint.only(300)).toBe(
      `(min-width: ${value(300)}px) and (max-width:${value(300) + 1}px)`,
    );
  });

  it('should match `not` queries where the start (inclusive) is less than the end (exclusive)', () => {
    expect(breakpoint.not('sm')).toBe(
      `not all and (min-width: ${value('sm')}px) and (max-width:${value('md') - 1}px)`,
    );
    expect(breakpoint.not('md')).toBe(
      `not all and (min-width: ${value('md')}px) and (max-width:${value('lg') - 1}px)`,
    );
    expect(breakpoint.not('lg')).toBe(
      `not all and (min-width: ${value('lg')}px) and (max-width:${value('xl') - 1}px)`,
    );
    expect(breakpoint.not('xxl')).toBe(`(max-width: ${value('xxl') - 1}px)`);
    expect(breakpoint.not(300)).toBe(
      `not all and (min-width: ${value(300) - 1}px) and (max-width:${value(300)}px)`,
    );
  });

  it('should allow custom breakpoints', () => {
    const customBreakpoint = new ThemeBreakpoint({
      values: {
        xs: 0,
        sm: 0,
        md: 0,
        lg: 0,
        xl: 0,
        xxl: 0,
      },
    });

    expect(customBreakpoint.up('sm')).toBe('(min-width: 0px)');
    expect(customBreakpoint.down('md')).toBe('(max-width: -1px)');
  });
});

function value(breakpoint: ThemeBreakpointOption, exclusive = false) {
  const isBreakpointString = typeof breakpoint === 'string';
  const breakpointValue = isBreakpointString
    ? new ThemeBreakpoint().values[breakpoint]
    : breakpoint;
  return breakpointValue - (exclusive ? 1 : 0);
}
