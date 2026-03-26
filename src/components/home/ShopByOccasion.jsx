import { Link } from 'react-router-dom'
import occasions from '../../data/occasions'
import products from '../../data/products'
import { getProductThumbnail } from '../../data/productImages'
import '../../styles/categories.css'

/* Build occasion circles — use an image from the first product that has one */
function getOccasionImage(occasion) {
  for (const pid of occasion.productIds) {
    const product = products.find(p => p.id === pid)
    if (product) {
      const img = getProductThumbnail(product.slug)
      if (img) return img
    }
  }
  return null
}

/* Gradient fallback colors for occasions */
const occasionGradients = [
  'linear-gradient(135deg, #005780, #2a9d8f)',
  'linear-gradient(135deg, #2a9d8f, #55C4B7)',
  'linear-gradient(135deg, #B07D1A, #D4A840)',
  'linear-gradient(135deg, #5E3F8A, #8B6DB5)',
  'linear-gradient(135deg, #D93025, #E8645A)',
  'linear-gradient(135deg, #1a2a3a, #415264)',
  'linear-gradient(135deg, #228477, #3DB3A4)',
]

export default function ShopByOccasion() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header-center">
          <div className="section-label">Occasions</div>
          <h2 className="section-title">Find Your Perfect Album</h2>
        </div>

        <div className="occ-row">
          {occasions.map((occasion, i) => {
            const img = getOccasionImage(occasion)
            return (
              <Link
                key={occasion.id}
                to={`/shop?occasion=${occasion.id}`}
                className="occ-item"
              >
                <div className="occ-circle">
                  {img ? (
                    <img src={img} alt={occasion.name} className="occ-img" loading="lazy" />
                  ) : (
                    <div className="occ-placeholder" style={{ background: occasionGradients[i % occasionGradients.length] }} />
                  )}
                </div>
                <span className="occ-name">{occasion.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
