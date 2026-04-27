import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroCarousel from './HeroCarousel';
import { heroProducts } from '../data/products';
import './Hero.css';

export default function Hero() {
  const { isLoggedIn, user } = useAuth();

  return (
    <section className="hero">
      <div className="hero__bounded">
        {/* Text + CTAs */}
        <div className="hero__text">
          <p className="hero__eyebrow hero__fade-in" style={{ animationDelay: '0.1s' }}>
            India&rsquo;s Leading Online Photography Company
          </p>
          <h1 className="hero__title hero__fade-in" style={{ animationDelay: '0.2s' }}>
            Photographs Deserve{' '}
            <span className="hero__title-accent">More Than Storage</span>
          </h1>

          {/* ── Auth-aware CTAs ── */}
          {isLoggedIn ? (
            <div className="hero__ctas hero__fade-in" style={{ animationDelay: '0.35s' }}>
              <Link to="/shop" className="btn btn--primary btn--lg">
                Browse Albums
              </Link>
              <Link to="/custom" className="btn btn--secondary btn--lg">
                Make Your Own
              </Link>
            </div>
          ) : (
            <div className="hero__ctas hero__fade-in" style={{ animationDelay: '0.35s' }}>
              <Link to="/signup" className="btn btn--primary btn--lg">
                Join Now — It&rsquo;s Free
              </Link>
              <Link to="/shop" className="btn btn--secondary btn--lg">
                Explore Collection
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
        </div>

        {/* 3D Carousel */}
        <div className="hero__fade-in" style={{ animationDelay: '0.4s' }}>
          <HeroCarousel items={heroProducts} />
        </div>
      </div>
    </section>
  );
}
