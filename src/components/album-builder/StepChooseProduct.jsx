import { useState, useMemo } from 'react'
import products from '../../data/products'
import { productSvgs } from '../home/ProductCard'

const albumCategories = ['Photobooks', 'Momentbooks', 'Magazines']

export default function StepChooseProduct({ selectedId, onSelect }) {
  const [activeCategory, setActiveCategory] = useState(albumCategories[0])

  const filtered = useMemo(
    () => products.filter(p => p.category === activeCategory),
    [activeCategory]
  )

  return (
    <div>
      <h2 className="ab-step-title">Choose Your Product</h2>
      <p className="ab-step-subtitle">Select the album or photobook you'd like to create</p>

      <div className="ab-category-tabs">
        {albumCategories.map(cat => (
          <button
            key={cat}
            className={`ab-cat-tab${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="ab-product-grid">
        {filtered.map(product => {
          const svg = productSvgs[product.imageVariant] || productSvgs.petrol
          return (
            <div
              key={product.id}
              className={`ab-product-card${selectedId === product.id ? ' selected' : ''}`}
              onClick={() => onSelect(product.id)}
            >
              <div className="ab-product-card-check">
                <svg viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={`ab-product-card-img pc-img-${product.imageVariant}`}>
                {svg}
              </div>
              <div className="ab-product-card-body">
                <div className="ab-product-card-tag">{product.tag}</div>
                <div className="ab-product-card-name">{product.name}</div>
                <div className="ab-product-card-specs">{product.specs}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
