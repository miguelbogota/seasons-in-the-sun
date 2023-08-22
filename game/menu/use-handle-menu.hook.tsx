import { Navigation } from '@app/website/navigation/navigation.component';
import { type FC, useEffect, useState } from 'react';

import { useGameMenu } from './store';

/** Hook to handle the initial setup for the menu. */
export function useHandleMenu() {
  const [loading, setLoading] = useState(true);
  const gameMenu = useGameMenu();

  useEffect(
    () => {
      if (gameMenu.isGameMenuOpen) {
        gameMenu.closeGameMenu();
      }

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          gameMenu.toggleGameMenu();
        }
      };

      window.addEventListener('keydown', handleEscape);
      setLoading(false);

      return () => {
        gameMenu.openGameMenu();
        window.removeEventListener('keydown', handleEscape);
      };
    },
    // Disabled since it should only run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const Menu = () => gameMenu.isGameMenuOpen && <Navigation />;

  return [loading, Menu] as [loading: boolean, Menu: FC];
}
