import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import knightModelUrl from './knight-hd.glb';
import gsap from 'gsap';

function KnightModel({ scene, invalidate }) {
  const meshRef = useRef();

  // ── HEAD TRACKING refs ─────────────────────────────────────────────────────
  const headBoneRef = useRef(null);
  const initialHeadRotation = useRef(new THREE.Euler());
  const isPointerActive = useRef(false);
  const globalMouse = useRef({ x: 0, y: 0 });

  // ── Step 2: Traverse to find head bone & apply shadows ─────────────────────
  useEffect(() => {
    let foundHead = false;

    scene.traverse((child) => {
      // 1. Apply shadows to all meshes
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

      // 2. Find the head/neck bone
      if (!foundHead && child.isBone) {
        const name = child.name.toLowerCase();
        if (name.includes('head') || name.includes('neck')) {
          headBoneRef.current = child;
          initialHeadRotation.current.copy(child.rotation);
          foundHead = true;
        }
      }
    });
  }, [scene]);

  // ── Step 3: Single global mouse/leave listener ─────────────────────────────
  useEffect(() => {
    const onMouseMove = (e) => {
      isPointerActive.current = true;
      globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      invalidate();
    };
    const onMouseLeave = () => {
      isPointerActive.current = false;
      invalidate();
    };
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    if (navigator.maxTouchPoints === 0) isPointerActive.current = true;
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [invalidate]);

  // ── Step 4: Material Fade-in ───────────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.transparent = true;
        child.material.opacity = 0;

        gsap.to(child.material, {
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out',
          delay: 0.4,
          onUpdate: invalidate,
        });
      }
    });
  }, [scene, invalidate]);

  // ── Step 5: Per-frame head lerp & idle float ───────────────────────────────
  useFrame((state) => {
    if (!headBoneRef.current) return;

    let targetYaw = 0;
    let targetPitch = 0;

    if (isPointerActive.current) {
      targetYaw = globalMouse.current.x * (20 * Math.PI / 180);
      targetPitch = -globalMouse.current.y * (10 * Math.PI / 180);
    }

    const head = headBoneRef.current;
    const init = initialHeadRotation.current;
    const finalYaw = init.y + targetYaw;
    const finalPitch = init.x + targetPitch;

    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, finalYaw, 0.15);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, finalPitch, 0.15);

    if (
      Math.abs(head.rotation.y - finalYaw) > 0.001 ||
      Math.abs(head.rotation.x - finalPitch) > 0.001
    ) {
      invalidate();
    }
  });

  return (
    <group ref={meshRef} position={[-0.155, -1.74, 0]} scale={1.8} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

export function Knight() {
  const { invalidate } = useThree();
  const { scene } = useGLTF(knightModelUrl, 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

  return <KnightModel scene={scene} invalidate={invalidate} />;
}

// Preload the model so it starts downloading immediately
useGLTF.preload(knightModelUrl, 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
