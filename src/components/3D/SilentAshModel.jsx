import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float } from '@react-three/drei';

const Model = () => {
  const { scene } = useGLTF('/models/earth.glb');

  useFrame((state) => {
    scene.rotation.y = state.clock.elapsedTime * 0.25;
  });

  return (
    <primitive
      object={scene}
      scale={1.8}
      position={[0, -0.15, 0]}
    />
  );
};

export const SilentAshModel = () => (// globe removed

  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
    {/* Globe intentionally removed from Hero */}
    <div style={{ width: '70%', height: '70%', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', boxShadow: '0 0 60px rgba(120,200,255,0.18)', backdropFilter: 'blur(4px)' }} />
    <Canvas camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}>
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 10, 6]} intensity={1.6} />
        <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.6}>
          <Model />
        </Float>
      </Suspense>
    </Canvas>
  </div>
);

useGLTF.preload('/models/earth.glb');

