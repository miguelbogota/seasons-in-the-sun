import { useGameState } from '@app/game/state';
import { useGLTF } from '@react-three/drei';
import {
  CapsuleCollider,
  type RapierRigidBody,
  RigidBody,
  type RigidBodyProps,
  vec3,
} from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import { type Mesh, type MeshStandardMaterial } from 'three';
import { type GLTF } from 'three-stdlib';

/**
 * Duck props.
 */
export type DuckProps = {
  groupProps?: JSX.IntrinsicElements['group'];
  rigidBodyProps?: RigidBodyProps;
  initialPosition: [number, number, number];
};

/**
 * A duck model.
 */
export function Duck(props: DuckProps) {
  const { groupProps, rigidBodyProps, initialPosition } = props;

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

  const { nodes, materials } = useGLTF('./models/duck.glb') as GLTFResult;

  return (
    <RigidBody {...rigidBodyProps} ref={ref} position={initialPosition}>
      <CapsuleCollider args={[1, 1]} />
      <group {...groupProps} dispose={null}>
        <mesh
          geometry={nodes.character_duck.geometry}
          material={materials['White.026']}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <mesh
            geometry={nodes.character_duckArmLeft.geometry}
            material={materials['White.026']}
            position={[0.204, 0, -0.634]}
          />
          <mesh
            geometry={nodes.character_duckArmRight.geometry}
            material={materials['White.026']}
            position={[-0.204, 0, -0.634]}
          />
          <group position={[0, 0, -0.704]}>
            <mesh geometry={nodes.Cube1338.geometry} material={materials['White.026']} />
            <mesh geometry={nodes.Cube1338_1.geometry} material={materials['Yellow.043']} />
            <mesh geometry={nodes.Cube1338_2.geometry} material={materials['Black.027']} />
          </group>
        </mesh>
      </group>
    </RigidBody>
  );
}

/**
 * Duck GLTF result.
 */
type GLTFResult = GLTF & {
  nodes: {
    character_duck: Mesh;
    character_duckArmLeft: Mesh;
    character_duckArmRight: Mesh;
    Cube1338: Mesh;
    Cube1338_1: Mesh;
    Cube1338_2: Mesh;
  };
  materials: {
    ['White.026']: MeshStandardMaterial;
    ['Yellow.043']: MeshStandardMaterial;
    ['Black.027']: MeshStandardMaterial;
  };
};

// Preload the duck model.
useGLTF.preload('./models/duck.glb');
