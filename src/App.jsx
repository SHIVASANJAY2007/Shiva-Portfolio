import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { Navigation, Footer, Loader } from './components/common';
import {
  Hero,
  About,
  Skills,
  Projects,
  Experience,
  Contact,
} from './components/sections';
import useScrollScene from './hooks/useScrollScene';
import './styles/globals.css';
import ModuleScroller from './components/sections/ModuleScroller';
import TheatreStudio from './utils/TheatreStudio';

export default function App() {
  useScrollScene();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="app">
      <TheatreStudio />
      <Loader />
      <Navigation />

      <main>
        <ModuleScroller>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </ModuleScroller>
      </main>

      <Footer />
    </div>
  );
}
