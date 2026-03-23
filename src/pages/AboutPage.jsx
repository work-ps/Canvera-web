import { useState, useRef, useEffect, useCallback } from 'react'
import '../styles/about-page.css'

const VIDEO_SRC = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

export default function AboutPage() {
  const [videoPlaying, setVideoPlaying] = useState(false)
  const videoRef = useRef(null)

  const handlePlay = useCallback(() => {
    const vid = videoRef.current
    if (vid) {
      vid.play().catch(() => {})
      setVideoPlaying(true)
    }
  }, [])

  const handleVideoEnd = useCallback(() => {
    setVideoPlaying(false)
  }, [])

  useEffect(() => {
    const vid = videoRef.current
    if (vid) {
      vid.addEventListener('ended', handleVideoEnd)
      vid.addEventListener('pause', handleVideoEnd)
      return () => {
        vid.removeEventListener('ended', handleVideoEnd)
        vid.removeEventListener('pause', handleVideoEnd)
      }
    }
  }, [handleVideoEnd])

  return (
    <div className="about-page">
      {/* Hero banner */}
      <section className="about-hero">
        <h1 className="about-hero-title">About Canvera</h1>
        <p className="about-hero-subtitle">
          Why we are the preferred choice of pro photographers nationwide
        </p>
      </section>

      {/* Video — Explore Canvera Experience */}
      <section className="about-video-section">
        <div className="about-video-inner">
          <div className={`about-video-player${videoPlaying ? ' playing' : ''}`}>
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              playsInline
              controls={videoPlaying}
              preload="metadata"
            />
            {!videoPlaying && (
              <button className="about-video-play-btn" onClick={handlePlay} aria-label="Play video">
                <span className="about-video-play-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <polygon points="8,4.5 8,19.5 20,12" fill="currentColor"/>
                  </svg>
                </span>
                <span className="about-video-play-label">Explore Canvera Experience</span>
              </button>
            )}
          </div>
          <p className="about-video-caption">
            Discover what makes Canvera India's #1 photobook platform — craftsmanship, precision, and quality.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-block">
        <div className="about-block-inner">
          <h2 className="about-block-title">Our Story</h2>
          <p className="about-block-text">
            With a vision to help individuals record and preserve their happiest memories, we started our journey in 2007. Today, Canvera is India's leading online photography company, fulfilling every professional photography need across 2,800+ cities.
          </p>
          <p className="about-block-text">
            Canvera began its journey with a simple belief: photographs deserve more than storage—they deserve to be experienced. Since then, photographers across India have trusted Canvera to turn moments into lasting memories.
          </p>
          <p className="about-block-text">
            This milestone belongs to our community—and it's why Canvera continues to be the preferred choice for professional photographers nationwide.
          </p>
        </div>
      </section>

      {/* Bento Grid — Who We Are, What We Do, Stats */}
      <section className="about-bento">
        <div className="about-bento-inner">

          {/* Row 1: Who We Are (wide) + 2 stats */}
          <div className="bento-card bento-card--wide bento-card--who">
            <div className="bento-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15l-2 5l9-13h-5l2-5l-9 13h5z"/>
              </svg>
            </div>
            <h3 className="bento-card-title">Who We Are</h3>
            <p className="bento-card-desc">
              We are Canvera—pixel-peepers, sharpness fanatics, and edge-to-edge print perfectionists. We're the go-to printing partner for India's top professional photographers.
            </p>
          </div>

          <div className="bento-card bento-card--stat">
            <span className="bento-stat-number">91,000+</span>
            <span className="bento-stat-label">Partners Nationwide</span>
          </div>

          <div className="bento-card bento-card--stat">
            <span className="bento-stat-number">1.75M+</span>
            <span className="bento-stat-label">Albums Sold</span>
          </div>

          {/* Row 2: 2 stats + What We Do (wide) */}
          <div className="bento-card bento-card--stat">
            <span className="bento-stat-number">150+</span>
            <span className="bento-stat-label">Album Products</span>
          </div>

          <div className="bento-card bento-card--stat">
            <span className="bento-stat-number">2,800+</span>
            <span className="bento-stat-label">Cities Across India</span>
          </div>

          <div className="bento-card bento-card--wide bento-card--whatwedo">
            <div className="bento-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className="bento-card-title">What We Do</h3>
            <p className="bento-card-desc">
              State-of-the-art machines and calibration devices, hawk-eyed quality control, and lightning-fast turnarounds. From world-class posters, fliers, and leaflets to premium coffee table books—you name it, we'll print it.
            </p>
          </div>

          {/* Row 3: DIY (medium) + Where (medium) */}
          <div className="bento-card bento-card--medium bento-card--diy">
            <div className="bento-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className="bento-card-title">As DIY As You Are</h3>
            <p className="bento-card-desc">
              We give you access to top design software like Fundy and Pixellu. Choose a template and print, or design your album from the ground up. Not in a DIY frame of mind? Send us your JPEGs and we'll take care of the design for you.
            </p>
          </div>

          <div className="bento-card bento-card--medium bento-card--where">
            <div className="bento-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h3 className="bento-card-title">Where We Are</h3>
            <p className="bento-card-desc">
              We go everywhere your device goes. Simply download the Canvera app (or the Partner app if you're a photographer) from Google Play or the App Store, and swipe your printing blues away.
            </p>
          </div>

        </div>
      </section>

      {/* Mission */}
      <section className="about-block about-mission">
        <div className="about-block-inner">
          <h2 className="about-block-title">Our Mission</h2>
          <p className="about-block-text">
            To empower professional photographers with the finest products and services, enabling them to deliver
            unforgettable experiences to their clients. We believe that the art of photography extends beyond the lens,
            and it is our privilege to bring those captured moments to life in a form that families will cherish for
            generations.
          </p>
          <p className="about-block-text">
            As we look to the future, we remain committed to innovation, sustainability, and the relentless pursuit of
            perfection. Whether it is experimenting with eco-friendly materials or pushing the boundaries of print
            technology, Canvera will continue to set the standard for premium photobooks in India and beyond.
          </p>
        </div>
      </section>
    </div>
  )
}
