/**
 * CarScrollModel — Cinematic Hypercar Reveal
 */
import React, { useRef, Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

import { Spring, NoiseOscillator } from './cinematic/SpringPhysics';
import {
  easeOutCubic,
  easeOutQuint,
  easeAnticipate,
  smoothstep,
  easeInOutExpo,
  easeOutBack,
  mapRange,
  clamp,
} from './cinematic/EasingCurves';

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL TIMELINE — maps raw scrollY into normalized phases
// ─────────────────────────────────────────────────────────────────────────────
const scrollState = { y: 0, velocity: 0, direction: 1 };

// ─────────────────────────────────────────────────────────────────────────────
// PHASE DEFINITIONS (all in viewport-height multiples)
// ─────────────────────────────────────────────────────────────────────────────
//  Phase 0: [0.00 – 0.08 vh]  Hidden / Parked
//  Phase 1: [0.08 – 0.45 vh]  Anticipation → High-speed Entry (covers screen)
//  Phase 2: [0.45 – 0.60 vh]  Hero Lock-In (camera focus, dramatic pause)
//  Phase 3: [0.60 – 0.90 vh]  Controlled Settle (physics deceleration)
//  Phase 4: [0.90 +        ]  Ambient Background Presence

const PH = {
  P0_END: 0.10, // Hero Static State
  P1_END: 1.00, // THE SLIDE (Right to Left)
  P2_END: 2.20, // About Section Lock-in
  P3_END: 3.50, // Final Settle
};

// ─────────────────────────────────────────────────────────────────────────────
// CAR MODEL SCENE — motion, vibration, wheel spin, suspension
// ─────────────────────────────────────────────────────────────────────────────
const CarMotionController = () => {
  const groupRef = useRef();
  const bodyRef = useRef();
  const { scene } = useGLTF('/car_model/car.gltf');

  // Springs for each animated property
  const springs = useMemo(() => ({
    x:      new Spring({ stiffness: 60,  damping: 15, mass: 1.5, initial: 12 }),
    y:      new Spring({ stiffness: 80,  damping: 18, mass: 1.2, initial: -0.5 }),
    scale:  new Spring({ stiffness: 50,  damping: 12, mass: 2.0, initial: 2.5 }),
    rotY:   new Spring({ stiffness: 40,  damping: 8,  mass: 2.0, initial: Math.PI * 0.1 }),
    suspY:  new Spring({ stiffness: 180, damping: 25, mass: 0.4, initial: 0  }),
  }), []);

  // Micro-vibration oscillators (engine idle feel)
  const noise = useMemo(() => ({
    x:    new NoiseOscillator({ amplitude: 0.003, speed: 0.8 }),
    y:    new NoiseOscillator({ amplitude: 0.002, speed: 1.2 }),
    rotZ: new NoiseOscillator({ amplitude: 0.001, speed: 0.6 }),
  }), []);

  // Bounding-box normalization — fires once on load
  useEffect(() => {
    if (!scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const maxDim = box.getSize(new THREE.Vector3()).length();
    const s = 1.0 / maxDim;
    scene.scale.setScalar(s);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center.clone().multiplyScalar(s));
  }, [scene]);

  let previousScrollY = 0;

  useFrame((state) => {
    if (!groupRef.current) return;
    const dt = Math.min(state.delta, 0.05); // clamp delta for stability
    const t = state.clock.elapsedTime;
    const sy = window.scrollY;
    const vh = window.innerHeight;
    const progress = Math.max(sy / vh, 0);

    // ── Velocity for intensity modulation
    const velocity = sy - previousScrollY;
    previousScrollY = sy;
    const velIntensity = clamp(Math.abs(velocity) / 30, 0, 1);
    
    // Update global scroll state tracker
    scrollState.y = sy;
    scrollState.velocity = velocity;
    if (Math.abs(velocity) > 0.1) scrollState.direction = velocity > 0 ? 1 : -1;

    // ── PHASE TARGETS ───────────────────────────────────────────────
    let targetX = 0;
    let targetY = 0;
    let targetScale = 3.5;
    let targetRotY = 0;
    let suspensionPunch = 0;

    if (progress <= PH.P0_END) {
      // Phase 0: Hero State — Car peek from right
      const t0 = progress / PH.P0_END;
      targetX = 6; // Starts at the right edge
      targetY = -0.3;
      targetScale = 3.0;
      targetRotY = -Math.PI * 0.15; // Angled slightly away

    } else if (progress <= PH.P1_END) {
      // Phase 1: THE GREAT SLIDE (Right to Left sweep)
      const t1 = mapRange(progress, PH.P0_END, PH.P1_END, 0, 1, easeInOutQuad);
      targetX = THREE.MathUtils.lerp(6, -6, t1); // Sweeps across full screen
      targetY = THREE.MathUtils.lerp(-0.3, 0.2, t1);
      targetScale = THREE.MathUtils.lerp(3.0, 4.5, t1); // Gets closer mid-way
      targetRotY = THREE.MathUtils.lerp(-Math.PI * 0.15, Math.PI * 0.2, t1); // Dynamic turn

    } else if (progress <= PH.P2_END) {
      // Phase 2: ABOUT LOCK-IN
      const t2 = mapRange(progress, PH.P1_END, PH.P2_END, 0, 1, easeOutBack);
      targetX = THREE.MathUtils.lerp(-6, -2, t2); // Settles on the left of text
      targetY = THREE.MathUtils.lerp(0.2, -0.5, t2);
      targetScale = THREE.MathUtils.lerp(4.5, 3.2, t2);
      targetRotY = THREE.MathUtils.lerp(Math.PI * 0.2, Math.PI * 0.5, t2); // Side profile
      suspensionPunch = Math.pow(1 - t2, 4) * 0.2;

    } else if (progress <= PH.P3_END) {
      // Phase 3: SETTLE
      const t3 = mapRange(progress, PH.P2_END, PH.P3_END, 0, 1, easeOutBack);
      targetX = 0;
      targetY = THREE.MathUtils.lerp(0, -1.2, t3);
      targetScale = THREE.MathUtils.lerp(4.0, 1.2, t3);
      targetRotY = sy * 0.001;

    } else {
      targetX = 0;
      targetY = -1.2;
      targetScale = 1.2;
      targetRotY = sy * 0.0005;
    }

    // ── Continuous scroll-driven Y rotation (spins faster with more velocity)
    targetRotY = sy * 0.003 + velIntensity * 0.08 * scrollState.direction;

    // ── Feed spring targets
    springs.x.setTarget(targetX);
    springs.y.setTarget(targetY);
    springs.scale.setTarget(targetScale);
    springs.rotY.setTarget(targetRotY);
    springs.suspY.setTarget(suspensionPunch);

    // ── Evolve springs
    const sx = springs.x.update(dt);
    const sy2 = springs.y.update(dt) + springs.suspY.update(dt);
    const ss = springs.scale.update(dt);
    const sr = springs.rotY.update(dt);

    // ── Micro-vibrations (engine idle — only visible when car is on screen)
    const isVisible = progress > PH.P0_END && progress < PH.P3_END + 0.3;
    const vibAmp = isVisible ? (1.0 - clamp(progress / PH.P3_END, 0, 1) * 0.7) : 0;
    const vx = noise.x.getValue(t) * vibAmp;
    const vy = noise.y.getValue(t) * vibAmp;
    const vrz = noise.rotZ.getValue(t) * vibAmp;

    // ── Apply to group
    groupRef.current.position.set(sx + vx, sy2 + vy, 0);
    groupRef.current.rotation.set(0, sr, vrz);
    groupRef.current.scale.setScalar(Math.max(ss, 0.01));

    // ── Background Color Morphing (Dynamic Scrollytelling)
    // Darken/Shift background during the 'The Great Slide'
    if (progress > PH.P0_END && progress < PH.P2_END) {
        const morphT = mapRange(progress, PH.P0_END, PH.P2_END, 0, 1, smoothstep);
        // Transition from #000000 to #0b0b14 (Deep Midnight)
        const r = Math.round(THREE.MathUtils.lerp(0, 11, morphT));
        const g = Math.round(THREE.MathUtils.lerp(0, 11, morphT));
        const b = Math.round(THREE.MathUtils.lerp(0, 20, morphT));
        document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    } else if (progress >= PH.P2_END) {
        document.body.style.backgroundColor = '#000000';
    }

    // ── Inertia rotation lag on Z axis (weight/tilt when sweeping in)
    if (bodyRef.current) {
      const inertiaZ = clamp(-velocity * 0.0015, -0.08, 0.08);
      bodyRef.current.rotation.z = THREE.MathUtils.lerp(
        bodyRef.current.rotation.z, inertiaZ, 0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA RIG — dolly + orbit + parallax storytelling
// ─────────────────────────────────────────────────────────────────────────────
const CameraRigController = () => {
  const { camera } = useThree();

  const camSprings = useMemo(() => ({
    z:    new Spring({ stiffness: 50, damping: 10, mass: 1, initial: 8 }),
    y:    new Spring({ stiffness: 60, damping: 12, mass: 1, initial: 0 }),
    rotY: new Spring({ stiffness: 30, damping: 8,  mass: 1, initial: 0 }),
    fov:  new Spring({ stiffness: 40, damping: 10, mass: 1, initial: 45 }),
  }), []);

  useFrame((state) => {
    const dt = Math.min(state.delta, 0.05);
    const sy = window.scrollY;
    const vh = window.innerHeight;
    const progress = Math.max(sy / vh, 0);

    let targetCamZ = 8;
    let targetCamY = 0;
    let targetCamRotY = 0;
    let targetFov = 45;

    if (progress <= PH.P0_END) {
      // Camera resting, neutral
      targetCamZ = 8;

    } else if (progress <= PH.P1_END) {
      // Phase 1: DOLLY-IN — camera rushes toward the car as it enters
      const t1 = mapRange(progress, PH.P0_END, PH.P1_END, 0, 1, easeOutCubic);
      targetCamZ = THREE.MathUtils.lerp(8, 5.5, t1);  // moves closer
      targetFov = THREE.MathUtils.lerp(45, 52, t1);    // widening FOV = more dramatic

    } else if (progress <= PH.P2_END) {
      // Phase 2: HERO LOCK — subtle orbit around the car (clockwise drift)
      const t2 = mapRange(progress, PH.P1_END, PH.P2_END, 0, 1, smoothstep);
      targetCamZ = THREE.MathUtils.lerp(5.5, 6.0, t2);
      targetCamRotY = THREE.MathUtils.lerp(0, 0.12, t2); // slightly circles car
      targetCamY = THREE.MathUtils.lerp(0, 0.3, t2);     // rises slightly
      targetFov = THREE.MathUtils.lerp(52, 48, t2);      // tightens focus

    } else if (progress <= PH.P3_END) {
      // Phase 3: PULL BACK TO NEUTRAL — smooth dolly-out, settle
      const t3 = mapRange(progress, PH.P2_END, PH.P3_END, 0, 1, easeOutQuint);
      targetCamZ = THREE.MathUtils.lerp(6.0, 8, t3);
      targetCamRotY = THREE.MathUtils.lerp(0.12, 0, t3);
      targetCamY = THREE.MathUtils.lerp(0.3, 0, t3);
      targetFov = THREE.MathUtils.lerp(48, 45, t3);

    } else {
      targetCamZ = 8;
      targetCamY = 0;
      targetCamRotY = 0;
      targetFov = 45;
    }

    camSprings.z.setTarget(targetCamZ);
    camSprings.y.setTarget(targetCamY);
    camSprings.rotY.setTarget(targetCamRotY);
    camSprings.fov.setTarget(targetFov);

    camera.position.z = camSprings.z.update(dt);
    camera.position.y = camSprings.y.update(dt);
    camera.rotation.y = camSprings.rotY.update(dt);
    camera.fov = camSprings.fov.update(dt);
    camera.updateProjectionMatrix();
  });

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTING ANIMATOR — scroll-reactive lights
// ─────────────────────────────────────────────────────────────────────────────
const LightingAnimator = () => {
  const keyLightRef = useRef();
  const fillLightRef = useRef();
  const rimLightRef = useRef();
  const spotRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sy = window.scrollY;
    const vh = window.innerHeight;
    const progress = Math.max(sy / vh, 0);

    if (!keyLightRef.current || !fillLightRef.current || !rimLightRef.current || !spotRef.current) return;

    if (progress <= PH.P0_END) {
      // Ambient darkness — hint of a reveal
      keyLightRef.current.intensity = 0.4;
      fillLightRef.current.intensity = 0.2;
      rimLightRef.current.intensity  = 0.1;
      spotRef.current.intensity = 0;

    } else if (progress <= PH.P1_END) {
      // High-speed entry — lights flash bright (like a showroom reveal)
      const t1 = mapRange(progress, PH.P0_END, PH.P1_END, 0, 1, easeOutCubic);
      keyLightRef.current.intensity = THREE.MathUtils.lerp(0.4, 2.5, t1);
      fillLightRef.current.intensity = THREE.MathUtils.lerp(0.2, 1.2, t1);
      rimLightRef.current.intensity  = THREE.MathUtils.lerp(0.1, 2.0, t1);
      spotRef.current.intensity = 0;

      // Key light sweeps across car surface (highlight sweep effect)
      keyLightRef.current.position.x = THREE.MathUtils.lerp(10, -5, t1);

    } else if (progress <= PH.P2_END) {
      // Hero lock — dramatic, cinematic single-key dramatic lighting
      const t2 = mapRange(progress, PH.P1_END, PH.P2_END, 0, 1, smoothstep);
      keyLightRef.current.intensity = THREE.MathUtils.lerp(2.5, 3.5, t2);
      fillLightRef.current.intensity = THREE.MathUtils.lerp(1.2, 0.4, t2); // narrow fill = drama
      rimLightRef.current.intensity  = THREE.MathUtils.lerp(2.0, 3.0, t2); // hot rim
      spotRef.current.intensity = THREE.MathUtils.lerp(0, 8.0, t2); // spotlight snap

      // Subtle light orbit for showroom "rotation" feel
      keyLightRef.current.position.x = Math.cos(t * 0.3) * 6;
      keyLightRef.current.position.z = Math.sin(t * 0.3) * 6;

    } else if (progress <= PH.P3_END) {
      // Settle — normalize back to balanced ambient
      const t3 = mapRange(progress, PH.P2_END, PH.P3_END, 0, 1, smoothstep);
      keyLightRef.current.intensity = THREE.MathUtils.lerp(3.5, 1.5, t3);
      fillLightRef.current.intensity = THREE.MathUtils.lerp(0.4, 0.8, t3);
      rimLightRef.current.intensity  = THREE.MathUtils.lerp(3.0, 0.8, t3);
      spotRef.current.intensity = THREE.MathUtils.lerp(8.0, 0, t3);

    } else {
      keyLightRef.current.intensity = 1.5;
      fillLightRef.current.intensity = 0.8;
      rimLightRef.current.intensity  = 0.8;
      spotRef.current.intensity = 0;
    }
  });

  return (
    <>
      {/* Key light — main dramatic source */}
      <directionalLight ref={keyLightRef} position={[8, 6, 5]} intensity={1.5} castShadow />

      {/* Fill light — cool blue from left */}
      <directionalLight ref={fillLightRef} position={[-6, 3, -4]} intensity={0.8} color="#6090ff" />

      {/* Rim / back light — highlights silhouette */}
      <directionalLight ref={rimLightRef} position={[0, -3, -8]} intensity={0.8} color="#ff8844" />

      {/* Spotlight — showroom column of light during hero lock */}
      <spotLight
        ref={spotRef}
        position={[0, 10, 2]}
        angle={0.25}
        penumbra={0.6}
        intensity={0}
        color="#ffffff"
        castShadow
      />

      {/* Always-on ambient base */}
      <ambientLight intensity={0.5} />
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT — CarScrollModel
// ─────────────────────────────────────────────────────────────────────────────
export const CarScrollModel = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={1} 
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
        }}
      >
        {/* Environment HDRI for PBR reflections */}
        <Environment preset="city" />

        {/* Lighting system */}
        <LightingAnimator />

        {/* Camera choreography */}
        <CameraRigController />

        {/* The car itself */}
        <Suspense fallback={null}>
          <CarMotionController />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Eagerly preload car GLTF
useGLTF.preload('/car_model/car.gltf');

export default CarScrollModel;
