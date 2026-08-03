import React, { useEffect, useRef, useState, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { HeroLoader } from '../3D/HeroLoader';
import { scrollToSection } from '../../lib/scrollToSection';
import { resumeData } from '../../data/resume';
import Hyperspeed from '../3D/Hyperspeed';

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

// Ultra-Resilient WebGL Error Boundary to prevent white screen browser exceptions upon high-speed mode switching
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("WebGL visual context temporarily interrupted during rapid transition:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B0B0C0', fontFamily: 'monospace' }}>
          <span>Reloading GPU shaders...</span>
        </div>
      );
    }
    return this.props.children;
  }
}

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const bioRef = useRef(null);
  const stripRef = useRef(null);
  const roleRef = useRef(null);
  const overlayTitleRef = useRef(null);
  const overlayRoleRef = useRef(null);

  const [roleIndex, setRoleIndex] = useState(0);
  const [showBackground, setShowBackground] = useState(false);

  // Resume-driven dynamic role catalog
  const rotatingRoles = [
    { left: "WEB", right: "DEVELOPER" },
    { left: "AI AUTOMATION", right: "SPECIALIST" },
    { left: "TRAINER", right: "& MENTOR" },
    { left: "SPORTSMAN", right: "KHO KHO CAPTAIN" },
    { left: "FULL-STACK", right: "ENGINEER" },
    { left: "N8N WORKFLOW", right: "ARCHITECT" },
    { left: "ODOO & SALESFORCE", right: "DEVELOPER" },
    { left: "UI/UX & REACT", right: "DESIGNER" },
    { left: "ENTERPRISE CRM", right: "INTEGRATOR" },
    { left: "PYTHON & AI", right: "SOLUTIONS" }
  ];

  const specializations = [
    { role: "Web Development", icon: "💻", target: "skills" },
    { role: "AI Automation (n8n)", icon: "🤖", target: "skills" },
    { role: "Odoo & Salesforce CRM", icon: "⚡", target: "skills" },
    { role: "Trainer & Mentor", icon: "🎯", target: "about" },
    { role: "Sportsman & Leader", icon: "🏆", target: "about" }
  ];

  // High-performance Dynamic Role Rotator Interval & Animation
  useEffect(() => {
    const interval = setInterval(() => {
      const targets = [
        ...(roleRef.current?.children || []),
        ...(overlayRoleRef.current?.children || [])
      ];
      if (!targets.length) return;

      gsap.to(targets, {
        y: -18,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setRoleIndex((prev) => (prev + 1) % rotatingRoles.length);
          gsap.fromTo(targets,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
          );
        }
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [rotatingRoles.length]);

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
      const stripItems = stripRef.current?.querySelectorAll(`.${styles.stripItem}`) || [];

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

      tl.from(stripItems, {
        y: 20,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7
      }, 0.65);

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
          y: !showBackground ? -170 : -150,
          opacity: 0.35,
          scale: !showBackground ? 0.94 : 1,
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
          y: !showBackground ? -90 : -80,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "15% top",
            end: "70% top",
            scrub: true,
          },
        });
      }

      const canvasContainer = containerRef.current.querySelector('.canvas-container');
      if (canvasContainer && !showBackground) {
        gsap.to(canvasContainer, {
          y: 180,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [showBackground]);

  const handleCardClick = (e, targetSection) => {
    e.preventDefault();
    scrollToSection(targetSection);
  };

  const currentRole = rotatingRoles[roleIndex];

  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>
      {/* Layer 1: Ambient Decorative Blobs (CSS Powered for 60fps speed) */}
      <div className={styles.blobLeft} aria-hidden="true" />
      <div className={styles.blobRight} aria-hidden="true" />

      {/* Dynamic Magic Background Layer (Hyperspeed) */}
      <div className={`${styles.bgContainer} ${showBackground ? styles.bgContainerActive : ''}`}>
        {showBackground && (
          <WebGLErrorBoundary key="hyperspeed-view">
            <Hyperspeed />
          </WebGLErrorBoundary>
        )}
      </div>

      {/* Layer 2: Separated Background Typography (Behind 3D Model or Above Magic BG) */}
      <div className={`${styles.bgTypography} ${showBackground ? styles.bgTypographyMagic : styles.bgTypography3D}`} ref={titleRef}>
        <div className={`${styles.splitTitle} ${showBackground ? styles.splitTitleCenter : ''}`}>
          <h1 className={styles.titleLeft}>SHIVA</h1>
          <h1 className={styles.titleRight}>SANJAY</h1>
        </div>
        
        {/* Dynamic Rotating Role Switcher */}
        <div className={`${styles.splitSubhead} ${showBackground ? styles.splitSubheadCenter : ''}`} ref={roleRef}>
          <span className={styles.subLeft}>{currentRole.left}</span>
          <span className={styles.subRight}>{currentRole.right}</span>
        </div>
      </div>

      {/* Layer 3: High-Speed 3D Canvas (Conditionally active ONLY when 3D mode is enabled to eliminate VRAM contention and white screens) */}
      {!showBackground && (
        <div className={`canvas-container ${styles.modelContainer}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}>
          <WebGLErrorBoundary key="3d-sculpture-view">
            <Canvas
              shadows
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.1,
              }}
              dpr={[1, 1.35]}
            >
              <HeroCameraRig />
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1.2}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-5, 3, -5]} intensity={0.5} />
              <Environment preset="city" resolution={256} />

              <HeroLoader />
              <Suspense fallback={null}>
                <group>
                  <Knight />
                </group>
              </Suspense>
            </Canvas>
          </WebGLErrorBoundary>
        </div>
      )}

      {/* Layer 3.5: X-Ray Glass Overlay (Strictly in 3D model mode, keeping text legible over 3D sculpture without altering original metal colors) */}
      {!showBackground && (
        <div className={styles.xrayOverlay} ref={overlayTitleRef} aria-hidden="true">
          <div className={styles.splitTitle}>
            <h1 className={styles.titleLeft}>SHIVA</h1>
            <h1 className={styles.titleRight}>SANJAY</h1>
          </div>
          <div className={styles.splitSubhead} ref={overlayRoleRef}>
            <span className={styles.subLeft}>{currentRole.left}</span>
            <span className={styles.subRight}>{currentRole.right}</span>
          </div>
        </div>
      )}

      {/* Layer 4: Foreground Overlay UI (In Front of 3D Model or Above Magic BG) */}
      <div className={`${styles.foregroundUI} ${showBackground ? styles.foregroundUIMagic : styles.foregroundUI3D}`}>
        {/* Lower-Left Bio Widget */}
        <div className={styles.bioWidget} ref={bioRef}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>Available for real-world solutions</span>
          </div>

          <p className={styles.bioText}>
            Hey there! I'm an <strong>AI Automation Specialist</strong> and <strong>Full-Stack Developer</strong> building practical, high-impact solutions with modern web stacks, n8n workflows, Odoo, and Salesforce CRM.
          </p>

          <div className={styles.btnRow}>
            <a href="#projects" onClick={(e) => handleCardClick(e, 'projects')} className={styles.ctaButton}>
              Explore Projects
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Right Uiverse Shutter Toggle Button */}
      <div className={styles.btnWrapper}>
        <input
          id="capture-toggle"
          className={styles.btnCbox}
          type="checkbox"
          checked={showBackground}
          onChange={() => setShowBackground(!showBackground)}
        />
        <label htmlFor="capture-toggle" className={styles.btn}>
          <span className={styles.letter}>CLICK NOW</span>
          <div className={styles.shutterWrapper}>
            <span className={`${styles.shutter} ${styles.s1}`}></span>
            <span className={`${styles.shutter} ${styles.s2}`}></span>
            <span className={`${styles.shutter} ${styles.s3}`}></span>
            <span className={`${styles.shutter} ${styles.s4}`}></span>
            <span className={`${styles.shutter} ${styles.s5}`}></span>
            <span className={`${styles.shutter} ${styles.s6}`}></span>
          </div>
        </label>
        <div className={styles.flash}></div>
        
      </div>

      {/* Bottom Horizontal Specializations Ticker Strip */}
      <div className={styles.bottomStrip} ref={stripRef}>
        <div className={styles.tickerWrap}>
          {specializations.map((item) => (
            <div key={item.role} className={styles.stripItem} onClick={(e) => handleCardClick(e, item.target)}>
              <span className={styles.stripIcon}>{item.icon}</span>
              <span className={styles.stripRole}>{item.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;