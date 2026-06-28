import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_SHOTS } from './cameraShots';

export default function CameraRig({ current }) {
  const { camera } = useThree();
  
  // Use a ref to smoothly lerp the lookAt target vector to avoid snapping
  const initialShot = CAMERA_SHOTS[current] || CAMERA_SHOTS['hero'];
  const lookAtTarget = useRef(new THREE.Vector3(...initialShot.target));

  useFrame(() => {
    const shot = CAMERA_SHOTS[current];
    if (!shot) return;

    const targetPos = new THREE.Vector3(...shot.position);
    const targetLookAt = new THREE.Vector3(...shot.target);

    // Smooth lerp for both position and target rotation
    camera.position.lerp(targetPos, 0.05);
    lookAtTarget.current.lerp(targetLookAt, 0.05);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
