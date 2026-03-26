import { useState, useMemo, useRef, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import products from '../data/products'
import collections from '../data/collections'
import '../styles/pages.css'

const pageLinks = [
  { name: 'About Canvera', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Track Order', path: '/track' },
  { name: 'Check Genuineness', path: '/genuine' },
  { name: 'Design Services', path: '/design-services' },
  { name: 'Product Finder', path: '/find' },
]

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  // Sync URL param when query changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        setSearchParams({ q: query.trim() })
      } else {
        setSearchParams({})
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [query, setSearchParams])

  const q = query.toLowerCase().trim()

  const matchedProducts = useMemo(() => {
    if (!q) return []
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tag?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [q])

  const matchedCollections = useMemo(() => {
    if (!q) return []
    return collections.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.fullName?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    )
  }, [q])

  const matchedPages = useMemo(() => {
    if (!q) return []
    return pageLinks.filter((p) => p.name.toLowerCase().includes(q))
  }, [q])

  const hasResults = matchedProducts.length > 0 || matchedCollections.length > 0 || matchedPages.length > 0

  return (
    <div className="search-page">
      <div className="container">
        {/* Search input */}
        <div className="search-input-wrap">
          <svg className="search-input-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className="search-input-field"
            type="text"
            placeholder="Search products, collections, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-input-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <svg viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>

        {q && !hasResults && (
          <div className="search-empty">
            <h2 className="display-sm">No results for "{query}"</h2>
            <p>Try different keywords or browse our products.</p>
            <div className="search-empty-suggestions">
              <span className="search-suggestion-label">Suggestions:</span>
              {['Photobook', 'Leather', 'Wedding', 'Calendar'].map((s) => (
                <button key={s} className="search-suggestion" onClick={() => setQuery(s)}>{s}</button>
              ))}
            </div>
            <Link to="/shop" className="btn btn-primary">
              Browse Products
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        )}

        {!q && (
          <div className="search-empty">
            <h2 className="display-sm">Start Typing to Search</h2>
            <p>Search across products, collections, and pages.</p>
          </div>
        )}

        {/* Products */}
        {matchedProducts.length > 0 && (
          <div className="search-section">
            <h2 className="heading-xl">Products</h2>
            <div className="search-products-grid">
              {matchedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="search-product-card">
                  <div className="search-product-thumb">
                    <span className="search-product-cat">{p.tag}</span>
                  </div>
                  <div className="search-product-body">
                    <span className="search-product-name">{p.name}</span>
                    <span className="search-product-specs">{p.specs}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Collections */}
        {matchedCollections.length > 0 && (
          <div className="search-section">
            <h2 className="heading-xl">Collections</h2>
            <div className="search-links-list">
              {matchedCollections.map((c) => (
                <Link key={c.id} to={`/collections/${c.slug}`} className="search-link-item">
                  <span className="search-link-name">{c.fullName}</span>
                  <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pages */}
        {matchedPages.length > 0 && (
          <div className="search-section">
            <h2 className="heading-xl">Pages</h2>
            <div className="search-links-list">
              {matchedPages.map((p) => (
                <Link key={p.path} to={p.path} className="search-link-item">
                  <span className="search-link-name">{p.name}</span>
                  <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
