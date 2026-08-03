import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import styles from './Carousel.module.css';

const TWEEN_FACTOR_BASE = 0.2;

// Internal Dot Button Helper
const useDotButton = (emblaApi) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onDotButtonClick = useCallback((index) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

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
    emblaApi.on('reinit', onInit).on('reinit', onSelect).on('select', onSelect);
    return () => {
      emblaApi.off('reinit', onInit).off('reinit', onSelect).off('select', onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return { selectedIndex, scrollSnaps, onDotButtonClick };
};

const DotButton = ({ children, className, ...restProps }) => (
  <button type="button" className={`${styles.embla__dot} ${className || ''}`} {...restProps}>
    {children}
  </button>
);

// Internal Prev/Next Arrow Helpers
const usePrevNextButtons = (emblaApi) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const onNextButtonClick = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('reinit', onSelect).on('select', onSelect);
    return () => {
      emblaApi.off('reinit', onSelect).off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick };
};

const PrevButton = ({ children, className, ...restProps }) => (
  <button className={`${styles.embla__button} ${className || ''}`} type="button" {...restProps}>
    <svg className={styles.embla__button__svg} viewBox="0 0 532 532">
      <path fill="currentColor" d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z" />
    </svg>
    {children}
  </button>
);

const NextButton = ({ children, className, ...restProps }) => (
  <button className={`${styles.embla__button} ${className || ''}`} type="button" {...restProps}>
    <svg className={styles.embla__button__svg} viewBox="0 0 532 532">
      <path fill="currentColor" d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z" />
    </svg>
    {children}
  </button>
);

export const Carousel = (props) => {
  const { slides, options, setApi } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => ({
      layer: slideNode.querySelector(`.${styles.embla__parallax__layer}`),
      inner: slideNode.querySelector(`.${styles.embla__slide__inner}`),
      content: slideNode.querySelector(`.${styles.embla__slide__content}`),
    }));
  }, []);

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback((emblaApi, event) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = event?.type === 'scroll';

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }

        const nodes = tweenNodes.current[slideIndex];
        if (!nodes) return;

        const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
        const zoom = 1 + Math.min(Math.abs(diffToTarget) * 0.15, 0.3);
        if (nodes.layer) {
          nodes.layer.style.transform = `translateX(${translate}%) scale(${zoom})`;
        }

        if (nodes.inner) {
          const distance = Math.min(Math.abs(diffToTarget * 1.8), 1);
          const scale = 1 - (distance * 0.14);
          const opacity = 1 - (distance * 0.55);
          const rotateY = diffToTarget * 22;
          const translateY = distance * 20;

          nodes.inner.style.transform = `perspective(1200px) rotateY(${rotateY}deg) scale(${scale}) translateY(${translateY}px)`;
          nodes.inner.style.opacity = opacity;

          if (distance < 0.25) {
            nodes.inner.style.boxShadow = `0 20px 50px -10px rgba(255, 46, 84, ${0.45 * (1 - distance * 4)}), 0 0 35px rgba(255, 46, 84, ${0.25 * (1 - distance * 4)})`;
            nodes.inner.style.borderColor = `rgba(255, 46, 84, ${0.8 - distance * 2})`;
          } else {
            nodes.inner.style.boxShadow = '0 15px 35px -12px rgba(0, 0, 0, 0.6)';
            nodes.inner.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }
        }

        if (nodes.content) {
          const distance = Math.min(Math.abs(diffToTarget * 1.8), 1);
          const contentTranslateY = distance * 30;
          const contentOpacity = Math.max(1 - (distance * 0.8), 0);
          nodes.content.style.transform = `translateY(${contentTranslateY}px)`;
          nodes.content.style.opacity = contentOpacity;
        }
      });
    });
  }, []);

  useEffect(() => {
    if (setApi) setApi(emblaApi);
  }, [emblaApi, setApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on('reinit', setTweenNodes)
      .on('reinit', setTweenFactor)
      .on('reinit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slidefocus', tweenParallax);

    return () => {
      emblaApi
        .off('reinit', setTweenNodes)
        .off('reinit', setTweenFactor)
        .off('reinit', tweenParallax)
        .off('scroll', tweenParallax)
        .off('slidefocus', tweenParallax);
    };
  }, [emblaApi, tweenParallax, setTweenNodes, setTweenFactor]);

  return (
    <div className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {slides.map((project, index) => (
            <div className={styles.embla__slide} key={project.id || index}>
              <div className={styles.embla__slide__inner}>
                <div className={styles.embla__parallax}>
                  <div className={styles.embla__parallax__layer}>
                    <img
                      className={styles.embla__parallax__img}
                      src={project.image || `https://picsum.photos/600/350?v=${index}`}
                      alt={project.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                <div className={styles.embla__slide__content}>
                  <h1 className={styles.embla__slide__title}>{project.name}</h1>
                  <p className={styles.embla__slide__desc}>{project.description}</p>
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className={styles.embla__slide__highlights}>
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx} className={styles.embla__slide__highlight}>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className={styles.embla__slide__actions}>
                    <a href={project.link || "#"} target={project.link ? "_blank" : "_self"} rel="noopener noreferrer" className={styles.embla__slide__btn}>
                      View Project
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.embla__controls}>
        <div className={styles.embla__buttons}>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className={styles.embla__dots}>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`${styles.embla__dot} ${index === selectedIndex ? styles['embla__dot--selected'] : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { Carousel as EmblaCarousel };
export default Carousel;
