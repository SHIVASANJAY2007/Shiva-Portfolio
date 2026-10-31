import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';

export const KNIGHT_MODEL_URL = '/models/knight-opt.glb';

function KnightModel({ scene, invalidate, onRenderSuccess }) {
  const meshRef = useRef();
  const hasRenderedFirstFrame = useRef(false);

  // ── HEAD TRACKING refs ─────────────────────────────────────────────────────
  const headBoneRef = useRef(null);
  const initialHeadRotation = useRef(new THREE.Euler());
  const isPointerActive = useRef(false);
  const globalMouse = useRef({ x: 0, y: 0 });
  const smoothedMouse = useRef({ x: 0, y: 0 });

  // ── Step 2: Traverse to find head bone & apply shadows ─────────────────────
  useEffect(() => {
    let foundHead = false;

    scene.traverse((child) => {
      // 1. Apply shadows to all meshes
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

      // 2. Find strictly the primary head bone to prevent distorting lower neck/shoulder armor rigging
      if (!foundHead && child.isBone) {
        const name = child.name.toLowerCase();
        if (name.includes('head') || name === 'head') {
          headBoneRef.current = child;
          // Prevent cumulative rotation drift across unmount/remount transitions by caching original rest angle in userData
          if (!child.userData.initialRotation) {
            child.userData.initialRotation = child.rotation.clone();
          }
          initialHeadRotation.current.copy(child.userData.initialRotation);
          child.rotation.copy(child.userData.initialRotation);
          foundHead = true;
        }
      }
    });
  }, [scene]);

  // ── Step 3: Single global mouse/leave listener ─────────────────────────────
  useEffect(() => {
    const onMouseMove = (e) => {
      if (window.scrollY > window.innerHeight) return;
      isPointerActive.current = true;
      globalMouse.current.x = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
      globalMouse.current.y = Math.max(-1, Math.min(1, -(e.clientY / window.innerHeight) * 2 + 1));
      invalidate();
    };
    const onMouseLeave = () => {
      isPointerActive.current = false;
      invalidate();
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });

    if (navigator.maxTouchPoints === 0) isPointerActive.current = true;
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [invalidate]);

  // ── Step 4: Solid Unbreakable Material Visibility & Initial Render Force ──
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = 1;
        child.material.transparent = false;
        child.material.needsUpdate = true;
      }
    });
    // Invalidate immediately and in next frame to guarantee first paint
    invalidate();
    const frame = requestAnimationFrame(() => invalidate());
    return () => cancelAnimationFrame(frame);
  }, [scene, invalidate]);

  // ── Step 5: Per-frame head lerp & idle float ───────────────────────────────
  useFrame((state) => {
    // Notify parent that the 3D model has rendered its first frame on screen
    if (!hasRenderedFirstFrame.current) {
      hasRenderedFirstFrame.current = true;
      if (onRenderSuccess) {
        onRenderSuccess();
      }
    }

    if (!headBoneRef.current) return;
    if (window.scrollY > window.innerHeight) return;

    // Silky smooth two-stage damped tracking
    smoothedMouse.current.x = THREE.MathUtils.lerp(smoothedMouse.current.x, globalMouse.current.x, 0.12);
    smoothedMouse.current.y = THREE.MathUtils.lerp(smoothedMouse.current.y, globalMouse.current.y, 0.12);

    let targetYaw = 0;
    let targetPitch = 0;

    if (isPointerActive.current) {
      targetYaw = smoothedMouse.current.x * (22 * Math.PI / 180);
      targetPitch = -smoothedMouse.current.y * (12 * Math.PI / 180);
    }

    const head = headBoneRef.current;
    const init = initialHeadRotation.current;
    const finalYaw = init.y + targetYaw;
    const finalPitch = init.x + targetPitch;

    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, finalYaw, 0.14);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, finalPitch, 0.14);

    if (
      Math.abs(head.rotation.y - finalYaw) > 0.0001 ||
      Math.abs(head.rotation.x - finalPitch) > 0.0001 ||
      Math.abs(smoothedMouse.current.x - globalMouse.current.x) > 0.0001 ||
      Math.abs(smoothedMouse.current.y - globalMouse.current.y) > 0.0001
    ) {
      invalidate();
    }
  });

  return (
    <group ref={meshRef} position={[0, -1.56, 0]} scale={1.6} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

export function Knight({ onRenderSuccess }) {
  const { invalidate } = useThree();
  const { scene } = useGLTF(KNIGHT_MODEL_URL, false, true);

  return <KnightModel scene={scene} invalidate={invalidate} onRenderSuccess={onRenderSuccess} />;
}

// Preload the model so it begins streaming immediately without waiting for mount
useGLTF.preload(KNIGHT_MODEL_URL, false, true);
