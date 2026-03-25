import { Link } from 'react-router-dom'
import '../styles/pages.css'

export default function TrackOrderPage() {
  return (
    <section className="placeholder-page">
      <h1>Track Your Order</h1>
      <p>Order tracking — Coming Soon</p>
      <Link to="/contact" className="placeholder-link">Contact Support</Link>
    </section>
  )
}
