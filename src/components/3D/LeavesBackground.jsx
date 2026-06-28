import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Float, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '../../store/sceneStore';
import { CAMERA_SHOTS } from './leavesCameraShots';

// Pre-load the model
useGLTF.preload('/models/leaves_in_the_garden.glb');

const LeavesModel = () => {
  const { scene } = useGLTF('/models/leaves_in_the_garden.glb');
  
  return (
    <Center position={[0, 0, 0]} scale={1}>
      <primitive object={scene} />
    </Center>
  );
};

const CameraRig = () => {
  const mode = useSceneStore((state) => state.mode);
  const { camera } = useThree();
  
  // Store current state
  const currentTarget = React.useRef(new THREE.Vector3(...CAMERA_SHOTS.hero.target));
  const currentSpherical = React.useRef(new THREE.Spherical(
    CAMERA_SHOTS.hero.orbit[2], // radius
    CAMERA_SHOTS.hero.orbit[1], // phi
    CAMERA_SHOTS.hero.orbit[0]  // theta
  ).makeSafe());

  const targetVec = React.useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const shot = CAMERA_SHOTS[mode] || CAMERA_SHOTS.hero;

    // 1. Interpolate FOV
    camera.fov = THREE.MathUtils.damp(camera.fov, shot.fov, 2, delta);
    camera.updateProjectionMatrix();

    // 2. Interpolate Target
    targetVec.set(...shot.target);
    currentTarget.current.lerp(targetVec, 1 - Math.exp(-2 * delta));

    // 3. Interpolate Spherical Orbit
    const targetTheta = shot.orbit[0];
    const targetPhi = shot.orbit[1];
    const targetRadius = shot.orbit[2];

    currentSpherical.current.radius = THREE.MathUtils.damp(currentSpherical.current.radius, targetRadius, 2, delta);
    currentSpherical.current.phi = THREE.MathUtils.damp(currentSpherical.current.phi, targetPhi, 2, delta);
    currentSpherical.current.theta = THREE.MathUtils.damp(currentSpherical.current.theta, targetTheta, 2, delta);
    
    // 4. Apply to Camera
    camera.position.setFromSpherical(currentSpherical.current).add(currentTarget.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
};

export default function LeavesBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: -1,
      pointerEvents: 'none',
      background: '#050505'
    }}>
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 2, 10], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment preset="night" />
          <fogExp2 attach="fog" args={['#050505', 0.015]} />
          
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, 5, -10]} intensity={2} color="#4ade80" />
          
          <LeavesModel />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
