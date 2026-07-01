import { useEffect } from 'react';
import studio from '@theatre/studio';
import { getProject } from '@theatre/core';

// Initialize Theatre.js studio only in development mode
let studioInitialized = false;

export const TheatreSetup = () => {
  useEffect(() => {
    if (import.meta.env.DEV && !studioInitialized) {
      studio.initialize();
      studioInitialized = true;
      
      // Initialize a project so it shows up in the studio UI
      const project = getProject('SHIVA_Portfolio');
      const sheet = project.sheet('Hero Scene');
      
      console.log('Theatre.js Studio initialized', sheet);
    }
  }, []);

  return null;
};

export default TheatreSetup;
