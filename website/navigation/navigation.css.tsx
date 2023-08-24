import { style } from '@vanilla-extract/css';

export const navigation = style({
  position: 'fixed',
  zIndex: 100,
  top: 0,
  right: 0,
  padding: '1rem',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '1rem',
});
