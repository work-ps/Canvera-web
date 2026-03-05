import { useState, useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductFilter from './ProductFilter'
import ProductCard from '../home/ProductCard'
import products from '../../data/products'
import '../../styles/products-page.css'
import '../../styles/popular-products.css'

const categoryAliases = {
  'moment-books': 'standard-albums',
  'magazines': 'photobooks',
  'wall-decor': 'canvas-frames',
  'gifting-packages': 'decor-gifts',
  'accessories': 'calendars',
}

const emptyFilters = {
  categories: [],
  materials: [],
  sizes: [],
  orientations: [],
  bindings: [],
  printTypes: [],
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const badgeParam = searchParams.get('badge')

  const [filters, setFilters] = useState(() => {
    const init = { ...emptyFilters }
    if (categoryParam) {
      const resolved = categoryAliases[categoryParam] || categoryParam
      const match = products.find(p =>
        p.category.toLowerCase().replace(/[& ]+/g, '-') === resolved
      )
      if (match) init.categories = [match.category]
    }
    return init
  })

  const [sortBy, setSortBy] = useState('popular')

  const handleToggle = useCallback((dimension, value) => {
    if (dimension === 'clear-all') {
      setFilters({ ...emptyFilters })
      return
    }
    setFilters(prev => ({
      ...prev,
      [dimension]: prev[dimension].includes(value)
        ? prev[dimension].filter(v => v !== value)
        : [...prev[dimension], value],
    }))
  }, [])

  const filtered = useMemo(() => {
    let result = [...products]

    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category))
    }
    if (filters.materials.length > 0) {
      result = result.filter(p => filters.materials.includes(p.material))
    }
    if (filters.sizes.length > 0) {
      result = result.filter(p => p.sizes?.some(s => filters.sizes.includes(s)))
    }
    if (filters.orientations.length > 0) {
      result = result.filter(p => p.orientations?.some(o => filters.orientations.includes(o)))
    }
    if (filters.bindings.length > 0) {
      result = result.filter(p => p.bindings?.some(b => filters.bindings.includes(b)))
    }
    if (filters.printTypes.length > 0) {
      result = result.filter(p => p.printTypes?.some(pt => filters.printTypes.includes(pt)))
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
      default:
        break
    }

    return result
  }, [filters, badgeParam, sortBy])

  const activeCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0)

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
            filters={filters}
            onToggle={handleToggle}
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
                <ProductCard key={product.id} product={product} showCompare listingMode />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="products-empty">
                <p>No products match your filters.</p>
                <button
                  className="products-clear-btn"
                  onClick={() => handleToggle('clear-all')}
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
