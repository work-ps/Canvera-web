import { useRef, useState, useEffect, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';
import './SocialFeedSection.css';

const socialPosts = [
  { id: 1, platform: 'instagram', handle: '@photography.by.ravi', location: 'Mumbai',    thumbnail: '/images/products/luxury-celestial.jpg' },
  { id: 2, platform: 'youtube',   handle: '@weddingframes',        location: 'Delhi',     thumbnail: '/images/products/mirage.jpg' },
  { id: 3, platform: 'instagram', handle: '@memories.captured',    location: 'Bangalore', thumbnail: '/images/products/mesmera.jpg' },
  { id: 4, platform: 'youtube',   handle: '@studio.lens',          location: 'Chennai',   thumbnail: '/images/products/melange.jpg' },
  { id: 5, platform: 'instagram', handle: '@artful.frames',        location: 'Hyderabad', thumbnail: '/images/products/luxury-celestial.jpg' },
  { id: 6, platform: 'instagram', handle: '@light.and.love',       location: 'Pune',      thumbnail: '/images/products/mirage.jpg' },
];

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="4" ry="4" />
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PlayButton() {
  return (
    <div className="social-feed__play">
      <div className="social-feed__play-btn" aria-label="Play video">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--interactive-primary)" aria-hidden="true">
          <polygon points="6,4 20,12 6,20" />
        </svg>
      </div>
    </div>
  );
}

function PlatformBadge({ platform }) {
  return (
    <div className="social-feed__platform">
      {platform === 'instagram' ? <InstagramIcon /> : <YouTubeIcon />}
      <span>{platform === 'instagram' ? 'Instagram' : 'YouTube'}</span>
    </div>
  );
}

function SocialCard({ post }) {
  return (
    <div className="social-feed__card">
      <div className="social-feed__thumb">
        <img
          src={post.thumbnail}
          alt={`${post.handle} — ${post.location}`}
          loading="lazy"
        />
        <PlatformBadge platform={post.platform} />
        <PlayButton />
      </div>
      <div className="social-feed__meta">
        <div className="social-feed__handle">{post.handle}</div>
        <div className="social-feed__location">{post.location}</div>
      </div>
    </div>
  );
}

export default function SocialFeedSection() {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd,   setAtEnd]   = useState(false);

  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 4);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener('scroll', syncArrows, { passive: true });
    return () => el.removeEventListener('scroll', syncArrows);
  }, [syncArrows]);

  const scrollTrack = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 480, behavior: 'smooth' });
  };

  return (
    <div className="section-wrapper">
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">From Our Community</h2>
          <span className="section-link">#CanveraStories</span>
        </div>
      </ScrollReveal>

      {/* Frame: clips overflow, hosts right-edge fade, anchors side arrows */}
      <div className="social-feed__frame">

        {/* Left arrow */}
        <button
          className={`social-feed__arrow social-feed__arrow--prev${atStart ? ' social-feed__arrow--hidden' : ''}`}
          onClick={() => scrollTrack(-1)}
          aria-label="Scroll left"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Scrollable track */}
        <div className="social-feed__wrap">
          <div className="social-feed" ref={trackRef}>
            {socialPosts.map((post) => (
              <SocialCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          className={`social-feed__arrow social-feed__arrow--next${atEnd ? ' social-feed__arrow--hidden' : ''}`}
          onClick={() => scrollTrack(1)}
          aria-label="Scroll right"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

      </div>
    </div>
  );
}
