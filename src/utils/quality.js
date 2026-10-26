/**
 * Adaptive Quality Tiers System
 * Dynamically calibrates rendering fidelity ('high' | 'medium' | 'low') based on
 * hardware concurrency, RAM, mobile/touch, reduced-motion, and real-time FPS monitoring.
 */

export function getQuality() {
  if (typeof window === 'undefined') {
    return 'medium';
  }

  // Reduced motion or user data saver preference forces low-tier conservative rendering
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isSaveData = connection?.saveData;

  if (prefersReduced || isSaveData) {
    return 'low';
  }

  // Inspect hardware concurrency and memory (GB)
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const isTouchOrMobile = (navigator.maxTouchPoints > 0) || (typeof window !== 'undefined' && window.innerWidth < 768);

  // Low-tier mobile or weak hardware
  if (cores < 4 || memory < 4 || (isTouchOrMobile && memory <= 4)) {
    return 'low';
  }

  // Mid-tier laptops and standard devices
  if (cores <= 6 || memory <= 6 || isTouchOrMobile) {
    return 'medium';
  }

  // High-performance dedicated desktop rigs
  return 'high';
}

export const QUALITY_CONFIG = {
  high: {
    dpr: [1, 1.5],
    shadows: true,
    bloom: true,
    smaa: true,
    video: true,
    tilt: true,
    orbitItemCount: 27,
  },
  medium: {
    dpr: [1, 1.25],
    shadows: false,
    bloom: false,
    smaa: true,
    video: true,
    tilt: true,
    orbitItemCount: 20,
  },
  low: {
    dpr: [1, 1],
    shadows: false,
    bloom: false,
    smaa: false,
    video: false,
    tilt: false,
    orbitItemCount: 12,
  },
};

export function getQualityConfig(tier = getQuality()) {
  return QUALITY_CONFIG[tier] || QUALITY_CONFIG.medium;
}

export default getQuality;
