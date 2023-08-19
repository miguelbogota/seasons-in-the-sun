import { globalStyle } from '@vanilla-extract/css';

import { ThemeColor } from './color';
import { ThemePalette } from './palette';

globalStyle(':root', {
  vars: {
    ...ThemeColor.vars,
    ...ThemePalette.vars,
    ...ThemePalette.lightVars,
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: {
        ...ThemePalette.darkVars,
      },
    },
  },
});
