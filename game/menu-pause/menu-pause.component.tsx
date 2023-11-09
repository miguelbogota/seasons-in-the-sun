'use client';

import { emitCameraControlEvent } from '@app/game/player/camera-control';
import { useGameState } from '@app/game/state';

/**
 * Component with the pause menu of the game.
 */
export function MenuPause() {
  const state = useGameState();

  return (
    state.isPlaying &&
    state.isPaused && (
      <div className="menu-pause">
        <div className="menu">
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
          <button onClick={() => state.exitGame()}>Quit</button>
        </div>
      </div>
    )
  );
}
