import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils';

/**
 * Safely clones a THREE.Scene, including SkinnedMeshes.
 * React Three Fiber requires each mounted scene to be unique. If you reuse
 * the exact same scene object, it will unmount it from the previous location.
 * 
 * @param {THREE.Scene | THREE.Object3D} source 
 * @returns {THREE.Scene | THREE.Object3D}
 */
export function cloneScene(source) {
  if (!source) return null;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Cache] 🧬 Cloning Scene...`);
  }
  
  // SkeletonUtils handles deep cloning of SkinnedMeshes and bones correctly.
  return skeletonClone(source);
}
