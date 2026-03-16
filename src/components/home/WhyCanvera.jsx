import '../../styles/why-canvera.css'

const reasons = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: 'Premium Materials',
    desc: 'Archival-grade papers, Italian leathers, and museum-quality inks for products that last generations.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15l-2 5l9-13h-5l2-5l-9 13h5z"/>
      </svg>
    ),
    title: 'Handcrafted Quality',
    desc: 'Every product passes through a rigorous multi-point quality check before shipping.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Free Shipping & Fast Delivery',
    desc: 'Complimentary shipping across 500+ cities with 5-7 day turnaround and real-time tracking.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    title: 'Dedicated Support',
    desc: 'Expert support team that understands the photography business inside out.',
  },
]

export default function WhyCanvera() {
  return (
    <section className="why-section">
      <div className="why-inner">
        <h2 className="why-title">Why Photographers Choose Canvera</h2>

        <div className="why-grid">
          {reasons.map((item, i) => (
            <div className="why-card" key={i}>
              <div className="why-card-icon">{item.icon}</div>
              <h3 className="why-card-name">{item.title}</h3>
              <p className="why-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
