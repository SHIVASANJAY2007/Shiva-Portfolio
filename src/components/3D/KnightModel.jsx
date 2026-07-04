import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, Suspense } from '@react-three/drei';
import { SheetProvider, editable as e } from '@theatre/r3f';
import { knightSheet } from '../../utils/theatreSetup';
import { MODEL_URLS } from '../../constants/models';

const MODEL_URL = MODEL_URLS.knight;

// ─── Inner mesh with head tracking ────────────────────
const Model = () => {
  const { scene } = useGLTF(MODEL_URL);

  const headBoneRef = useRef(null);
  const initialHeadRot = useRef(new THREE.Euler());
  const mouse = useRef({ x: 0, y: 0 });
  const isPointerActive = useRef(false);

  useEffect(() => {
    if (!scene) return;
    let found = false;
    scene.traverse((child) => {
      if (!found && child.isBone) {
        const name = child.name.toLowerCase();
        if (name.includes('head') || name.includes('neck')) {
          headBoneRef.current = child;
          initialHeadRot.current.copy(child.rotation);
          found = true;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    const onMove = (e) => {
      isPointerActive.current = true;
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onLeave = () => { isPointerActive.current = false; };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useFrame(() => {
    if (!headBoneRef.current) return;

    const targetYaw = isPointerActive.current
      ? mouse.current.x * (20 * Math.PI / 180)
      : 0;
    const targetPitch = isPointerActive.current
      ? -mouse.current.y * (10 * Math.PI / 180)
      : 0;

    const head = headBoneRef.current;
    const init = initialHeadRot.current;

    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, init.y + targetYaw, 0.05);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, init.x + targetPitch, 0.05);
  });

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

// ─── Public wrapper (scroll-driven Theatre.js animation) ──
export const KnightModel = () => {
  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('about');
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      const start = rect.top - viewHeight;
      const end = rect.bottom;
      const total = end - start;
      const current = -start;

      const progress = Math.max(0, Math.min(1, current / total));

      if (knightSheet && knightSheet.sequence) {
        knightSheet.sequence.position = progress * 5;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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

useGLTF.preload(MODEL_URL);
export default KnightModel;
