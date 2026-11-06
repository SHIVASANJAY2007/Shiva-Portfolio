import React, { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, useGLTF, PerformanceMonitor, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { HeroLoader } from '../3D/HeroLoader';
import { scrollToSection } from '../../lib/scrollToSection';
import { resumeData } from '../../data/resume';
import { getQuality, getQualityConfig } from '../../utils/quality';
import AeroShardsFallback from '../3D/AeroShardsFallback';

const KNIGHT_MODEL_URL = '/models/knight-opt.glb';

// High-priority early preload trigger for the 3D model
useGLTF.preload(KNIGHT_MODEL_URL, false, true);

const Knight = React.lazy(() => import('../3D/Knight').then(module => ({ default: module.Knight })));

// Preserved CameraRig for 3D Model
function HeroCameraRig() {
  return (
    <PerspectiveCamera
      makeDefault
      fov={21.676747862747334}
      near={0.1}
      far={1000}
      position={[
        0.03506215468457707 + 3.705 * Math.sin(1.602) * Math.sin(-0.002),
        2.0473513037249234 + 3.705 * Math.cos(1.602),
        0.1572685070081812 + 3.705 * Math.sin(1.602) * Math.cos(-0.002)
      ]}
    />
  );
}

// Ultra-Resilient WebGL Error Boundary with automated fallback trigger
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("WebGL visual context interrupted:", error);
    if (this.props.onFail) {
      this.props.onFail();
    }
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// Dedicated Error Boundary for inside the Canvas reconciler tree
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("[Hero] 3D Model failed inside Canvas:", error);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

const AeroShards = React.lazy(() => import('../3D/AeroShards'));

function AeroShardsBackground({ isHeroVisible, documentHidden }) {
  const [useFallback, setUseFallback] = useState(false);
  const isPaused = !isHeroVisible || documentHidden;

  const supportsWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator && !useFallback;

  if (!supportsWebGPU) {
    return (
      <AeroShardsFallback
        shardColor="#896ABD"
        accentColor="#A855F7"
        count={280}
        paused={isPaused}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <AeroShardsFallback
          shardColor="#896ABD"
          accentColor="#A855F7"
          count={280}
          paused={isPaused}
        />
      }
    >
      <AeroShards
        shardColor="#896ABD"
        accentColor="#A855F7"
        backgroundColor="transparent"
        placement="full"
        material="glass"
        markers="plus"
        count={650}
        shardSize={1}
        spread={1}
        twist={1}
        billow={1}
        speed={1.2}
        scale={1}
        depthOfField={0.75}
        glow={0.35}
        grain={0.06}
        vignette={0.3}
        intro={true}
        mouseInteraction={true}
        mouseStrength={0.6}
        parallax={0.5}
        pulseOnClick={true}
        holdToGather={true}
        paused={isPaused}
        dpr={1.5}
        onError={(err) => {
          console.warn("[AeroShards] WebGPU pipeline unavailable, switching to 2D canvas fallback:", err);
          setUseFallback(true);
        }}
      />
    </Suspense>
  );
}

// Resume-driven dynamic role catalog
const ROTATING_ROLES = [
  { left: "WEB", right: "DEVELOPER" },
  { left: "AI AUTOMATION", right: "SPECIALIST" },
  { left: "TRAINER", right: "& MENTOR" },
  { left: "SPORTSMAN", right: "KHO KHO CAPTAIN" },
  { left: "FULL-STACK", right: "ENGINEER" },
  { left: "N8N WORKFLOW", right: "ARCHITECT" },
  { left: "ODOO & SALESFORCE", right: "INTERESTED" },
  { left: "UI/UX & REACT", right: "DESIGNER" },
  { left: "ENTERPRISE CRM", right: "INTEGRATOR" },
  { left: "PYTHON & AI", right: "SOLUTIONS" }
];

const DynamicRole = React.memo(({ isCenter, roleRef }) => {
  const [index, setIndex] = useState(0);
  const localRef = useRef(null);
  const targetRef = roleRef || localRef;

  useEffect(() => {
    const interval = setInterval(() => {
      const targets = targetRef.current?.children;
      if (!targets || !targets.length) return;

      gsap.to(targets, {
        y: -18,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setIndex((prev) => (prev + 1) % ROTATING_ROLES.length);
          gsap.fromTo(targets,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
          );
        }
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [targetRef]);

  const currentRole = ROTATING_ROLES[index];

  return (
    <div 
      className={`${styles.splitSubhead} ${isCenter ? styles.splitSubheadCenter : ''}`} 
      ref={targetRef}
    >
      <span className={styles.subLeft}>{currentRole.left}</span>
      <span className={styles.subRight}>{currentRole.right}</span>
    </div>
  );
});

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const bioRef = useRef(null);
  const roleRef = useRef(null);
  const overlayTitleRef = useRef(null);
  const overlayRoleRef = useRef(null);
  const ctaRef = useRef(null);

  // Model ready: becomes true when 3D Knight model renders its first frame on GPU
  const [isModelReady, setIsModelReady] = useState(false);
  // Model failed: becomes true if 3D model encounters WebGL error or exceeds 5s timeout
  const [modelFailed, setModelFailed] = useState(false);
  // AeroShards mounted: active while loading and smoothly unmounts after crossfade to preserve GPU
  const [aeroShardsMounted, setAeroShardsMounted] = useState(true);

  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [tier, setTier] = useState(() => getQuality());
  const qualityConfig = getQualityConfig(tier);

  const modelRenderedRef = useRef(false);
  const fallbackTriggeredRef = useRef(false);

  const triggerFallback = useCallback(() => {
    if (fallbackTriggeredRef.current || modelRenderedRef.current) return;
    fallbackTriggeredRef.current = true;
    console.warn("[Hero] 3D Model did not render within 5s or WebGL failed. Preserving AeroShards background.");
    setModelFailed(true);
    setIsModelReady(false);
    setAeroShardsMounted(true);
  }, []);

  const handleModelRenderSuccess = useCallback(() => {
    if (fallbackTriggeredRef.current) return;
    modelRenderedRef.current = true;
    setIsModelReady(true);

    // After the 0.9s crossfade completes, unmount AeroShards to give 100% GPU power to 3D Knight
    setTimeout(() => {
      setAeroShardsMounted(false);
    }, 1200);
  }, []);

  // 5-second safety timer: If 3D model is not ready within 5 seconds, keep AeroShards permanently
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!modelRenderedRef.current) {
        triggerFallback();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [triggerFallback]);

  // Monitor viewport visibility to pause Three.js GPU cycles when scrolled away
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsHeroVisible(entry.isIntersecting);
    }, { threshold: 0.02 });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Monitor document visibility to freeze render loop when tab is backgrounded
  useEffect(() => {
    const handleVis = () => setDocumentHidden(document.hidden);
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  // Ultra-Fast 60 FPS GSAP Entrance & Hardware-Accelerated Parallax Engine
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const titleLeft = titleRef.current?.querySelector(`.${styles.titleLeft}`) || null;
      const titleRight = titleRef.current?.querySelector(`.${styles.titleRight}`) || null;
      const overlayLeft = overlayTitleRef.current?.querySelector(`.${styles.titleLeft}`) || null;
      const overlayRight = overlayTitleRef.current?.querySelector(`.${styles.titleRight}`) || null;
      const bioChildren = bioRef.current?.children || [];

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.8
      });

      const targets = [titleLeft, titleRight, overlayLeft, overlayRight].filter(Boolean);
      if (targets.length) {
        tl.fromTo(targets,
          { y: 40, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: 0.15 },
          0
        );
      }

      const roleTargets = [
        ...(roleRef.current?.children || []),
        ...(overlayRoleRef.current?.children || [])
      ];
      if (roleTargets.length) {
        tl.fromTo(roleTargets,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
          0.3
        );
      }

      tl.from(bioChildren, {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85
      }, 0.4);

      if (ctaRef.current) {
        tl.from(ctaRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.85
        }, 0.52);
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // High-performance hardware-accelerated scroll parallax engine
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const titleTargets = [titleRef.current, overlayTitleRef.current].filter(Boolean);
      if (titleTargets.length) {
        gsap.to(titleTargets, {
          y: isModelReady ? -120 : -100,
          opacity: 0.35,
          scale: isModelReady ? 0.96 : 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (bioRef.current) {
        gsap.to(bioRef.current, {
          y: -60,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "15% top",
            end: "70% top",
            scrub: true,
          },
        });
      }

      if (ctaRef.current) {
        gsap.to(ctaRef.current, {
          y: -60,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "15% top",
            end: "70% top",
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isModelReady]);

  const handleCardClick = (e, targetSection) => {
    e.preventDefault();
    scrollToSection(targetSection);
  };

  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>
      {/* Layer 1: Ambient Decorative Blobs (CSS Powered for 60fps speed) */}
      <div className={styles.blobLeft} aria-hidden="true" />
      <div className={styles.blobRight} aria-hidden="true" />

      {/* Dynamic Background Layer: AeroShards animation active until 3D model is completely loaded, or permanently if model fails */}
      <div 
        className={`${styles.bgContainer} ${!isModelReady || modelFailed ? styles.bgContainerActive : ''}`}
        style={{
          visibility: aeroShardsMounted ? 'visible' : 'hidden',
          pointerEvents: (!isModelReady || modelFailed) ? 'auto' : 'none',
        }}
      >
        {aeroShardsMounted && (
          <AeroShardsBackground isHeroVisible={isHeroVisible} documentHidden={documentHidden} />
        )}
      </div>

      {/* Layer 2: Separated Background Typography (Behind 3D Model or Above AeroShards) */}
      <div className={`${styles.bgTypography} ${!isModelReady ? styles.bgTypographyMagic : styles.bgTypography3D}`} ref={titleRef}>
        <div className={`${styles.splitTitle} ${!isModelReady ? styles.splitTitleCenter : ''}`}>
          <h1 className={styles.titleLeft}>SHIVA</h1>
          <h1 className={styles.titleRight}>SANJAY</h1>
        </div>

        {/* Dynamic Rotating Role Switcher */}
        <DynamicRole isCenter={!isModelReady} roleRef={roleRef} />
      </div>

      {/* Layer 3: High-Speed 3D Canvas (Preloads in background; smoothly fades in once completely loaded) */}
      <div 
        className={`canvas-container ${styles.modelContainer} ${isModelReady && !modelFailed ? styles.modelVisible : styles.modelHidden}`} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 5, 
          pointerEvents: isModelReady && !modelFailed ? 'auto' : 'none',
          display: modelFailed ? 'none' : 'block'
        }}
      >
        {!modelFailed && (
          <WebGLErrorBoundary key="3d-sculpture-view" onFail={triggerFallback}>
            <Canvas
              frameloop={isHeroVisible && !documentHidden ? (isModelReady ? "demand" : "always") : "never"}
              shadows={qualityConfig.shadows}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.1,
              }}
              dpr={qualityConfig.dpr}
              onCreated={({ gl }) => {
                gl.domElement.addEventListener('webglcontextlost', (e) => {
                  e.preventDefault();
                  triggerFallback();
                });
              }}
            >
              <PerformanceMonitor onDecline={() => setTier((prev) => (prev === 'high' ? 'medium' : 'low'))} />
              <HeroCameraRig />
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1.2}
                castShadow={qualityConfig.shadows}
                shadow-mapSize={[512, 512]}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-5, 3, -5]} intensity={0.5} />
              <Environment files="/models/potsdamer_platz_1k.hdr" resolution={256} />

              <ModelErrorBoundary onError={triggerFallback}>
                <Suspense fallback={null}>
                  <group>
                    <Knight modelUrl={KNIGHT_MODEL_URL} onRenderSuccess={handleModelRenderSuccess} />
                  </group>
                </Suspense>
              </ModelErrorBoundary>
              <Preload all />
            </Canvas>
          </WebGLErrorBoundary>
        )}
      </div>

      {/* Layer 3.5: X-Ray Glass Overlay (Active when 3D model is visible) */}
      <div 
        className={styles.xrayOverlay} 
        ref={overlayTitleRef} 
        aria-hidden="true"
        style={{
          visibility: isModelReady && !modelFailed ? 'visible' : 'hidden',
          opacity: isModelReady && !modelFailed ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s ease'
        }}
      >
        <div className={styles.splitTitle}>
          <h1 className={styles.titleLeft}>SHIVA</h1>
          <h1 className={styles.titleRight}>SANJAY</h1>
        </div>
        <DynamicRole isCenter={false} roleRef={overlayRoleRef} />
      </div>

      {/* Layer 4: Foreground Overlay UI (In Front of 3D Model or Above Magic BG) */}
      <div className={`${styles.foregroundUI} ${!isModelReady ? styles.foregroundUIMagic : styles.foregroundUI3D}`}>
        {/* Lower-Left Bio Widget */}
        <div className={styles.bioWidget} ref={bioRef}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>Available for real-world solutions</span>
          </div>

          <p className={styles.bioText}>
            Hey there! I'm an <strong>AI Automation Specialist</strong> and <strong>Full-Stack Developer</strong> building practical, high-impact solutions with modern web stacks, n8n workflows, Odoo, and Salesforce CRM.
          </p>
        </div>

        {/* Lower-Right Explore Projects CTA Action */}
        <div className={styles.rightActionWidget} ref={ctaRef}>
          <a href="#projects" onClick={(e) => handleCardClick(e, 'projects')} className={styles.ctaButton}>
            <span>Explore Projects</span>
            <svg className={styles.ctaArrow} viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </div>

    </section>
  );
};

export default Hero;