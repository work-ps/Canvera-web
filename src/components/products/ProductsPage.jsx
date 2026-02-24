import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductFilter from './ProductFilter'
import ProductCard from '../home/ProductCard'
import products from '../../data/products'
import '../../styles/products-page.css'
import '../../styles/popular-products.css'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const badgeParam = searchParams.get('badge')

  const [selectedCategories, setSelectedCategories] = useState(() => {
    if (categoryParam) {
      const match = products.find(p =>
        p.category.toLowerCase().replace(/[& ]+/g, '-') === categoryParam
      )
      return match ? [match.category] : []
    }
    return []
  })

  const [sortBy, setSortBy] = useState('popular')

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const filtered = useMemo(() => {
    let result = [...products]

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category))
    }

    if (badgeParam) {
      result = result.filter(p => p.badge === badgeParam)
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default: // popular - keep original order
        break
    }

    return result
  }, [selectedCategories, badgeParam, sortBy])

  return (
    <div className="products-page">
      <div className="products-page-inner">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span className="current">Products</span>
        </div>

        <div className="products-layout">
          <ProductFilter
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
          />

          <div>
            <div className="products-header">
              <h1>
                All Products
                <span className="products-count">({filtered.length})</span>
              </h1>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Sort: Popular</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="reviews">Sort: Most Reviews</option>
                <option value="name">Sort: Name A-Z</option>
              </select>
            </div>

            <div className="products-grid-list">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--neutral-400)' }}>
                <p style={{ fontSize: 16, marginBottom: 8 }}>No products match your filters.</p>
                <button
                  className="btn btn-outline btn-md"
                  onClick={() => setSelectedCategories([])}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
