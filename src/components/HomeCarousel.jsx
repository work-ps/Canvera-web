import { useState, useRef, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import './HomeCarousel.css';

function ArrowBtn({ dir, onClick, hidden }) {
  return (
    <button
      className={`hcarousel__arrow hcarousel__arrow--${dir}${hidden ? ' hcarousel__arrow--hidden' : ''}`}
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Scroll left' : 'Scroll right'}
    >
      {dir === 'prev' ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      )}
    </button>
  );
}

export default function HomeCarousel({ tabs, getProducts }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [atStart,   setAtStart]   = useState(true);
  const [atEnd,     setAtEnd]     = useState(false);
  const trackRef = useRef(null);

  const visibleProducts = getProducts(tabs[activeIdx]);

  /* ── Sync arrow visibility with scroll position ── */
  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 4);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener('scroll', syncArrows, { passive: true });
    return () => el.removeEventListener('scroll', syncArrows);
  }, [syncArrows, activeIdx]);

  const scrollTrack = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 480, behavior: 'smooth' });
  };

  const handleTabClick = (i) => {
    setActiveIdx(i);
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  };

  return (
    <div className="hcarousel">

      {/* ── Chip tabs only — arrows moved to frame sides ── */}
      <div className="hcarousel__header">
        <div className="hcarousel__chips">
          {tabs.map((tab, i) => (
            <button
              key={tab.name}
              className={`hcarousel__chip${activeIdx === i ? ' hcarousel__chip--active' : ''}`}
              onClick={() => handleTabClick(i)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Frame: track + side arrow buttons ── */}
      <div className="hcarousel__frame">
        <ArrowBtn dir="prev" onClick={() => scrollTrack(-1)} hidden={atStart} />

        <div className="hcarousel__track-wrap">
          <div className="hcarousel__track" ref={trackRef} key={activeIdx}>
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product, i) => (
                <div key={product.id} className="hcarousel__item">
                  <ProductCard product={product} index={i} />
                </div>
              ))
            ) : (
              <p className="hcarousel__empty">No products in this category yet.</p>
            )}
          </div>
        </div>

        <ArrowBtn dir="next" onClick={() => scrollTrack(1)} hidden={atEnd} />
      </div>

    </div>
  );
}
