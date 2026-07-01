import { useEffect } from 'react';
import { getProject } from '@theatre/core';

let studioInitialized = false;

export const TheatreStudio = () => {
  useEffect(() => {
    // Commented out studio.initialize() to remove the UI tabs
    if (import.meta.env.DEV && !studioInitialized) {
      (async () => {
        const studioModule = await import('@theatre/studio');
        const studio = studioModule.default;
        // studio.initialize(); // <-- UI REMOVED HERE
        studioInitialized = true;
        
        const project = getProject('SHIVA_Portfolio');
        const sheet = project.sheet('Hero Scene');
        
        console.log('Theatre.js project initialized (Studio UI hidden)', sheet);
      })();
    }
  }, []);

  return null;
};

export default TheatreStudio;
