import React, { useEffect, useRef, useState } from 'react';
import './StackScroller.css';

const StickyCard = React.memo(({ child, index }) => {
  const ref = useRef(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const updateTop = () => {
      if (!ref.current) return;
      const height = ref.current.offsetHeight || ref.current.getBoundingClientRect().height;
      const viewportHeight = window.innerHeight;
      // If a card is taller than the viewport, set top to viewportHeight - height
      // so it sticks once the user has scrolled to the bottom of the card.
      // If card is <= viewportHeight (like Hero), top is 0 so it locks at top: 0 immediately.
      const calculatedTop = height > viewportHeight ? viewportHeight - height : 0;
      setTop(calculatedTop);
    };

    updateTop();

    const observer = new ResizeObserver(updateTop);
    if (ref.current) {
      observer.observe(ref.current);
    }

    window.addEventListener('resize', updateTop, { passive: true });

    // Also recalculate after fonts and assets are loaded
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(updateTop);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateTop);
    };
  }, []);

  return (
    <section 
      ref={ref}
      className="card__conceal overlay__conceal"
      style={{ top: `${top}px` }}
    >
      {child}
    </section>
  );
});

export const StackScroller = React.memo(({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    function observerCallback(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.replace("overlay__conceal", "overlay__conceal--visible");
        } else {
          entry.target.classList.replace("overlay__conceal--visible", "overlay__conceal");
        }
      });
    }

    if (!containerRef.current) return;
    const fadeInElms = containerRef.current.querySelectorAll(".card__conceal");
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    fadeInElms.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [children]);

  return (
    <div className="container__stack" ref={containerRef}>
      <div className="stack__conceal">
        {React.Children.map(children, (child, index) => (
          <StickyCard key={index} index={index} child={child} />
        ))}
      </div>
    </div>
  );
});

export default StackScroller;

