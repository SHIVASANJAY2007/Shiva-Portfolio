import React, { useEffect, useState, Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useModelProvider } from '../../providers/ModelProvider';
import { HeroLoader } from './HeroLoader';
import { Knight } from './Knight';

gsap.registerPlugin(ScrollTrigger);

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Global 3D Canvas Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function CameraRig() {
  const { camera } = useThree();
  const rigRef = useRef({
    targetX: 0.03506215468457707,
    targetY: 2.0473513037249234,
    targetZ: 0.1572685070081812,
    radius: 3.705001029137252,
    phi: 1.6022120935411297,
    theta: -0.002073837435617138,
    fov: 21.676747862747334
  });

  useEffect(() => {
    // Initial setup
    const updateCamera = () => {
      const target = new THREE.Vector3(rigRef.current.targetX, rigRef.current.targetY, rigRef.current.targetZ);
      const spherical = new THREE.Spherical(rigRef.current.radius, rigRef.current.phi, rigRef.current.theta);
      const position = new THREE.Vector3().setFromSpherical(spherical).add(target);
      
      camera.position.copy(position);
      camera.lookAt(target);
      camera.fov = rigRef.current.fov;
      camera.updateProjectionMatrix();
    };
    
    updateCamera(); // Set initially

    // Setup GSAP animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about", // Transition based on About section scroll
        start: "top bottom", // When About top hits viewport bottom
        end: "top top",      // When About top hits viewport top
        scrub: 1,
        // markers: true, // Uncomment for debugging
      }
    });

    tl.to(rigRef.current, {
      targetX: -0.4, // Shifted left to move model right on screen
      targetY: 1.9642811513114504,
      targetZ: 0.1856663508509217,
      radius: 3.7547183277016716,
      phi: 1.5707961670052297,
      theta: 0.8228039003103755,
      fov: 22.137967843727875,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
    };
  }, [camera]);

  useFrame(() => {
    const target = new THREE.Vector3(rigRef.current.targetX, rigRef.current.targetY, rigRef.current.targetZ);
    const spherical = new THREE.Spherical(rigRef.current.radius, rigRef.current.phi, rigRef.current.theta);
    const position = new THREE.Vector3().setFromSpherical(spherical).add(target);
    
    camera.position.copy(position);
    camera.lookAt(target);
    camera.fov = rigRef.current.fov;
    camera.updateProjectionMatrix();
  });

  return null;
}

export const GlobalCanvas = () => {
  const { progress } = useModelProvider() || { progress: 0 };
  const [modelReady, setModelReady] = useState(false);
  const [mountModel, setMountModel] = useState(false);

  useEffect(() => {
    setMountModel(true);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setModelReady(true), 1500);
    }
  }, [progress]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 5, // Above backgrounds, below text
      pointerEvents: 'none', // Allow clicks to pass through
      background: 'transparent'
    }} aria-hidden="true">
      <CanvasErrorBoundary>
        <Canvas
          shadows
          gl={{ 
            alpha: true, 
            antialias: true, 
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1
          }}
          dpr={[1.5, 2]}
          frameloop={modelReady ? "always" : "always"} 
          /* NOTE: Changing to always to ensure useFrame runs for scroll animations. 
             Can optimize later if we detect when not scrolling */
        >
          <PerspectiveCamera
            makeDefault
            fov={21.676747862747334}
            near={0.1}
            far={1000}
          />
          <CameraRig />

          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize={[2048, 2048]} 
            shadow-bias={-0.0001} 
          />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <Environment preset="city" />

          <HeroLoader />
          {mountModel && (
            <Suspense fallback={null}>
              <group>
                <Knight />
              </group>
            </Suspense>
          )}
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

export default GlobalCanvas;
