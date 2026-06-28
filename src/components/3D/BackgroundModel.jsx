/**
 * 3D Background Model Component
 * Loads GLTF model from /models folder
 * Uses depth of field and cinematic lighting
 */
import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSceneStore } from '../../store/sceneStore';
import { CAMERA_SHOTS } from './leavesCameraShots';

/**
 * Load and display the GLTF model
 */
const ModelScene = () => {
  const groupRef = useRef();
  const { scene } = useGLTF('/models/leaves_in_the_garden.glb');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle fluid rotation tracking
      const targetRotX = mousePos.y * 0.02;
      const targetRotY = mousePos.x * 0.02;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {scene && <primitive object={scene} />}
    </group>
  );
};

useGLTF.preload('/models/leaves_in_the_garden.glb');

/**
 * Camera animation rig
 */
const CameraRig = () => {
  const mode = useSceneStore((state) => state.mode);
  const { camera } = useThree();
  
  // Store current state
  const currentTarget = useRef(new THREE.Vector3(...CAMERA_SHOTS.hero.target));
  const currentSpherical = useRef(new THREE.Spherical(
    CAMERA_SHOTS.hero.orbit[2], // radius
    CAMERA_SHOTS.hero.orbit[1], // phi
    CAMERA_SHOTS.hero.orbit[0]  // theta
  ).makeSafe());

  const targetVec = new THREE.Vector3();

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

/**
 * Background Model Canvas
 */
export const BackgroundModel = () => {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, -1, 6], fov: 35 }}
      dpr={1}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    >
      {/* Lighting for realistic look */}
      <Environment preset="forest" />
      <ambientLight intensity={2.5} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={3} castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={2} color="#a0c0d0" />

      {/* Model */}
      <Suspense fallback={null}>
        <ModelScene />
      </Suspense>

      <CameraRig />

      {/* Post Processing for the macro photography look */}
      <EffectComposer>
        <DepthOfField 
          focusDistance={0.015} 
          focalLength={0.04} 
          bokehScale={6} 
          height={480} 
        />
      </EffectComposer>
    </Canvas>
  );
};

export default BackgroundModel;
