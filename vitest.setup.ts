import 'vitest-canvas-mock';

import * as matchers from 'jest-extended';
import React from 'react';
import { expect } from 'vitest';

global.React = React;
expect.extend(matchers);

// Disables certain console warnings
const ignoredWarnings = ['WARNING: Multiple instances of Three.js being imported.'];
for (const [key, fn] of Object.entries(console)) {
  (console as any)[key] = (...msg: any) => {
    if (
      !ignoredWarnings.some((warning) => typeof msg[0] === 'string' && msg[0].includes(warning))
    ) {
      fn(...msg);
    }
  };
}
