import testimonials from '../../data/testimonials'
import '../../styles/testimonials.css'

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1.3l2 4.1 4.5.7-3.3 3.2.8 4.5L8 11.4l-4 2.4.8-4.5L1.5 6.1l4.5-.7 2-4.1z"/>
    </svg>
  )
}

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-inner">
        <div className="section-label">What People Say</div>
        <h2 className="section-title">Trusted by Thousands</h2>
        <p className="section-subtitle">Hear from photographers and clients who love Canvera</p>

        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div className="testimonial-card" key={t.id}>
              <div className="testimonial-stars">
                {[...Array(t.rating)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className={`testimonial-avatar ${t.type}`}>
                  {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}, {t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
