import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import SceneContent from './SceneContent';
import { Loader } from '@react-three/drei';

export default function Background3D() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: -1, // Behind all UI
      pointerEvents: 'none', // Allow clicking through to buttons
      background: '#000000',
    }}>
      <Canvas 
        shadows
        camera={{ position: [0, 2, 8], fov: 45 }} 
        dpr={[1, 1.5]}
        gl={{ 
            antialias: true,
            powerPreference: "high-performance",
            alpha: false
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
