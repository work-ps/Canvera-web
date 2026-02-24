/* 6 SVG carousel slides representing different product views.
   null = use the product's own variant SVG (first frame stays identical to static state) */

const productSlides = [
  // Slide 0: default product SVG (sentinel)
  null,

  // Slide 1: open spread view
  <svg key="s1" viewBox="0 0 56 42" fill="none">
    <path d="M4 6h22v30H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M30 6h22v30H30z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M28 6v30" stroke="currentColor" strokeWidth="1"/>
    <path d="M8 14h14M8 18h10M8 22h12" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
    <path d="M34 14h14M34 18h10M34 22h12" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
  </svg>,

  // Slide 2: detail / texture close-up
  <svg key="s2" viewBox="0 0 56 42" fill="none">
    <rect x="8" y="5" width="40" height="32" rx="3" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M14 13h28M14 19h20M14 25h24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    <circle cx="38" cy="30" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M42 34l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>,

  // Slide 3: spine / side view
  <svg key="s3" viewBox="0 0 56 42" fill="none">
    <rect x="22" y="4" width="12" height="34" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M25 10h6M25 15h6M25 20h6" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
    <path d="M22 4c-2 0-3 1-3 2v30c0 1 1 2 3 2" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
    <path d="M34 4c2 0 3 1 3 2v30c0 1-1 2-3 2" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
  </svg>,

  // Slide 4: stacked / multiple albums
  <svg key="s4" viewBox="0 0 56 42" fill="none">
    <rect x="10" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="7" y="11" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
    <rect x="4" y="14" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="0.8" opacity="0.25"/>
    <path d="M16 18l6 5 4-3 8 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
  </svg>,

  // Slide 5: packaging / box view
  <svg key="s5" viewBox="0 0 56 42" fill="none">
    <path d="M28 4l18 8v18l-18 8-18-8V12z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M10 12l18 8 18-8" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <path d="M28 20v18" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
  </svg>,
]

export default productSlides
