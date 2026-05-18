import { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import SEOMeta from '../components/SEOMeta';
import './AboutPage.css';

const STATS = [
  { val: '1.5M+', label: 'Albums in 2025 Alone' },
  { val: '18+ Years', label: 'Of Excellence' },
  { val: '91,000+', label: 'Partner Photographers' },
  { val: '2,800+', label: 'Cities Served' },
];

const MILESTONES = [
  { year: '2007', title: 'Canvera Founded', desc: 'With a vision to help individuals record and preserve their happiest memories, Canvera started its journey — serving professional photographers with hand-crafted albums.' },
  { year: '2010', title: 'First Digital Lab', desc: 'Launched India\'s first fully automated digital photobook production line, reducing turnaround from weeks to days.' },
  { year: '2014', title: 'Pan-India Expansion', desc: 'Extended distribution to 100+ cities. Introduced the Celestial and Suede collections — still bestsellers today.' },
  { year: '2018', title: 'Hexachrome Printing', desc: 'Became one of the first Indian labs to adopt 6-color Hexachrome printing for exhibition-quality photo reproduction.' },
  { year: '2022', title: 'PRO Photographer Program', desc: 'Launched the PRO verification program, offering wholesale pricing and priority production for professional studios.' },
  { year: '2025', title: '1.5 Million Albums', desc: 'Photographers on the Canvera platform created 1,568,981 albums in a single year — a milestone that belongs to the photography community.' },
];

const GALLERY_IMAGES = [
  '/images/Hero%20Section%20-%201080x720/1.jpg',
  '/images/Hero%20Section%20-%201080x720/2.jpg',
  '/images/Hero%20Section%20-%201080x720/3.jpg',
  '/images/Hero%20Section%20-%201080x720/4.jpg',
  '/images/Hero%20Section%20-%201080x720/5.jpg',
  '/images/Hero%20Section%20-%201080x720/6.jpg',
  '/images/Hero%20Section%20-%201080x720/7.jpg',
];

const VALUES = [
  { icon: '✦', title: 'Uncompromising Quality', desc: 'Every album leaves our facility only after passing a 22-point quality checklist. We\'d rather delay than deliver anything below perfect.' },
  { icon: '♻', title: 'Sustainable Materials', desc: 'We source leathers from tanneries with environmental certifications, use soy-based inks, and offset all production carbon.' },
  { icon: '🤝', title: 'Photographer First', desc: 'Every decision we make is filtered through one question: does this make the photographer\'s life easier and their work more impressive?' },
  { icon: '⚡', title: 'Relentless Innovation', desc: 'We invest heavily in R&D — from new binding techniques to digital ordering tools — so you always have the best tools available.' },
];

const ABOUT_SCHEMA = [
  {
    '@type': 'AboutPage',
    '@id': 'https://canvera.com/about',
    name: 'About Canvera',
    url: 'https://canvera.com/about',
    description: "India's leading premium photobook and wedding album manufacturer. Founded in 2007, Canvera serves 91,000+ professional photographers across 2,800+ cities.",
    mainEntity: { '@id': 'https://canvera.com/#organization' },
  },
  {
    '@type': 'Organization',
    '@id': 'https://canvera.com/#organization',
    name: 'Canvera',
    url: 'https://canvera.com',
    foundingDate: '2007',
    description: "India's leading premium photobook and wedding album manufacturer, serving 91,000+ professional photographers across 2,800+ cities.",
    numberOfEmployees: { '@type': 'QuantitativeValue', value: '500+' },
    areaServed: { '@type': 'Country', name: 'India' },
    address: { '@type': 'PostalAddress', addressCountry: 'IN', addressRegion: 'Karnataka' },
    milestone: MILESTONES.map(m => ({
      '@type': 'Event',
      name: m.title,
      startDate: m.year,
      description: m.desc,
    })),
  },
];

function GalleryCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const canPrev = index > 0;
  const canNext = index + 2 < total;

  return (
    <section className="about__gallery-section about__section--alt">
      <div className="about__gallery-inner">
        <div className="about__gallery-track">
          {images.slice(index, index + 2).map((src, i) => (
            <div key={index + i} className="about__gallery-slide">
              <img src={src} alt={`Canvera gallery ${index + i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
        <div className="about__gallery-nav">
          <button
            className="about__gallery-btn"
            onClick={() => setIndex(i => Math.max(0, i - 1))}
            disabled={!canPrev}
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <span className="about__gallery-counter">{index + 1}–{Math.min(index + 2, total)} / {total}</span>
          <button
            className="about__gallery-btn"
            onClick={() => setIndex(i => Math.min(total - 2, i + 1))}
            disabled={!canNext}
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="about">
      <SEOMeta
        title="About Canvera — India's Leading Photobook Manufacturer Since 2007"
        description="Canvera has been India's premier photobook and wedding album manufacturer since 2007. Serving 91,000+ photographers, 2,800+ cities, 1.5M+ albums in 2025."
        canonical="https://canvera.com/about"
        og={{ url: 'https://canvera.com/about' }}
        schema={ABOUT_SCHEMA}
        breadcrumb={[
          { name: 'Home',  url: 'https://canvera.com/' },
          { name: 'About', url: 'https://canvera.com/about' },
        ]}
      />
      <Breadcrumb />
      {/* Hero */}
      <section className="about__hero">
        <div className="about__hero-inner">
          <p className="about__hero-eyebrow">About Canvera</p>
          <h1 className="about__hero-title">India&rsquo;s Leading<br />Online Photography Company</h1>
          <p className="about__hero-sub">
            Since 2007, we&rsquo;ve been empowering professional photographers to create albums that last generations — from intimate family portraits to grand destination weddings across 2,800+ cities.
          </p>
          <div className="about__hero-cta">
            <Link to="/shop" className="about__btn about__btn--primary">Explore Products</Link>
            <Link to="/contact" className="about__btn about__btn--secondary">Get in Touch</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about__stats-section">
        <div className="about__inner">
          <div className="about__stats">
            {STATS.map(s => (
              <div key={s.label} className="about__stat">
                <span className="about__stat-val">{s.val}</span>
                <span className="about__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Video */}
      <section className="about__video-section">
        <div className="about__inner">
          <div className="about__video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/t7RcpATaP6Q?rel=0&modestbranding=1"
              title="Canvera Brand Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about__section about__section--alt">
        <div className="about__inner">
          <div className="about__section-header">
            <p className="about__eyebrow">What We Stand For</p>
            <h2 className="about__section-title">Our Values</h2>
          </div>
          <div className="about__values">
            {VALUES.map(v => (
              <div key={v.title} className="about__value-card">
                <span className="about__value-icon">{v.icon}</span>
                <h3 className="about__value-title">{v.title}</h3>
                <p className="about__value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about__section">
        <div className="about__inner">
          <div className="about__section-header">
            <p className="about__eyebrow">Our Journey</p>
            <h2 className="about__section-title">Milestones Since 2007</h2>
          </div>
          <div className="about__timeline">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={m.year} className="about__tl-row">
                  {/* Left column — content for even items */}
                  <div className="about__tl-col about__tl-col--left">
                    {isLeft && (
                      <div className="about__tl-card">
                        <h3 className="about__tl-title">{m.title}</h3>
                        <p className="about__tl-desc">{m.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Center — always: dot + year */}
                  <div className="about__tl-node">
                    <div className="about__tl-dot" />
                    <span className="about__tl-year">{m.year}</span>
                  </div>

                  {/* Right column — content for odd items */}
                  <div className="about__tl-col about__tl-col--right">
                    {!isLeft && (
                      <div className="about__tl-card">
                        <h3 className="about__tl-title">{m.title}</h3>
                        <p className="about__tl-desc">{m.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Carousel */}
      <GalleryCarousel images={GALLERY_IMAGES} />

      {/* CTA */}
      <section className="about__cta-section">
        <div className="about__inner">
          <div className="about__cta-card">
            <h2 className="about__cta-title">Ready to create something extraordinary?</h2>
            <p className="about__cta-sub">Join 91,000+ professional photographers who trust Canvera across 2,800+ cities.</p>
            <div className="about__cta-btns">
              <Link to="/shop" className="about__btn about__btn--primary">Browse Albums</Link>
              <Link to="/finder" className="about__btn about__btn--secondary">Find Your Album</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
