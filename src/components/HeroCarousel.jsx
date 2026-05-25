import { useState, useEffect, useRef, useCallback } from 'react';
import './HeroCarousel.css';

export default function HeroCarousel({ items }) {
  const [active, setActive]   = useState(0);
  const [prev,   setPrev]     = useState(null);
  const timerRef              = useRef(null);
  const count                 = items.length;

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(i => {
        setPrev(i);
        return (i + 1) % count;
      });
    }, 3800);
  }, [count]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const goTo = (idx) => {
    if (idx === active) return;
    setPrev(active);
    setActive(idx);
    startTimer();
  };

  return (
    <div className="hero-carousel">

      {/* Full-bleed image stack */}
      <div className="hero-carousel__track">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={[
              'hero-carousel__slide',
              i === active ? 'is-active'   : '',
              i === prev   ? 'is-leaving'  : '',
            ].join(' ')}
          >
            <img
              src={item.image}
              alt={item.name}
              className="hero-carousel__image"
              draggable={false}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchpriority={i === 0 ? 'high' : undefined}
            />
          </div>
        ))}
      </div>

      {/* Dot navigation */}
      <div className="hero-carousel__dots" role="tablist" aria-label="Carousel navigation">
        {items.map((item, i) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={i === active}
            aria-label={`View ${item.name}`}
            className={`hero-carousel__dot${i === active ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

    </div>
  );
}
