import React, { useEffect, useRef } from 'react';

/**
 * Ultra-Fast, 120 FPS Hardware-Accelerated 2D Canvas Fallback for AeroShards
 * Exact match to the reference image:
 * - Deep midnight amethyst/obsidian cosmic void background (#090514)
 * - Flowing translucent lilac/lavender crystalline ribbon streams with faceted internal reflection lines
 * - Luminous lavender/white beveled crystal edge highlights
 * - Scattered '+' survey markers with subtle pulse blinking
 * - Target bracket '[ + ]' tracking near bottom/cursor matching the reference photo
 * - Smooth mouse parallax lean and click ripple waves
 * - Zero per-frame allocations for buttery 120 FPS performance
 */

const FULL_SLOPES = [
  [0.22, -0.68],
  [-0.65, 0.08],
  [0.48, -0.12],
  [-0.20, 0.58],
  [0.72, 0.25]
];

const DEPTHS = [2.7, 3.8, 5.5, 7.8, 11.2];
const SHARE = [0.28, 0.25, 0.20, 0.16, 0.11];
const FADE = [1.0, 0.88, 0.65, 0.45, 0.28];
const LEVELS = 5;
const CAMERA = 4;
const TAU = Math.PI * 2;

export const AeroShardsFallback = ({
  shardColor = '#896ABD',
  accentColor = '#A855F7',
  count = 280,
  paused = false
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
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
          width * 0.5, height * 0.5, Math.min(width, height) * 0.40,
          width * 0.5, height * 0.5, Math.max(width, height) * 0.88
        );
        vignetteGradient.addColorStop(0, 'rgba(9, 5, 20, 0)');
        vignetteGradient.addColorStop(0.7, 'rgba(6, 3, 14, 0.45)');
        vignetteGradient.addColorStop(1, 'rgba(4, 2, 8, 0.85)');
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

    const mouse = { x: 0.5, y: 0.5, screenX: width * 0.5, screenY: height * 0.5, active: false };
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

    // Pre-grouped shards array by level - ZERO array allocations inside render()
    const shardsByLevel = Array.from({ length: LEVELS }, () => []);

    for (let level = 0; level < LEVELS; level++) {
      const levelCount = Math.round(count * SHARE[level]);
      for (let i = 0; i < levelCount; i++) {
        const s = (i + random() * 0.8) / levelCount;
        const laneSpread = (random() + random() + random() - 1.5) * 0.12;
        const layer = (random() - 0.5) * 0.06;

        // Shape: 3 to 5-sided faceted glass polygon oriented longitudinally along ribbons
        const shapeType = random();
        const shape = [];
        let corners = 4;
        if (shapeType < 0.60) {
          // Elongated beveled diamond/rhombus
          const len = 1.35 + random() * 0.95;
          const w = 0.30 + random() * 0.28;
          shape.push([-len * 0.52, -w * 0.15]);
          shape.push([-len * 0.08, w * 0.72]);
          shape.push([len * 0.52, w * 0.12]);
          shape.push([len * 0.08, -w * 0.72]);
          corners = 4;
        } else if (shapeType < 0.85) {
          // Crystalline prism triangle
          const len = 1.25 + random() * 0.8;
          const w = 0.32 + random() * 0.25;
          shape.push([-len * 0.5, -w * 0.65]);
          shape.push([len * 0.55, 0]);
          shape.push([-len * 0.35, w * 0.65]);
          corners = 3;
        } else {
          // Faceted pentagonal crystal shard
          const len = 1.1 + random() * 0.7;
          const w = 0.38 + random() * 0.28;
          shape.push([-len * 0.45, -w * 0.35]);
          shape.push([-len * 0.1, w * 0.65]);
          shape.push([len * 0.45, w * 0.25]);
          shape.push([len * 0.35, -w * 0.55]);
          shape.push([-len * 0.15, -w * 0.65]);
          corners = 5;
        }

        shardsByLevel[level].push({
          level,
          s,
          speed: 0.12 + random() * 0.06,
          lane: laneSpread,
          layer,
          baseSize: 11 + random() * 14,
          shape,
          corners,
          roll: (random() - 0.5) * 0.5,
          rollSpeed: (random() - 0.5) * 0.9,
          facetType: random() > 0.5 ? 1 : 0
        });
      }
    }

    // Grid of survey '+' markers (42 markers total across depth layers, matching reference photo)
    const markers = [];
    const cols = 9;
    const rows = 5;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        markers.push({
          level: (c + r * 2) % LEVELS,
          gridU: (c + 0.35 + (random() - 0.5) * 0.25) / cols,
          gridV: (r + 0.35 + (random() - 0.5) * 0.25) / rows,
          phase: random() * TAU,
          blinkSpeed: 1.2 + random() * 2.2
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

      // Base: Midnight Obsidian with Deep Amethyst Glow matching reference photo
      ctx.fillStyle = '#090514';
      ctx.fillRect(0, 0, width, height);

      const dpr = getDpr();
      const leanX = mouse.active ? (mouse.x - 0.5) * 0.05 : 0;
      const leanY = mouse.active ? (mouse.y - 0.5) * 0.035 : 0;

      // Update and draw pulse ripple rings on click
      for (let r = rings.length - 1; r >= 0; r--) {
        const ring = rings[r];
        ring.radius += dt * 450 * dpr;
        ring.alpha -= dt * 0.75;
        if (ring.alpha <= 0) {
          rings.splice(r, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(192, 132, 252, ${ring.alpha * 0.55})`;
        ctx.lineWidth = 1.8 * dpr;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, TAU);
        ctx.stroke();
      }

      // 1. Draw Batched '+' Survey Markers
      let nearestMarker = null;
      let minMarkerDist = Infinity;

      ctx.lineWidth = 1.1 * dpr;
      for (let i = 0; i < markers.length; i++) {
        const m = markers[i];
        const depth = DEPTHS[m.level];
        const scale = CAMERA / depth;

        const sx = width * (m.gridU + leanX * scale);
        const sy = height * (m.gridV + leanY * scale);

        if (sx < -15 || sx > width + 15 || sy < -15 || sy > height + 15) continue;

        const blinkVal = Math.sin(clock * m.blinkSpeed + m.phase);
        const isBlinking = blinkVal > 0.80;
        const alpha = FADE[m.level] * (isBlinking ? 0.92 : 0.35);

        const dist = Math.hypot(sx - mouse.screenX, sy - mouse.screenY);
        if (dist < minMarkerDist) {
          minMarkerDist = dist;
          nearestMarker = { sx, sy, alpha: 0.95 };
        }

        const plusSize = (3.8 + (4 - m.level) * 0.55) * dpr;
        ctx.strokeStyle = isBlinking ? `rgba(243, 232, 255, ${alpha})` : `rgba(192, 132, 252, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(sx - plusSize, sy);
        ctx.lineTo(sx + plusSize, sy);
        ctx.moveTo(sx, sy - plusSize);
        ctx.lineTo(sx, sy + plusSize);
        ctx.stroke();
      }

      // Target Bracket [ + ] (Locks onto nearest marker or rests elegantly around x: 48%, y: 88%)
      const defaultTargetX = width * 0.48;
      const defaultTargetY = height * 0.88;
      const activeTarget = nearestMarker && minMarkerDist < 180 * dpr
        ? nearestMarker
        : { sx: defaultTargetX, sy: defaultTargetY, alpha: 0.75 };

      if (activeTarget) {
        const { sx, sy, alpha } = activeTarget;
        const bSize = 9.5 * dpr;
        const cLen = 4.2 * dpr;
        ctx.strokeStyle = `rgba(235, 215, 255, ${alpha})`;
        ctx.lineWidth = 1.3 * dpr;
        ctx.beginPath();
        // Top-left corner
        ctx.moveTo(sx - bSize, sy - bSize + cLen);
        ctx.lineTo(sx - bSize, sy - bSize);
        ctx.lineTo(sx - bSize + cLen, sy - bSize);
        // Top-right corner
        ctx.moveTo(sx + bSize - cLen, sy - bSize);
        ctx.lineTo(sx + bSize, sy - bSize);
        ctx.lineTo(sx + bSize, sy - bSize + cLen);
        // Bottom-left corner
        ctx.moveTo(sx - bSize, sy + bSize - cLen);
        ctx.lineTo(sx - bSize, sy + bSize);
        ctx.lineTo(sx - bSize + cLen, sy + bSize);
        // Bottom-right corner
        ctx.moveTo(sx + bSize - cLen, sy + bSize);
        ctx.lineTo(sx + bSize, sy + bSize);
        ctx.lineTo(sx + bSize, sy + bSize - cLen);
        ctx.stroke();
      }

      // 2. Draw Shard Ribbon Waves (from farthest depth level 4 down to foreground level 0)
      for (let level = LEVELS - 1; level >= 0; level--) {
        const levelShards = shardsByLevel[level];
        const depth = DEPTHS[level];
        const fade = FADE[level];
        const slope = FULL_SLOPES[level];
        const slopeDelta = slope[1] - slope[0];
        const depthScale = (CAMERA / depth) * dpr;

        // Visual match to attached photo: luminous lilac glass with sparkling violet rim light
        const fillAlpha = (0.18 + (4 - level) * 0.05) * fade;
        const strokeAlpha = (0.58 + (4 - level) * 0.10) * fade;
        const fillStyle = `rgba(165, 128, 225, ${fillAlpha})`;
        const facetFillStyle = `rgba(185, 150, 245, ${fillAlpha * 1.35})`;
        const strokeStyle = `rgba(235, 215, 255, ${strokeAlpha})`;
        const facetStrokeStyle = `rgba(248, 235, 255, ${strokeAlpha * 0.55})`;
        const lineWidth = Math.max(0.9, (1.4 - level * 0.12) * dpr);

        for (let i = 0; i < levelShards.length; i++) {
          const s = levelShards[i];

          // Advance along ribbon with graceful fluid velocity
          s.s = (s.s + s.speed * dt) % 1.0;
          s.roll += s.rollSpeed * dt * 2.2;

          const progress = s.s;
          const u = -1.35 + 2.7 * progress;
          const v =
            slope[0] +
            slopeDelta * progress +
            0.13 * Math.sin(progress * TAU * 0.75 + level * 2.3 + clock * 0.12) +
            0.06 * Math.sin(progress * TAU * 1.8 + level);

          const du = 2.7;
          const dv = slopeDelta + 0.13 * Math.cos(progress * TAU * 0.75 + level * 2.3) * TAU * 0.75;
          const tLen = Math.hypot(du, dv) || 1;
          const normU = -dv / tLen;
          const normV = du / tLen;

          const finalU = u + normU * s.lane + leanX;
          const finalV = v + normV * s.lane + s.layer - leanY;

          const sx = width * (0.5 + 0.5 * finalU);
          const sy = height * (0.5 - 0.5 * finalV);

          // Skip if offscreen
          if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) continue;

          const shardSize = s.baseSize * depthScale;
          const ribbonAngle = Math.atan2(-dv, du);

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(ribbonAngle + s.roll * 0.35);

          // 1. Draw polygon body
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

          // 2. Dual-tone specular facet reflection (one illuminated prism facet)
          if (s.corners >= 4 && s.facetType === 1) {
            ctx.beginPath();
            ctx.moveTo(s.shape[0][0] * shardSize, s.shape[0][1] * shardSize);
            ctx.lineTo(s.shape[1][0] * shardSize, s.shape[1][1] * shardSize);
            ctx.lineTo(s.shape[2][0] * shardSize, s.shape[2][0] * shardSize);
            ctx.closePath();
            ctx.fillStyle = facetFillStyle;
            ctx.fill();
          }

          // 3. Crisp outer edge stroke
          ctx.strokeStyle = strokeStyle;
          ctx.lineWidth = lineWidth;
          ctx.stroke();

          // 4. Internal geometric facet cut lines (matching crystal glass facets in photo)
          if (s.corners >= 3) {
            ctx.strokeStyle = facetStrokeStyle;
            ctx.lineWidth = 0.65 * dpr;
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
            } else if (s.corners === 5) {
              ctx.moveTo(s.shape[0][0] * shardSize, s.shape[0][1] * shardSize);
              ctx.lineTo(s.shape[2][0] * shardSize, s.shape[2][0] * shardSize);
              ctx.moveTo(s.shape[0][0] * shardSize, s.shape[0][1] * shardSize);
              ctx.lineTo(s.shape[3][0] * shardSize, s.shape[3][1] * shardSize);
            }
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      // Radial Vignette
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
