import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import './HeroCarousel.css';

function useResponsiveRadius() {
  const [radius, setRadius] = useState(440);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 767) setRadius(280);
      else if (w <= 1023) setRadius(360);
      else setRadius(440);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return radius;
}

export default function HeroCarousel({ items }) {
  const count = items.length;
  const anglePerItem = 360 / count;
  const radius = useResponsiveRadius();

  // Motion value for smooth continuous rotation
  const rawRotation = useMotionValue(0);
  const rotation = useSpring(rawRotation, {
    stiffness: 80,
    damping: 20,
    mass: 0.5,
  });

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);
  const velocityRef = useRef(0);
  const lastMoveX = useRef(0);
  const lastMoveTime = useRef(0);

  // Auto-rotate with smooth animation
  const startAutoPlay = useCallback(() => {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isDragging.current) {
        rawRotation.set(rawRotation.get() - anglePerItem);
      }
    }, 3500);
  }, [anglePerItem, rawRotation]);

  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(autoPlayRef.current);
  }, [startAutoPlay]);

  // Drag interaction
  const handlePointerDown = (e) => {
    isDragging.current = true;
    clearInterval(autoPlayRef.current);
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragStartX.current = clientX;
    dragStartRotation.current = rawRotation.get();
    lastMoveX.current = clientX;
    lastMoveTime.current = Date.now();
    velocityRef.current = 0;

    // Temporarily make spring snappy during drag
    rotation.set(rawRotation.get());
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const diff = clientX - dragStartX.current;

    // Track velocity for momentum
    const now = Date.now();
    const dt = now - lastMoveTime.current;
    if (dt > 0) {
      velocityRef.current = (clientX - lastMoveX.current) / dt;
    }
    lastMoveX.current = clientX;
    lastMoveTime.current = now;

    // Directly set rotation for responsive drag
    rawRotation.set(dragStartRotation.current + diff * 0.35);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // Apply momentum
    const velocity = velocityRef.current;
    const momentum = velocity * 150;
    const currentRotation = rawRotation.get() + momentum;

    // Snap to nearest item
    const snapped = Math.round(currentRotation / anglePerItem) * anglePerItem;
    rawRotation.set(snapped);

    startAutoPlay();
  };

  // Scroll interaction — rotate on mouse wheel over carousel
  const handleWheel = (e) => {
    e.preventDefault();
    clearInterval(autoPlayRef.current);
    const delta = e.deltaY || e.deltaX;
    rawRotation.set(rawRotation.get() - delta * 0.15);

    // Debounced snap after scroll stops
    clearTimeout(handleWheel._snapTimer);
    handleWheel._snapTimer = setTimeout(() => {
      const current = rawRotation.get();
      const snapped = Math.round(current / anglePerItem) * anglePerItem;
      rawRotation.set(snapped);
      startAutoPlay();
    }, 300);
  };

  // Attach wheel listener with passive:false for preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => handleWheel(e);
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  });

  return (
    <div className="hero-carousel" ref={containerRef}>
      <div className="hero-carousel__scene">
        <motion.div
          className="hero-carousel__orbit"
          style={{ rotateY: rotation }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={() => isDragging.current && handlePointerUp()}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {items.map((item, index) => {
            const itemAngle = index * anglePerItem;
            return (
              <div
                key={item.id}
                className="hero-carousel__item"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                }}
              >
                <div className="hero-carousel__image-wrapper">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="hero-carousel__image"
                    draggable={false}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchpriority={index === 0 ? 'high' : 'low'}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
