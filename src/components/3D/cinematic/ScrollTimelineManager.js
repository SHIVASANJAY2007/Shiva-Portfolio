/**
 * ScrollTimelineManager
 * Single source of truth for scroll progress, velocity, and direction.
 * All animation controllers read from this — no duplicate scroll listeners.
 */

let scrollY = 0;
let prevScrollY = 0;
let velocity = 0;
let direction = 1; // 1 = down, -1 = up
let raf = null;

const listeners = new Set();

function tick() {
  const rawY = window.scrollY;
  velocity = rawY - prevScrollY;
  direction = velocity >= 0 ? 1 : -1;
  prevScrollY = scrollY;
  scrollY = rawY;
  listeners.forEach((fn) => fn({ scrollY, velocity, direction }));
  raf = requestAnimationFrame(tick);
}

export function startScrollTimeline() {
  if (!raf) raf = requestAnimationFrame(tick);
}

export function stopScrollTimeline() {
  if (raf) { cancelAnimationFrame(raf); raf = null; }
}

export function subscribeScroll(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Map scrollY to a normalized 0→1 progress value bounded by start/end in pixels.
 */
export function mapProgress(sy, startPx, endPx) {
  return Math.min(Math.max((sy - startPx) / (endPx - startPx), 0), 1);
}
