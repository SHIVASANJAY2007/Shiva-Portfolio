import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useModelProgress } from '../../../hooks/useModelLoader';
import { HologramProxy } from './HologramProxy';
import { GlassCells } from './GlassCells';
import { EnergyEffects } from './EnergyEffects';
import { Html } from '@react-three/drei';
import gsap from 'gsap';

export function HeroLoader({ onComplete }) {
  const { progress } = useModelProgress();
  const [fakeProgress, setFakeProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const progressRef = useRef({ val: 0 });

  // Simulate progress building up since large files only emit 100% when fully downloaded
  useEffect(() => {
    if (progress === 100) {
      setFakeProgress(100);
      return;
    }
    
    const interval = setInterval(() => {
      setFakeProgress(p => {
        if (p >= 95) return p;
        // Slows down logarithmically as it gets higher
        return p + (100 - p) * 0.03;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [progress]);

  useEffect(() => {
    const tween = gsap.to(progressRef.current, {
      val: fakeProgress,
      duration: 0.5,
      ease: 'power3.out',
      onUpdate: () => {
        setSmoothProgress(progressRef.current.val);
      },
      onComplete: () => {
        if (progressRef.current.val >= 99.9) {
          gsap.to({ val: 1 }, {
            val: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onUpdate: function () {
              setOpacity(this.targets()[0].val);
            },
            onComplete: () => {
              if (onComplete) onComplete();
            }
          });
        }
      }
    });
    
    return () => tween.kill();
  }, [fakeProgress, onComplete]);

  // If totally faded out, unmount to save resources
  if (opacity <= 0.01) return null;

  return (
    <group>
      <Suspense fallback={null}>
        <HologramProxy progress={smoothProgress} opacity={opacity} />
      </Suspense>
      <GlassCells progress={smoothProgress} opacity={opacity} />
      <EnergyEffects progress={smoothProgress} opacity={opacity} />
      
      {/* Abstract loading text to match the reconstruction theme */}
      <Html center position={[0, -2.0, 0]}>
        <div style={{
          color: `rgba(17, 17, 17, ${opacity})`,
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontSize: '0.8rem',
          textAlign: 'center',
          textShadow: '0 0 10px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap'
        }}>
          AI Reconstruction... {Math.round(smoothProgress)}%
        </div>
      </Html>
    </group>
  );
}
