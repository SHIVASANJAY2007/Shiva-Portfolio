import React, { useCallback, useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import styles from './embla.module.css';

const TWEEN_FACTOR_BASE = 0.2;

const EmblaCarousel = (props) => {
  const { slides, options, setApi } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(`.${styles.embla__parallax__layer}`);
    });
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

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
        const tweenNode = tweenNodes.current[slideIndex];
        if (tweenNode) {
          tweenNode.style.transform = `translateX(${translate}%)`;
        }
      });
    });
  }, []);

  useEffect(() => {
    if (setApi) {
      setApi(emblaApi);
    }
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
              className={`${styles.embla__dot} ${
                index === selectedIndex ? styles['embla__dot--selected'] : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
