import { create as createStore } from 'zustand';

/**
 * Game menu state.
 */
export type GameMenuState = {
  /** Value to check if the menu is open or not (Initial values is `true`). */
  isOpen: boolean;
  /** Function to open the menu. */
  open: () => void;
  /** Function to close the menu. */
  close: () => void;
  /** Function to toggle the menu. */
  toggle: () => void;
  /** Function to get the selector of the menu. */
  selector: (prefix?: boolean) => string;
};

/**
 * Game menu state using zustand.
 */
export const useGameMenuState = createStore<GameMenuState>((set) => ({
  isOpen: true,
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  selector: (prefix = false) => {
    const htmlSelector = 'play-button';
    return prefix ? `#${htmlSelector}` : htmlSelector;
  },
}));
