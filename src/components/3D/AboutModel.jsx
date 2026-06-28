/**
 * 3D About Section Model Component
 * Loads FBX model and aligns it to the left side
 */
import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const ModelScene = () => {
  const groupRef = useRef();
  const gltf = useGLTF('/models/about.gltf');
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

  useFrame(() => {
    if (groupRef.current) {
      // Subtle rotation based on cursor position
      groupRef.current.rotation.x += (mousePos.y * 0.3 - groupRef.current.rotation.x) * 0.1;
      groupRef.current.rotation.y += (mousePos.x * 0.3 - groupRef.current.rotation.y) * 0.1;

      // Slight floating animation
      groupRef.current.position.y = Math.sin(Date.now() * 0.0003) * 0.5;
    }
  });

  return (
    // Adjust scale since GLTF uses 1m units, unlike FBX's 1cm units
    <group ref={groupRef} scale={[2.5, 2.5, 2.5]} position={[-2.2, -0.5, 0]}>
      {gltf && gltf.scene && <primitive object={gltf.scene} />}
    </group>
  );
};

export const AboutModel = () => {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={1}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#e0e0e0" />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#d0d0d0" />
      <Suspense fallback={null}>
        <ModelScene />
      </Suspense>
    </Canvas>
  );
};

export default AboutModel;
