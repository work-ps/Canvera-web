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

      {/* ── Full-bleed background carousel ── */}
      <HeroCarousel items={heroProducts} />

      {/* ── Layered scrim for text legibility ── */}
      <div className="hero__scrim" aria-hidden="true" />

      {/* ── Foreground content ── */}
      <div className="hero__content">

        {/* Headline + CTAs */}
        <div className="hero__body">
          <h1 className="hero__title hero__fade-in" style={{ animationDelay: '0.1s' }}>
            Photographers Deserve
            <span className="hero__title-accent">Craftmanship</span>
          </h1>

          <p className="hero__subtitle hero__fade-in" style={{ animationDelay: '0.28s' }}>
            Award-winning photobooks crafted with premium materials,
            trusted by photographers across 2,800+ cities.
          </p>

          {isLoggedIn ? (
            <div className="hero__ctas hero__fade-in" style={{ animationDelay: '0.42s' }}>
              <Link to="/shop"   className="btn btn--hero-primary btn--lg">Explore Collection</Link>
              <Link to="/custom" className="btn btn--hero-secondary btn--lg">Make Your Own</Link>
            </div>
          ) : (
            <div className="hero__ctas hero__fade-in" style={{ animationDelay: '0.42s' }}>
              <Link to="/shop"   className="btn btn--hero-primary btn--lg">Explore Collection</Link>
              <Link to="/signup" className="btn btn--hero-secondary btn--lg">Join Free</Link>
            </div>
          )}

          {isLoggedIn && (
            <p className="hero__welcome hero__fade-in" style={{ animationDelay: '0.52s' }}>
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              {user?.status === 'verified' && (
                <span className="hero__verified-badge">✓ PRO Verified</span>
              )}
            </p>
          )}
        </div>

        {/* Trust stats — bottom strip */}
        <div className="hero__trust hero__fade-in" style={{ animationDelay: '0.58s' }}>
          {TRUST_STATS.map(s => (
            <div key={s.label} className="hero__trust-item">
              <span className="hero__trust-val">{s.val}</span>
              <span className="hero__trust-label">{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
