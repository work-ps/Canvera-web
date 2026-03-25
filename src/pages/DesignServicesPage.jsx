import { Link } from 'react-router-dom'
import '../styles/pages.css'

export default function DesignServicesPage() {
  return (
    <section className="placeholder-page">
      <h1>Design Services</h1>
      <p>Professional design assistance — Coming Soon</p>
      <Link to="/shop" className="placeholder-link">Browse Products</Link>
    </section>
  )
}
