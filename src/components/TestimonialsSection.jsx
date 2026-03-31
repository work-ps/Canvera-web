import ScrollReveal from './ScrollReveal';
import { testimonials } from '../data/products';

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--warning)" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

export default function TestimonialsSection() {
  return (
    <div className="section-wrapper">
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">Testimonials</h2>
          <span className="section-link" style={{ cursor: 'default' }}>
            Trusted by photographers nationwide
          </span>
        </div>
      </ScrollReveal>
      <div className="section-content section-content--flush">
        <div className="testimonials-track">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-card__stars">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="testimonial-card__text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-card__author">
                <img src={t.avatar} alt={t.name} className="testimonial-card__avatar" loading="lazy" />
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__role">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
