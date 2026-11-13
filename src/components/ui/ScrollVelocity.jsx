import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import {
  motion,
  useTransform,
  useMotionValue,
  useAnimationFrame
} from 'framer-motion';
import './ScrollVelocity.css';

function VelocityText({
  children,
  baseVelocity = 100,
  className = '',
  numCopies = 3,
  parallaxClassName = 'parallax',
  scrollerClassName = 'scroller',
  parallaxStyle,
  scrollerStyle
}) {
  const baseX = useMotionValue(0);
  const containerRef = useRef(null);
  const copyRef = useRef(null);
  const periodRef = useRef(0);
  const rowWidthRef = useRef(0);
  const isInViewRef = useRef(false);
  const [copyCount, setCopyCount] = useState(numCopies);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      isInViewRef.current = entry.isIntersecting;
    }, { threshold: 0.01 });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const firstCopy = copyRef.current;
    const container = containerRef.current;
    if (!firstCopy || !container) return;

    // Each repeated copy is "text + trailing gap"; measure the real repeat
    // period so the wrap cycle is seamless (includes the 3rem gap) and the
    // scroller always stays covered.
    const nextCopy = firstCopy.nextElementSibling;
    let period = nextCopy
      ? nextCopy.offsetLeft - firstCopy.offsetLeft
      : firstCopy.offsetWidth;
    if (period <= 0) period = firstCopy.offsetWidth || 300;
    periodRef.current = period;

    // The scroller slides within [-period, 0]; with N copies the content
    // always reaches (N - 1) * period. For short labels like "JAVA" a fixed
    // count of 3 copies could slide entirely into the masked-off left region,
    // leaving the visible right side empty. Render just enough copies so the
    // row is always covered on any viewport width.
    rowWidthRef.current = container.offsetWidth;
    const needed = Math.ceil(rowWidthRef.current / period) + 1;
    const target = Math.max(numCopies, needed);
    setCopyCount((prev) => (prev === target ? prev : target));
  }, [children, numCopies]);

  function wrap(min, max, v) {
    const range = max - min;
    const mod = (((v - min) % range) + range) % range;
    return mod + min;
  }

  const x = useTransform(baseX, v => {
    const period = periodRef.current || 300;
    return `${wrap(-period, 0, v)}px`;
  });

  useAnimationFrame((t, delta) => {
    if (!isInViewRef.current || typeof document === 'undefined' || document.hidden) return;
    if (baseVelocity === 0) return;
    const smoothDelta = Math.min(delta, 50);
    const moveBy = baseVelocity * (smoothDelta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  const spans = [];
  for (let i = 0; i < copyCount; i++) {
    spans.push(
      <span className={className} key={i} ref={i === 0 ? copyRef : null}>
        {children}&nbsp;
      </span>
    );
  }

  return (
    <div ref={containerRef} className={parallaxClassName} style={parallaxStyle}>
      <motion.div className={scrollerClassName} style={{ x, ...scrollerStyle }}>
        {spans}
      </motion.div>
    </div>
  );
}

export const ScrollVelocity = ({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = '',
  damping = 50,
  stiffness = 400,
  numCopies = 3,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = 'parallax',
  scrollerClassName = 'scroller',
  parallaxStyle,
  scrollerStyle
}) => {
  return (
    <section>
      {texts.map((text, index) => (
        <VelocityText
          key={`${index}-${String(text)}`}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}
        </VelocityText>
      ))}
    </section>
  );
};

export default ScrollVelocity;
