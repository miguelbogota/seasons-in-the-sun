import { Spinner } from '@app/lib/spinner';
import { Navigation } from '@app/website/navigation';
import clsx from 'clsx';

import { menuStyles } from './menu.css';
import { useGameMenuState } from './state';

/**
 * Game menu to show when the esc key is pressed (Or when the lock API from the PointerLockControls
 * gets triggered).
 */
export function GameMenu() {
  const isOpen = useGameMenuState((state) => state.isOpen);
  const isLoading = useGameMenuState((state) => state.isLoading);
  const selector = useGameMenuState((state) => state.selector);

  return (
    <div style={{ display: isOpen || isLoading ? 'block' : 'none' }}>
      <Navigation />
      <div className={menuStyles.menu}>
        <button
          id={selector()}
          className={clsx(menuStyles.button, { [menuStyles.loading]: isLoading })}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <h3>Click to play</h3>}
        </button>
      </div>
    </div>
  );
}
