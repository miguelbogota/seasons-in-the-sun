import { keyframes, style, theme } from '@app/theme';

const rotate = keyframes({
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const circleAnimation = keyframes({
  '0%, 25%': {
    strokeDashoffset: 280,
    transform: 'rotate(0)',
  },
  '50%, 75%': {
    strokeDashoffset: 75,
    transform: 'rotate(45deg)',
  },
  '100%': {
    strokeDashoffset: 280,
    transform: 'rotate(360deg)',
  },
});

const spinner = style({
  animationName: rotate,
  animationDuration: '2s',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
  width: '1.75rem',
  overflow: 'visible',
});

const circle = style({
  selectors: {
    [`${spinner} &`]: {
      animationName: circleAnimation,
      animationDuration: '1.4s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
      animationFillMode: 'both',
      display: 'block',
      fill: 'transparent',
      stroke: theme.palette('text.secondary'),
      strokeLinecap: 'round',
      strokeDasharray: 283,
      strokeDashoffset: 280,
      strokeWidth: '0.8rem',
      transformOrigin: '50% 50%',
    },
  },
});

export const spinnerStyles = {
  spinner,
  circle,
};
