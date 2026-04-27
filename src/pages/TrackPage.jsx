import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MOCK_ORDERS } from '../data/productConfig';
import Breadcrumb from '../components/Breadcrumb';
import './TrackPage.css';

const STATUS_STEP = { PROCESSING: 1, SHIPPED: 2, DELIVERED: 3 };

function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TrackPage() {
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState(() => {
    const pre = searchParams.get('order');
    return pre ? MOCK_ORDERS.find(o => o.orderNumber === pre) || null : null;
  });
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const q = input.trim().toUpperCase();
    if (!q) return;
    const found = MOCK_ORDERS.find(o => o.orderNumber.toUpperCase() === q);
    if (found) { setOrder(found); setNotFound(false); }
    else { setOrder(null); setNotFound(true); }
  };

  const currentStep = order ? STATUS_STEP[order.status] || 0 : 0;

  const STEPS = [
    { label: 'Order Placed', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg> },
    { label: 'Processing', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> },
    { label: 'Shipped', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
    { label: 'Delivered', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  ];

  return (
    <div className="track-page">
      <Breadcrumb />
      <div className="track-page__inner">
        {/* Header */}
        <div className="track-hero">
          <p className="track-hero__eyebrow">Order Tracking</p>
          <h1 className="track-hero__title">Track Your Order</h1>
          <p className="track-hero__sub">Enter your order number (format: CNV-XXXXXXXX) to get real-time status updates.</p>
        </div>

        {/* Search box */}
        <div className="track-search">
          <div className="track-search__box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="track-search__input"
              placeholder="e.g. CNV-00123456"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="track-search__btn" onClick={handleSearch}>Track</button>
          </div>
          <p className="track-search__hint">
            Try: <button className="track-search__sample" onClick={() => { setInput('CNV-00123456'); }}>CNV-00123456</button>,{' '}
            <button className="track-search__sample" onClick={() => { setInput('CNV-00234567'); }}>CNV-00234567</button>,{' '}
            <button className="track-search__sample" onClick={() => { setInput('CNV-00345678'); }}>CNV-00345678</button>
          </p>
        </div>

        {/* Not found */}
        {notFound && (
          <div className="track-not-found">
            <div className="track-not-found__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3>Order not found</h3>
            <p>We couldn't find order <strong>{input}</strong>. Please check the order number and try again.</p>
            <Link to="/contact" className="track-not-found__link">Contact Support</Link>
          </div>
        )}

        {/* Order result */}
        {order && (
          <div className="track-result">
            {/* Summary bar */}
            <div className="track-result__header">
              <div className="track-result__info">
                <h2 className="track-result__order-num">{order.orderNumber}</h2>
                <p className="track-result__product">{order.productName} — {order.collectionName} Collection</p>
                <p className="track-result__date">Placed on {fmtDate(order.placedAt)}</p>
              </div>
              <div className="track-result__status-wrap">
                <span className={`track-status track-status--${order.status.toLowerCase()}`}>
                  {order.status === 'DELIVERED' && '✓ '}
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>
                <p className="track-result__amount">{fmt(order.amount)}</p>
              </div>
            </div>

            {/* Progress tracker */}
            <div className="track-progress">
              {STEPS.map((step, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <div key={step.label} className="track-progress__step">
                    <div className={`track-progress__node ${isDone ? 'track-progress__node--done' : ''} ${isActive ? 'track-progress__node--active' : ''}`}>
                      {isDone ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <span className="track-progress__node-icon">{step.icon}</span>
                      )}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`track-progress__line ${isDone ? 'track-progress__line--done' : ''}`} />
                    )}
                    <p className={`track-progress__label ${isDone || isActive ? 'track-progress__label--active' : ''}`}>{step.label}</p>
                    {order.timeline[i]?.date && (
                      <p className="track-progress__date">{order.timeline[i].date}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detailed timeline */}
            <div className="track-section">
              <h3 className="track-section__title">Detailed Timeline</h3>
              <div className="track-timeline">
                {order.timeline.map((t, i) => (
                  <div key={i} className={`track-timeline__row ${t.done ? 'track-timeline__row--done' : ''}`}>
                    <div className="track-timeline__dot">
                      {t.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <div className="track-timeline__content">
                      <span className="track-timeline__label">{t.label}</span>
                      {t.date && <span className="track-timeline__date">{t.date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Config summary */}
            <div className="track-section">
              <h3 className="track-section__title">Order Configuration</h3>
              <div className="track-config">
                {Object.entries(order.config).map(([k, v]) => (
                  <div key={k} className="track-config__item">
                    <span className="track-config__key">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                    <span className="track-config__val">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="track-actions">
              <Link to="/contact" className="track-btn track-btn--secondary">Need Help?</Link>
              <Link to="/shop" className="track-btn track-btn--primary">Order Again</Link>
            </div>
          </div>
        )}

        {/* No order yet — hint */}
        {!order && !notFound && (
          <div className="track-hints">
            <h3 className="track-hints__title">What you can track</h3>
            <div className="track-hints__grid">
              {[
                { icon: '📦', title: 'Processing', desc: 'Your files are being reviewed and production is being prepared.' },
                { icon: '🖨️', title: 'Printing', desc: 'Your album pages are being printed and quality-checked.' },
                { icon: '🚚', title: 'Shipped', desc: 'Your package is on its way. You\'ll get an SMS with courier details.' },
                { icon: '✅', title: 'Delivered', desc: 'Your album has been delivered. Enjoy your masterpiece!' },
              ].map(h => (
                <div key={h.title} className="track-hint-card">
                  <span className="track-hint-card__icon">{h.icon}</span>
                  <h4 className="track-hint-card__title">{h.title}</h4>
                  <p className="track-hint-card__desc">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
