import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CollectionCard.css';

export default function CollectionCard({ collection, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      className="collection-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0, 0, 0.2, 1] }}
      whileHover={{ y: -2 }}
    >
      <Link to={`/collections/${collection.slug}`} className="collection-card__link">
        <div className="collection-card__image-container">
          <img
            src={collection.image}
            alt={collection.name}
            className={`collection-card__image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          <div className="collection-card__overlay">
            <h3 className="collection-card__name">{collection.name}</h3>
            <span className="collection-card__count">{collection.count} products</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
