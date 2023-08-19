import './reset.css';
import '@app/module/theme/_setup.css';

import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  width: '100%',
  height: '100%',
});