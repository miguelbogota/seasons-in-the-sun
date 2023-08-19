import { create } from 'zustand';

export type GameMenuState = {
  isGameMenuOpen: boolean;
  toggleGameMenu: () => void;
  closeGameMenu: () => void;
  openGameMenu: () => void;
};

export const useGameMenu = create<GameMenuState>((set) => ({
  isGameMenuOpen: true,
  toggleGameMenu: () => set((state) => ({ isGameMenuOpen: !state.isGameMenuOpen })),
  closeGameMenu: () => set({ isGameMenuOpen: false }),
  openGameMenu: () => set({ isGameMenuOpen: true }),
}));
