import '../../styles/banner.css'

const benefits = [
  {
    icon: <svg viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M16 24l4 4 12-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'Free Design Service',
    desc: 'Upload your photos, our expert designers create your album at no extra cost',
  },
  {
    icon: <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2"/><path d="M24 14v10l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: '10% Off First Order',
    desc: 'New photographers get an exclusive 10% discount on their first album order',
  },
  {
    icon: <svg viewBox="0 0 48 48" fill="none"><path d="M8 32h10l4-20h16l2 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="16" cy="38" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="34" cy="38" r="3" stroke="currentColor" strokeWidth="2"/></svg>,
    title: 'Fast Delivery',
    desc: '5-7 day turnaround with real-time tracking across 500+ cities in India',
  },
  {
    icon: <svg viewBox="0 0 48 48" fill="none"><path d="M12 36V16a4 4 0 014-4h16a4 4 0 014 4v20" stroke="currentColor" strokeWidth="2"/><path d="M8 36h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M20 24h8M24 20v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    title: 'Free Shipping',
    desc: 'Complimentary shipping on all orders — no minimum order value required',
  },
]

export default function OffersBanner() {
  return (
    <section className="offers-banner">
      <div className="banner-inner">
        <div className="banner-grid">
          {benefits.map((item, i) => (
            <div className="banner-item" key={i}>
              <div className="banner-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
