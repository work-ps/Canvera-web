import { useSearchParams, Link } from 'react-router-dom'
import '../styles/pages.css'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  return (
    <section className="search-results-page">
      <h1>Search Results{query ? ` for "${query}"` : ''}</h1>
      <p>Search results — Coming Soon</p>
      <Link to="/shop" className="placeholder-link">Browse All Products</Link>
    </section>
  )
}
