import React, { useEffect, useRef } from 'react';

const ClickSpark = ({
  sparkColor = '#ffffff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let sparks = [];

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    const easeOutCirc = (t) => Math.sqrt(1 - Math.pow(t - 1, 2));

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparks = sparks.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        
        let easedProgress = progress;
        if (easing === 'ease-out') easedProgress = easeOutQuart(progress);
        else if (easing === 'ease-out-circ') easedProgress = easeOutCirc(progress);

        // Distance from center
        const currentRadius = (sparkRadius * extraScale) + (30 * easedProgress);
        // Size/length of the spark
        const length = (sparkSize * extraScale) * (1 - easedProgress);

        const startX = spark.x + Math.cos(spark.angle) * currentRadius;
        const startY = spark.y + Math.sin(spark.angle) * currentRadius;
        const endX = spark.x + Math.cos(spark.angle) * (currentRadius + length);
        const endY = spark.y + Math.sin(spark.angle) * (currentRadius + length);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2 * (1 - progress);
        ctx.lineCap = 'round';
        ctx.stroke();

        return true;
      });

      if (sparks.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    const handleClick = (e) => {
      const { clientX, clientY } = e;
      const now = performance.now();

      // Create new sparks
      const newSparks = Array.from({ length: sparkCount }).map((_, i) => ({
        x: clientX,
        y: clientY,
        angle: (Math.PI * 2 / sparkCount) * i,
        startTime: now
      }));
      
      const wasEmpty = sparks.length === 0;
      sparks.push(...newSparks);

      if (wasEmpty) {
        requestAnimationFrame(animate);
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('click', handleClick);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
        mixBlendMode: 'difference' // Magic for contrasting against light/dark backgrounds
      }}
    />
  );
};

export default ClickSpark;
