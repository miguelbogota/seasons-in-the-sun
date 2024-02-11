'use client';

import { Duck, Viking } from '@app/game/models';
import { CameraControls, Player } from '@app/game/player';
import { KeyboardControl } from '@app/game/player/keyboard-control';
import { useGameState } from '@app/game/state';
import { Box, Plane, Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics, type RapierRigidBody, RigidBody, vec3 } from '@react-three/rapier';
import { type ComponentProps, type PropsWithChildren, useEffect, useRef } from 'react';

import { MenuMain } from '../menu-main';
import { MenuPause } from '../menu-pause';

/**
 * Main scene to show.
 */
export function Scene() {
  return (
    <>
      <MenuMain />
      <MenuPause />

      <KeyboardControl>
        <Canvas>
          <CameraControls.CameraControl />
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 5]} intensity={0.5} castShadow />

          <GamePhysics>
            {[0, 1.5, 3, 4.5, 6, 7.5].map((v) => (
              <SimpleBox key={v} initialPosition={[v, 4, -15]} />
            ))}

            <Duck initialPosition={[-3, 4, -15]} />

            <Viking initialPosition={[-7, 4, -15]} />

            <Ground />
            <Player />
          </GamePhysics>
        </Canvas>
      </KeyboardControl>
    </>
  );
}

/**
 * Physics wrapper to pause when the menu is open.
 */
function GamePhysics(props: PropsWithChildren) {
  const { children } = props;

  const state = useGameState();

  return (
    <Physics gravity={[0, -30, 0]} paused={state.isPaused || !state.isPlaying}>
      {children}
    </Physics>
  );
}

/**
 * Testing Box component to show while testing.
 */
function SimpleBox(
  props: ComponentProps<typeof Box> & { initialPosition: [number, number, number] },
) {
  const { initialPosition, ...otherProps } = props;

  const state = useGameState();
  const ref = useRef<RapierRigidBody>(null);

  // Resets position/rotation when game is over.
  useEffect(() => {
    if (!state.isPlaying) {
      ref.current?.setTranslation(
        vec3({ x: initialPosition[0], y: initialPosition[1], z: initialPosition[2] }),
        true,
      );
      ref.current?.setRotation({ w: 1, x: 0, y: 0, z: 0 }, true);
    }
  }, [state.isPlaying]);

  return (
    <RigidBody ref={ref} colliders="cuboid" position={initialPosition}>
      <Box {...otherProps}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#9f5c7e" />
      </Box>
    </RigidBody>
  );
}

/**
 * Simple ground being used.
 */
function Ground() {
  return (
    <RigidBody type="fixed">
      <Plane rotation={[-Math.PI / 2, 0, 0]} args={[200, 200]}>
        <meshPhysicalMaterial attach="material" color="#2cc027" />
      </Plane>
    </RigidBody>
  );
}
