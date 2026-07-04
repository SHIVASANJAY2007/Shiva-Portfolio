import { useGLTF, useProgress } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MODEL_REGISTRY } from "../config/models";
import * as THREE from "three";

const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

export function useModelLoader(modelKey) {
  const entry = MODEL_REGISTRY[modelKey];
  if (!entry) throw new Error(`[useModelLoader] No registry entry for "${modelKey}".`);

  const gltf = useGLTF(entry.url, entry.isDracoCompressed ? DRACO_DECODER_PATH : undefined, undefined, (loader) => {
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
    useGLTF.preload(entry.url);
  }
}

export function useModelProgress() {
  return useProgress();
}
