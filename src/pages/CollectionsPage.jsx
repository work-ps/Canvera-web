import { Link } from 'react-router-dom'
import collections from '../data/collections'
import products from '../data/products'
import '../styles/collections.css'

function getProductCount(collection) {
  return products.filter(p =>
    collection.productNames.some(n => n.toLowerCase() === p.name.toLowerCase())
  ).length
}

const collectionSvgs = {
  petrol: <svg viewBox="0 0 120 90" fill="none"><rect x="5" y="5" width="110" height="80" rx="8" stroke="currentColor" strokeWidth="2"/><path d="M5 65l30-22 20 12 25-20 30 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="35" cy="35" r="10" stroke="currentColor" strokeWidth="1.5"/></svg>,
  amber: <svg viewBox="0 0 120 90" fill="none"><rect x="5" y="5" width="110" height="80" rx="8" stroke="currentColor" strokeWidth="2"/><path d="M60 25v40M40 45h40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  warm: <svg viewBox="0 0 120 90" fill="none"><path d="M60 12c-12 0-22 4-22 4v60s10-4 22-4 22 4 22 4V16s-10-4-22-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M60 12v60" stroke="currentColor" strokeWidth="1.5"/></svg>,
  dark: <svg viewBox="0 0 120 90" fill="none"><rect x="5" y="5" width="110" height="80" rx="8" stroke="currentColor" strokeWidth="2"/><path d="M35 30l12 12-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M55 60h30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  neutral: <svg viewBox="0 0 120 90" fill="none"><rect x="10" y="5" width="100" height="80" rx="6" stroke="currentColor" strokeWidth="2"/><rect x="20" y="15" width="80" height="45" rx="4" stroke="currentColor" strokeWidth="1.5"/><path d="M20 45l20-15 12 8 18-14 18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mixed: <svg viewBox="0 0 120 90" fill="none"><rect x="15" y="8" width="90" height="74" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M30 25h60M30 38h45M30 51h52M30 64h35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  leaf: <svg viewBox="0 0 120 90" fill="none"><path d="M60 80V38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M60 38c-24-16-42 0-42 20s28 12 42-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M60 50c16-20 38-8 38 8s-24 16-38 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  deep: <svg viewBox="0 0 120 90" fill="none"><rect x="8" y="10" width="104" height="70" rx="6" stroke="currentColor" strokeWidth="2"/><path d="M8 28h104" stroke="currentColor" strokeWidth="1.5"/><path d="M30 48l16 16 34-30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

export default function CollectionsPage() {
  return (
    <div className="collections-page">
      <div className="collections-inner">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span className="current">Collections</span>
        </div>

        <div className="collections-header">
          <h1>Our Collections</h1>
          <p>Explore our curated ranges — each crafted around a distinct material, style, and finish.</p>
        </div>

        <div className="collections-grid">
          {collections.map(col => {
            const count = getProductCount(col)
            return (
              <Link to={`/collections/${col.slug}`} className="collection-grid-card" key={col.id}>
                <div className={`collection-grid-image cc-img-${col.imageVariant}`}>
                  {collectionSvgs[col.imageVariant] || collectionSvgs.petrol}
                </div>
                <div className="collection-grid-body">
                  <h3>{col.name}</h3>
                  <p>{col.description}</p>
                  <span className="collection-grid-meta">
                    {count > 0 ? `${count} product${count !== 1 ? 's' : ''}` : 'Coming soon'}
                    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
