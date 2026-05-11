import { useRef, useState, useEffect, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';
import './SocialFeedSection.css';

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD REELS
// ─────────────────────────────────────────────────────────────────────────────
// 1. Go to Instagram → open any Canvera reel
// 2. The URL looks like: https://www.instagram.com/reel/C9xK2abcXYZ/
//                                                        ^^^^^^^^^^^
//                                                        Copy this → reelCode
// 3. Add a new entry below with:
//    - reelCode  : the shortcode from the URL (required)
//    - thumbnail : a local image shown before the user clicks play
//                  Use a screenshot/cover of the reel, or a product image
//    - caption   : short text shown under the card
//    - location  : city / photographer studio name (optional)
//
// The reel plays inside a popup when the user clicks the card.
// No API key or Meta approval needed — Instagram's public embed URL is used.
// ─────────────────────────────────────────────────────────────────────────────

const socialPosts = [
  {
    id: 1,
    reelCode:  'DIvtVUxv6g-',
    location:  'Standard Custom Cover',
    thumbnail: '/images/collections/custom-cover.jpg',
  },
  {
    id: 2,
    reelCode:  'CxNmLIgpmkY',
    location:  'Luna',
    thumbnail: '/images/collections/celestial.jpg',
  },
  {
    id: 3,
    reelCode:  'DL7QMfsyUmK',
    location:  'Royal Relics',
    thumbnail: '/images/collections/luxury.jpg',
  },
  {
    id: 4,
    reelCode:  'DGmWHhDSURK',
    location:  'Eleganza Celestial',
    thumbnail: '/images/collections/signature.jpg',
  },
  {
    id: 5,
    reelCode:  'DJbz5dbJgv1',
    location:  'Mirage',
    thumbnail: '/images/collections/foiling.jpg',
  },
  {
    id: 6,
    reelCode:  'CuCSgpppOKD',
    location:  'Vintage Wood – Dark',
    thumbnail: '/images/collections/suede.jpg',
  },
  {
    id: 7,
    reelCode:  'C4XrU0EpysU',
    location:  'Plush Leather with Encasing Box',
    thumbnail: '/images/collections/luxury.jpg',
  },
];


function PlayButton() {
  return (
    <div className="social-feed__play">
      <div className="social-feed__play-btn" aria-label="Play reel">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--interactive-primary)" aria-hidden="true">
          <polygon points="6,4 20,12 6,20" />
        </svg>
      </div>
    </div>
  );
}

// ── Card: shows thumbnail; clicking opens the reel in a lightbox ──────────────
function SocialCard({ post, onPlay }) {
  return (
    <div className="social-feed__card" onClick={() => onPlay(post)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onPlay(post)}>
      <div className="social-feed__thumb">
        <img
          src={post.thumbnail}
          alt={post.location}
          loading="lazy"
        />
        <PlayButton />
      </div>
      <div className="social-feed__meta">
        <div className="social-feed__location">{post.location}</div>
      </div>
    </div>
  );
}

// ── Lightbox: renders the reel inside an Instagram embed iframe ───────────────
function ReelLightbox({ post, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden'; // lock background scroll
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!post) return null;

  // Instagram public embed URL — no API key needed
  const embedUrl = `https://www.instagram.com/reel/${post.reelCode}/embed/`;

  return (
    <div className="social-feed__lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Instagram Reel">
      <div className="social-feed__lightbox-inner" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="social-feed__lightbox-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* The reel iframe */}
        <iframe
          src={embedUrl}
          className="social-feed__reel-frame"
          title={post.caption}
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        />

        {/* Caption below the reel */}
        <div className="social-feed__lightbox-caption">
          <a
            href={`https://www.instagram.com/reel/${post.reelCode}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-feed__lightbox-link"
            onClick={(e) => e.stopPropagation()}
          >
            View on Instagram ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SocialFeedSection() {
  const trackRef = useRef(null);
  const [atStart,      setAtStart]      = useState(true);
  const [atEnd,        setAtEnd]        = useState(false);
  const [activeReel,   setActiveReel]   = useState(null); // which reel is open in lightbox

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
          <a
            href="https://www.instagram.com/canveradotcom/"
            target="_blank"
            rel="noopener noreferrer"
            className="section-link"
          >
            #CanveraStories →
          </a>
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
              <SocialCard key={post.id} post={post} onPlay={setActiveReel} />
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

      {/* Reel lightbox — mounts only when a card is clicked */}
      {activeReel && (
        <ReelLightbox post={activeReel} onClose={() => setActiveReel(null)} />
      )}
    </div>
  );
}
