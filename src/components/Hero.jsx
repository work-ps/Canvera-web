import HeroCarousel from './HeroCarousel';
import { heroProducts } from '../data/products';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bounded">
        {/* Text + CTAs */}
        <div className="hero__text">
          <p className="hero__eyebrow hero__fade-in" style={{ animationDelay: '0.1s' }}>
            India&rsquo;s #1 Premium Photo Album Platform
          </p>
          <h1 className="hero__title hero__fade-in" style={{ animationDelay: '0.2s' }}>
            Preserving Memories,{' '}
            <span className="hero__title-accent">Crafted with Precision</span>
          </h1>
          <div className="hero__ctas hero__fade-in" style={{ animationDelay: '0.35s' }}>
            <a href="/signup" className="btn btn--primary btn--lg">
              Join Now
            </a>
            <a href="/shop" className="btn btn--secondary btn--lg">
              Explore Collection
            </a>
          </div>
        </div>

        {/* 3D Carousel */}
        <div className="hero__fade-in" style={{ animationDelay: '0.4s' }}>
          <HeroCarousel items={heroProducts} />
        </div>
      </div>
    </section>
  );
}
