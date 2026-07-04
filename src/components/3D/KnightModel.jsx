import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, Float } from '@react-three/drei';
import { SheetProvider, editable as e } from '@theatre/r3f';
import { knightSheet } from '../../utils/theatreSetup';

const Model = () => {
  const { scene } = useGLTF('/models/3D Models/knight.glb');

  return (
    <e.primitive
      theatreKey="knightModel"
      editableType="group"
      object={scene}
      scale={1.8}
      position={[0, -1.5, 0]}
    />
  );
};

export const KnightModel = () => {
  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('about');
      if (!el) return;
      
      const rect = el.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      // Calculate scroll progress through the About section
      // 0.0: when section top enters bottom of viewport
      // 1.0: when section bottom leaves top of viewport
      const start = rect.top - viewHeight;
      const end = rect.bottom;
      const total = end - start;
      const current = -start; // How far scrolled past start
      
      const progress = Math.max(0, Math.min(1, current / total));
      
      // Map progress (0 to 1) to Theatre.js timeline (0s to 5s)
      if (knightSheet && knightSheet.sequence) {
        knightSheet.sequence.position = progress * 5;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial sizing / placement
    setTimeout(handleScroll, 100); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}>
        <Suspense fallback={null}>
          <SheetProvider sheet={knightSheet}>
            <Environment preset="night" />
            <e.ambientLight theatreKey="ambientLight" intensity={0.3} />
            <e.directionalLight theatreKey="mainLight" position={[5, 10, 5]} intensity={2} />
            <e.directionalLight theatreKey="neonHighlight" position={[-5, 5, -5]} intensity={0.8} color="#4488ff" />
            <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.5}>
              <Model />
            </Float>
          </SheetProvider>
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload('/models/3D Models/knight.glb');
export default KnightModel;
