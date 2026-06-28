/**
 * Cinematic Easing Curves
 * Handcrafted easing functions matching luxury automotive commercial motion.
 */

/** Cubic ease-out — fast entry, graceful deceleration */
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/** Quintic ease-out — even more dramatic, then dead-slow landing */
export const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

/** Anticipation ease — slight pullback before forward thrust */
export const easeAnticipate = (t) => {
  const s = 1.70158;
  return t * t * ((s + 1) * t - s);
};

/** Smooth stop — like hydraulic brakes, soft landing */
export const smoothstep = (t) => t * t * (3 - 2 * t);

/** Expo ease-in-out — sharp acceleration curve for dramatic sweeps */
export const easeInOutExpo = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
};

/** Back ease-out — slight overshoot on arrival, bounces back to exact target */
export const easeOutBack = (t) => {
  const s = 1.70158 * 1.525;
  return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
};

/** Clamp a value to [min, max] */
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/** Map a value from one range to another with optional clamping */
export const mapRange = (value, inMin, inMax, outMin, outMax, ease = null) => {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  const eased = ease ? ease(t) : t;
  return outMin + eased * (outMax - outMin);
};
