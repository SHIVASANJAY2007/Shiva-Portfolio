import { useGLTF, Environment, Float } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useSceneStore } from '../../../store/sceneStore';
import * as THREE from 'three';
import CameraController from './CameraController';
import Annotations from './Annotations';

export default function SceneContent() {
  const { scene } = useGLTF('/dragon_scene/wrath_of_the_dragon.glb');
  const mode = useSceneStore((state) => state.mode);
  const group = useRef();

  useEffect(() => {
    if (!scene) return;

    // Visibility & Dynamic Opacity Control Logic
    const dragon = scene.getObjectByName('Dragon');
    const warrior = scene.getObjectByName('Warrior');
    const env = scene.getObjectByName('Environment');

    if (dragon && warrior) {
      if (mode === 'warrior') {
        // Dim dragon to emphasize warrior
        dragon.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, 0.3, 0.1);
          }
        });
        warrior.visible = true;
      } else if (mode === 'dragon') {
        // Dim warrior to emphasize dragon
        warrior.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, 0.2, 0.1);
          }
        });
        dragon.visible = true;
      } else {
        // Full visibility
        scene.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 1;
          }
        });
      }
    }
  }, [mode, scene]);

  return (
    <>
      <primitive ref={group} object={scene} scale={1} position={[0, 0, 0]} />

      {/* Cinematic Lighting System */}
      <Environment preset="night" />
      <fog attach="fog" args={["#0a0a0a", 5, 25]} />

      <ambientLight intensity={0.5} />
      <spotLight 
        position={[10, 15, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        color="#ff7b00" // Embers/Fire tint
      />
      
      <pointLight position={[-5, 5, -5]} intensity={1} color="#0066ff" />

      {/* Global camera choreography */}
      <CameraController />
      
      {/* Interactive points */}
      <Annotations />
    </>
  );
}

// Preload for performance
useGLTF.preload('/dragon_scene/wrath_of_the_dragon.glb');
