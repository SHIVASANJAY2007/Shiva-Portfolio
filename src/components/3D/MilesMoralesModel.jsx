import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';

const Model = () => {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/fortnite-miles-morales.glb');
  const { actions } = useAnimations(animations, group);

  // Play idle animation on load
  useEffect(() => {
    const idleAction = actions['FearlessFlight_Male_idle'];
    if (idleAction) {
      idleAction.reset().fadeIn(0.5).play();
    }
    return () => {
      if (idleAction) idleAction.fadeOut(0.5);
    };
  }, [actions]);

  // Tune materials for a more cinematic, Spider-Verse aesthetic
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        const materials = Array.isArray(child.material) ? child.material : [child.material];

        materials.forEach((mat) => {
          const name = (mat.name || '').toLowerCase();

          // Enhance suit reflectiveness and detail
          if (name.includes('body') || mat.name === 'M_MED_FearlessFlightHero_Body') {
            mat.roughness = 0.3;
            mat.metalness = 0.6;
          }

          // Make eyes/visors glow intensely so Bloom catches them
          if (name.includes('eye') || name.includes('visor') || name.includes('faceacc') || mat.name === 'DefaultMaterial') {
            mat.emissive = new THREE.Color('#ffffff');
            mat.emissiveIntensity = 4.0;
            // toneMapped = false ensures the bright white bypasses tone mapping for an intense bloom effect
            mat.toneMapped = false;
          }
        });
      }
    });
  }, [scene]);

  // Handle interactive mouse rotation
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
    if (group.current) {
      // Dynamic camera/group rotation based on mouse coordinates
      group.current.rotation.y += (mousePos.x * 0.4 - group.current.rotation.y) * 0.08;
      group.current.rotation.x += (-mousePos.y * 0.2 - group.current.rotation.x) * 0.08;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive
        object={scene}
        scale={2.2}
        position={[0, -2.0, 0]}
      />
    </group>
  );
};

export const MilesMoralesModel = () => (
  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
    {/* Japanese Dragon / Spider-Verse Neon Circle Backdrop */}
    <div style={{
      position: 'absolute',
      width: '75%',
      height: '75%',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255, 0, 55, 0.08) 0%, rgba(0, 0, 0, 0) 70%)',
      boxShadow: '0 0 80px rgba(255, 0, 55, 0.15), inset 0 0 40px rgba(255, 0, 55, 0.1)',
      border: '1px solid rgba(255, 0, 55, 0.1)',
      backdropFilter: 'blur(8px)',
      zIndex: 0,
      pointerEvents: 'none'
    }} />

    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 50, near: 0.1, far: 100 }}
      shadows
      style={{ zIndex: 1 }}
    >
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ambientLight intensity={0.2} />
        {/* Primary directional light */}
        <directionalLight position={[5, 8, 5]} intensity={2.0} castShadow />
        {/* Dynamic neon red/magenta backlight to highlight model edges */}
        <directionalLight position={[-5, 3, -5]} intensity={4.0} color="#ff0037" />
        {/* Subtle cyan fill light from bottom for a classic cinematic cyber aesthetic */}
        <pointLight position={[0, -2, 2]} intensity={1.5} color="#00d2ff" />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <Model />
        </Float>

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
          <ChromaticAberration offset={new THREE.Vector2(0.0015, 0.0015)} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  </div>
);

useGLTF.preload('/models/fortnite-miles-morales.glb');
export default MilesMoralesModel;
