'use client';

import { emitCameraControlEvent } from '@app/game/player/camera-control';
import { GameLogo } from '@app/ui/game-logo';
import { Authentication, useAuthentication } from '@app/website/authentication';

import { useGameState } from '../state';

/**
 * Component with the main menu of the game.
 */
export function MenuMain() {
  const state = useGameState();
  const { is: isSignedIn } = useAuthentication();

  return (
    !state.isPlaying &&
    !state.isPaused && (
      <div className="menu-main">
        <img src="/images/menu-main-background.webp" alt="Background Image" />

        <div className="menu">
          <GameLogo style={{ marginBottom: '2rem' }} />

          <button
            disabled={state.isLoading || !isSignedIn}
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
