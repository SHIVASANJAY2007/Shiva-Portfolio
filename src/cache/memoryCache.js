import * as THREE from 'three';
import { MODEL_CACHE_KEY } from './constants';

/**
 * A simple global Map to hold parsed THREE.Scene instances.
 * This lives until the browser tab is closed and prevents parsing the GLB twice.
 */
const sceneCache = new Map();

// --- PRE-POPULATE FALLBACK SCENE ---
// This serves as "pieces of the 3D model as code". It allows the application 
// to render a proxy instantly while the real model downloads from Hugging Face.
const fallbackScene = new THREE.Scene();
fallbackScene.userData.isFallback = true;

const proxyMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 3.5, 1.5),
  new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.3 
  })
);
proxyMesh.position.y = 1.75; // Center it
fallbackScene.add(proxyMesh);

// Store the fallback in the cache immediately
sceneCache.set(MODEL_CACHE_KEY, { scene: fallbackScene });
// -----------------------------------

export const memoryCache = {
  /**
   * Checks if a scene exists in the cache.
   * @param {string} key 
   * @returns {boolean}
   */
  has(key) {
    return sceneCache.has(key);
  },

  /**
   * Retrieves the parsed GLTF object from cache.
   * @param {string} key 
   * @returns {any}
   */
  get(key) {
    const data = sceneCache.get(key);
    if (data && process.env.NODE_ENV === 'development') {
      console.log(`[Cache] ✅ Loaded from Memory Cache: ${key}`);
    }
    return data;
  },

  /**
   * Stores a parsed GLTF object in memory.
   * @param {string} key 
   * @param {any} gltf 
   */
  set(key, gltf) {
    sceneCache.set(key, gltf);
  },

  /**
   * Removes a specific scene from memory.
   * @param {string} key 
   */
  delete(key) {
    sceneCache.delete(key);
  },

  /**
   * Clears all scenes from memory.
   */
  clear() {
    sceneCache.clear();
  },

  /**
   * Returns the number of cached scenes.
   * @returns {number}
   */
  size() {
    return sceneCache.size;
  }
};
