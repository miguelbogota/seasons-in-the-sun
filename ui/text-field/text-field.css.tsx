import { createVar, globalStyle, style } from '@vanilla-extract/css';

const color = createVar();
const size = createVar();

export const root = style({
  vars: {
    [color]: '#333333',
    [size]: '0.9rem',
  },
  // display: 'inline-block',
  marginBottom: '0.6rem', // Remove after testing.
  marginTop: '0.6rem', // Remove after testing.
  display: 'block',
  position: 'relative',
  padding: 5,
  borderRadius: 3,
  border: `1px solid ${color}`,
});

export const input = style({
  selectors: {
    [`${root} > &`]: {
      fontSize: '1em',
      color,
      backgroundColor: '#ffffff',
      backgroundClip: 'padding-box',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    },
  },
});

export const label = style({
  selectors: {
    [`${root} > &`]: {
      position: 'absolute',
      display: 'block',
      top: '-0.5em',
      fontSize: '0.66em',
      padding: '0px 5px',
      backgroundColor: '#ffffff',
      transition: 'font-size 0.1s ease-in-out, top 0.1s ease-in-out',
      color,
    },
  },
});

globalStyle(`${input}::placeholder`, {
  opacity: 0,
});

globalStyle(`${input}:placeholder-shown`, {
  paddingTop: 0,
  fontSize: '1em',
});

globalStyle(`${input}:placeholder-shown:focus-visible::placeholder`, {
  opacity: 1,
});

globalStyle(`${input}:placeholder-shown:focus-visible + ${label}`, {
  top: '-0.5em',
  fontSize: '0.66em',
});

globalStyle(`${input}:placeholder-shown + ${label}`, {
  top: '0.3em',
  fontSize: '1em',
});

export const hint = style({
  selectors: {
    [`${root} > &`]: {},
  },
});
