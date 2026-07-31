import React, { useMemo } from 'react';
import styles from './EmojiBackground.module.css';

// Import all SVG files from emojis directory
const svgModules = import.meta.glob('../../assets/emojis/*.svg', { eager: true });
const emojis = Object.values(svgModules).map((mod) => mod.default);

export const EmojiBackground = () => {
  const rowsCount = 15; /* Perfectly even vertical distribution */
  
  const rows = useMemo(() => {
    return Array.from({ length: rowsCount }).map((_, i) => {
      // Shuffle emojis for each row to make faces organic, but spacing uniform
      const shuffled = [...emojis].sort(() => Math.random() - 0.5);
      
      // Use 100 emojis per row
      const rowEmojis = shuffled.slice(0, 100).map(src => ({
        src,
      }));
      
      return {
        id: i,
        emojis: rowEmojis,
        // Fixed speed so all rows move exactly together, maintaining a perfect uniform grid
        speed: 50, 
      };
    });
  }, []);

  return (
    <div className={styles.stickyWrapper}>
      <div className={styles.container}>
        {rows.map((row) => (
        <div key={row.id} className={styles.row}>
          <div 
            className={styles.marquee} 
            style={{ animationDuration: `${row.speed}s` }}
          >
            <div className={styles.emojiSet}>
              {row.emojis.map((emoji, idx) => (
                <img 
                  key={`orig-${idx}`} 
                  src={emoji.src} 
                  className={styles.emoji} 
                  alt="" 
                />
              ))}
            </div>
            <div className={styles.emojiSet}>
              {row.emojis.map((emoji, idx) => (
                <img 
                  key={`dup-${idx}`} 
                  src={emoji.src} 
                  className={styles.emoji} 
                  alt="" 
                />
              ))}
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiBackground;
