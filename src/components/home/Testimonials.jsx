import { useState, useEffect, useCallback } from 'react'
import testimonials from '../../data/testimonials'
import '../../styles/testimonials.css'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = testimonials.length

  const goTo = useCallback((idx) => {
    setCurrent(((idx % total) + total) % total)
  }, [total])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % total)
    }, 5000)
    return () => clearInterval(timer)
  }, [paused, total])

  const t = testimonials[current]

  return (
    <section
      className="section-alt"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container">
        <div className="section-header-center">
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">What People Say</h2>
        </div>

        <div className="tm-carousel">
          <blockquote className="tm-quote display-sm">
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <div className="tm-author">
            <span className="tm-author-name">{t.name}</span>
            <span className="tm-author-role">{t.role}, {t.city}</span>
          </div>

          <div className="tm-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`tm-dot${i === current ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
