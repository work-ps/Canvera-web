import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroCarousel from './HeroCarousel';
import { heroProducts } from '../data/products';
import './Hero.css';

const TRUST_STATS = [
  { val: '91K+',   label: 'Photographers' },
  { val: '18+',    label: 'Years' },
  { val: '1.5M+',  label: 'Albums' },
  { val: '2,800+', label: 'Cities' },
];

export default function Hero() {
  const { isLoggedIn, user } = useAuth();

  return (
    <section className="hero">
      <div className="hero__bounded">

        {/* ── Left: Text + CTAs ── */}
        <div className="hero__text">
          <p className="hero__eyebrow hero__fade-in" style={{ animationDelay: '0.05s' }}>
            India&rsquo;s Trusted Photobook Partner for Professionals
          </p>

          <h1 className="hero__title hero__fade-in" style={{ animationDelay: '0.15s' }}>
            Photographs Deserve{' '}
            <span className="hero__title-accent">More Than Storage</span>
          </h1>

          <p className="hero__subtitle hero__fade-in" style={{ animationDelay: '0.25s' }}>
            Award-winning photobooks crafted with premium materials, professional
            printing, and fast delivery — trusted by photographers across 2,800+ cities.
          </p>

          {/* Auth-aware CTAs — Explore first, Join second */}
          {isLoggedIn ? (
            <div className="hero__ctas hero__fade-in" style={{ animationDelay: '0.35s' }}>
              <Link to="/shop" className="btn btn--hero-primary btn--lg">
                Explore Collection
              </Link>
              <Link to="/custom" className="btn btn--hero-secondary btn--lg">
                Make Your Own
              </Link>
            </div>
          ) : (
            <div className="hero__ctas hero__fade-in" style={{ animationDelay: '0.35s' }}>
              <Link to="/shop" className="btn btn--hero-primary btn--lg">
                Explore Collection
              </Link>
              <Link to="/signup" className="btn btn--hero-secondary btn--lg">
                Join Free
              </Link>
            </div>
          )}

          {/* Logged-in welcome nudge */}
          {isLoggedIn && (
            <p className="hero__welcome hero__fade-in" style={{ animationDelay: '0.45s' }}>
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              {user?.status === 'verified' && (
                <span className="hero__verified-badge">✓ PRO Verified</span>
              )}
            </p>
          )}

          {/* Trust stats */}
          <div className="hero__trust hero__fade-in" style={{ animationDelay: '0.5s' }}>
            {TRUST_STATS.map(s => (
              <div key={s.label} className="hero__trust-item">
                <span className="hero__trust-val">{s.val}</span>
                <span className="hero__trust-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: 3D Carousel ── */}
        <div className="hero__carousel-col hero__fade-in" style={{ animationDelay: '0.3s' }}>
          <HeroCarousel items={heroProducts.slice(0, 3)} />
        </div>

      </div>
    </section>
  );
}
