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

  useEffect(() => {
    if (!meshRef.current) return;
    
    // Honor accessibility settings
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    
    // Animate the model's appearance
    meshRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        // We clone the material so we don't accidentally mutate the cached scene's materials
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

  useFrame((state) => {
    if (meshRef.current) {
      // Idle float animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.03;
    }
  });

  if (error) {
    console.error("Failed to render Knight:", error);
    return null;
  }

  if (loading || !scene) {
    // The HeroLoader handles the loading visual outside of this component
    return null; 
  }

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      position={[1.2, -1.8, 0]} 
      scale={1.8} 
    />
  );
}
