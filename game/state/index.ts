import { create as createStore } from 'zustand';

import { PAUSE_LOADING_TIME } from './constants';

/**
 * Game state.
 */
export type GameState = {
  /**
   * Value to check if the game is being played or not (Initial values is `false` since you start in
   * the main menu. Pausing the game will not change this value).
   */
  isPlaying: boolean;
  /**
   * Value to check if the game is paused or not (Initial values is `false` since you start in the
   * main menu therefore the game is paused).
   */
  isPaused: boolean;
  /**
   * Value to have a feedback while a game is being loaded (Initial values is `false` since you
   * start in the main menu).
   */
  isLoading: boolean;
  /**
   * Due to the Pointer Lock API in chrome you can't unpause the game immediately after pausing it.
   */
  canUnpause: boolean;
  /**
   * Function to start the game.
   */
  startGame: (callback?: ActionCallback) => Promise<void>;
  /**
   * Function to exit the game.
   */
  exitGame: (callback?: ActionCallback) => Promise<void>;
  /**
   * Function to pause the game.
   */
  pauseGame: () => void;
  /**
   * Function to resume the game.
   */
  resumeGame: () => void;
};

/**
 * Game state using zustand.
 */
export const useGameState = createStore<GameState>((set) => ({
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  canUnpause: true,
  startGame: async (callback) => {
    set(() => ({ isLoading: true }));
    const shouldStart = await callback?.();

    if (shouldStart === false) {
      set(() => ({ isLoading: false }));
      return;
    }

    window.onbeforeunload = () => 'Are you sure you want to leave?';
    set(() => ({ isPlaying: true, isLoading: false, isPaused: false }));
  },
  exitGame: async (callback) => {
    set(() => ({ isLoading: true }));
    const shouldExit = await callback?.();

    if (shouldExit === false) {
      set(() => ({ isLoading: false }));
      return;
    }

    window.onbeforeunload = null;
    set(() => ({ isPlaying: false, isLoading: false, isPaused: false }));
  },
  pauseGame: () => {
    set(() => ({ canUnpause: false, isPaused: true }));
    // Minimum time to show the loading screen.
    setTimeout(() => set(() => ({ canUnpause: true })), PAUSE_LOADING_TIME);
  },
  resumeGame: () => set(() => ({ isPaused: false })),
}));

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type ActionCallback = () => boolean | void | Promise<boolean | void>;
