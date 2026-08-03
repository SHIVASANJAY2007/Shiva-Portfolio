import { useEffect } from 'react';
import { useSceneStore } from '../store/sceneStore';
import { getActiveSection } from '../lib/scrollToSection';

export default function useScrollScene() {
  const setMode = useSceneStore((state) => state.setMode);

  useEffect(() => {
    let lastActive = '';
    const checkScene = () => {
      const current = getActiveSection();
      if (current && current !== lastActive) {
        lastActive = current;
        setMode(current);
      }
    };

    if (typeof window !== 'undefined') {
      if (window.lenis) {
        window.lenis.on('scroll', checkScene);
      }
      window.addEventListener('scroll', checkScene, { passive: true });
      const timer = setInterval(checkScene, 150);
      checkScene();

      return () => {
        if (window.lenis) window.lenis.off('scroll', checkScene);
        window.removeEventListener('scroll', checkScene);
        clearInterval(timer);
      };
    }
  }, [setMode]);
}
