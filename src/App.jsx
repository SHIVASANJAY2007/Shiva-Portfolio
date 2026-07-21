import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation, Footer, Loader, ClickSpark } from './components/common';

gsap.registerPlugin(ScrollTrigger);
import { lazy, Suspense } from 'react';
import Hero from './components/sections/Hero';
const About = lazy(() => import('./components/sections/About').then(m => ({ default: m.About || m.default })));
const Skills = lazy(() => import('./components/sections/Skills').then(m => ({ default: m.Skills || m.default })));
const Projects = lazy(() => import('./components/sections/Projects').then(m => ({ default: m.Projects || m.default })));
const Experience = lazy(() => import('./components/sections/Experience').then(m => ({ default: m.Experience || m.default })));
const Contact = lazy(() => import('./components/sections/Contact').then(m => ({ default: m.Contact || m.default })));
import useScrollScene from './hooks/useScrollScene';
import './styles/globals.css';
import StackScroller from './components/sections/StackScroller';
import TheatreStudio from './utils/TheatreStudio';
import { ModelProvider } from './providers/ModelProvider';

export default function App() {
  useScrollScene();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
    });

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
