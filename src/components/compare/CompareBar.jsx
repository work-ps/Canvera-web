import { useLocation } from 'react-router-dom'
import { useCompare } from '../../context/CompareContext'
import { getProductThumbnail } from '../../data/productImages'
import '../../styles/compare.css'

const MAX_SLOTS = 4

export default function CompareBar() {
  const { pathname } = useLocation()
  const { compareList, removeFromCompare, clearCompare, openDrawer } = useCompare()

  const isProductsRoute = pathname === '/shop' || pathname.startsWith('/shop/') || pathname === '/products' || pathname.startsWith('/products/') || pathname.startsWith('/product/')
  const visible = isProductsRoute && compareList.length > 0

  const emptySlots = MAX_SLOTS - compareList.length

  return (
    <div className={`compare-bar${visible ? ' visible' : ''}`}>
      <div className="compare-bar-inner">
        <div className="compare-bar-items">
          {compareList.map(product => (
            <div className="compare-bar-item" key={product.id}>
              <div className={`compare-bar-item-thumb pc-img-${product.imageVariant}`}>
                {getProductThumbnail(product.slug) ? (
                  <img src={getProductThumbnail(product.slug)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg viewBox="0 0 56 42" fill="none"><rect x="3" y="3" width="50" height="36" rx="4" stroke="currentColor" strokeWidth="1.5"/></svg>
                )}
              </div>
              <span className="compare-bar-item-name">{product.name}</span>
              <button
                className="compare-bar-item-remove"
                onClick={() => removeFromCompare(product.id)}
                aria-label={`Remove ${product.name}`}
              >
                <svg viewBox="0 0 12 12" fill="none">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div className="compare-bar-slot-empty" key={`empty-${i}`}>
              <span>+ Add</span>
            </div>
          ))}
        </div>
        <div className="compare-bar-actions">
          <button
            className="btn btn-primary btn-md"
            disabled={compareList.length < 2}
            onClick={openDrawer}
          >
            Compare ({compareList.length})
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={clearCompare}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}
