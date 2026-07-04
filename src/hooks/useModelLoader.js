import { useGLTF, useProgress } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MODEL_REGISTRY } from "../config/models";

// Pinned Draco decoder version — do not change without re-testing.
const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

export function useModelLoader(modelKey) {
  const entry = MODEL_REGISTRY[modelKey];

  if (!entry) {
    throw new Error(
      `[useModelLoader] No registry entry for "${modelKey}". Add it to config/models.js — do not hardcode a URL inline.`
    );
  }

  const gltf = useGLTF(entry.url, entry.isDracoCompressed ? DRACO_DECODER_PATH : undefined, undefined, (loader) => {
    if (entry.isDracoCompressed) {
      const draco = new DRACOLoader();
      draco.setDecoderPath(DRACO_DECODER_PATH);
      loader.setDRACOLoader(draco);
    }
  });

  return { gltf, meta: entry };
}

// Call this from a route/section BEFORE it's likely to be viewed,
// e.g. on hover of a nav link, or when a section enters the viewport (IntersectionObserver).
export function preloadModel(modelKey) {
  const entry = MODEL_REGISTRY[modelKey];
  if (entry) useGLTF.preload(entry.url);
}

export function useModelProgress() {
  return useProgress(); // { active, progress, loaded, total }
}
