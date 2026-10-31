import React, { useEffect, useRef } from 'react';

/**
 * Ultra-Faithful 2D Canvas Fallback for AeroShards
 * Recreates the exact ribbon waves, faceted wireframe glass plates, and '+' survey markers
 * from the React Bits AeroShards specification when WebGPU is unavailable or headless.
 */
const FULL_SLOPES = [
  [0.2, -0.78],
  [-0.72, 0.02],
  [0.58, -0.06],
  [-0.24, 0.62],
  [0.8, 0.3]
];
const DEPTHS = [2.7, 3.9, 5.6, 8.1, 11.6];
const SHARE = [0.28, 0.24, 0.20, 0.16, 0.12];
const FADE = [1.0, 0.85, 0.62, 0.42, 0.28];
const LEVELS = 5;
const CAMERA = 4;
const TAU = Math.PI * 2;

export const AeroShardsFallback = ({
  shardColor = '#896ABD',
  accentColor = '#A855F7',
  count = 420
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1));
    let height = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      height = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: 0.5, y: 0.5, screenX: width * 0.7, screenY: height * 0.7, active: false };
    const rings = [];

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.screenX = (e.clientX - rect.left) * (window.devicePixelRatio || 1);
      mouse.screenY = (e.clientY - rect.top) * (window.devicePixelRatio || 1);
      mouse.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      mouse.y = (e.clientY - rect.top) / Math.max(rect.height, 1);
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      rings.push({
        x: (e.clientX - rect.left) * (window.devicePixelRatio || 1),
        y: (e.clientY - rect.top) * (window.devicePixelRatio || 1),
        radius: 0,
        alpha: 1.0
      });
      if (rings.length > 4) rings.shift();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('click', onClick);

    // Seeded pseudo-random generator
    let seed = 1337;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Generate faceted crystalline shard geometries along tight ribbon streams
    const shards = [];
    for (let level = 0; level < LEVELS; level++) {
      const levelCount = Math.round(count * SHARE[level]);
      for (let i = 0; i < levelCount; i++) {
        const s = (i + random() * 0.8) / levelCount;
        // Tightly grouped along the ribbon stream center (standard normal distribution)
        const laneSpread = (random() + random() + random() - 1.5) * 0.11;
        const layer = (random() - 0.5) * 0.05;

        // Shape: 3 to 4-sided faceted glass polygon oriented longitudinally
        const shapeType = random();
        const shape = [];
        let corners = 4;
        if (shapeType < 0.65) {
          // Elongated diamond/trapezoid shard aligned with flow
          const len = 1.3 + random() * 0.9;
          const w = 0.28 + random() * 0.25;
          shape.push([-len * 0.55, -w * 0.2]);
          shape.push([-len * 0.1, w * 0.7]);
          shape.push([len * 0.55, w * 0.1]);
          shape.push([len * 0.1, -w * 0.7]);
          corners = 4;
        } else if (shapeType < 0.88) {
          // Sharp triangle shard
          const len = 1.2 + random() * 0.7;
          const w = 0.3 + random() * 0.25;
          shape.push([-len * 0.5, -w * 0.6]);
          shape.push([len * 0.55, 0]);
          shape.push([-len * 0.35, w * 0.6]);
          corners = 3;
        } else {
          // Polygon
          corners = 4;
          const len = 0.9 + random() * 0.6;
          const w = 0.35 + random() * 0.3;
          shape.push([-len * 0.5, -w * 0.4]);
          shape.push([0, w * 0.6]);
          shape.push([len * 0.5, 0]);
          shape.push([0, -w * 0.6]);
        }

        shards.push({
          level,
          s,
          speed: 0.038 + random() * 0.02,
          lane: laneSpread,
          layer,
          baseSize: (9 + random() * 11) * (window.devicePixelRatio || 1),
          shape,
          corners,
          roll: (random() - 0.5) * 0.3,
          rollSpeed: (random() - 0.5) * 0.4,
          tilt: (random() - 0.5) * 0.3,
          tint: random()
        });
      }
    }

    // Generate 3D grid of survey '+' markers
    const markers = [];
    for (let level = 0; level < LEVELS; level++) {
      const cols = 9;
      const rows = 6;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          markers.push({
            level,
            gridU: (c + 0.4 + (random() - 0.5) * 0.2) / cols,
            gridV: (r + 0.4 + (random() - 0.5) * 0.2) / rows,
            phase: random() * TAU,
            blinkSpeed: 1.5 + random() * 2
          });
        }
      }
    }

    let clock = 0;
    let lastTime = performance.now();

    const render = (now) => {
      animId = requestAnimationFrame(render);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      clock += dt;

      ctx.clearRect(0, 0, width, height);

      // Camera lean from mouse interaction
      const leanX = mouse.active ? (mouse.x - 0.5) * 0.04 : 0;
      const leanY = mouse.active ? (mouse.y - 0.5) * 0.03 : 0;

      // Update pulse rings
      for (let r = rings.length - 1; r >= 0; r--) {
        const ring = rings[r];
        ring.radius += dt * 500 * (window.devicePixelRatio || 1);
        ring.alpha -= dt * 0.75;
        if (ring.alpha <= 0) {
          rings.splice(r, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = `rgba(168, 85, 247, ${ring.alpha * 0.6})`;
        ctx.lineWidth = 1.5 * (window.devicePixelRatio || 1);
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }

      // 1. Draw '+' Survey Markers at depth levels
      let nearestMarker = null;
      let minMarkerDist = Infinity;

      for (let i = 0; i < markers.length; i++) {
        const m = markers[i];
        const depth = DEPTHS[m.level];
        const scale = CAMERA / depth;

        // Position across screen
        const sx = width * (m.gridU + leanX * scale);
        const sy = height * (m.gridV + leanY * scale);

        if (sx < -10 || sx > width + 10 || sy < -10 || sy > height + 10) continue;

        // Blinking
        const blinkVal = Math.sin(clock * m.blinkSpeed + m.phase);
        const isBlinking = blinkVal > 0.82;
        const alpha = FADE[m.level] * (isBlinking ? 0.85 : 0.35);

        // Find nearest marker to mouse
        const dist = Math.hypot(sx - mouse.screenX, sy - mouse.screenY);
        if (dist < minMarkerDist) {
          minMarkerDist = dist;
          nearestMarker = { sx, sy, alpha: 0.95 };
        }

        // Draw plus '+'
        const plusSize = (3.5 + (4 - m.level) * 0.7) * (window.devicePixelRatio || 1);
        ctx.save();
        ctx.strokeStyle = isBlinking ? `rgba(216, 180, 254, ${alpha})` : `rgba(168, 85, 247, ${alpha})`;
        ctx.lineWidth = 1 * (window.devicePixelRatio || 1);
        ctx.beginPath();
        ctx.moveTo(sx - plusSize, sy);
        ctx.lineTo(sx + plusSize, sy);
        ctx.moveTo(sx, sy - plusSize);
        ctx.lineTo(sx, sy + plusSize);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Target Bracket [+] on marker near cursor or fixed highlight
      const activeTarget = nearestMarker && minMarkerDist < 180 * (window.devicePixelRatio || 1)
        ? nearestMarker
        : { sx: width * 0.42, sy: height * 0.88, alpha: 0.6 };

      if (activeTarget) {
        const { sx, sy, alpha } = activeTarget;
        const bSize = 9 * (window.devicePixelRatio || 1);
        const cLen = 4 * (window.devicePixelRatio || 1);
        ctx.save();
        ctx.strokeStyle = `rgba(216, 180, 254, ${alpha})`;
        ctx.lineWidth = 1.2 * (window.devicePixelRatio || 1);
        ctx.beginPath();
        // Top-left
        ctx.moveTo(sx - bSize, sy - bSize + cLen);
        ctx.lineTo(sx - bSize, sy - bSize);
        ctx.lineTo(sx - bSize + cLen, sy - bSize);
        // Top-right
        ctx.moveTo(sx + bSize - cLen, sy - bSize);
        ctx.lineTo(sx + bSize, sy - bSize);
        ctx.lineTo(sx + bSize, sy - bSize + cLen);
        // Bottom-left
        ctx.moveTo(sx - bSize, sy + bSize - cLen);
        ctx.lineTo(sx - bSize, sy + bSize);
        ctx.lineTo(sx - bSize + cLen, sy + bSize);
        // Bottom-right
        ctx.moveTo(sx + bSize - cLen, sy + bSize);
        ctx.lineTo(sx + bSize, sy + bSize);
        ctx.lineTo(sx + bSize, sy + bSize - cLen);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Compute and Draw Ribbon Waves from background to foreground
      for (let level = LEVELS - 1; level >= 0; level--) {
        const levelShards = shards.filter(s => s.level === level);
        const depth = DEPTHS[level];
        const fade = FADE[level];
        const isFar = level >= 3;

        // Apply depth of field blur on distant ribbons if supported
        if (isFar && ctx.filter !== undefined) {
          ctx.filter = `blur(${level === 4 ? 2.5 : 1.2}px)`;
        } else if (ctx.filter !== undefined) {
          ctx.filter = 'none';
        }

        const slope = FULL_SLOPES[level];

        for (let i = 0; i < levelShards.length; i++) {
          const s = levelShards[i];

          // Advance along ribbon
          s.s = (s.s + s.speed * dt * 0.85) % 1.0;
          s.roll += s.rollSpeed * dt;

          const progress = s.s;
          // Exact ribbon trajectory formula matching AeroShards
          const u = -1.32 + 2.64 * progress;
          const v =
            slope[0] +
            (slope[1] - slope[0]) * progress +
            0.12 * Math.sin(progress * TAU * 0.75 + level * 2.3 + clock * 0.1) +
            0.05 * Math.sin(progress * TAU * 1.9 + level);

          // Ribbon tangent & normal vector
          const du = 2.64;
          const dv = slope[1] - slope[0] + 0.12 * Math.cos(progress * TAU * 0.75 + level * 2.3) * TAU * 0.75;
          const tLen = Math.hypot(du, dv) || 1;
          const normU = -dv / tLen;
          const normV = du / tLen;

          // Position with ribbon width lane & layer offset
          const finalU = u + normU * s.lane + leanX;
          const finalV = v + normV * s.lane + s.layer - leanY;

          // Projected screen coordinates
          const sx = width * (0.5 + 0.5 * finalU);
          const sy = height * (0.5 - 0.5 * finalV);

          // Skip if offscreen
          if (sx < -60 || sx > width + 60 || sy < -60 || sy > height + 60) continue;

          // Perspective depth scale
          const depthScale = (CAMERA / depth);
          const shardSize = s.baseSize * depthScale;
          const ribbonAngle = Math.atan2(-dv, du);

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(ribbonAngle + s.roll * 0.3);

          // Faceted Glass Polygon
          ctx.beginPath();
          for (let p = 0; p < s.corners; p++) {
            const px = s.shape[p][0] * shardSize;
            const py = s.shape[p][1] * shardSize;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();

          // Translucent Lavender Glass Fill (#896ABD tint)
          const fillAlpha = (0.16 + s.tint * 0.12) * fade;
          ctx.fillStyle = `rgba(137, 106, 189, ${fillAlpha})`;
          ctx.fill();

          // Crisp Violet / Lavender Rim Highlight (#A855F7 / #D8B4FE)
          const strokeAlpha = (0.5 + (4 - level) * 0.1) * fade;
          ctx.strokeStyle = `rgba(205, 172, 250, ${strokeAlpha})`;
          ctx.lineWidth = Math.max(0.75, (1.3 - level * 0.15) * (window.devicePixelRatio || 1));
          ctx.stroke();

          // Internal geometric facet reflection lines (gives the exact crystalline faceted look from the reference image)
          if (s.corners >= 3) {
            ctx.strokeStyle = `rgba(225, 200, 255, ${strokeAlpha * 0.42})`;
            ctx.lineWidth = 0.55 * (window.devicePixelRatio || 1);
            ctx.beginPath();
            if (s.corners === 4) {
              ctx.moveTo(s.shape[0][0] * shardSize, s.shape[0][1] * shardSize);
              ctx.lineTo(s.shape[2][0] * shardSize, s.shape[2][1] * shardSize);
              ctx.moveTo(s.shape[1][0] * shardSize, s.shape[1][1] * shardSize);
              ctx.lineTo(s.shape[3][0] * shardSize, s.shape[3][1] * shardSize);
            } else if (s.corners === 3) {
              ctx.moveTo(s.shape[0][0] * shardSize, s.shape[0][1] * shardSize);
              ctx.lineTo((s.shape[1][0] + s.shape[2][0]) * 0.5 * shardSize, (s.shape[1][1] + s.shape[2][1]) * 0.5 * shardSize);
            }
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      if (ctx.filter !== undefined) ctx.filter = 'none';

      // Soft cinematic edge vignette
      const vignette = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.45,
        width / 2, height / 2, Math.max(width, height) * 0.85
      );
      vignette.addColorStop(0, 'rgba(6, 6, 6, 0)');
      vignette.addColorStop(1, 'rgba(6, 6, 6, 0.55)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('click', onClick);
    };
  }, [shardColor, accentColor, count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'auto'
      }}
    />
  );
};

export default AeroShardsFallback;
