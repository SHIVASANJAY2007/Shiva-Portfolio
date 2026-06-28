import { useState, useEffect, useCallback } from 'react';

const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/-=+*#%&@';

export const useScramble = (text, delay = 1000, duration = 2000) => {
  const [output, setOutput] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = useCallback(() => {
    let frame = 0;
    const totalFrames = duration / 16;
    setIsScrambling(true);

    const tick = () => {
      frame++;
      const progress = frame / totalFrames;
      
      const nextText = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (progress > (i / text.length)) return char;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      setOutput(nextText);

      if (frame < totalFrames) {
        requestAnimationFrame(tick);
      } else {
        setIsScrambling(false);
        setOutput(text);
      }
    };

    tick();
  }, [text, duration]);

  useEffect(() => {
    const timer = setTimeout(scramble, delay);
    return () => clearTimeout(timer);
  }, [scramble, delay]);

  return { output, isScrambling };
};
