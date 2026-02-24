import { Link } from 'react-router-dom'
import categories from '../../data/categories'
import '../../styles/categories.css'

export default function Categories() {
  return (
    <section className="categories-section">
      <div className="categories-inner">
        <div className="section-label">Browse By Category</div>
        <h2 className="section-title">Shop By Category</h2>
        <p className="section-subtitle">Find the perfect product for every occasion</p>

        <div className="categories-grid">
          {categories.map(cat => (
            <Link
              to={`/products?category=${cat.slug}`}
              className="category-card"
              key={cat.id}
            >
              <div
                className="category-card-bg"
                style={{ background: `linear-gradient(135deg, ${cat.colorFrom} 0%, ${cat.colorTo} 100%)` }}
              />
              <div className="category-card-content">
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </div>
              <span className="category-card-count">{cat.productCount} Products</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
