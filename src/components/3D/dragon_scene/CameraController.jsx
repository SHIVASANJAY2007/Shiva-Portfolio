import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '../../../store/sceneStore';
import * as THREE from 'three';
import { useRef, useEffect } from 'react';

const STATES = {
  hero: { 
    pos: [0, 2, 12], 
    target: [0, 1, 0],
    fov: 45
  },
  warrior: { 
    pos: [-3.5, 1.8, 5], 
    target: [-1.2, 1.2, 0], // Focus on Warrior
    fov: 35
  },
  dragon: { 
    pos: [4, 2.5, 6], 
    target: [2, 1.5, 0], // Focus on Dragon
    fov: 38
  },
  battle: { 
    pos: [0, 4, 15], 
    target: [0, 1, 0],
    fov: 50
  }
};

export default function CameraController() {
  const { camera } = useThree();
  const mode = useSceneStore((state) => state.mode);
  const targetPos = useRef(new THREE.Vector3());
  const lookAtPos = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const config = STATES[mode] || STATES.hero;
    
    // Smoothly interpolate position
    targetPos.current.set(...config.pos);
    camera.position.lerp(targetPos.current, 0.03); // Slow, cinematic lerp

    // Smoothly interpolate lookAt target
    lookAtPos.current.lerp(new THREE.Vector3(...config.target), 0.05);
    camera.lookAt(lookAtPos.current);

    // Dynamic FOV adjustment
    camera.fov = THREE.MathUtils.lerp(camera.fov, config.fov, 0.02);
    camera.updateProjectionMatrix();
  });

  return null;
}
