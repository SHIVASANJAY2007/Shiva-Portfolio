import React, { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function HologramProxy({ progress, opacity = 1 }) {
  const { scene } = useGLTF('/models/knight.glb');

  // Extract all vertices from the loaded scene into a single point cloud
  const pointGeometry = useMemo(() => {
    const positions = [];
    scene.updateMatrixWorld(true);

    // Some models have high vertex counts; we can sample them to avoid 
    // too many particles, but rendering 100k-200k points in WebGL is usually fine.
    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const posAttribute = child.geometry.attributes.position;
        if (!posAttribute) return;
        
        const v = new THREE.Vector3();
        // Step size of 2 or 3 can reduce point count if it's too dense
        // Let's use step = 1 (all vertices) for maximum detail
        for (let i = 0; i < posAttribute.count; i += 2) {
          v.fromBufferAttribute(posAttribute, i);
          v.applyMatrix4(child.matrixWorld);
          positions.push(v.x, v.y, v.z);
        }
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    // Add some random offsets for idle jitter
    const randoms = new Float32Array(positions.length / 3);
    for (let i = 0; i < randoms.length; i++) randoms[i] = Math.random();
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    
    return geometry;
  }, [scene]);

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

  const { invalidate } = useThree();

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

useGLTF.preload('/models/knight.glb');
