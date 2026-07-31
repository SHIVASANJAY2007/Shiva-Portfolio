import React, { useCallback, useEffect, useState } from 'react';
import styles from './embla.module.css';

export const useDotButton = (emblaApi) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onDotButtonClick = useCallback(
    (index) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reinit', onInit);
    emblaApi.on('reinit', onSelect);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('reinit', onInit);
      emblaApi.off('reinit', onSelect);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick
  };
};

export const DotButton = (props) => {
  const { children, className, ...restProps } = props;

  return (
    <button
      type="button"
      className={`${styles.embla__dot} ${className || ''}`}
      {...restProps}
    >
      {children}
    </button>
  );
};
