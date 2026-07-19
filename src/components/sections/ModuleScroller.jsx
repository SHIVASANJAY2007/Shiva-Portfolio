import React, { useRef } from 'react';
import styles from './ModuleScroller.module.css';

export const ModuleScroller = ({ children }) => {
  const containerRef = useRef(null);
  const modules = React.Children.toArray(children);

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
