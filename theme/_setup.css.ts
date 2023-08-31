import { globalStyle } from '@vanilla-extract/css';

import { ThemeColor } from './color';
import { ThemePalette } from './palette';
import { ThemeSize } from './size';

const color = new ThemeColor();
const palette = new ThemePalette();
const size = new ThemeSize();

globalStyle(':root', {
  vars: {
    ...palette.vars.base,
    ...color.vars,
    ...size.vars,
  },
  '@media': {
    '(prefers-color-scheme: light)': {
      vars: {
        ...palette.vars.light,
      },
    },
    '(prefers-color-scheme: dark)': {
      vars: {
        ...palette.vars.dark,
      },
    },
  },
});
