import { theme } from '@app/theme';
import { Navigation } from '@app/website/navigation';

import { useGameMenuState } from './state';

/**
 * Game menu to show when the esc key is pressed (Or when the lock API from the PointerLockControls
 * gets triggered).
 */
export function GameMenu() {
  const [isOpen, selector] = useGameMenuState((state) => [state.isOpen, state.selector]);

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <Navigation />
      <div
        style={{
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
        }}
      >
        <button
          id={selector()}
          style={{
            padding: '2rem',
            backgroundColor: theme.palette('primary'),
            cursor: 'pointer',
            borderRadius: 5,
          }}
        >
          Click to play
        </button>
      </div>
    </div>
  );
}
