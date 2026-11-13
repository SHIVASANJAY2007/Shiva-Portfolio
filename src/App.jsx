import React, { useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation, Footer, Loader, ClickSpark } from './components/common';
import './styles/globals.css';
import StackScroller from './components/sections/StackScroller';

gsap.registerPlugin(ScrollTrigger);

const Hero = lazy(() => import('./components/sections/Hero').then(m => ({ default: m.Hero || m.default })));
const About = lazy(() => import('./components/sections/About').then(m => ({ default: m.About || m.default })));
const Skills = lazy(() => import('./components/sections/Skills').then(m => ({ default: m.Skills || m.default })));
const Projects = lazy(() => import('./components/sections/Projects').then(m => ({ default: m.Projects || m.default })));
const Experience = lazy(() => import('./components/sections/Experience').then(m => ({ default: m.Experience || m.default })));
const Contact = lazy(() => import('./components/sections/Contact').then(m => ({ default: m.Contact || m.default })));

// Static memoized fallback style to avoid object re-creation and GC churn during render passes
const FALLBACK_STYLE = { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' };

export default function App() {

  useEffect(() => {
    // Prevent browser from restoring dirty scroll positions on reload
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }

    // Ultra-smooth, luxury gliding scroll configuration
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2.0,
    });

    window.lenis = lenis; // Expose Lenis globally for real-time navigation color changing events
    lenis.scrollTo(0, { immediate: true });
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(500, 33);

    /**
     * Re-measures the document height after async content (lazy sections,
     * 3D canvas, fonts) settles so the very FIRST paint matches the real
     * scroll height. Without this, Lenis + ScrollTrigger compute a stale
     * scroll limit up front, producing a black gap below the Hero that only
     * "repairs" once the user scrolls. This keeps the correction instant on load.
     */
    const recalibrate = () => {
      if (!window.lenis) return;
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        window.lenis.resize();
        ScrollTrigger.refresh();
      });
    };

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
        recalibrate();
      });
    }

    // Re-measure once all assets (3D model, lazy section chunks, images) finish loading
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        recalibrate();
      } else {
        window.addEventListener('load', recalibrate, { once: true });
      }
    }

    // Late safety pass to capture anything (e.g. 3D environment map) that
    // loads after `load` fires. Runs until the layout has fully stabilized.
    const settlePass = () => {
      recalibrate();
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          recalibrate();
          // Only re-align to the very top while still on the Hero (user hasn't
          // scrolled yet), so a slow asset load never yanks the reader downward.
          if ((window.scrollY ?? 0) < 5 && (window.lenis?.scroll ?? 0) < 5) {
            window.lenis?.scrollTo(0, { immediate: true });
          }
        });
      }
    };
    const settleTimer = setTimeout(settlePass, 900);

    return () => {
      clearTimeout(settleTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', recalibrate);
      }
      lenis.destroy();
      gsap.ticker.remove(raf);
      delete window.lenis;
    };
  }, []);

  return (
    <div className="app">
      <ClickSpark
        sparkColor="#ffffff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
        easing="ease-out"
        extraScale={1}
      />
      <Loader />
      <Navigation />

      <main>
        <Suspense fallback={<div style={FALLBACK_STYLE}>Loading...</div>}>
          <StackScroller>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </StackScroller>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
