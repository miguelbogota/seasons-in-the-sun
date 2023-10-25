import { create as createStore } from 'zustand';

/**
 * Game menu state.
 */
export type GameMenuState = {
  /** Value to check if the menu is open or not (Initial values is `true`). */
  isOpen: boolean;
  /** Value to check if the menu is loading or not (Initial values is `false`). */
  isLoading: boolean;
  /** Function to change the loading state. */
  setLoading: (newState: boolean) => void;
  /** Function to open the menu. */
  open: () => void;
  /** Function to close the menu. */
  close: () => void;
  /** Function to toggle the menu. */
  toggle: () => void;
};

/**
 * Game menu state using zustand.
 */
export const useGameMenuState = createStore<GameMenuState>((set) => ({
  isOpen: true,
  isLoading: false,
  setLoading: (newState) => set(() => ({ isLoading: newState })),
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
