import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, useGraph } from '@react-three/fiber';
import { useKnightModel } from '../../hooks/useKnightModel';
import gsap from 'gsap';

function KnightModel({ scene, invalidate }) {
  const meshRef = useRef();
  
  if (scene.userData && scene.userData.isFallback) {
    return <primitive object={scene} />;
  }

  const { nodes, materials } = useGraph(scene);

  // ── HEAD TRACKING refs ─────────────────────────────────────────────────────
  const headBoneRef = useRef(null);
  const initialHeadRotation = useRef(new THREE.Euler());
  const isPointerActive = useRef(false);
  const globalMouse = useRef({ x: 0, y: 0 });

  // ── Step 2: Traverse to find head bone ─────────────────────
  useEffect(() => {
    let found = false;
    if (nodes && nodes.GLTF_created_0_rootJoint) {
      nodes.GLTF_created_0_rootJoint.traverse((child) => {
        if (!found && child.isBone) {
          const name = child.name.toLowerCase();
          if (name.includes('head') || name.includes('neck')) {
            headBoneRef.current = child;
            initialHeadRotation.current.copy(child.rotation);
            found = true;
          }
        }
      });
    }
  }, [nodes]);

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
    
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    
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
          onUpdate: invalidate,
        });
      }
    });
  }, [invalidate]);

  // ── Step 5: Per-frame head lerp & idle float ───────────────────────────────
  useFrame((state) => {
    if (!meshRef.current) return;
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

    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, finalYaw,   0.05);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, finalPitch, 0.05);

    if (
      Math.abs(head.rotation.y - finalYaw)   > 0.001 ||
      Math.abs(head.rotation.x - finalPitch) > 0.001
    ) {
      invalidate();
    }
  });

  return (
    <group ref={meshRef} position={[-0.155, -1.74, 0]} scale={1.8} dispose={null}>
      <group position={[0.248, 1.783, 0.363]} rotation={[2.443, -1.393, -0.88]} scale={0.496}>
        <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry} material={materials.roses_mat} />
        <mesh castShadow receiveShadow geometry={nodes.Object_5.geometry} material={materials.roses_mat} />
      </group>
      <primitive object={nodes.GLTF_created_0_rootJoint} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_10.geometry} material={materials.cloak_mat} skeleton={nodes.Object_10.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_12.geometry} material={materials.center_armor_mat} skeleton={nodes.Object_12.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_14.geometry} material={materials.center_armor_mat} skeleton={nodes.Object_14.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_16.geometry} material={materials.eye_plug_mat} skeleton={nodes.Object_16.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_18.geometry} material={materials.top_armor_mat} skeleton={nodes.Object_18.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_20.geometry} material={materials.top_armor_mat} skeleton={nodes.Object_20.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_22.geometry} material={materials.bottom_armor_mat} skeleton={nodes.Object_22.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_24.geometry} material={materials.center_armor_mat} skeleton={nodes.Object_24.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_25.geometry} material={materials.details_mat} skeleton={nodes.Object_25.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_27.geometry} material={materials.center_armor_mat} skeleton={nodes.Object_27.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_28.geometry} material={materials.details_mat} skeleton={nodes.Object_28.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_29.geometry} material={materials.top_armor_mat} skeleton={nodes.Object_29.skeleton} />
      <skinnedMesh castShadow receiveShadow geometry={nodes.Object_31.geometry} material={materials.details_mat} skeleton={nodes.Object_31.skeleton} />
      <mesh castShadow receiveShadow geometry={nodes.Object_103.geometry} material={materials.sword_mat} position={[0, 1.844, 0.392]} />
    </group>
  );
}

export function Knight() {
  const { invalidate } = useThree();
  const { scene, loading, error } = useKnightModel(false);

  if (error) {
    console.error("Failed to render Knight:", error);
    return null;
  }

  if (loading || !scene) {
    return null; 
  }

  return <KnightModel scene={scene} invalidate={invalidate} />;
}
