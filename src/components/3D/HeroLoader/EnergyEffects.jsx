import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function EnergyEffects({ progress, opacity = 1 }) {
  const particleCount = window.innerWidth < 768 ? 150 : 400;
  
  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      // Volume around the knight
      positions[i * 3] = (Math.random() - 0.5) * 2.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      randoms[i] = Math.random();
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    return geometry;
  }, [particleCount]);

  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: opacity },
        color: { value: new THREE.Color('#88ccff') },
      },
      vertexShader: `
        uniform float uTime;
        attribute float aRandom;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.5 + aRandom * 10.0) * 0.2;
          pos.x += cos(uTime * 0.3 + aRandom * 10.0) * 0.1;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (12.0 * aRandom + 4.0) * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          vAlpha = sin(uTime * 2.0 + aRandom * 20.0) * 0.5 + 0.5;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float uOpacity;
        varying float vAlpha;
        void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          
          float glow = (0.5 - ll) * 2.0;
          gl_FragColor = vec4(color, glow * vAlpha * uOpacity * 0.6);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const rings = useMemo(() => [0, 1, 2].map(i => ({ delay: i * 1.5 })), []);

  const ringMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: opacity },
        color: { value: new THREE.Color('#0055ff') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          float glow = sin(vUv.y * 3.14159);
          gl_FragColor = vec4(color, glow * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);

  const ringsRef = useRef();

  const { invalidate } = useThree();

  useFrame(({ clock }) => {
    particleMaterial.uniforms.uTime.value = clock.elapsedTime;
    particleMaterial.uniforms.uOpacity.value = opacity;
    ringMaterial.uniforms.uTime.value = clock.elapsedTime;

    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        const time = (clock.elapsedTime + rings[i].delay) % 4.5;
        const scale = 0.2 + time * 0.8;
        ring.scale.set(scale, scale, scale);
        // fade out as it expands
        const ringOp = opacity * Math.max(0, (1.0 - time / 4.5));
        ring.material.uniforms.uOpacity.value = ringOp * 0.5; // keep it subtle
      });
    }
    invalidate();
  });

  return (
    <group position={[-0.155, -1.3, 0]}>
      <points geometry={particles} material={particleMaterial} />
      <group ref={ringsRef} rotation={[-Math.PI / 2, 0, 0]}>
        {rings.map((_, i) => (
          <mesh key={i} material={ringMaterial}>
            <ringGeometry args={[0.9, 1.0, 64]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
