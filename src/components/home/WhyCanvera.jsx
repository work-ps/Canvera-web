import '../../styles/why-canvera.css'

const stats = [
  {
    value: '150+',
    title: 'Products',
    desc: 'Premium photobooks, prints, canvases, and more for every occasion.',
  },
  {
    value: '6-Color',
    title: 'Printing',
    desc: 'Advanced hex-color technology for true-to-life reproduction.',
  },
  {
    value: '2,800+',
    title: 'Cities',
    desc: 'Fast delivery with real-time tracking across India.',
  },
  {
    value: '24/7',
    title: 'Support',
    desc: 'Dedicated partner support whenever you need us.',
  },
]

export default function WhyCanvera() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header-center">
          <div className="section-label">Why Canvera</div>
          <h2 className="section-title">Built for Photographers</h2>
        </div>

        <div className="wc-grid">
          {stats.map((item, i) => (
            <div className="wc-card" key={i}>
              <div className="wc-stat display-md text-accent">{item.value}</div>
              <h3 className="wc-title heading-sm">{item.title}</h3>
              <p className="wc-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
