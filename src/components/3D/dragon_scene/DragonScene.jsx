import React, { Suspense, useRef, useLayoutEffect, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CAMERA_SHOTS } from './cameraShots';
import CameraRig from './CameraRig';

// Pre-load the model
useGLTF.preload('/dragon_scene/wrath_of_the_dragon.glb');

// 🛠️ VIRTUAL CAMERA LOGGER (For finding perfect shots)
function CameraLogger() {
  const { camera } = useThree();

  useEffect(() => {
    const logCamera = () => {
      console.log("--- PERFECT SHOT LOGGED ---");
      console.log("position:", `[${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}]`);
      
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const target = new THREE.Vector3().copy(camera.position).add(dir.multiplyScalar(5));
      
      console.log("target:", `[${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`);
    };

    window.addEventListener('click', logCamera);
    return () => window.removeEventListener('click', logCamera);
  }, [camera]);

  return null;
}

const CinematicEngine = ({ isDebug }) => {
  const { scene } = useGLTF('/dragon_scene/wrath_of_the_dragon.glb');
  const [currentState, setCurrentState] = useState('hero');
  const stateRef = useRef('hero');

  useLayoutEffect(() => {
    scene.traverse((obj) => {
        if (obj.name === "7" || obj.name === "8") obj.visible = false;
        if (obj.isMesh) {
          obj.material.transparent = true;
          obj.material.opacity = 0.4;
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
    });
  }, [scene]);

  useEffect(() => {
    const sectionMap = ["hero", "about", "skills", "projects", "experience", "contact"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          const newState = entry.target.id;
          if (newState !== stateRef.current) {
            stateRef.current = newState;
            setCurrentState(newState);
          }
        }
      });
    }, { threshold: [0.3, 0.5, 0.8] });

    sectionMap.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useFrame(() => {
    if (isDebug) return; // Disable dynamic dimming updates while debugging so you see everything clearly

    const state = CAMERA_SHOTS[currentState];
    if (!state) return;

    // Dynamic Dimming Focus Engine
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        const isActive = obj.name.includes(state.focusName);
        const targetOpacity = isActive ? 1 : 0.4;
        obj.material.opacity = THREE.MathUtils.lerp(obj.material.opacity, targetOpacity, 0.05);
      }
    });
  });

  return (
    <>
      <primitive object={scene} position={[0, -1, 0]} />
      {/* 🎥 THE CORE CAMERA RIG */}
      {!isDebug && <CameraRig current={currentState} />}
    </>
  );
};

export default function DragonScene() {
  // 🟢 SET TO TRUE TO FIND NEW CAMERA SHOTS 🟢
  // Click anywhere on screen to log the exact position & target
  const [isDebug, setIsDebug] = useState(false); 

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: -1,
      pointerEvents: isDebug ? 'auto' : 'none',
      background: '#050505'
    }}>
      <Canvas shadows dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 15, 40]} fov={45} />
          
          <Environment preset="night" />
          <fogExp2 attach="fog" args={['#050505', 0.01]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 10, 5]} intensity={0.5} />
          
          <CinematicEngine isDebug={isDebug} />

          {isDebug && (
            <>
              <OrbitControls makeDefault />
              <CameraLogger />
            </>
          )}
        </Suspense>
      </Canvas>

      {/* Helper UI when in debug mode */}
      {isDebug && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'rgba(255,255,255,0.9)',
          padding: '15px',
          borderRadius: '8px',
          color: 'black',
          zIndex: 100,
          fontFamily: 'monospace',
          pointerEvents: 'auto'
        }}>
          <b>📸 VIRTUAL CAMERA LOGGER ACTIVE</b><br/>
          1. Move camera manually<br/>
          2. Click anywhere to log coordinates<br/>
          3. Check browser console (F12)<br/>
          <br/>
          <button 
            onClick={() => setIsDebug(false)}
            style={{ padding: '8px', background: 'black', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
          >
            Finish Framing
          </button>
        </div>
      )}
    </div>
  );
}
