import { createVar, globalStyle, style, theme } from '@app/theme';

export const root = style({
  width: '100vw',
  height: '100vh',
  position: 'relative',
});

export const image = style({
  selectors: {
    [`${root} > &`]: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      zIndex: -1,
    },
  },
});

const menuSpace = createVar();

export const menu = style({
  vars: {
    [menuSpace]: '50px',
  },
  selectors: {
    [`${root} > &`]: {
      position: 'absolute',
      left: menuSpace,
      bottom: menuSpace,
    },
  },
});

export const title = style({
  selectors: {
    [`${menu} > &`]: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '2rem',
      textTransform: 'uppercase',
    },
  },
});

export const button = style({
  selectors: {
    [`${menu} > &`]: {
      display: 'block',
      width: '100%',
      padding: '1rem',
      fontSize: '1.5rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      color: 'white',
      backgroundColor: theme.palette.game('primary'),
      border: 'none',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease-in-out',
    },
  },
});

globalStyle(`html:has(${root}), body:has(${root})`, {
  // Disables window scrollbars to prevent the page from scrolling while playing.
  // This also prevents the white space when the scroll reaches the end of the page.
  overflow: 'hidden',
});
