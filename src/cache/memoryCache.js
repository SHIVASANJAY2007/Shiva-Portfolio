/**
 * A simple global Map to hold parsed THREE.Scene instances.
 * This lives until the browser tab is closed and prevents parsing the GLB twice.
 */
const sceneCache = new Map();

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
