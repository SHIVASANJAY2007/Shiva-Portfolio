import React, { useMemo } from 'react';
import styles from './BlackMeteors.module.css';

export const BlackMeteors = ({ count = 14 }) => {
  const meteors = useMemo(() => {
    return Array.from({ length: count }, (_, idx) => ({
      id: idx,
      // Positioned to originate around the upper-right boundary to traverse smoothly towards bottom-left
      top: `${Math.floor(Math.random() * 60) - 15}%`,
      left: `${Math.floor(Math.random() * 70) + 35}%`,
      delay: `${(Math.random() * 3.5 + 0.1).toFixed(2)}s`,
      duration: `${(Math.random() * 1.8 + 3.0).toFixed(2)}s`,
    }));
  }, [count]);

  return (
    <div className={styles.meteorsWrapper} aria-hidden="true">
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className={styles.meteor}
          style={{
            top: meteor.top,
            left: meteor.left,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        >
          <span className={styles.meteorTail} />
        </span>
      ))}
    </div>
  );
};

export default BlackMeteors;
