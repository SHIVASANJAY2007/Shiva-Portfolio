import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ModuleScroller.module.css';

gsap.registerPlugin(ScrollTrigger);

export const ModuleScroller = ({ children }) => {
  const containerRef = useRef(null);
  const modules = React.Children.toArray(children);

  useEffect(() => {
    if (!containerRef.current) return;

    const moduleElements = containerRef.current.querySelectorAll(`.${styles.moduleItem}`);
    const triggers = [];

    // Allow components to render properly before calculating heights
    const timeoutId = setTimeout(() => {
      moduleElements.forEach((el, index) => {
        // Do not pin the last module, as there is nothing to scroll over it.
        // Pinning it would just hold it in place and cause empty scrolling at the end.
        if (index === moduleElements.length - 1) return;

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "bottom bottom", 
          pin: true,
          pinSpacing: false, 
          invalidateOnRefresh: true,
        });
        
        triggers.push(trigger);
      });

      // Refresh to ensure all metrics are correct
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      triggers.forEach(t => t.kill());
    };
  }, [modules.length]);

  return (
    <div className={styles.scrollerWrapper} ref={containerRef}>
      {modules.map((child, index) => (
        <div 
          key={index} 
          className={styles.moduleItem} 
          style={{ zIndex: index + 1 }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ModuleScroller;
