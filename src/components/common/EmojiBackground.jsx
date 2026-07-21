import React, { useMemo } from 'react';
import styles from './EmojiBackground.module.css';

// Import all SVG files from emojis directory
const svgModules = import.meta.glob('../emojis/*.svg', { eager: true });
const emojis = Object.values(svgModules).map((mod) => mod.default);

export const EmojiBackground = () => {
  const rowsCount = 12; /* Massive number of rows */
  
  const rows = useMemo(() => {
    return Array.from({ length: rowsCount }).map((_, i) => {
      // Shuffle emojis for each row to make it look organic
      const shuffled = [...emojis].sort(() => Math.random() - 0.5);
      
      // Use 100 emojis per row for extreme density
      const rowEmojis = shuffled.slice(0, 100);
      
      return {
        id: i,
        emojis: rowEmojis,
        // Different speeds for parallax effect (between 40s and 60s)
        speed: 40 + Math.random() * 20, 
      };
    });
  }, []);

  return (
    <div className={styles.container}>
      {rows.map((row) => (
        <div key={row.id} className={styles.row}>
          <div 
            className={styles.marquee} 
            style={{ animationDuration: `${row.speed}s` }}
          >
            <div className={styles.emojiSet}>
              {row.emojis.map((src, idx) => (
                <img key={`orig-${idx}`} src={src} className={styles.emoji} alt="" />
              ))}
            </div>
            <div className={styles.emojiSet}>
              {row.emojis.map((src, idx) => (
                <img key={`dup-${idx}`} src={src} className={styles.emoji} alt="" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmojiBackground;
