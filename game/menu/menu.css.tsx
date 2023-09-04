import { style, theme } from '@app/theme';

const menu = style({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 90,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette('background.sheet', { alpha: 0.5 }),
});

const button = style({
  padding: '2rem',
  backgroundColor: theme.palette('primary'),
  cursor: 'pointer',
  borderRadius: 5,
});

const loading = style({
  selectors: {
    [`${button}&`]: {
      backgroundColor: theme.palette('text.disabled'),
      cursor: 'default',
    },
  },
});

export const menuStyles = {
  menu,
  button,
  loading,
};
