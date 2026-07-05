import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function GlassCells({ progress, opacity = 1 }) {
  const meshRef = useRef();
  // Adjust particle count for mobile
  const count = window.innerWidth < 768 ? 500 : 2000;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      // Keep cells within an approximate humanoid bounding volume
      // Head area
      let x, y, z;
      const area = Math.random();
      if (area < 0.15) { // Head
        x = (Math.random() - 0.5) * 0.35;
        y = 2.1 + Math.random() * 0.4;
        z = (Math.random() - 0.5) * 0.35;
      } else if (area < 0.6) { // Torso
        x = (Math.random() - 0.5) * 0.65;
        y = 1.0 + Math.random() * 1.1;
        z = (Math.random() - 0.5) * 0.5;
      } else if (area < 0.8) { // Legs
        x = (Math.random() > 0.5 ? 0.2 : -0.2) + (Math.random() - 0.5) * 0.25;
        y = 0.0 + Math.random() * 1.0;
        z = (Math.random() - 0.5) * 0.25;
      } else { // Arms
        x = (Math.random() > 0.5 ? 0.45 : -0.45) + (Math.random() - 0.5) * 0.25;
        y = 1.0 + Math.random() * 1.0;
        z = (Math.random() - 0.5) * 0.25;
      }
      
      const rotX = Math.random() * Math.PI;
      const rotY = Math.random() * Math.PI;
      const rotZ = Math.random() * Math.PI;
      
      const scale = Math.random() * 0.5 + 0.5;
      arr.push({ x, y, z, rotX, rotY, rotZ, scale });
    }
    return arr;
  }, [count]);

  useEffect(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      dummy.scale.setScalar(p.scale * 0.035);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [particles, dummy]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uOpacity: { value: opacity },
        color: { value: new THREE.Color('#00ccff') },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          
          // Get instance position
          vec4 worldPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          
          float normalizedY = (worldPos.y + 0.7) / 1.5;
          
          float scale = 0.0;
          // Soft threshold for scale popping
          float diff = uProgress - normalizedY;
          if (diff > 0.0) {
             scale = min(diff * 10.0, 1.0) + sin(uTime * 3.0 + worldPos.y * 15.0) * 0.15;
          }
          
          vec3 transformed = position * scale;
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform vec3 color;
        varying vec2 vUv;
        
        void main() {
          float edge = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) * 2.0;
          float glow = smoothstep(0.5, 1.0, edge) + 0.2;
          gl_FragColor = vec4(color, glow * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const { invalidate } = useThree();

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uProgress.value = progress / 100;
    material.uniforms.uOpacity.value = opacity;
    invalidate();
  });

  return (
    <group position={[1.2, -1.8, 0]} scale={1.8}>
      <instancedMesh ref={meshRef} args={[null, null, count]} material={material}>
        <octahedronGeometry args={[1, 0]} />
      </instancedMesh>
    </group>
  );
}
