import { create } from 'zustand';

export const useSceneStore = create((set) => ({
  mode: 'hero',
  setMode: (mode) => set({ mode }),
  
  // Camera targets for lookAt
  targetPosition: [0, 0, 0],
  setTargetPosition: (pos) => set({ targetPosition: pos }),

  // Interaction markers
  showAnnotations: true,
  setShowAnnotations: (val) => set({ showAnnotations: val }),
}));
