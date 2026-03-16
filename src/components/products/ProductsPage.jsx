import { useState, useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductFilter from './ProductFilter'
import ProductCard from '../home/ProductCard'
import products from '../../data/products'
import collections from '../../data/collections'
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
  collections: [],
  sizes: [],
  orientations: [],
  bindings: [],
}

const dimensionLabels = {
  categories: 'Category',
  collections: 'Collection',
  sizes: 'Size',
  orientations: 'Orientation',
  bindings: 'Binding',
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

  const [sortBy, setSortBy] = useState('relevance')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

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
    if (filters.collections.length > 0) {
      const matchingProductNames = new Set()
      filters.collections.forEach(colName => {
        const col = collections.find(c => c.name === colName)
        if (col) col.productNames.forEach(n => matchingProductNames.add(n))
      })
      result = result.filter(p => matchingProductNames.has(p.name))
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
    if (badgeParam) {
      result = result.filter(p => p.badge === badgeParam)
    }

    switch (sortBy) {
      case 'price-low':
      case 'price-high':
        break
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
      case 'best-selling':
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'better-deal':
        result.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
        break
      default:
        break
    }

    return result
  }, [filters, badgeParam, sortBy])

  const activeChips = useMemo(() => {
    const chips = []
    Object.entries(filters).forEach(([dim, values]) => {
      values.forEach(val => {
        chips.push({ dimension: dim, value: val })
      })
    })
    return chips
  }, [filters])

  return (
    <div className="products-page">
      <div className="products-page-inner">
        {/* Top bar: breadcrumb left, count + sort right */}
        <div className="shop-toolbar">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Products</span>
          </div>
          <div className="shop-toolbar-right">
            <span className="shop-product-count">{filtered.length} products</span>
            <select
              className="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="best-selling">Best Selling</option>
              <option value="better-deal">Better Deal</option>
            </select>
            <button
              className="shop-mobile-filter-btn"
              onClick={() => setMobileFilterOpen(true)}
            >
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="shop-active-chips">
            {activeChips.map(chip => (
              <button
                key={`${chip.dimension}-${chip.value}`}
                className="shop-chip"
                onClick={() => handleToggle(chip.dimension, chip.value)}
              >
                {chip.value}
                <span className="shop-chip-x">&times;</span>
              </button>
            ))}
            <button className="shop-clear-all" onClick={() => handleToggle('clear-all')}>
              Clear all
            </button>
          </div>
        )}

        <div className="products-layout">
          <ProductFilter
            filters={filters}
            onToggle={handleToggle}
          />

          <div>
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

        {/* Mobile filter drawer */}
        {mobileFilterOpen && (
          <div className="shop-mobile-overlay" onClick={() => setMobileFilterOpen(false)}>
            <div className="shop-mobile-drawer" onClick={e => e.stopPropagation()}>
              <div className="shop-mobile-drawer-header">
                <span>Filters</span>
                <button onClick={() => setMobileFilterOpen(false)}>&times;</button>
              </div>
              <ProductFilter filters={filters} onToggle={handleToggle} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
