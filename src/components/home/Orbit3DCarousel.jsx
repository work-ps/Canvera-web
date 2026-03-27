import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const ITEMS = [
  { slug: 'luxury-celestial', name: 'Luxury Celestial', img: '/images/hero-carousel/1.png' },
  { slug: 'plush-leather-cover', name: 'Plush Leather Cover', img: '/images/hero-carousel/2.png' },
  { slug: 'ornato', name: 'Ornato', img: '/images/hero-carousel/3.png' },
  { slug: 'premium-mesmera', name: 'Premium Mesmera', img: '/images/hero-carousel/4.png' },
  { slug: 'premium-celestial', name: 'Premium Celestial', img: '/images/hero-carousel/5.png' },
  { slug: 'mystique-suede', name: 'Mystique Suede', img: '/images/hero-carousel/6.png' },
]

const N = ITEMS.length
const CARD = 230
const R = 210
const SPEED = 0.002
const DRAG_K = 0.004
const SCROLL_K = 0.003
const TILT_K = 10

const THUMBS = ITEMS.map(it => it.img)

function computeCards(baseAngle) {
  const step = (Math.PI * 2) / N
  return ITEMS.map((_, i) => {
    const a = baseAngle + i * step
    const x = Math.sin(a) * R
    const z = Math.cos(a) * R
    const rotY = (a * 180) / Math.PI
    const d = (z + R) / (2 * R)
    return {
      transform: `translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${(0.6 + 0.4 * d).toFixed(3)})`,
      opacity: (0.4 + 0.6 * d).toFixed(3),
      zIndex: Math.round(d * 100),
    }
  })
}

export default function Orbit3DCarousel() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const angleRef = useRef(0)
  const autoRef = useRef(true)
  const velRef = useRef(SPEED)
  const dragRef = useRef({ on: false, sx: 0, sa: 0, lx: 0, lt: 0 })
  const tiltRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  const [styles, setStyles] = useState(() => computeCards(0))
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  // Animation loop
  useEffect(() => {
    let mounted = true
    const tick = () => {
      if (!mounted) return
      if (autoRef.current) {
        angleRef.current += SPEED
      } else if (!dragRef.current.on) {
        angleRef.current += velRef.current
        velRef.current *= 0.96
        if (Math.abs(velRef.current) < 0.0001) velRef.current = 0
      }
      setStyles(computeCards(angleRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { mounted = false; cancelAnimationFrame(rafRef.current) }
  }, [])

  // Mouse tilt
  const onMM = useCallback((e) => {
    const r = containerRef.current?.getBoundingClientRect()
    if (!r) return
    const px = ((e.clientX - r.left) / r.width - 0.5) * 2
    const py = ((e.clientY - r.top) / r.height - 0.5) * 2
    tiltRef.current = { x: py * -TILT_K, y: px * TILT_K }
    setTilt({ x: py * -TILT_K, y: px * TILT_K })
  }, [])
  const onME = useCallback(() => { autoRef.current = false }, [])
  const onML = useCallback(() => {
    autoRef.current = true; velRef.current = SPEED
    tiltRef.current = { x: 0, y: 0 }; setTilt({ x: 0, y: 0 })
    dragRef.current.on = false
  }, [])

  // Drag
  const onPD = useCallback((e) => {
    autoRef.current = false; velRef.current = 0
    dragRef.current = { on: true, sx: e.clientX, sa: angleRef.current, lx: e.clientX, lt: performance.now() }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])
  const onPM = useCallback((e) => {
    if (!dragRef.current.on) return
    angleRef.current = dragRef.current.sa + (e.clientX - dragRef.current.sx) * DRAG_K
    const now = performance.now(); const dt = now - dragRef.current.lt
    if (dt > 0) velRef.current = ((e.clientX - dragRef.current.lx) * DRAG_K) / Math.max(dt / 16, 1)
    dragRef.current.lx = e.clientX; dragRef.current.lt = now
  }, [])
  const onPU = useCallback(() => { dragRef.current.on = false }, [])

  // Scroll
  useEffect(() => {
    const el = containerRef.current; if (!el) return
    let wt
    const onW = (e) => {
      e.preventDefault(); autoRef.current = false
      angleRef.current += e.deltaY * SCROLL_K
      clearTimeout(wt); wt = setTimeout(() => { autoRef.current = true }, 1500)
    }
    el.addEventListener('wheel', onW, { passive: false })
    return () => { el.removeEventListener('wheel', onW); clearTimeout(wt) }
  }, [])

  const onClick = useCallback((e, slug) => {
    if (Math.abs((dragRef.current.sx || 0) - e.clientX) > 5) { e.preventDefault(); return }
    e.preventDefault(); navigate(`/products/${slug}`)
  }, [navigate])

  return (
    <div
      ref={containerRef}
      className="orbit-carousel"
      onMouseMove={onMM} onMouseEnter={onME} onMouseLeave={onML}
      onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
    >
      <div className="orbit-scene" style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        {ITEMS.map((item, i) => (
          <a
            key={item.slug}
            href={`/products/${item.slug}`}
            className="orbit-card"
            style={{ width: CARD, height: CARD, transform: styles[i].transform, opacity: styles[i].opacity, zIndex: styles[i].zIndex }}
            onClick={(e) => onClick(e, item.slug)}
            draggable={false}
          >
            {THUMBS[i] ? (
              <img src={THUMBS[i]} alt={item.name} className="orbit-card-img" draggable={false} />
            ) : (
              <div className="orbit-card-placeholder">
                <svg viewBox="0 0 44 34" fill="none"><rect x="2" y="2" width="40" height="30" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 24l12-9 8 5 10-8 10 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
            <div className="orbit-card-label">{item.name}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
