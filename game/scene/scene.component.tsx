'use client';

import { useHandleMenu } from '@app/game/menu';
import { theme } from '@app/theme';
import {
  KeyboardControls,
  type KeyboardControlsEntry,
  PerspectiveCamera,
  Plane,
  PointerLockControls,
  useKeyboardControls,
} from '@react-three/drei';
import { Canvas, type MeshProps, useFrame } from '@react-three/fiber';
import { Physics, type RapierRigidBody, RigidBody } from '@react-three/rapier';
import { type PropsWithChildren, Suspense, useMemo, useRef, useState } from 'react';
import { type Mesh } from 'three';

/** Main scene to show. */
export function Scene() {
  const [loading, Menu] = useHandleMenu();

  if (loading) {
    return <SimpleLoading />;
  }

  return (
    <>
      <Menu />

      <GameKeyboardControls>
        <Canvas camera={{ position: [0, 5, 10] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 5]} intensity={0.5} castShadow />

          <Suspense>
            <Physics debug>
              <Box position={[-1.2, 4, 0]} />

              <Box position={[1.2, 4, 0]} />

              <Ground />

              <Player />
            </Physics>
          </Suspense>
        </Canvas>
      </GameKeyboardControls>
    </>
  );
}

/** Testing Box component to show while testing. */
function Box(props: MeshProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <RigidBody colliders="cuboid">
      <mesh
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
      </mesh>
    </RigidBody>
  );
}

/** Ground being used. */
function Ground() {
  return (
    <RigidBody colliders="cuboid">
      <Plane rotation={[-Math.PI / 2, 0, 0]} args={[100, 100]}>
        <meshPhysicalMaterial attach="material" color={theme.palette.game('green')} />
      </Plane>
    </RigidBody>
  );
}

/** First person camera is added to the player. */
const MyCamera = () => (
  <PerspectiveCamera fov={75} rotation={[0, Math.PI, 0]} makeDefault={true} position={[0, 0.5, 0]}>
    <PointerLockControls />
  </PerspectiveCamera>
);

/** Testing basic player. */
function Player() {
  const playerRef = useRef<Mesh>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  const forwardPressed = useKeyboardControls<Controls>((state) => state.forward);
  const backPressed = useKeyboardControls<Controls>((state) => state.back);
  const leftPressed = useKeyboardControls<Controls>((state) => state.left);
  const rightPressed = useKeyboardControls<Controls>((state) => state.right);
  const jumpPressed = useKeyboardControls<Controls>((state) => state.jump);

  useFrame((_, delta) => {
    if (!playerRef.current || !rigidBodyRef.current) {
      return;
    }

    playerRef.current.position.z -= forwardPressed ? delta * 2 : 0;
    playerRef.current.position.z += backPressed ? delta * 2 : 0;
    playerRef.current.position.x -= leftPressed ? delta * 2 : 0;
    playerRef.current.position.x += rightPressed ? delta * 2 : 0;

    if (jumpPressed) {
      const jump = 1;
      rigidBodyRef.current.applyImpulse({ x: 0, y: jump, z: 0 }, true);
      rigidBodyRef.current.applyImpulse({ x: 0, y: jump * 0.5 * -1, z: 0 }, true);
    }
  });

  return (
    <RigidBody ref={rigidBodyRef}>
      <mesh ref={playerRef} position={[0, 0.5, 0]} castShadow>
        <MyCamera />
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color="blue" />
      </mesh>
    </RigidBody>
  );
}

type Controls = 'forward' | 'back' | 'left' | 'right' | 'jump' | 'couch';

/** Keyboard controls for the game. */
function GameKeyboardControls(props: PropsWithChildren) {
  const { children } = props;

  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: 'forward', keys: ['KeyW'] },
      { name: 'back', keys: ['KeyS'] },
      { name: 'left', keys: ['KeyA'] },
      { name: 'right', keys: ['KeyD'] },
      { name: 'jump', keys: ['Space'] },
      { name: 'couch', keys: ['ShiftLeft'] },
    ],
    [],
  );

  return <KeyboardControls map={map}>{children}</KeyboardControls>;
}

/** Simple loading component to show while loading. */
function SimpleLoading() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '4rem',
      }}
    >
      LOADING...
    </div>
  );
}
