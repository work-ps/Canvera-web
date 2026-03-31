import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './StackingSlider.css';

const CARD_WIDTH = 240;
const CARD_GAP = 14;
const STACK_PEEK = 6;

export default function StackingSlider({ items, endMessage }) {
  const [stackCount, setStackCount] = useState(1);
  const directionRef = useRef(1); // 1 = forward (stacking), -1 = backward (unstacking)

  const allStacked = stackCount >= items.length;
  const isAtStart = stackCount <= 1;

  const goNext = () => {
    if (stackCount < items.length) {
      directionRef.current = 1;
      setStackCount((s) => s + 1);
    }
  };
  const goPrev = () => {
    if (stackCount > 1) {
      directionRef.current = -1;
      setStackCount((s) => s - 1);
    }
  };

  const stackRightEdge = stackCount > 0
    ? CARD_WIDTH + Math.min(stackCount - 1, 5) * STACK_PEEK
    : 0;
  const visibleStartX = stackCount > 0 ? stackRightEdge + CARD_GAP : 0;

  // The card that just transitioned (the boundary card)
  const boundaryIdx = directionRef.current === 1
    ? stackCount - 1   // just got stacked (forward)
    : stackCount;       // just got unstacked (backward)

  return (
    <div className="stacking-slider">
      <div className="stacking-slider__viewport">
        <div className="stacking-slider__track">
          {items.map((item, i) => {
            const isStacked = i < stackCount;
            const visibleIdx = i - stackCount;

            let x, zIndex;

            if (isStacked) {
              x = Math.min(i, 5) * STACK_PEEK;
              zIndex = 100 + i;
            } else {
              x = visibleStartX + visibleIdx * (CARD_WIDTH + CARD_GAP);
              zIndex = 50 - visibleIdx;
            }

            // The card that is actively transitioning gets boosted z-index
            // so it visually slides ON TOP of everything during the animation
            if (i === boundaryIdx) {
              zIndex = 200;
            }

            return (
              <motion.div
                key={item.id}
                className={`stacking-slider__card ${isStacked ? 'stacking-slider__card--stacked' : ''}`}
                animate={{ x, zIndex }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ width: CARD_WIDTH }}
              >
                <div className="stacking-slider__card-image">
                  <img src={item.image} alt={item.name} draggable={false} />
                  <span className="stacking-slider__card-label">{item.name}</span>
                </div>
              </motion.div>
            );
          })}

          <AnimatePresence>
            {allStacked && endMessage && (
              <motion.div
                className="stacking-slider__end-message"
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.05 },
                }}
                style={{ left: stackRightEdge + CARD_GAP * 2 }}
              >
                <p className="stacking-slider__end-text">{endMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="stacking-slider__nav">
        <button
          className={`stacking-slider__arrow ${isAtStart ? 'stacking-slider__arrow--disabled' : ''}`}
          onClick={goPrev}
          disabled={isAtStart}
          aria-label="Previous"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          className={`stacking-slider__arrow ${allStacked ? 'stacking-slider__arrow--disabled' : ''}`}
          onClick={goNext}
          disabled={allStacked}
          aria-label="Next"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
