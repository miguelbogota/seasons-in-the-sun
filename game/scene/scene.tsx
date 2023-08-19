'use client';

import { Navigation } from '@app/components/navigation/navigation';
import { useGameMenu } from '@app/state/game-menu';
import { Canvas, type MeshProps, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { type Mesh } from 'three';

/** Main scene to show. */
export function Scene() {
  const [loading, showMenu] = useHandleMenu();

  if (loading) {
    return <SimpleLoading />;
  }

  return (
    <>
      {showMenu && <Navigation />}

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
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
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

/** Hook to handle the initial setup for the menu. */
function useHandleMenu() {
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

  return [loading, gameMenu.isGameMenuOpen] as [loading: boolean, showMenu: boolean];
}
