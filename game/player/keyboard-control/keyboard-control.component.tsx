import { KeyboardControls } from '@react-three/drei';
import { type PropsWithChildren } from 'react';

export type KeyboardControlKey = 'forward' | 'backward' | 'left' | 'right' | 'jump';

/**
 * Keyboard controls for the game mapped.
 */
export function KeyboardControl(props: PropsWithChildren) {
  const { children } = props;

  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['KeyW'] },
        { name: 'backward', keys: ['KeyS'] },
        { name: 'left', keys: ['KeyA'] },
        { name: 'right', keys: ['KeyD'] },
        { name: 'jump', keys: ['Space'] },
      ]}
    >
      {children}
    </KeyboardControls>
  );
}
