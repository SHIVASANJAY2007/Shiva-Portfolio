import React, { useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation, Footer, Loader, ClickSpark } from './components/common';
import useScrollScene from './hooks/useScrollScene';
import './styles/globals.css';
import StackScroller from './components/sections/StackScroller';
import TheatreStudio from './components/3D/TheatreStudio';
import { ModelProvider } from './providers/ModelProvider';

gsap.registerPlugin(ScrollTrigger);

import Hero from './components/sections/Hero';
const About = lazy(() => import('./components/sections/About').then(m => ({ default: m.About || m.default })));
const Skills = lazy(() => import('./components/sections/Skills').then(m => ({ default: m.Skills || m.default })));
const Projects = lazy(() => import('./components/sections/Projects').then(m => ({ default: m.Projects || m.default })));
const Experience = lazy(() => import('./components/sections/Experience').then(m => ({ default: m.Experience || m.default })));
const Contact = lazy(() => import('./components/sections/Contact').then(m => ({ default: m.Contact || m.default })));

export default function App() {
  useScrollScene();

  useEffect(() => {
    // Ultra-smooth, luxury gliding scroll configuration
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -12 * t)), 
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 2.0,
    });

    window.lenis = lenis; // Expose Lenis globally for real-time navigation color changing events
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <ModelProvider>
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
        <TheatreStudio />
        <Loader />
        <Navigation />

        <main>
          <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff'}}>Loading...</div>}>
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
    </ModelProvider>
  );
}
