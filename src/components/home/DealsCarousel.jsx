import { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/deals.css'

const deals = [
  {
    tag: 'Limited Time',
    title: 'Premium Album Sale',
    desc: 'Flat 30% off on Acroluxe, Royal Relics & Majestic Marvel albums. Code: PREMIUM30.',
    highlight: '30% OFF',
    accent: 'amber',
    icon: <svg viewBox="0 0 48 48" fill="none"><path d="M24 4l6 12 13 1.9-9.4 9.2L35.8 40 24 34l-11.8 6 2.2-12.9L5 18l13-1.9L24 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  },
  {
    tag: 'New Members',
    title: 'First Order Discount',
    desc: 'Sign up today and enjoy 15% off your first order — Suede Classic, Moment Book & more.',
    highlight: '15% OFF',
    accent: 'leaf',
    icon: <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5"/><path d="M24 14v10l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    tag: 'Dualuxe Bundle',
    title: 'Buy 3 Albums, Get 1 Free',
    desc: 'Order any 3 Dualuxe or Ornato albums and receive a Moment Book free. Wedding season special.',
    highlight: '3+1 FREE',
    accent: 'petrol',
    icon: <svg viewBox="0 0 48 48" fill="none"><rect x="6" y="6" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="1.5"/><path d="M6 30l12-9 8 6 10-8 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="18" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>,
  },
  {
    tag: 'Special Offer',
    title: 'Fab Leather 40+ Sheets',
    desc: 'Book a Premium Fab Leather album with more than 40 sheets and get a special 5% discount.',
    highlight: '5% OFF',
    accent: 'amber',
    icon: <svg viewBox="0 0 48 48" fill="none"><path d="M8 40V16a4 4 0 014-4h24a4 4 0 014 4v24" stroke="currentColor" strokeWidth="1.5"/><path d="M4 40h40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M20 24h8M24 20v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
]

export default function DealsCarousel() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)
  const total = deals.length

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total)
    }, 4500)
  }, [total])

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [resetTimer])

  const goTo = (idx) => {
    setCurrent(idx)
    resetTimer()
  }

  const deal = deals[current]

  return (
    <section className="deals-section">
      <div className="deals-inner">
      <div
        className={`deals-strip deals-strip--${deal.accent}`}
        onMouseEnter={() => clearInterval(timerRef.current)}
        onMouseLeave={resetTimer}
      >
        {/* Decorative bg icon */}
        <div className="deals-strip-bg-icon">{deal.icon}</div>

        <div className="deals-strip-inner">
          {/* Content area */}
          <div className="deals-strip-content">
            <span className="deals-strip-tag">{deal.tag}</span>
            <div className="deals-strip-main">
              <h3 className="deals-strip-title">{deal.title}</h3>
              <span className={`deals-strip-highlight deals-strip-highlight--${deal.accent}`}>{deal.highlight}</span>
            </div>
            <p className="deals-strip-desc">{deal.desc}</p>
          </div>

          {/* Bottom bar inside the strip */}
          <div className="deals-strip-bottom">
            <Link to="/signup" className="deals-join-btn">
              Join Now
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <div className="deals-dots">
              {deals.map((_, i) => (
                <button
                  key={i}
                  className={`deals-dot${i === current ? ' active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to deal ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
