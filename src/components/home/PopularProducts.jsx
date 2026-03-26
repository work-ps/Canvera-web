import { Link } from 'react-router-dom'
import products from '../../data/products'
import { getProductThumbnail } from '../../data/productImages'
import '../../styles/popular-products.css'

const badgeLabels = {
  bestseller: 'Bestseller',
  new: 'New',
  popular: 'Popular',
}

/* Pick the first 8 products that have real photos, prioritising those with badges */
const featured = (() => {
  const withBadge = products.filter(p => p.badge && getProductThumbnail(p.slug))
  const withoutBadge = products.filter(p => !p.badge && getProductThumbnail(p.slug))
  return [...withBadge, ...withoutBadge].slice(0, 8)
})()

export default function PopularProducts() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <div className="section-label">Best Sellers</div>
            <h2 className="section-title">Most Loved by Photographers</h2>
          </div>
          <Link to="/shop" className="link-arrow">
            View All Products
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className="pp-grid">
          {featured.map((product) => {
            const thumbnail = getProductThumbnail(product.slug)
            const badge = product.badge ? badgeLabels[product.badge] : null
            return (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="pp-card"
              >
                <div className="pp-card-image">
                  {badge && <span className="badge badge-glass pp-badge">{badge}</span>}
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={product.name}
                      className="pp-card-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="pp-card-placeholder" />
                  )}
                </div>
                <div className="pp-card-body">
                  <span className="pp-card-collection">{product.tag}</span>
                  <h3 className="pp-card-name">{product.name}</h3>
                  <span className="pp-card-price">From &#x20B9;{(product.id * 1200 + 2999).toLocaleString('en-IN')}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="pp-view-all-mobile">
          <Link to="/shop" className="link-arrow">
            View All Products
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
