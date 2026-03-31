import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import './FreeflowGallery.css';

const CARD_WIDTH = 280;
const CARD_HEIGHT = 280;
const GAP = 12;
const COLS = 5;
const ROWS = 4;
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
    if (!mouseInContainer.current || isDragging.current) {
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

  // Build one tile block of cards
  const tiles = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = (row * COLS + col) % items.length;
      tiles.push({ ...items[idx], _col: col, _row: row, _key: `${row}-${col}` });
    }
  }

  // 5x5 tile repetition for infinite seamless wrap
  const tileOffsets = [-2, -1, 0, 1, 2];

  return (
    <div
      className="freeflow"
      ref={containerRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={() => {
        mouseInContainer.current = false;
        if (isDragging.current) handlePointerUp();
      }}
      onMouseEnter={() => { mouseInContainer.current = true; }}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {showHint && (
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
    </div>
  );
}

function FreeflowCard({ item, style }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="freeflow__card"
      style={style}
      animate={{
        scale: hovered ? 1.04 : 1,
        zIndex: hovered ? 10 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <img
        src={item.image}
        alt={item.name}
        className="freeflow__card-img"
        draggable={false}
        loading="eager"
      />
    </motion.div>
  );
}
