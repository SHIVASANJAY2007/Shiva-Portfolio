/**
 * SpringPhysics
 * Custom spring physics implementation — no external library needed.
 * Simulates mass-spring-damper for believable organic motion.
 *
 * Usage:
 *   const spring = new Spring({ stiffness: 120, damping: 14, mass: 1 });
 *   spring.setTarget(5.0);
 *   // every frame:
 *   const value = spring.update(delta);
 */
export class Spring {
  constructor({ stiffness = 100, damping = 12, mass = 1, initial = 0 } = {}) {
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
    this.value = initial;
    this.velocity = 0;
    this.target = initial;
  }

  setTarget(t) { this.target = t; }

  /**
   * @param {number} dt - delta time in seconds (from Three.js clock or useFrame state.delta)
   */
  update(dt) {
    const force = -this.stiffness * (this.value - this.target);
    const damperForce = -this.damping * this.velocity;
    const acceleration = (force + damperForce) / this.mass;

    this.velocity += acceleration * dt;
    this.value += this.velocity * dt;
    return this.value;
  }

  /** True when essentially at rest */
  isSettled(threshold = 0.001) {
    return Math.abs(this.velocity) < threshold && Math.abs(this.value - this.target) < threshold;
  }

  snap(value) {
    this.value = value;
    this.velocity = 0;
    this.target = value;
  }
}

/**
 * NoiseOscillator
 * Very lightweight pseudo-random micro-vibration using layered sines.
 * Simulates engine idle, road texture — no noise library needed.
 */
export class NoiseOscillator {
  constructor({ amplitude = 0.002, speed = 1.0 } = {}) {
    this.amplitude = amplitude;
    this.speed = speed;
    this.phase = Math.random() * Math.PI * 2; // random start phase per instance
  }

  getValue(time) {
    // Two-frequency blend for pseudo-randomness
    return (
      Math.sin(time * this.speed * 2.3 + this.phase) * this.amplitude * 0.6 +
      Math.sin(time * this.speed * 5.7 + this.phase * 0.3) * this.amplitude * 0.4
    );
  }
}
