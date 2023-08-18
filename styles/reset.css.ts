// The new CSS reset - version 1.9 (last updated 19.6.2023)
// GitHub page: https://github.com/elad2412/the-new-css-reset

import { globalStyle } from '@vanilla-extract/css';

// Remove all the styles of the "User-Agent-Stylesheet", except for the 'display' property
// - The "symbol *" part is to solve Firefox SVG sprite bug
// - The "html" element is excluded, otherwise a bug in Chrome breaks the CSS hyphens property (https://github.com/elad2412/the-new-css-reset/issues/36)
globalStyle('*:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *))', {
  all: 'unset',
  display: 'revert',

  // Remove all animations, transitions and smooth scroll for people that prefer not to see them.
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animationDuration: '0.01ms',
      animationIterationCount: '1',
      transitionDuration: '0.01ms',
      scrollBehavior: 'auto',
    },
  },
});

// Preferred box-sizing value
globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

// Reapply the pointer cursor for anchor tags
globalStyle('a, button', {
  cursor: 'revert',
});

// Remove list styles (bullets/numbers)
globalStyle('ol, ul, menu', {
  listStyle: 'none',
});

// For images to not be able to exceed their container
globalStyle('img', {
  maxInlineSize: '100%',
  maxBlockSize: '100%',
});

// Removes spacing between cells in tables
globalStyle('table', {
  borderCollapse: 'collapse',
});

// Safari - solving issue when using user-select:none on the <body> text input doesn't working
globalStyle('input, textarea', {
  WebkitUserSelect: 'auto',
});

// Revert the 'white-space' property for textarea elements on Safari
globalStyle('textarea', {
  whiteSpace: 'revert',
});

// Minimum style to allow styling meter element
globalStyle('meter', {
  WebkitAppearance: 'revert',
  appearance: 'revert',
});

// Preformatted text - use only for this feature
globalStyle(':where(pre)', {
  all: 'revert',
});

// Reset default text opacity of input placeholder
globalStyle('::placeholder', {
  color: 'unset',
});

// Remove default dot (•) sign
globalStyle('::marker', {
  content: 'initial',
});

// Fix the feature of 'hidden' attribute. display:revert; revert to element instead of attribute
globalStyle(':where([hidden])', {
  display: 'none',
});

// Revert for bug in Chromium browsers
//   - fix for the content editable attribute will work properly.
//   - webkit-user-select: auto; added for Safari in case of using user-select:none on wrapper element
globalStyle(':where([contenteditable]:not([contenteditable="false"]))', {
  MozUserModify: 'read-write',
  WebkitUserModify: 'read-write',
  overflowWrap: 'break-word',
  WebkitLineBreak: 'after-white-space',
  WebkitUserSelect: 'auto',
});

// Apply back the draggable feature - exist only in Chromium and Safari
globalStyle(':where([draggable="true"])', {
  WebkitUserDrag: 'element',
});

// Revert Modal native behavior
globalStyle(':where(dialog:modal)', {
  all: 'revert',
});
