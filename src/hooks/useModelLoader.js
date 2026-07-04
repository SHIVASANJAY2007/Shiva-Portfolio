import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MODEL_REGISTRY } from "../config/models";
import { get, set } from "idb-keyval";
import { suspend } from "suspend-react";

const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

// Bypasses browser cache CORS bugs by caching the raw binary in IndexedDB
async function fetchModelWithCache(url) {
  try {
    const cached = await get(url);
    if (cached) {
      console.log("[ModelLoader] Loaded from IndexedDB cache:", url);
      return cached;
    }
    console.log("[ModelLoader] Fetching from network:", url);
    // cache: 'no-store' forces a fresh 302 redirect from HF, avoiding CORS failures on cached redirects
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const buffer = await res.arrayBuffer();
    await set(url, buffer);
    return buffer;
  } catch (err) {
    console.error("[ModelLoader] Error fetching model:", err);
    throw err;
  }
}

export function useModelLoader(modelKey) {
  const entry = MODEL_REGISTRY[modelKey];
  if (!entry) throw new Error(`[useModelLoader] No registry entry for "${modelKey}".`);

  // Suspend component while fetching the ArrayBuffer and creating a Blob URL
  const blobUrl = suspend(async () => {
    const buffer = await fetchModelWithCache(entry.url);
    const blob = new Blob([buffer], { type: 'model/gltf-binary' });
    return URL.createObjectURL(blob);
  }, [entry.url]);

  // Pass the local Blob URL to useGLTF
  const gltf = useGLTF(blobUrl, entry.isDracoCompressed ? DRACO_DECODER_PATH : undefined, undefined, (loader) => {
    if (entry.isDracoCompressed) {
      const draco = new DRACOLoader();
      draco.setDecoderPath(DRACO_DECODER_PATH);
      loader.setDRACOLoader(draco);
    }
  });

  return { gltf, meta: entry };
}

export function preloadModel(modelKey) {
  const entry = MODEL_REGISTRY[modelKey];
  if (entry) {
    fetchModelWithCache(entry.url).then(buffer => {
      const blob = new Blob([buffer], { type: 'model/gltf-binary' });
      const url = URL.createObjectURL(blob);
      useGLTF.preload(url);
    }).catch(console.error);
  }
}

export function useModelProgress() {
  // We don't use this anymore since we have our custom idb fetcher, 
  // but we keep the export to avoid breaking existing imports.
  return { progress: 100, active: false };
}
