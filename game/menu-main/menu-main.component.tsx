'use client';

import { emitCameraControlEvent } from '@app/game/player/camera-control';
import { Authentication } from '@app/website/authentication';

import { useGameState } from '../state';

/**
 * Component with the main menu of the game.
 */
export function MenuMain() {
  const state = useGameState();

  return (
    !state.isPlaying &&
    !state.isPaused && (
      <div className="menu-main">
        <img src="/images/menu-main-background.webp" alt="Background Image" />

        <div className="menu">
          <h1>Seasons in the Sun</h1>

          <button
            disabled={state.isLoading}
            onClick={() => {
              state.startGame().then(() => {
                setTimeout(() => {
                  emitCameraControlEvent('lock-controls', null);
                }, 200);
              });
            }}
          >
            {state.isLoading ? 'Loading...' : 'Begin'}
          </button>
          <button>Options</button>
        </div>

        <div className="authentication-menu">
          <Authentication />
        </div>
      </div>
    )
  );
}
