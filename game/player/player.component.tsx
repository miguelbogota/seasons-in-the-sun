import { Box, useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CapsuleCollider, type RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import { Vector3 } from 'three';

import { type KeyboardControlKey } from './keyboard-control';

export /**
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
  const [, get] = useKeyboardControls<KeyboardControlKey>();

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
