import React, { useEffect, useRef, useState, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { HeroLoader } from '../3D/HeroLoader';

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

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const bioRef = useRef(null);
  const stripRef = useRef(null);
  const roleRef = useRef(null);

  const [roleIndex, setRoleIndex] = useState(0);

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
      if (!roleRef.current) return;

      gsap.to(roleRef.current.children, {
        y: -18,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setRoleIndex((prev) => (prev + 1) % rotatingRoles.length);
          gsap.fromTo(roleRef.current.children,
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
      const titleLeft = titleRef.current ? titleRef.current.querySelector(`.${styles.titleLeft}`) : null;
      const titleRight = titleRef.current ? titleRef.current.querySelector(`.${styles.titleRight}`) : null;
      const bioChildren = bioRef.current ? bioRef.current.children : [];
      const stripItems = stripRef.current ? stripRef.current.querySelectorAll(`.${styles.stripItem}`) : [];

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.8
      });

      // Pure Hardware-Accelerated Transform Reveals (No heavy blurs!)
      if (titleLeft && titleRight) {
        tl.fromTo([titleLeft, titleRight], 
          { y: 40, opacity: 0, scale: 0.98 }, 
          { y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: 0.15 },
          0
        );
      }

      if (roleRef.current) {
        tl.fromTo(roleRef.current.children,
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

      // Lightweight Hardware Parallax on Scroll
      gsap.to(titleRef.current, {
        y: -150,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(bioRef.current, {
        y: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: '15% top',
          end: '70% top',
          scrub: true,
        },
      });

      const canvasContainer = containerRef.current.querySelector('.canvas-container');
      if (canvasContainer) {
        gsap.to(canvasContainer, {
          y: 180,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (e, targetSection) => {
    e.preventDefault();
    const el = document.getElementById(targetSection);
    if (el && window.lenis) {
      window.lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentRole = rotatingRoles[roleIndex];

  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>
      {/* Layer 1: Ambient Decorative Blobs (CSS Powered for 60fps speed) */}
      <div className={styles.blobLeft} aria-hidden="true" />
      <div className={styles.blobRight} aria-hidden="true" />

      {/* Layer 2: Separated Background Typography (Behind 3D Model) */}
      <div className={styles.bgTypography} ref={titleRef}>
        <div className={styles.splitTitle}>
          <h1 className={styles.titleLeft}>SHIVA</h1>
          <h1 className={styles.titleRight}>SANJAY</h1>
        </div>
        
        {/* Dynamic Rotating Role Switcher */}
        <div className={styles.splitSubhead} ref={roleRef}>
          <span className={styles.subLeft}>{currentRole.left}</span>
          <span className={styles.subRight}>{currentRole.right}</span>
        </div>
      </div>

      {/* Layer 3: High-Speed 3D Canvas centered in front of text space */}
      <div className="canvas-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none' }}>
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
      </div>

      {/* Layer 4: Foreground Overlay UI (In Front of 3D Model) */}
      <div className={styles.foregroundUI}>
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
            <a href="https://www.linkedin.com/in/shiva-sanjay-610512320/" target="_blank" rel="noopener noreferrer" className={styles.resumeButton}>
              LinkedIn ↗
            </a>
          </div>
        </div>
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