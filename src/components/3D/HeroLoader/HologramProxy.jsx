import React, { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function HologramProxy({ progress, opacity = 1 }) {
  const { invalidate } = useThree();

  // Generate a generic Knight-like silhouette using math instead of a proxy file!
  // This guarantees the loader appears instantly on screen (0ms network delay).
  const pointGeometry = useMemo(() => {
    const positions = [];
    const count = window.innerWidth < 768 ? 5000 : 15000;
    
    for (let i = 0; i < count; i++) {
      let x, y, z;
      const area = Math.random();
      
      // Math-based Humanoid/Knight structure
      if (area < 0.08) { // Head/Helmet
        x = (Math.random() - 0.5) * 0.2;
        y = 0.55 + Math.random() * 0.25;
        z = (Math.random() - 0.5) * 0.22;
      } else if (area < 0.45) { // Torso/Armor
        x = (Math.random() - 0.5) * 0.45;
        y = -0.1 + Math.random() * 0.65;
        z = (Math.random() - 0.5) * 0.35;
      } else if (area < 0.65) { // Legs
        x = (Math.random() > 0.5 ? 0.15 : -0.15) + (Math.random() - 0.5) * 0.15;
        y = -0.7 + Math.random() * 0.6;
        z = (Math.random() - 0.5) * 0.15;
      } else if (area < 0.85) { // Arms
        x = (Math.random() > 0.5 ? 0.35 : -0.35) + (Math.random() - 0.5) * 0.15;
        y = -0.1 + Math.random() * 0.6;
        z = (Math.random() - 0.5) * 0.15;
      } else { // Cape extending backwards
        x = (Math.random() - 0.5) * 0.5;
        y = -0.7 + Math.random() * 1.3;
        z = -0.2 - Math.random() * 0.35;
      }

      positions.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) randoms[i] = Math.random();
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    
    return geometry;
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uOpacity: { value: opacity },
        color: { value: new THREE.Color('#111111') }, // Black dotted structure
      },
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        attribute float aRandom;
        varying float vAlpha;
        
        void main() {
          vec3 pos = position;
          
          // The proxy meshes go roughly from y=-1.0 to y=2.0 in local space
          float normalizedY = (pos.y + 1.0) / 3.0; 
          
          // Idle jitter
          pos.x += sin(uTime * 2.0 + aRandom * 10.0) * 0.005;
          pos.y += cos(uTime * 2.5 + aRandom * 10.0) * 0.005;

          // Building effect based on progress
          float diff = normalizedY - uProgress;
          
          if (diff > 0.0) {
            // Unloaded particles scatter and fade
            pos.y += diff * 1.5;
            pos.x += sin(uTime * 3.0 + aRandom * 20.0) * diff * 0.5;
            pos.z += cos(uTime * 3.0 + aRandom * 20.0) * diff * 0.5;
            
            // Soft transition zone
            vAlpha = max(0.0, 1.0 - diff * 5.0); 
          } else {
            // Loaded particles stay firm
            vAlpha = 1.0;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (4.0 + aRandom * 2.0) * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          
          float smoothEdge = smoothstep(0.5, 0.3, ll);
          gl_FragColor = vec4(color, vAlpha * uOpacity * smoothEdge);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending, 
    });
  }, []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uProgress.value = progress / 100;
    material.uniforms.uOpacity.value = opacity;
    invalidate();
  });

  return (
    <points geometry={pointGeometry} material={material} position={[-0.155, -1.74, 0]} scale={1.8} />
  );
}
