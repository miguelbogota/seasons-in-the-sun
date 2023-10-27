'use client';

import { emitCameraControlEvent } from '@app/game/player/camera-control';
import { useGameState } from '@app/game/state';

/**
 * Component with the pause menu of the game.
 */
export function PauseMenu() {
  const state = useGameState();

  return (
    state.isPlaying &&
    state.isPaused && (
      <div>
        <button
          disabled={!state.canUnpause}
          onClick={() => {
            state.pauseGame();
            emitCameraControlEvent('lock-controls', null);
          }}
        >
          Continue
        </button>
        <button>Options</button>
      </div>
    )
  );
}
