/**
 * 3D Dragon Component
 * Animated dragon centerpiece using Three.js and React Three Fiber
 * Creates a stylized, minimalist dragon with Japanese aesthetic
 */
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Icosahedron, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Dragon Head - Abstract geometric representation
 */
const DragonHead = ({ scale = 1 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={meshRef} scale={scale}>
      {/* Main head */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.8, 4]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe={false}
          roughness={0.4}
          metalness={0.2}
          emissive="#333333"
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.3, 0.3, 0.6]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#000000"
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.3, 0.3, 0.6]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#000000"
          roughness={0.2}
        />
      </mesh>

      {/* Snout/Mouth */}
      <mesh position={[0, -0.2, 0.7]} scale={[0.6, 0.4, 0.8]}>
        <icosahedronGeometry args={[0.5, 3]} />
        <meshStandardMaterial
          color="#e0e0e0"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

/**
 * Dragon Horns - Geometric spikes
 */
const DragonHorns = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Left horn */}
      <mesh position={[-0.5, 1.2, 0]} rotation={[0.4, -0.3, 0.2]} castShadow>
        <coneGeometry args={[0.15, 1.2, 16]} />
        <meshStandardMaterial
          color="#d0d0d0"
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Right horn */}
      <mesh position={[0.5, 1.2, 0]} rotation={[0.4, 0.3, -0.2]} castShadow>
        <coneGeometry args={[0.15, 1.2, 16]} />
        <meshStandardMaterial
          color="#d0d0d0"
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Center crest */}
      <mesh position={[0, 1.4, -0.3]} rotation={[0.3, 0, 0]} castShadow>
        <coneGeometry args={[0.1, 0.8, 12]} />
        <meshStandardMaterial
          color="#c0c0c0"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

/**
 * Dragon Mane/Whiskers - Dynamic flowing elements
 */
const DragonMane = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 0.7;
        const z = Math.sin(angle) * 0.7;

        return (
          <mesh key={i} position={[x, 0.5, z]} rotation={[0, angle, 0.2]}>
            <boxGeometry args={[0.08, 0.6, 0.08]} />
            <meshStandardMaterial
              color="#b0b0b0"
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Floating Orbs - Abstract Japanese elements
 */
const FloatingOrbs = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.001;
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 0.8;

        return (
          <mesh key={i} position={[x, y, z]} scale={0.3}>
            <octahedronGeometry args={[0.4, 2]} />
            <meshStandardMaterial
              color="#808080"
              roughness={0.5}
              metalness={0.1}
              wireframe={i % 2 === 0}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Main Dragon Mesh Assembly
 */
const DragonMesh = () => {
  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      <DragonHead scale={1.2} />
      <DragonHorns />
      <DragonMane />
      <FloatingOrbs />
    </group>
  );
};

/**
 * Dragon Scene - Complete 3D scene with lighting
 */
const DragonScene = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 4;
    camera.fov = 75;
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[5, 10, 7]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 5, -7]} intensity={0.3} color="#e0e0e0" />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#d0d0d0" />

      {/* Dragon */}
      <DragonMesh />

      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={2}
        maxPolarAngle={Math.PI * 0.6}
        minPolarAngle={Math.PI * 0.4}
      />

      {/* Background */}
      <color attach="background" args={['#000000']} />
    </>
  );
};

/**
 * Dragon Component Wrapper
 */
export const Dragon = () => {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 4], fov: 75 }}
      dpr={[1, 2]}
    >
      <DragonScene />
    </Canvas>
  );
};

export default Dragon;
