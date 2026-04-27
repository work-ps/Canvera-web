import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQ_ITEMS } from '../data/productConfig';
import Breadcrumb from '../components/Breadcrumb';
import SEOMeta from '../components/SEOMeta';
import './FAQPage.css';

/* ── Build FAQPage JSON-LD from FAQ_ITEMS data ─────────────────────────────── */
const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.flatMap(cat =>
    cat.questions.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }))
  ),
};

export default function FAQPage() {
  const [openItem, setOpenItem] = useState(null); // 'cat-idx'
  const [activeCategory, setActiveCategory] = useState(FAQ_ITEMS[0].category);
  const [searchQ, setSearchQ] = useState('');

  const toggle = (key) => setOpenItem(p => p === key ? null : key);

  // Filter by search
  const filteredCategories = searchQ.trim()
    ? FAQ_ITEMS.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
          q.q.toLowerCase().includes(searchQ.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQ.toLowerCase())
        ),
      })).filter(cat => cat.questions.length > 0)
    : FAQ_ITEMS.filter(cat => cat.category === activeCategory);

  return (
    <div className="faq-page">
      <SEOMeta
        title="FAQ — Canvera | Photobook & Wedding Album Support"
        description="Find answers about ordering, pricing, delivery, and product quality for Canvera premium photobooks and wedding albums. Serving 91,000+ photographers."
        canonical="https://canvera.com/faq"
        og={{ url: 'https://canvera.com/faq' }}
        schema={[FAQ_SCHEMA]}
        breadcrumb={[
          { name: 'Home', url: 'https://canvera.com/' },
          { name: 'FAQ',  url: 'https://canvera.com/faq' },
        ]}
      />
      <Breadcrumb />
      <div className="faq-page__inner">
        {/* Header */}
        <div className="faq-hero">
          <p className="faq-hero__eyebrow">Support</p>
          <h1 className="faq-hero__title">Frequently Asked Questions</h1>
          <p className="faq-hero__sub">Find answers to the most common questions about ordering, pricing, delivery, and our products.</p>
          <div className="faq-hero__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              placeholder="Search questions…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
            {searchQ && (
              <button className="faq-hero__search-clear" onClick={() => setSearchQ('')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>

        <div className="faq-layout">
          {/* Sidebar categories (hidden during search) */}
          {!searchQ && (
            <nav className="faq-sidebar">
              {FAQ_ITEMS.map(cat => (
                <button
                  key={cat.category}
                  className={`faq-sidebar__item ${activeCategory === cat.category ? 'faq-sidebar__item--active' : ''}`}
                  onClick={() => setActiveCategory(cat.category)}
                >
                  {cat.category}
                  <span className="faq-sidebar__count">{cat.questions.length}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Questions */}
          <div className="faq-content">
            {searchQ && (
              <p className="faq-search-result">
                {filteredCategories.reduce((s, c) => s + c.questions.length, 0)} result{filteredCategories.reduce((s, c) => s + c.questions.length, 0) !== 1 ? 's' : ''} for <strong>"{searchQ}"</strong>
              </p>
            )}

            {filteredCategories.length === 0 && (
              <div className="faq-empty">
                <p>No results found for <strong>"{searchQ}"</strong>.</p>
                <p>Try a different keyword or <Link to="/contact">contact us</Link> directly.</p>
              </div>
            )}

            {filteredCategories.map(cat => (
              <div key={cat.category} className="faq-category">
                {searchQ && <h2 className="faq-category__title">{cat.category}</h2>}
                <div className="faq-list">
                  {cat.questions.map((item, idx) => {
                    const key = `${cat.category}-${idx}`;
                    const isOpen = openItem === key;
                    return (
                      <div key={key} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
                        <button className="faq-item__question" onClick={() => toggle(key)}>
                          <span>{item.q}</span>
                          <span className="faq-item__chevron">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                          </span>
                        </button>
                        {isOpen && (
                          <div className="faq-item__answer">
                            <p>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="faq-cta">
          <div className="faq-cta__card">
            <div className="faq-cta__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3 className="faq-cta__title">Still have questions?</h3>
            <p className="faq-cta__sub">Our team is available Monday–Saturday, 9am–6pm IST. Average response time: under 4 hours.</p>
            <div className="faq-cta__actions">
              <Link to="/contact" className="faq-cta__btn faq-cta__btn--primary">Contact Support</Link>
              <a href="https://wa.me/919876543210" className="faq-cta__btn faq-cta__btn--whatsapp" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
