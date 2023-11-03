'use client';

import { Authentication } from '@app/website/authentication';
import { useState } from 'react';

import * as styles from './menu-main.css';

/**
 * Component with the main menu of the game.
 */
export function MenuMain() {
  const [tempIsLoading, setTempIsLoading] = useState(false);

  return (
    <div className={styles.root}>
      <img
        src="/images/menu-main-background.webp"
        alt="Background Image"
        className={styles.image}
      />

      <div className={styles.menu}>
        <h1 className={styles.title}>Seasons in the Sun</h1>

        <button
          className={styles.button}
          disabled={tempIsLoading}
          onClick={() => {
            setTempIsLoading(true);
            setTimeout(() => setTempIsLoading(false), 2000);
          }}
        >
          {tempIsLoading ? 'Loading...' : 'Begin'}
        </button>
        <button className={styles.button}>Options</button>
      </div>

      <div className={styles.authMenu}>
        <Authentication />
      </div>
    </div>
  );
}
