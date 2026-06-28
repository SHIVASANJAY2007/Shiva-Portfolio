import React, { useRef, useEffect, useState } from 'react';
import { useScramble } from '../../hooks/useScramble';
import { motion, useInView } from 'framer-motion';

export const ScrambleHeader = ({ text, className, as: Component = 'h2' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [trigger, setTrigger] = useState(false);
  
  const { output } = useScramble(text, 0, 1000);

  useEffect(() => {
    if (isInView) {
      setTrigger(true);
    }
  }, [isInView]);

  return (
    <Component ref={ref} className={className}>
      {trigger ? output : ''}
    </Component>
  );
};
