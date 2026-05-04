import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import './FreeflowGallery.css';

const CARD_WIDTH = 280;
const CARD_HEIGHT = 280;
const GAP = 12;
const COLS = 5;
const ROWS = 8; // 5×8 = 40 tiles ≥ 39 products — every product gets a slot

// Tile repeat range: 3×3 blocks = 9 copies of the 40-tile grid = 360 DOM images.
// Enough to fill any viewport with generous overflow; browser lazy-loads the rest.
const FRICTION = 0.92;
const EDGE_ZONE = 80;
const EDGE_SPEED = 4;

export default function FreeflowGallery({ items }) {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const animFrame = useRef(null);
  const edgeScrollFrame = useRef(null);
  const mouseInContainer = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(true);
  const expandedRef = useRef(false);

  const totalW = COLS * (CARD_WIDTH + GAP);
  const totalH = ROWS * (CARD_HEIGHT + GAP);

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  // Center the grid initially
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      offsetX.set(-(totalW - el.clientWidth) / 2);
      offsetY.set(-(totalH - el.clientHeight) / 2);
    }
  }, [totalW, totalH, offsetX, offsetY]);

  // Silent wrap — when offset drifts a full tile away from center,
  // snap it back by exactly one tile. Since tiles repeat, no visual change.
  const wrapOffset = useCallback(() => {
    const cx = offsetX.get();
    const cy = offsetY.get();
    let wrapped = false;
    if (cx > 0) { offsetX.set(cx - totalW); wrapped = true; }
    else if (cx < -totalW) { offsetX.set(cx + totalW); wrapped = true; }
    if (cy > 0) { offsetY.set(cy - totalH); wrapped = true; }
    else if (cy < -totalH) { offsetY.set(cy + totalH); wrapped = true; }
    // Also adjust drag start if wrapping mid-drag
    if (wrapped && isDragging.current) {
      dragStartOffset.current = { x: offsetX.get(), y: offsetY.get() };
      const clientX = lastPointer.current.x;
      const clientY = lastPointer.current.y;
      dragStartPos.current = { x: clientX, y: clientY };
    }
  }, [offsetX, offsetY, totalW, totalH]);

  // Momentum — completely free, wraps silently
  const momentumLoop = useCallback(() => {
    if (isDragging.current) return;
    velocity.current.x *= FRICTION;
    velocity.current.y *= FRICTION;
    if (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1) {
      offsetX.set(offsetX.get() + velocity.current.x);
      offsetY.set(offsetY.get() + velocity.current.y);
      wrapOffset();
      animFrame.current = requestAnimationFrame(momentumLoop);
    }
  }, [offsetX, offsetY, wrapOffset]);

  // Edge auto-scroll — no bounds
  const edgeScrollLoop = useCallback(() => {
    if (!mouseInContainer.current || isDragging.current || expandedRef.current) {
      edgeScrollFrame.current = requestAnimationFrame(edgeScrollLoop);
      return;
    }
    const container = containerRef.current;
    if (!container) {
      edgeScrollFrame.current = requestAnimationFrame(edgeScrollLoop);
      return;
    }
    const rect = container.getBoundingClientRect();
    const mx = mousePos.current.x - rect.left;
    const my = mousePos.current.y - rect.top;
    const cw = rect.width;
    const ch = rect.height;
    let dx = 0, dy = 0;
    if (mx < EDGE_ZONE) dx = EDGE_SPEED * (1 - mx / EDGE_ZONE);
    else if (mx > cw - EDGE_ZONE) dx = -EDGE_SPEED * (1 - (cw - mx) / EDGE_ZONE);
    if (my < EDGE_ZONE) dy = EDGE_SPEED * (1 - my / EDGE_ZONE);
    else if (my > ch - EDGE_ZONE) dy = -EDGE_SPEED * (1 - (ch - my) / EDGE_ZONE);
    if (dx !== 0 || dy !== 0) {
      offsetX.set(offsetX.get() + dx);
      offsetY.set(offsetY.get() + dy);
      wrapOffset();
    }
    edgeScrollFrame.current = requestAnimationFrame(edgeScrollLoop);
  }, [offsetX, offsetY, wrapOffset]);

  useEffect(() => {
    edgeScrollFrame.current = requestAnimationFrame(edgeScrollLoop);
    return () => {
      cancelAnimationFrame(edgeScrollFrame.current);
      cancelAnimationFrame(animFrame.current);
    };
  }, [edgeScrollLoop]);

  const hideHint = () => { if (showHint) setShowHint(false); };

  const handlePointerDown = (e) => {
    isDragging.current = true;
    cancelAnimationFrame(animFrame.current);
    velocity.current = { x: 0, y: 0 };
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    dragStartPos.current = { x: clientX, y: clientY };
    dragStartOffset.current = { x: offsetX.get(), y: offsetY.get() };
    lastPointer.current = { x: clientX, y: clientY };
    lastTime.current = Date.now();
    hideHint();
  };

  const handlePointerMove = (e) => {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    mousePos.current = { x: clientX, y: clientY };
    if (!isDragging.current) return;
    e.preventDefault();
    offsetX.set(dragStartOffset.current.x + (clientX - dragStartPos.current.x));
    offsetY.set(dragStartOffset.current.y + (clientY - dragStartPos.current.y));
    wrapOffset();
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current.x = (clientX - lastPointer.current.x) / Math.max(dt, 8) * 16;
      velocity.current.y = (clientY - lastPointer.current.y) / Math.max(dt, 8) * 16;
    }
    lastPointer.current = { x: clientX, y: clientY };
    lastTime.current = now;
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    animFrame.current = requestAnimationFrame(momentumLoop);
  };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (expandedRef.current) return;
    hideHint();
    offsetX.set(offsetX.get() - e.deltaX * 0.8);
    offsetY.set(offsetY.get() - e.deltaY * 0.8);
    wrapOffset();
  }, [offsetX, offsetY, wrapOffset]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const [expandedItem, setExpandedItem] = useState(null);

  const handleExpand = (item, e) => {
    e.stopPropagation();
    expandedRef.current = true;
    cancelAnimationFrame(animFrame.current);
    velocity.current = { x: 0, y: 0 };
    setExpandedItem(item);
  };

  const handleCollapse = () => {
    expandedRef.current = false;
    setExpandedItem(null);
  };

  // Build one tile block of cards
  const tiles = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = (row * COLS + col) % items.length;
      tiles.push({ ...items[idx], _col: col, _row: row, _key: `${row}-${col}` });
    }
  }

  const tileOffsets = [-1, 0, 1]; // 3×3 = 9 blocks × 40 tiles = 360 imgs (was 1000)

  return (
    <div
      className="freeflow"
      ref={containerRef}
      onMouseDown={!expandedItem ? handlePointerDown : undefined}
      onMouseMove={!expandedItem ? handlePointerMove : undefined}
      onMouseUp={!expandedItem ? handlePointerUp : undefined}
      onMouseLeave={() => {
        mouseInContainer.current = false;
        if (isDragging.current) handlePointerUp();
      }}
      onMouseEnter={() => { mouseInContainer.current = true; }}
      onTouchStart={!expandedItem ? handlePointerDown : undefined}
      onTouchMove={!expandedItem ? handlePointerMove : undefined}
      onTouchEnd={!expandedItem ? handlePointerUp : undefined}
    >
      {showHint && !expandedItem && (
        <div className="freeflow__hint">
          Drag &amp; Scroll to explore &bull; Move cursor to edge to auto-scroll
        </div>
      )}

      <motion.div
        className="freeflow__plane"
        style={{ x: offsetX, y: offsetY }}
      >
        {tileOffsets.map((tileRow) =>
          tileOffsets.map((tileCol) => (
            <div
              key={`tile-${tileRow}-${tileCol}`}
              className="freeflow__tile"
              style={{
                transform: `translate(${tileCol * totalW}px, ${tileRow * totalH}px)`,
              }}
            >
              {tiles.map((item) => (
                <FreeflowCard
                  key={`${tileRow}-${tileCol}-${item._key}`}
                  item={item}
                  onExpand={handleExpand}
                  style={{
                    left: item._col * (CARD_WIDTH + GAP),
                    top: item._row * (CARD_HEIGHT + GAP),
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                  }}
                />
              ))}
            </div>
          ))
        )}
      </motion.div>

      {/* Expanded overlay — dark glass, within section */}
      <AnimatePresence>
        {expandedItem && (
          <motion.div
            className="freeflow__expand-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
          >
            <motion.div
              className="freeflow__expand-image"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }}
              exit={{ scale: 0.9, opacity: 0, transition: { duration: 0 } }}
            >
              <img src={expandedItem.expandedImage || expandedItem.image} alt={expandedItem.name} />
            </motion.div>
            <motion.div
              className="freeflow__expand-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 } }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0 } }}
            >
              <span className="freeflow__expand-collection">
                {expandedItem.collection || expandedItem.category}
              </span>
              <h3 className="freeflow__expand-name">{expandedItem.name}</h3>
              <p className="freeflow__expand-desc">{expandedItem.description || expandedItem.specs}</p>
              {expandedItem.occasions && (
                <div className="freeflow__expand-occasions">
                  {expandedItem.occasions.map((o) => (
                    <span key={o} className="freeflow__expand-tag">{o}</span>
                  ))}
                </div>
              )}
              <Link
                to={`/products/${expandedItem.slug}`}
                className="freeflow__expand-cta"
                onClick={(e) => e.stopPropagation()}
              >
                Explore Product
              </Link>
            </motion.div>
            <button
              className="freeflow__expand-close"
              onClick={handleCollapse}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FreeflowCard({ item, style, onExpand }) {
  return (
    <div
      className="freeflow__card"
      style={style}
    >
      <img
        src={item.tileImage || item.image}
        alt={item.name}
        className="freeflow__card-img"
        draggable={false}
        loading="lazy"
      />
      <button
        className="freeflow__card-enlarge"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => onExpand(item, e)}
        aria-label="Enlarge"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
        </svg>
      </button>
    </div>
  );
}
