'use client';

import { GameMenu, useGameMenuState } from '@app/game/menu';
import { theme } from '@app/theme';
import {
  Box,
  KeyboardControls,
  Plane,
  PointerLockControls,
  Sky,
  useKeyboardControls,
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CapsuleCollider, Physics, type RapierRigidBody, RigidBody } from '@react-three/rapier';
import { type ComponentProps, type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { type Mesh, Vector3 } from 'three';
import { type PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';

/**
 * Main scene to show.
 */
export function Scene() {
  return (
    <>
      <GameMenu />

      <GameKeyboardControls>
        <Canvas>
          <GamePointerLockControls />
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 5]} intensity={0.5} castShadow />

          <Physics gravity={[0, -30, 0]}>
            {[0, 1.5, 3, 4.5, 6, 7.5].map((v) => (
              <SimpleBox key={v} position={[v, 4, -15]} />
            ))}

            <Ground />
            <Player />
          </Physics>
        </Canvas>
      </GameKeyboardControls>
    </>
  );
}

/**
 * Testing Box component to show while testing.
 */
function SimpleBox(props: ComponentProps<typeof Box>) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <RigidBody colliders="cuboid">
      <Box
        {...props}
        ref={meshRef}
        scale={active ? 1.5 : 1}
        onClick={() => setActive(!active)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={hovered ? theme.palette.game('pink') : theme.palette.game('orange')}
        />
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
        <meshPhysicalMaterial attach="material" color={theme.palette.game('green')} />
      </Plane>
    </RigidBody>
  );
}

/**
 * Testing player very simple.
 */
function Player() {
  const SPEED = 6;
  const direction = new Vector3();
  const frontVector = new Vector3();
  const sideVector = new Vector3();

  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const isOnGround = useRef(false);
  const { camera } = useThree();
  const [, get] = useKeyboardControls<Controls>();

  useFrame(() => {
    const { forward, backward, left, right, jump } = get();
    const velocity = rigidBodyRef.current?.linvel();

    // update camera
    const newCamera = rigidBodyRef.current?.translation();
    newCamera && camera.position.set(newCamera.x, newCamera.y, newCamera.z);

    // movement
    frontVector.set(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    sideVector.set((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    rigidBodyRef.current?.setLinvel({ x: direction.x, y: velocity?.y ?? 0, z: direction.z }, true);

    // jumping
    if (isOnGround.current && jump) {
      const jumpHeight = 8;
      const jumpPull = jumpHeight * 0.8;
      rigidBodyRef.current?.applyImpulse({ x: 0, y: jumpHeight, z: 0 }, true);
      rigidBodyRef.current?.applyImpulse({ x: 0, y: jumpPull, z: 0 }, true);
      isOnGround.current = false;
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]}
      onCollisionEnter={() => {
        isOnGround.current = true;
      }}
    >
      <Box>
        <CapsuleCollider args={[0.75, 0.5]} />
      </Box>
    </RigidBody>
  );
}

type Controls = 'forward' | 'backward' | 'left' | 'right' | 'jump';

/**
 * Keyboard controls for the game mapped.
 */
function GameKeyboardControls(props: PropsWithChildren) {
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

/**
 * Controls with the lock API opening and closing the game menu.
 */
function GamePointerLockControls() {
  const controlsRef = useRef<PointerLockControlsImpl>(null);

  const close = useGameMenuState((state) => state.close);
  const open = useGameMenuState((state) => state.open);
  const selector = useGameMenuState((state) => state.selector);

  useEffect(() => {
    const { current: controls } = controlsRef;

    controls?.addEventListener('lock', () => close());
    controls?.addEventListener('unlock', () => open());

    return () => {
      controls?.removeEventListener('lock', () => null);
      controls?.removeEventListener('unlock', () => null);
    };
  }, [controlsRef, close, open]);

  return <PointerLockControls ref={controlsRef} selector={selector(true)} />;
}
