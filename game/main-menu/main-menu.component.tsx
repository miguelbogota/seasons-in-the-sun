'use client';

import { emitCameraControlEvent } from '@app/game/player/camera-control';
import { useGameState } from '@app/game/state';

/**
 * Component with the main menu of the game.
 */
export function MainMenu() {
  const state = useGameState();

  return (
    !state.isPlaying && (
      <div>
        <h1>Seasons in the Sun</h1>

        <button
          onClick={() =>
            state.startGame(() => {
              setTimeout(() => emitCameraControlEvent('lock-controls', null), 200);
            })
          }
        >
          {state.isLoading ? 'Loading...' : 'Begin'}
        </button>
        <button>Options</button>
      </div>
    )
  );
}
