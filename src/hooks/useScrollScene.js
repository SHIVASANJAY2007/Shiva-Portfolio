import { useEffect } from 'react';
import { useSceneStore } from '../store/sceneStore';

export default function useScrollScene() {
  const setMode = useSceneStore((state) => state.setMode);

  useEffect(() => {
    const validModes = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible if multiple are intersecting
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id && validModes.includes(id)) {
              setMode(id);
            }
          }
        });
      },
      {
        rootMargin: '-30% 0px -30% 0px', // Trigger when section is prominent in viewport
        threshold: 0
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, [setMode]);
}
