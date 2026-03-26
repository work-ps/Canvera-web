import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

// Replace with actual Canvera experience video URL
const VIDEO_SRC = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

export default function VideoOverlay({ open, onClose }) {
  const backdropRef = useRef(null)
  const closeRef = useRef(null)
  const videoRef = useRef(null)

  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
      setTimeout(() => closeRef.current?.focus(), 100)

      // Ensure video plays automatically when overlay opens
      const vid = videoRef.current
      if (vid) {
        vid.currentTime = 0
        vid.play().catch(() => {})
      }
    } else {
      // Pause & reset video when overlay closes
      const vid = videoRef.current
      if (vid) {
        vid.pause()
        vid.currentTime = 0
      }
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, handleEsc])

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose()
  }

  return (
    <div
      ref={backdropRef}
      className={`video-overlay-backdrop${open ? ' open' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Canvera Experience Video"
    >
      {/* Close button — lives on backdrop so it's always reachable */}
      <button
        ref={closeRef}
        className={`video-overlay-close${open ? ' open' : ''}`}
        onClick={onClose}
        aria-label="Close video"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <div className={`video-overlay-container${open ? ' open' : ''}`}>
        {/* Branding strip */}
        <div className="video-overlay-header">
          <div className="video-overlay-badge">
            <svg viewBox="0 0 16 16" fill="none">
              <polygon points="6.5,3 6.5,13 13.5,8" fill="currentColor"/>
            </svg>
            The Canvera Experience
          </div>
        </div>

        {/* Native video player — autoplays, no external redirects */}
        <div className="video-overlay-player">
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            autoPlay
            playsInline
            controls
            preload="auto"
          />
        </div>

        {/* Info strip below video */}
        <div className="video-overlay-info">
          <div className="video-overlay-info-left">
            <span className="video-overlay-title">Discover what makes Canvera India's #1 photobook platform</span>
            <span className="video-overlay-subtitle">Craftsmanship · Precision · Quality · B2B Partnership · White-glove Support</span>
          </div>
          <Link to="/signup" className="video-overlay-cta" onClick={onClose}>
            Join Now
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
