import { Link } from 'react-router-dom'
import '../styles/pages.css'

export default function FAQPage() {
  return (
    <section className="placeholder-page">
      <h1>Frequently Asked Questions</h1>
      <p>FAQ section — Coming Soon</p>
      <Link to="/contact" className="placeholder-link">Contact Us for Help</Link>
    </section>
  )
}
