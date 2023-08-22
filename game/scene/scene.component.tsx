'use client';

import { useHandleMenu } from '@app/game/menu';
import { theme } from '@app/theme';
import { Canvas, type MeshProps, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
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

      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </>
  );
}

/** Testing Box component to show while testing. */
function Box(props: MeshProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
    }
  });

  return (
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
      Loading...
    </div>
  );
}
