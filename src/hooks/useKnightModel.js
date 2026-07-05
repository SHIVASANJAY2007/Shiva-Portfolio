import { useState, useEffect, useCallback, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getModelBlob, createModelUrl, revokeModelUrl } from '../cache/modelLoader';
import { memoryCache } from '../cache/memoryCache';
import { MODEL_CACHE_KEY } from '../cache/constants';
import { cloneScene } from '../utils/cloneScene';

// Single global instance to prevent parsing conflicts
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Custom hook to load, cache, and clone the Knight model.
 * 
 * Flow:
 * 1. Check Memory Cache -> Clone -> Return
 * 2. Check IndexedDB -> Load Blob -> Parse -> Memory Cache -> Clone -> Return
 * 3. Fetch Network -> Save Blob -> Parse -> Memory Cache -> Clone -> Return
 */
export function useKnightModel(prefetchOnly = false) {
  const [scene, setScene] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [error, setError] = useState(null);
  
  // Keep track of the active object URL so we can revoke it on cleanup if needed.
  // Note: We actually revoke it immediately after parsing to save memory.
  const activeUrlRef = useRef(null);

  const loadModel = useCallback(async (abortSignal) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Check Level 2: Memory Cache
      if (memoryCache.has(MODEL_CACHE_KEY)) {
        const cachedGltf = memoryCache.get(MODEL_CACHE_KEY);
        
        if (!prefetchOnly) {
          setScene(cloneScene(cachedGltf.scene));
        }

        // If it is the real model, we are completely done.
        if (!cachedGltf.scene.userData.isFallback) {
          setProgress(100);
          setLoading(false);
          return;
        }
        
        // If it's just the fallback proxy, we continue executing the download!
        // We set loading to false so the UI can render the proxy.
        setLoading(false);
      }

      // 2 & 3. Orchestrated by getModelBlob (IndexedDB -> Network)
      const blob = await getModelBlob(
        ({ loaded, total }) => {
          if (total > 0) {
            setProgress(Math.round((loaded / total) * 100));
          }
        },
        abortSignal
      );

      if (abortSignal?.aborted) return;

      // 4. Parse the GLB
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache] ⚙️ Parsing GLTF...`);
      }
      
      const objectUrl = createModelUrl(blob);
      activeUrlRef.current = objectUrl;

      const parsedGltf = await new Promise((resolve, reject) => {
        gltfLoader.load(
          objectUrl,
          (gltf) => resolve(gltf),
          undefined, // Internal progress not needed here
          (err) => reject(err)
        );
      });

      // Instantly revoke the object URL to free up browser memory!
      revokeModelUrl(objectUrl);
      activeUrlRef.current = null;

      if (abortSignal?.aborted) return;

      // 5. Store in Level 2: Memory Cache
      memoryCache.set(MODEL_CACHE_KEY, parsedGltf);

      // 6. Return cloned scene
      setProgress(100);
      if (!prefetchOnly) {
        setScene(cloneScene(parsedGltf.scene));
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache] ✅ Finished.`);
      }

    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error("[Cache] Error in useKnightModel:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [prefetchOnly]);

  useEffect(() => {
    // We only want to execute browser APIs on the client
    if (typeof window === 'undefined') return;

    const controller = new AbortController();
    
    // Start the loading process
    loadModel(controller.signal);

    return () => {
      // Cleanup
      controller.abort();
      if (activeUrlRef.current) {
        revokeModelUrl(activeUrlRef.current);
      }
    };
  }, [loadModel]);

  const reload = useCallback(() => {
    if (typeof window !== 'undefined') {
      loadModel();
    }
  }, [loadModel]);

  return {
    scene,
    loading,
    progress,
    error,
    reload
  };
}
