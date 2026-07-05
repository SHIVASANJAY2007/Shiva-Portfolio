import React, { createContext, useContext } from 'react';
import { useProgress } from '@react-three/drei';

const ModelContext = createContext(null);

export function ModelProvider({ children }) {
  const { progress, active } = useProgress();

  // We expose progress and loading so any UI (like a global loading screen) can use it if desired.
  return (
    <ModelContext.Provider value={{ progress, loading: active, error: null }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModelProvider() {
  return useContext(ModelContext);
}
