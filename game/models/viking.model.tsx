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
 * Viking props.
 */
export type VikingProps = {
  groupProps?: JSX.IntrinsicElements['group'];
  rigidBodyProps?: RigidBodyProps;
  initialPosition: [number, number, number];
};

/**
 * A viking model.
 */
export function Viking(props: VikingProps) {
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

  const { nodes, materials } = useGLTF('./models/viking.glb') as GLTFResult;

  return (
    <RigidBody {...rigidBodyProps} ref={ref} position={initialPosition}>
      <CapsuleCollider args={[0.8, 0.4]} />
      <group {...groupProps} dispose={null}>
        <mesh geometry={nodes.NurbsCurve.geometry} material={materials.Boots} />
        <mesh geometry={nodes.Body_Cylinder.geometry} material={materials.Skin} />
        <mesh geometry={nodes.Shoulder_Cylinder003.geometry} material={materials.Metal_2} />
        <mesh geometry={nodes.Armband_Cylinder010.geometry} material={materials.Metal_2} />
        <mesh geometry={nodes['Helmet_Cylinder002-Mesh'].geometry} material={materials.Metal} />
        <mesh geometry={nodes['Helmet_Cylinder002-Mesh_1'].geometry} material={materials.Horn} />
        <mesh geometry={nodes['Boots_Cylinder004-Mesh'].geometry} material={materials.Leather} />
        <mesh geometry={nodes['Boots_Cylinder004-Mesh_1'].geometry} material={materials.Metal} />
        <mesh geometry={nodes['Boots_Cylinder004-Mesh_2'].geometry} material={materials.Metal_2} />
        <mesh
          geometry={nodes['Boots_Cylinder004-Mesh_3'].geometry}
          material={materials['Leather.002']}
        />
        <mesh geometry={nodes['Shirt_Cylinder005-Mesh'].geometry} material={materials.Metal_2} />
        <mesh geometry={nodes['Shirt_Cylinder005-Mesh_1'].geometry} material={materials.Metal} />
        <mesh geometry={nodes['Shirt_Cylinder005-Mesh_2'].geometry} material={materials.Leather} />
        <mesh geometry={nodes['Gloves_Cylinder008-Mesh'].geometry} material={materials.Leather} />
        <mesh
          geometry={nodes['Gloves_Cylinder008-Mesh_1'].geometry}
          material={materials['Leather.002']}
        />
        <mesh geometry={nodes['Skirt_Cylinder011-Mesh'].geometry} material={materials.Leather} />
        <mesh
          geometry={nodes['Skirt_Cylinder011-Mesh_1'].geometry}
          material={materials['Leather.001']}
        />
        <mesh geometry={nodes['Belt_Cylinder001-Mesh'].geometry} material={materials.Metal} />
        <mesh geometry={nodes['Belt_Cylinder001-Mesh_1'].geometry} material={materials.Material} />
        <mesh geometry={nodes['Belt_Cylinder001-Mesh_2'].geometry} material={materials.Gold} />
        <mesh
          geometry={nodes['Belt_Cylinder001-Mesh_3'].geometry}
          material={materials['Leather.003']}
        />
      </group>
    </RigidBody>
  );
}

/**
 * Viking GLTF result.
 */
type GLTFResult = GLTF & {
  nodes: {
    NurbsCurve: Mesh;
    Body_Cylinder: Mesh;
    ['Helmet_Cylinder002-Mesh']: Mesh;
    ['Helmet_Cylinder002-Mesh_1']: Mesh;
    ['Boots_Cylinder004-Mesh']: Mesh;
    ['Boots_Cylinder004-Mesh_1']: Mesh;
    ['Boots_Cylinder004-Mesh_2']: Mesh;
    ['Boots_Cylinder004-Mesh_3']: Mesh;
    Shoulder_Cylinder003: Mesh;
    Armband_Cylinder010: Mesh;
    ['Shirt_Cylinder005-Mesh']: Mesh;
    ['Shirt_Cylinder005-Mesh_1']: Mesh;
    ['Shirt_Cylinder005-Mesh_2']: Mesh;
    ['Gloves_Cylinder008-Mesh']: Mesh;
    ['Gloves_Cylinder008-Mesh_1']: Mesh;
    ['Skirt_Cylinder011-Mesh']: Mesh;
    ['Skirt_Cylinder011-Mesh_1']: Mesh;
    ['Belt_Cylinder001-Mesh']: Mesh;
    ['Belt_Cylinder001-Mesh_1']: Mesh;
    ['Belt_Cylinder001-Mesh_2']: Mesh;
    ['Belt_Cylinder001-Mesh_3']: Mesh;
  };
  materials: {
    Boots: MeshStandardMaterial;
    Skin: MeshStandardMaterial;
    Metal: MeshStandardMaterial;
    Horn: MeshStandardMaterial;
    Leather: MeshStandardMaterial;
    Metal_2: MeshStandardMaterial;
    ['Leather.002']: MeshStandardMaterial;
    ['Leather.001']: MeshStandardMaterial;
    Material: MeshStandardMaterial;
    Gold: MeshStandardMaterial;
    ['Leather.003']: MeshStandardMaterial;
  };
};

// Preload the viking model.
useGLTF.preload('./models/viking.glb');
