import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BentoGallery.css';

/*
  Bento layout — 6 columns, 3 rows, every cell unique:
  Row 1: [Celestial 2c] [Luxury 1c] [Suede 1c ×2rows] [Foiling 2c]
  Row 2: [Leatherette 1c] [Signature 2c]  [Suede ↑]   [Fabric 2c]
  Row 3: [Wood ——————— 3c ———————]  [Custom Cover ——— 3c ———]
*/

const layoutMap = [
  { col: '1 / 3', row: '1 / 2' },        // 0 - Celestial (2 cols)
  { col: '3 / 4', row: '1 / 2' },        // 1 - Luxury (1 col)
  { col: '4 / 5', row: '1 / 3' },        // 2 - Suede (1 col, 2 rows tall)
  { col: '5 / 7', row: '1 / 2' },        // 3 - Foiling (2 cols)
  { col: '1 / 2', row: '2 / 3' },        // 4 - Leatherette (1 col)
  { col: '2 / 4', row: '2 / 3' },        // 5 - Signature (2 cols)
  { col: '5 / 7', row: '2 / 3' },        // 6 - Fabric (2 cols)
  { col: '1 / 4', row: '3 / 4' },        // 7 - Wood (3 cols)
  { col: '4 / 7', row: '3 / 4' },        // 8 - Custom Cover (3 cols)
];

export default function BentoGallery({ collections }) {
  const [lightbox, setLightbox] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const openLightbox = (idx) => {
    setLightboxIdx(idx);
    setLightbox(collections[idx]);
  };

  const closeLightbox = () => setLightbox(null);

  const navigateLightbox = (dir) => {
    const next = (lightboxIdx + dir + collections.length) % collections.length;
    setLightboxIdx(next);
    setLightbox(collections[next]);
  };

  return (
    <>
      <div className="bento">
        {collections.slice(0, 9).map((item, i) => (
          <BentoItem
            key={item.id}
            item={item}
            layout={layoutMap[i]}
            index={i}
            onClick={() => openLightbox(i)}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="bento-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeLightbox();
              if (e.key === 'ArrowRight') navigateLightbox(1);
              if (e.key === 'ArrowLeft') navigateLightbox(-1);
            }}
            tabIndex={0}
            role="dialog"
            ref={(el) => el && el.focus()}
          >
            <motion.div
              className="bento-lightbox__content"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.image.replace('w=500&h=600', 'w=1200&h=900')}
                alt={lightbox.name}
                className="bento-lightbox__image"
              />
              <div className="bento-lightbox__info">
                <h3>{lightbox.name}</h3>
                <p>{lightbox.description}</p>
              </div>
              <button className="bento-lightbox__close" onClick={closeLightbox} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
              <button className="bento-lightbox__nav bento-lightbox__nav--prev" onClick={() => navigateLightbox(-1)} aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button className="bento-lightbox__nav bento-lightbox__nav--next" onClick={() => navigateLightbox(1)} aria-label="Next">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BentoItem({ item, layout, index, onClick }) {
  return (
    <div
      className="bento__item bento__fade-in"
      style={{
        gridColumn: layout.col,
        gridRow: layout.row,
        animationDelay: `${index * 0.06}s`,
      }}
      onClick={onClick}
    >
      <div className="bento__image-wrap">
        <img
          src={item.image}
          alt={item.name}
          className="bento__image"
          draggable={false}
        />
        <div className="bento__overlay">
          <span className="bento__label">{item.name}</span>
        </div>
      </div>
    </div>
  );
}
