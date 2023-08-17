import * as matchers from 'jest-extended';
import React from 'react';
import { expect } from 'vitest';

global.React = React;
expect.extend(matchers);
