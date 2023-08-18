import '@vanilla-extract/css';

import { type PropertiesFallback } from 'csstype';

declare module '@vanilla-extract/css' {
  interface CSSProperties extends PropertiesFallback<number | (string & object)> {
    WebkitLineBreak?: 'auto' | 'loose' | 'normal' | 'strict' | 'after-white-space';
    WebkitUserDrag?: 'element' | 'none' | 'auto';
  }
}
