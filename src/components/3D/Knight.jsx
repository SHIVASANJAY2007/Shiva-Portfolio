import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKnightModel } from '../../hooks/useKnightModel';
import gsap from 'gsap';

export function Knight() {
  const meshRef = useRef();
  const { invalidate } = useThree();
  
  // Here we explicitly request the model. If it's already in the Memory Cache
  // (thanks to the ModelProvider prefetching), this will return INSTANTLY!
  const { scene, loading, error } = useKnightModel(false);

  // ── HEAD TRACKING refs ─────────────────────────────────────────────────────
  const headBoneRef = useRef(null);
  const initialHeadRotation = useRef(new THREE.Euler());
  const isPointerActive = useRef(false);
  const globalMouse = useRef({ x: 0, y: 0 });

  // ── Step 2: Traverse to find head bone and set shadows ─────────────────────
  useEffect(() => {
    if (!scene) return;
    let found = false;
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if (!found && child.isBone) {
        const name = child.name.toLowerCase();
        if (name.includes('head') || name.includes('neck')) {
          headBoneRef.current = child;
          initialHeadRotation.current.copy(child.rotation);
          found = true;
        }
      }
    });
  }, [scene]);

  // ── Step 3: Single global mouse/leave listener ─────────────────────────────
  useEffect(() => {
    const onMouseMove = (e) => {
      isPointerActive.current = true;
      globalMouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
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
    if (!meshRef.current) return;
    
    // Honor accessibility settings
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    
    // Animate the model's appearance
    meshRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.transparent = true;
        child.material.opacity = 0;
        
        gsap.to(child.material, {
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out',
          delay: 0.4,
          onUpdate: invalidate, // Trigger R3F to render the frame during animation!
        });
      }
    });
  }, [scene, invalidate]);

  // ── Step 5: Per-frame head lerp & idle float ───────────────────────────────
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Idle float animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.03;

    // Head tracking
    if (!headBoneRef.current) return;

    let targetYaw   = 0;
    let targetPitch = 0;

    if (isPointerActive.current) {
      targetYaw   = globalMouse.current.x *  (20 * Math.PI / 180);
      targetPitch = -globalMouse.current.y * (10 * Math.PI / 180);
    }

    const head = headBoneRef.current;
    const init = initialHeadRotation.current;
    const finalYaw   = init.y + targetYaw;
    const finalPitch = init.x + targetPitch;

    // 0.05 lerp → heavy armour inertia, no snapping
    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, finalYaw,   0.05);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, finalPitch, 0.05);

    if (
      Math.abs(head.rotation.y - finalYaw)   > 0.001 ||
      Math.abs(head.rotation.x - finalPitch) > 0.001
    ) {
      invalidate();
    }
  });

  if (error) {
    console.error("Failed to render Knight:", error);
    return null;
  }

  if (loading || !scene) {
    return null; 
  }

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      position={[-0.155, -1.74, 0]} 
      scale={1.8} 
    />
  );
}
