import { emitCameraControlEvent } from '@app/game/player/camera-control';
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

  return (
    (isOpen || isLoading) && (
      <div>
        <Navigation />
        <div className={menuStyles.menu}>
          <button
            className={clsx(menuStyles.button, { [menuStyles.loading]: isLoading })}
            disabled={isLoading}
            onClick={() => emitCameraControlEvent('lock-controls', null)}
          >
            {isLoading ? <Spinner /> : <h3>Click to play</h3>}
          </button>
        </div>
      </div>
    )
  );
}
