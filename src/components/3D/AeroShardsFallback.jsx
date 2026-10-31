import React, { useEffect, useRef } from 'react';

/**
 * High-performance 2D Canvas Fallback for AeroShards
 * Used when WebGPU is unavailable (e.g. Firefox, iOS Safari, non-WebGPU GPUs, or headless browsers).
 * Perfectly matches AeroShards aesthetic: floating glass & chrome crystalline shards in crimson and purple.
 */
export const AeroShardsFallback = ({
  shardColor = '#FF2E54',
  accentColor = '#A855F7',
  count = 90
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

    const mouse = { x: width / 2, y: height / 2, active: false };
    const rings = [];

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (window.devicePixelRatio || 1);
      mouse.y = (e.clientY - rect.top) * (window.devicePixelRatio || 1);
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
        maxRadius: Math.max(width, height) * 0.7,
        alpha: 0.8
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('click', onClick);

    // Create crystalline shards
    const shards = Array.from({ length: count }, (_, i) => {
      const depth = 0.2 + Math.random() * 0.8; // 0.2 = far, 1.0 = near
      const size = (14 + Math.random() * 26) * depth * (window.devicePixelRatio || 1);
      const isCrimson = Math.random() > 0.45;
      const points = 3 + Math.floor(Math.random() * 2); // 3 or 4-sided crystal
      const angles = [];
      for (let p = 0; p < points; p++) {
        angles.push((p / points) * Math.PI * 2 + (Math.random() - 0.5) * 0.5);
      }

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (0.15 + Math.random() * 0.4) * (depth + 0.3),
        vy: (-0.2 - Math.random() * 0.5) * (depth + 0.3),
        size,
        depth,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.015,
        color: isCrimson ? shardColor : accentColor,
        alpha: 0.15 + depth * 0.35,
        angles,
        points
      };
    });

    let lastTime = performance.now();

    const render = (time) => {
      animId = requestAnimationFrame(render);
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Render interactive pulse rings
      for (let r = rings.length - 1; r >= 0; r--) {
        const ring = rings[r];
        ring.radius += dt * 600 * (window.devicePixelRatio || 1);
        ring.alpha -= dt * 0.7;

        if (ring.alpha <= 0) {
          rings.splice(r, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(255, 46, 84, ${ring.alpha * 0.6})`;
        ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(168, 85, 247, ${ring.alpha * 0.4})`;
        ctx.lineWidth = 1 * (window.devicePixelRatio || 1);
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius * 0.95, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Sort by depth (farthest first)
      shards.sort((a, b) => a.depth - b.depth);

      for (let i = 0; i < shards.length; i++) {
        const s = shards[i];

        // Move
        s.x += s.vx * dt * 60;
        s.y += s.vy * dt * 60;
        s.rotation += s.vRot;

        // Wrap around bounds
        if (s.x < -s.size * 2) s.x = width + s.size;
        if (s.x > width + s.size * 2) s.x = -s.size;
        if (s.y < -s.size * 2) s.y = height + s.size;
        if (s.y > height + s.size * 2) s.y = -s.size;

        // Mouse interaction: push away slightly
        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 200 * (window.devicePixelRatio || 1);
          if (dist < maxDist && dist > 1) {
            const force = (1 - dist / maxDist) * 1.5;
            s.x += (dx / dist) * force;
            s.y += (dy / dist) * force;
          }
        }

        // Draw crystal polygon
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);

        // Glass crystal gradient
        const grad = ctx.createLinearGradient(-s.size, -s.size, s.size, s.size);
        const col = s.color === shardColor ? '255, 46, 84' : '168, 85, 247';
        grad.addColorStop(0, `rgba(${col}, ${s.alpha * 1.2})`);
        grad.addColorStop(0.5, `rgba(${col}, ${s.alpha * 0.6})`);
        grad.addColorStop(1, `rgba(${col}, ${s.alpha * 0.2})`);

        ctx.fillStyle = grad;
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha * 0.8})`;
        ctx.lineWidth = Math.max(0.75, 1.2 * s.depth * (window.devicePixelRatio || 1));

        ctx.beginPath();
        for (let p = 0; p < s.points; p++) {
          const px = Math.cos(s.angles[p]) * s.size;
          const py = Math.sin(s.angles[p]) * s.size * 0.7; // slight perspective flattening
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Shard inner highlight line for prismatic glass effect
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha * 0.5})`;
        ctx.lineWidth = 0.5 * (window.devicePixelRatio || 1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(s.angles[0]) * s.size * 0.8, Math.sin(s.angles[0]) * s.size * 0.5);
        ctx.stroke();

        ctx.restore();
      }
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
