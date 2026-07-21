import React, { useEffect, useRef, useState } from 'react';
import './StackScroller.css';

const StickyCard = ({ child }) => {
  const ref = useRef(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    // We use a ResizeObserver to dynamically calculate the top sticky offset.
    // If a card is taller than the viewport (like Experience or About), we set top to a negative value
    // so it only sticks after the user has scrolled all the way to the bottom of the card!
    const observer = new ResizeObserver(() => {
      if (ref.current) {
        const height = ref.current.getBoundingClientRect().height;
        const viewportHeight = window.innerHeight;
        if (height > viewportHeight) {
          setTop(viewportHeight - height);
        } else {
          setTop(0);
        }
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Also observe window resizes
    const handleResize = () => {
      if (ref.current) {
        const height = ref.current.getBoundingClientRect().height;
        const viewportHeight = window.innerHeight;
        if (height > viewportHeight) {
          setTop(viewportHeight - height);
        } else {
          setTop(0);
        }
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
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
};

export const StackScroller = ({ children }) => {
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

    const fadeInElms = containerRef.current.querySelectorAll(".card__conceal");
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    fadeInElms.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [children]); // Re-run if children change

  return (
    <main className="container__stack" ref={containerRef}>
      <section className="stack__conceal">
        {React.Children.map(children, (child, index) => (
          <StickyCard key={index} child={child} />
        ))}
      </section>
    </main>
  );
};

export default StackScroller;
