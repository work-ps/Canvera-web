import { Link } from 'react-router-dom'
import '../../styles/crafted-quality.css'

export default function CraftedQuality() {
  return (
    <section className="section-alt">
      <div className="container">
        <div className="cq-grid">
          <div className="cq-image-col">
            <div className="cq-image-wrapper">
              <img
                src="/images/products/royalty/1.jpg"
                alt="Canvera album craftsmanship"
                className="cq-image"
                loading="lazy"
              />
            </div>
          </div>

          <div className="cq-content-col">
            <div className="section-label">Our Craft</div>
            <h2 className="section-title">Where Technology Meets Artistry</h2>

            <p className="cq-text">
              Every Canvera photobook is a testament to meticulous craftsmanship.
              From selecting premium papers and archival-grade inks to hand-finishing
              each cover, our process ensures your memories are preserved with the
              quality they deserve.
            </p>
            <p className="cq-text">
              With 6-color printing technology and museum-grade materials, we deliver
              products that look stunning for generations. Each album passes through
              over 40 quality checkpoints before it reaches your hands.
            </p>
            <p className="cq-text">
              Our state-of-the-art facility combines precision engineering with
              artisan care, creating photobooks that are as durable as they are
              beautiful.
            </p>

            <Link to="/about" className="link-arrow cq-link">
              Learn About Our Process
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
