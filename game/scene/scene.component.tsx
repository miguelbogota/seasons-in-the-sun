'use client';

import { useHandleMenu } from '@app/game/menu';
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
import { type ComponentProps, type PropsWithChildren, useRef, useState } from 'react';
import { type Mesh, Vector3 } from 'three';

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
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 5]} intensity={0.5} castShadow />

          <Physics gravity={[0, -30, 0]} debug>
            {[0, 1.5, 3, 4.5, 6, 7.5].map((v) => (
              <SimpleBox key={v} position={[v, 4, -15]} />
            ))}

            <Ground />
            <Player />
          </Physics>

          <PointerLockControls />
        </Canvas>
      </GameKeyboardControls>
    </>
  );
}

/** Testing Box component to show while testing. */
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

/** Ground being used. */
function Ground() {
  return (
    <RigidBody type="fixed">
      <Plane rotation={[-Math.PI / 2, 0, 0]} args={[200, 200]}>
        <meshPhysicalMaterial attach="material" color={theme.palette.game('green')} />
      </Plane>
    </RigidBody>
  );
}

const SPEED = 6;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();

/** Testing basic player. */
function Player() {
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
      <CapsuleCollider args={[0.75, 0.5]} />
    </RigidBody>
  );
}

type Controls = 'forward' | 'backward' | 'left' | 'right' | 'jump';

/** Keyboard controls for the game. */
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
