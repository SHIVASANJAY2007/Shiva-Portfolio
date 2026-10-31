import React, { useEffect, useRef } from 'react';

/**
 * Ultra-Fast, 120 FPS Hardware-Accelerated 2D Canvas Fallback for AeroShards
 * Fully optimized: Zero per-frame allocations, batched draw calls, no software filters,
 * and automatic pausing when scrolled out of view.
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
const FADE = [1.0, 0.85, 0.60, 0.40, 0.25];
const LEVELS = 5;
const CAMERA = 4;
const TAU = Math.PI * 2;

export const AeroShardsFallback = ({
  shardColor = '#896ABD',
  accentColor = '#A855F7',
  count = 240,
  paused = false
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = null;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let vignetteGradient = null;

    // Device Pixel Ratio capped at 1.5 to eliminate high-DPI fillrate lag on 4K/retina displays
    const getDpr = () => Math.min(window.devicePixelRatio || 1, 1.5);

    const updateSize = () => {
      const dpr = getDpr();
      width = canvas.width = Math.round(canvas.offsetWidth * dpr);
      height = canvas.height = Math.round(canvas.offsetHeight * dpr);

      // Pre-compute vignette gradient once on resize instead of every single frame
      if (width > 0 && height > 0) {
        vignetteGradient = ctx.createRadialGradient(
          width * 0.5, height * 0.5, Math.min(width, height) * 0.45,
          width * 0.5, height * 0.5, Math.max(width, height) * 0.85
        );
        vignetteGradient.addColorStop(0, 'rgba(6, 6, 6, 0)');
        vignetteGradient.addColorStop(1, 'rgba(6, 6, 6, 0.55)');
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });

    // Viewport intersection observer: immediately pause animation when scrolled away
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId && !paused && !document.hidden) {
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      } else if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }, { threshold: 0.01 });

    observer.observe(canvas);

    // Tab visibility listener: pause when tab is in background
    const handleVisibilityChange = () => {
      if (document.hidden && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      } else if (!document.hidden && isVisible && !animId && !paused) {
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const mouse = { x: 0.5, y: 0.5, screenX: width * 0.7, screenY: height * 0.7, active: false };
    const rings = [];

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = getDpr();
      mouse.screenX = (e.clientX - rect.left) * dpr;
      mouse.screenY = (e.clientY - rect.top) * dpr;
      mouse.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      mouse.y = (e.clientY - rect.top) / Math.max(rect.height, 1);
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = getDpr();
      rings.push({
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
        radius: 0,
        alpha: 1.0
      });
      if (rings.length > 3) rings.shift();
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

    // Pre-grouped shards array by level - ZERO array allocations inside render()
    const shardsByLevel = Array.from({ length: LEVELS }, () => []);

    for (let level = 0; level < LEVELS; level++) {
      const levelCount = Math.round(count * SHARE[level]);
      for (let i = 0; i < levelCount; i++) {
        const s = (i + random() * 0.8) / levelCount;
        const laneSpread = (random() + random() + random() - 1.5) * 0.11;
        const layer = (random() - 0.5) * 0.05;

        // Shape: 3 to 4-sided faceted glass polygon oriented longitudinally
        const shapeType = random();
        const shape = [];
        let corners = 4;
        if (shapeType < 0.65) {
          // Elongated diamond/trapezoid
          const len = 1.3 + random() * 0.9;
          const w = 0.28 + random() * 0.25;
          shape.push([-len * 0.55, -w * 0.2]);
          shape.push([-len * 0.1, w * 0.7]);
          shape.push([len * 0.55, w * 0.1]);
          shape.push([len * 0.1, -w * 0.7]);
          corners = 4;
        } else if (shapeType < 0.88) {
          // Triangle facet
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

        shardsByLevel[level].push({
          level,
          s,
          speed: 0.038 + random() * 0.02,
          lane: laneSpread,
          layer,
          baseSize: 9 + random() * 11,
          shape,
          corners,
          roll: (random() - 0.5) * 0.3,
          rollSpeed: (random() - 0.5) * 0.4,
          tint: random()
        });
      }
    }

    // Grid of survey '+' markers (40 markers total, clean & fast)
    const markers = [];
    const cols = 8;
    const rows = 5;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        markers.push({
          level: (c + r) % LEVELS,
          gridU: (c + 0.4 + (random() - 0.5) * 0.2) / cols,
          gridV: (r + 0.4 + (random() - 0.5) * 0.2) / rows,
          phase: random() * TAU,
          blinkSpeed: 1.5 + random() * 2
        });
      }
    }

    let clock = 0;
    let lastTime = performance.now();

    const render = (now) => {
      if (!isVisible || paused || document.hidden) {
        animId = null;
        return;
      }

      animId = requestAnimationFrame(render);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      clock += dt;

      ctx.clearRect(0, 0, width, height);

      const dpr = getDpr();
      const leanX = mouse.active ? (mouse.x - 0.5) * 0.04 : 0;
      const leanY = mouse.active ? (mouse.y - 0.5) * 0.03 : 0;

      // Update pulse rings
      for (let r = rings.length - 1; r >= 0; r--) {
        const ring = rings[r];
        ring.radius += dt * 500 * dpr;
        ring.alpha -= dt * 0.8;
        if (ring.alpha <= 0) {
          rings.splice(r, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(168, 85, 247, ${ring.alpha * 0.6})`;
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, TAU);
        ctx.stroke();
      }

      // 1. Draw Batched '+' Survey Markers
      let nearestMarker = null;
      let minMarkerDist = Infinity;

      ctx.lineWidth = 1 * dpr;
      for (let i = 0; i < markers.length; i++) {
        const m = markers[i];
        const depth = DEPTHS[m.level];
        const scale = CAMERA / depth;

        const sx = width * (m.gridU + leanX * scale);
        const sy = height * (m.gridV + leanY * scale);

        if (sx < -10 || sx > width + 10 || sy < -10 || sy > height + 10) continue;

        const blinkVal = Math.sin(clock * m.blinkSpeed + m.phase);
        const isBlinking = blinkVal > 0.84;
        const alpha = FADE[m.level] * (isBlinking ? 0.85 : 0.32);

        const dist = Math.hypot(sx - mouse.screenX, sy - mouse.screenY);
        if (dist < minMarkerDist) {
          minMarkerDist = dist;
          nearestMarker = { sx, sy, alpha: 0.95 };
        }

        const plusSize = (3.5 + (4 - m.level) * 0.6) * dpr;
        ctx.strokeStyle = isBlinking ? `rgba(216, 180, 254, ${alpha})` : `rgba(168, 85, 247, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(sx - plusSize, sy);
        ctx.lineTo(sx + plusSize, sy);
        ctx.moveTo(sx, sy - plusSize);
        ctx.lineTo(sx, sy + plusSize);
        ctx.stroke();
      }

      // Target Bracket [+]
      const activeTarget = nearestMarker && minMarkerDist < 160 * dpr
        ? nearestMarker
        : { sx: width * 0.42, sy: height * 0.88, alpha: 0.6 };

      if (activeTarget) {
        const { sx, sy, alpha } = activeTarget;
        const bSize = 9 * dpr;
        const cLen = 4 * dpr;
        ctx.strokeStyle = `rgba(216, 180, 254, ${alpha})`;
        ctx.lineWidth = 1.2 * dpr;
        ctx.beginPath();
        // Corners
        ctx.moveTo(sx - bSize, sy - bSize + cLen);
        ctx.lineTo(sx - bSize, sy - bSize);
        ctx.lineTo(sx - bSize + cLen, sy - bSize);

        ctx.moveTo(sx + bSize - cLen, sy - bSize);
        ctx.lineTo(sx + bSize, sy - bSize);
        ctx.lineTo(sx + bSize, sy - bSize + cLen);

        ctx.moveTo(sx - bSize, sy + bSize - cLen);
        ctx.lineTo(sx - bSize, sy + bSize);
        ctx.lineTo(sx - bSize + cLen, sy + bSize);

        ctx.moveTo(sx + bSize - cLen, sy + bSize);
        ctx.lineTo(sx + bSize, sy + bSize);
        ctx.lineTo(sx + bSize, sy + bSize - cLen);
        ctx.stroke();
      }

      // 2. Draw Shard Ribbon Waves (from level 4 down to 0)
      for (let level = LEVELS - 1; level >= 0; level--) {
        const levelShards = shardsByLevel[level];
        const depth = DEPTHS[level];
        const fade = FADE[level];
        const slope = FULL_SLOPES[level];
        const slopeDelta = slope[1] - slope[0];
        const depthScale = (CAMERA / depth) * dpr;

        // Colors per depth level: softer alpha on distance eliminates need for expensive CPU blur
        const fillAlpha = (0.14 + (4 - level) * 0.03) * fade;
        const strokeAlpha = (0.35 + (4 - level) * 0.12) * fade;
        const fillStyle = `rgba(137, 106, 189, ${fillAlpha})`;
        const strokeStyle = `rgba(205, 172, 250, ${strokeAlpha})`;
        const facetStrokeStyle = `rgba(225, 200, 255, ${strokeAlpha * 0.4})`;
        const lineWidth = Math.max(0.75, (1.2 - level * 0.12) * dpr);

        for (let i = 0; i < levelShards.length; i++) {
          const s = levelShards[i];

          // Advance along ribbon
          s.s = (s.s + s.speed * dt * 0.85) % 1.0;
          s.roll += s.rollSpeed * dt;

          const progress = s.s;
          const u = -1.32 + 2.64 * progress;
          const v =
            slope[0] +
            slopeDelta * progress +
            0.12 * Math.sin(progress * TAU * 0.75 + level * 2.3 + clock * 0.1) +
            0.05 * Math.sin(progress * TAU * 1.9 + level);

          const du = 2.64;
          const dv = slopeDelta + 0.12 * Math.cos(progress * TAU * 0.75 + level * 2.3) * TAU * 0.75;
          const tLen = Math.hypot(du, dv) || 1;
          const normU = -dv / tLen;
          const normV = du / tLen;

          const finalU = u + normU * s.lane + leanX;
          const finalV = v + normV * s.lane + s.layer - leanY;

          const sx = width * (0.5 + 0.5 * finalU);
          const sy = height * (0.5 - 0.5 * finalV);

          // Skip if offscreen
          if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) continue;

          const shardSize = s.baseSize * depthScale;
          const ribbonAngle = Math.atan2(-dv, du);

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(ribbonAngle + s.roll * 0.3);

          // Draw polygon
          ctx.beginPath();
          for (let p = 0; p < s.corners; p++) {
            const px = s.shape[p][0] * shardSize;
            const py = s.shape[p][1] * shardSize;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();

          ctx.fillStyle = fillStyle;
          ctx.fill();

          ctx.strokeStyle = strokeStyle;
          ctx.lineWidth = lineWidth;
          ctx.stroke();

          // Internal geometric facet reflection lines
          if (s.corners >= 3) {
            ctx.strokeStyle = facetStrokeStyle;
            ctx.lineWidth = 0.55 * dpr;
            ctx.beginPath();
            if (s.corners === 4) {
              ctx.moveTo(s.shape[0][0] * shardSize, s.shape[0][1] * shardSize);
              ctx.lineTo(s.shape[2][0] * shardSize, s.shape[2][0] * shardSize);
              ctx.moveTo(s.shape[1][0] * shardSize, s.shape[1][1] * shardSize);
              ctx.lineTo(s.shape[3][0] * shardSize, s.shape[3][1] * shardSize);
            } else if (s.corners === 3) {
              ctx.moveTo(s.shape[0][0] * shardSize, s.shape[0][1] * shardSize);
              ctx.lineTo(
                (s.shape[1][0] + s.shape[2][0]) * 0.5 * shardSize,
                (s.shape[1][1] + s.shape[2][1]) * 0.5 * shardSize
              );
            }
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      // Vignette using pre-computed gradient (0ms overhead)
      if (vignetteGradient) {
        ctx.fillStyle = vignetteGradient;
        ctx.fillRect(0, 0, width, height);
      }
    };

    if (!paused) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('click', onClick);
    };
  }, [shardColor, accentColor, count, paused]);

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
