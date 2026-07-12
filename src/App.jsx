import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { Navigation, Footer, Loader, ClickSpark } from './components/common';
import { lazy, Suspense } from 'react';
const Hero = lazy(() => import('./components/sections/Hero').then(m => ({ default: m.Hero || m.default })));
const About = lazy(() => import('./components/sections/About').then(m => ({ default: m.About || m.default })));
const Skills = lazy(() => import('./components/sections/Skills').then(m => ({ default: m.Skills || m.default })));
const Projects = lazy(() => import('./components/sections/Projects').then(m => ({ default: m.Projects || m.default })));
const Experience = lazy(() => import('./components/sections/Experience').then(m => ({ default: m.Experience || m.default })));
const Contact = lazy(() => import('./components/sections/Contact').then(m => ({ default: m.Contact || m.default })));
import useScrollScene from './hooks/useScrollScene';
import './styles/globals.css';
import TheatreStudio from './utils/TheatreStudio';
import { ModelProvider } from './providers/ModelProvider';
import ModuleScroller from './components/sections/ModuleScroller';
import GlobalCanvas from './components/3D/GlobalCanvas';

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
        <GlobalCanvas />

        <main>
          <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>}>
            <Hero />
            <ModuleScroller>
              <About />
              <Skills />
              <Projects />
              <Experience />
              <Contact />
            </ModuleScroller>
          </Suspense>
        </main>

        <Footer />
      </div>
    </ModelProvider>
  );
}
