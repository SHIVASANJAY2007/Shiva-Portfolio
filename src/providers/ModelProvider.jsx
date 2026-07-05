import React, { createContext, useContext, useEffect } from 'react';
import { useKnightModel } from '../hooks/useKnightModel';

const ModelContext = createContext(null);

export function ModelProvider({ children }) {
  // Pass prefetchOnly = true so it downloads and parses the model immediately
  // on app mount, storing it in the Memory Cache.
  // It won't clone the scene until a component explicitly asks for it!
  const { progress, loading, error } = useKnightModel(true);

  // We expose progress and loading so any UI (like a global loading screen) can use it if desired.
  return (
    <ModelContext.Provider value={{ progress, loading, error }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModelProvider() {
  return useContext(ModelContext);
}
