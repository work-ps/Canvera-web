import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { SIZES, COVER_STYLES, PAPER_TYPES, BOX_MATERIALS, calculatePrice } from '../data/productConfig';
import Breadcrumb from '../components/Breadcrumb';
import './OrderWizardPage.css';

// ── Step order per design spec ────────────────────────────────────────────────
const STEPS = ['Files', 'Paper', 'Cover', 'Accessories', 'Review'];

// ── Lamination options with paper compatibility ────────────────────────────────
const LAMINATIONS = [
  { id: 'lam-matte',  name: 'Matte',         sub: 'Smooth, non-reflective finish',   badge: null,    bg: '#e5e1dc' },
  { id: 'lam-glossy', name: 'Glossy',        sub: 'High-shine, vibrant surface',     badge: null,    bg: '#cde6f5' },
  { id: 'lam-soft',   name: 'Soft Touch',    sub: 'Velvety, premium matte feel',     badge: '+₹600', bg: '#dfd7ec' },
  { id: 'lam-none',   name: 'No Lamination', sub: 'Natural uncoated paper surface',  badge: null,    bg: '#f0ebe0' },
];

const LAM_COMPAT = {
  'lam-matte':  ['pt-1', 'pt-2', 'pt-3', 'pt-4'],
  'lam-glossy': ['pt-1', 'pt-2', 'pt-3'],
  'lam-soft':   ['pt-1', 'pt-3', 'pt-4'],
  'lam-none':   ['pt-1', 'pt-2', 'pt-3', 'pt-4', 'pt-5'],
};

// ── Bag options per spec ──────────────────────────────────────────────────────
const BAG_OPTIONS = [
  { id: 'none',       label: 'No Bag',         sub: 'No packaging bag included',               badge: null     },
  { id: 'jute',       label: 'Jute Bag',        sub: 'Eco-friendly jute carrying bag',          badge: '+₹200'  },
  { id: 'royal-jute', label: 'Royal Jute Bag',  sub: 'Premium royal jute with velvet interior', badge: '+₹400'  },
];

const EVENT_TYPES = ['Wedding', 'Pre-Wedding', 'Birthday', 'Corporate', 'Portrait', 'Other'];

// ── Calendar options ─────────────────────────────────────────────────────────
const CALENDAR_OPTIONS = [
  { id: 'cal-table',    name: 'Table Calendar',          bg: '#edf4ee' },
  { id: 'cal-wall',     name: 'Wall Calendar',           bg: '#eef0f8' },
  { id: 'cal-frame-79', name: 'Frame Calendar 7×9',      bg: '#f8edf0' },
  { id: 'cal-frame-99', name: 'Frame Calendar 9×9',      bg: '#f8f0ed' },
  { id: 'cal-desktop',  name: 'Desktop Calendar 10×4',   bg: '#edf8f0' },
];

// ── Bundle items (with sub-option config) ─────────────────────────────────────
const BUNDLE_ITEMS = [
  { id: 'b-acrylic-68',   name: 'Acrylic Photo Frame 6×8',     cat: 'frame',   needsText: false, needsSize: false },
  { id: 'b-bottle-pure',  name: 'Pure Grip Glass Bottle',       cat: 'bottle',  needsText: false, needsSize: false },
  { id: 'b-bottle-bamboo',name: 'Bamboo Steel Water Bottle',    cat: 'bottle',  needsText: false, needsSize: false },
  { id: 'b-diary',        name: 'Suede Leather Diary',          cat: 'diary',   needsText: false, needsSize: false },
  { id: 'b-mug',          name: 'Caffe Tazza Mug',              cat: 'mug',     needsText: false, needsSize: false },
  { id: 'b-magnets',      name: 'Magnetic Memories',            cat: 'magnet',  needsText: false, needsSize: false },
  { id: 'b-usb-case',     name: 'Customized USB Case',          cat: 'usb',     needsText: false, needsSize: false },
  { id: 'b-canvas-mag',   name: 'Canvas Fridge Magnet',         cat: 'magnet',  needsText: false, needsSize: true,
    sizes: [{ id: 's-callout', name: 'Callout Combo' }, { id: 's-square', name: 'Square Combo' }] },
  { id: 'b-acrylic-mag',  name: 'Acrylic Fridge Magnet',        cat: 'magnet',  needsText: false, needsSize: true,
    sizes: [{ id: 's-callout', name: 'Callout Combo' }, { id: 's-square', name: 'Square Combo' }] },
  { id: 'b-fridge-mag',   name: 'Fridge Magnet',                cat: 'magnet',  needsText: false, needsSize: true,
    sizes: [{ id: 's-callout', name: 'Callout Combo' }, { id: 's-square', name: 'Square Combo' }] },
  { id: 'b-plaque',       name: 'Wooden Plaque Plus',           cat: 'plaque',  needsText: false, needsSize: false },
  { id: 'b-pd32',         name: 'Pen Drive Wooden Box 32GB',    cat: 'usb',     needsText: true,
    textFields: ['Pendrive Text Line 1', 'Box Text Line 1', 'Box Text Line 2'], needsSize: false },
  { id: 'b-pd64',         name: 'Pen Drive Wooden Box 64GB',    cat: 'usb',     needsText: true,
    textFields: ['Pendrive Text Line 1', 'Box Text Line 1', 'Box Text Line 2'], needsSize: false },
  { id: 'b-tabletop',     name: 'TableTop Classic Frame',       cat: 'frame',   needsText: false, needsSize: false },
  { id: 'b-acrylic-12l',  name: 'Acrylic Photo Frame 12×18 L', cat: 'frame',   needsText: false, needsSize: false },
  { id: 'b-acrylic-12',   name: 'Acrylic Photo Frame 12×18',   cat: 'frame',   needsText: false, needsSize: false },
];

const BUNDLE_CAT = {
  frame:  { bg: '#e8f0f8', color: '#3465a0' },
  bottle: { bg: '#e8f5ee', color: '#2e7d52' },
  diary:  { bg: '#f0ece4', color: '#6b4c28' },
  mug:    { bg: '#fef3e8', color: '#b85c20' },
  magnet: { bg: '#fce8ee', color: '#b02848' },
  usb:    { bg: '#ece8f8', color: '#5038b0' },
  plaque: { bg: '#f4ede0', color: '#7a5020' },
};

// ── Calendar SVG schematics ───────────────────────────────────────────────────
function CalendarSVG({ id }) {
  const c = CALENDAR_OPTIONS.find(o => o.id === id);
  const fill = c?.bg || '#eee';
  const stroke = '#666';
  if (id === 'cal-table') { // A-frame tent calendar
    return (
      <svg viewBox="0 0 72 56" fill="none" className="wizard__cal-svg">
        <rect x="0" y="0" width="72" height="56" rx="4" fill={fill}/>
        <polygon points="36,10 14,46 58,46" fill="white" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="22" y1="32" x2="50" y2="32" stroke={stroke} strokeWidth="0.8" opacity="0.5"/>
        <line x1="25" y1="38" x2="47" y2="38" stroke={stroke} strokeWidth="0.8" opacity="0.5"/>
        <line x1="28" y1="44" x2="44" y2="44" stroke={stroke} strokeWidth="0.8" opacity="0.5"/>
        <line x1="36" y1="10" x2="36" y2="46" stroke={stroke} strokeWidth="0.6" opacity="0.3" strokeDasharray="2 2"/>
      </svg>
    );
  }
  if (id === 'cal-wall') { // Flat wall calendar with spiral binding
    return (
      <svg viewBox="0 0 72 56" fill="none" className="wizard__cal-svg">
        <rect x="0" y="0" width="72" height="56" rx="4" fill={fill}/>
        <rect x="10" y="10" width="52" height="38" rx="2" fill="white" stroke={stroke} strokeWidth="1.2"/>
        {[18,26,34,42,50,58].map(x => (
          <circle key={x} cx={x} cy="10" r="3" fill={fill} stroke={stroke} strokeWidth="1"/>
        ))}
        <line x1="10" y1="18" x2="62" y2="18" stroke={stroke} strokeWidth="0.8" opacity="0.4"/>
        {[22,28,34,40].map(y => (
          <line key={y} x1="14" y1={y} x2="58" y2={y} stroke={stroke} strokeWidth="0.6" opacity="0.3"/>
        ))}
        <rect x="14" y="20" width="10" height="6" rx="1" fill={stroke} opacity="0.12"/>
        <rect x="28" y="20" width="10" height="6" rx="1" fill={stroke} opacity="0.12"/>
        <rect x="42" y="20" width="10" height="6" rx="1" fill={stroke} opacity="0.12"/>
      </svg>
    );
  }
  if (id === 'cal-frame-79') { // Portrait frame with calendar
    return (
      <svg viewBox="0 0 72 56" fill="none" className="wizard__cal-svg">
        <rect x="0" y="0" width="72" height="56" rx="4" fill={fill}/>
        <rect x="14" y="6" width="44" height="44" rx="3" fill="white" stroke={stroke} strokeWidth="1.5"/>
        <rect x="17" y="9" width="38" height="25" rx="1" fill={fill} opacity="0.6"/>
        <line x1="14" y1="35" x2="58" y2="35" stroke={stroke} strokeWidth="0.8" opacity="0.4"/>
        {[40,45].map(y => (
          <line key={y} x1="18" y1={y} x2="54" y2={y} stroke={stroke} strokeWidth="0.6" opacity="0.3"/>
        ))}
        {[14,24,34,44,54].map(x => (
          <line key={x} x1={x} y1="35" x2={x} y2="48" stroke={stroke} strokeWidth="0.5" opacity="0.2"/>
        ))}
      </svg>
    );
  }
  if (id === 'cal-frame-99') { // Square frame with calendar
    return (
      <svg viewBox="0 0 72 56" fill="none" className="wizard__cal-svg">
        <rect x="0" y="0" width="72" height="56" rx="4" fill={fill}/>
        <rect x="10" y="6" width="52" height="44" rx="3" fill="white" stroke={stroke} strokeWidth="1.5"/>
        <rect x="13" y="9" width="46" height="24" rx="1" fill={fill} opacity="0.6"/>
        <line x1="10" y1="34" x2="62" y2="34" stroke={stroke} strokeWidth="0.8" opacity="0.4"/>
        {[38,43].map(y => (
          <line key={y} x1="14" y1={y} x2="58" y2={y} stroke={stroke} strokeWidth="0.6" opacity="0.3"/>
        ))}
        {[14,22,30,38,46,54,62].map(x => (
          <line key={x} x1={x} y1="34" x2={x} y2="48" stroke={stroke} strokeWidth="0.5" opacity="0.2"/>
        ))}
      </svg>
    );
  }
  if (id === 'cal-desktop') { // Wide landscape desk calendar
    return (
      <svg viewBox="0 0 72 56" fill="none" className="wizard__cal-svg">
        <rect x="0" y="0" width="72" height="56" rx="4" fill={fill}/>
        <rect x="6" y="14" width="60" height="30" rx="2" fill="white" stroke={stroke} strokeWidth="1.2"/>
        <line x1="36" y1="14" x2="36" y2="44" stroke={stroke} strokeWidth="1" opacity="0.25"/>
        <line x1="6" y1="24" x2="66" y2="24" stroke={stroke} strokeWidth="0.8" opacity="0.35"/>
        {[8,16,24,32,40,48,56,64].map(x => (
          <line key={x} x1={x} y1="24" x2={x} y2="44" stroke={stroke} strokeWidth="0.5" opacity="0.2"/>
        ))}
        <rect x="6" y="44" width="28" height="6" rx="0 0 2 2" fill={fill} opacity="0.5"/>
        <rect x="38" y="44" width="28" height="6" rx="0 0 2 2" fill={fill} opacity="0.5"/>
      </svg>
    );
  }
  return null;
}

// ── Bundle item category icon ─────────────────────────────────────────────────
function BundleIcon({ cat, size = 36 }) {
  const s = BUNDLE_CAT[cat] || { bg: '#eee', color: '#888' };
  const c = s.color;
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      {cat === 'frame' && (
        <>
          <rect x="3" y="3" width="30" height="30" rx="3" fill="white" stroke={c} strokeWidth="2"/>
          <rect x="8" y="8" width="20" height="20" rx="1.5" fill={c} opacity="0.15"/>
          <path d="M8 22 L14 16 L19 20 L24 14 L28 22 Z" fill={c} opacity="0.25"/>
        </>
      )}
      {cat === 'bottle' && (
        <>
          <rect x="13" y="4" width="10" height="4" rx="2" fill={c} opacity="0.3"/>
          <path d="M10 9 Q9 12 9 16 L9 30 Q9 33 12 33 L24 33 Q27 33 27 30 L27 16 Q27 12 26 9 Z" fill={c} opacity="0.2" stroke={c} strokeWidth="1.5"/>
          <line x1="9" y1="22" x2="27" y2="22" stroke={c} strokeWidth="1" opacity="0.4"/>
        </>
      )}
      {cat === 'mug' && (
        <>
          <path d="M7 10 L7 28 Q7 31 10 31 L22 31 Q25 31 25 28 L25 10 Z" fill={c} opacity="0.2" stroke={c} strokeWidth="1.5"/>
          <path d="M25 14 Q31 14 31 20 Q31 26 25 26" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"/>
          <line x1="7" y1="16" x2="25" y2="16" stroke={c} strokeWidth="0.8" opacity="0.4"/>
        </>
      )}
      {cat === 'diary' && (
        <>
          <rect x="8" y="4" width="22" height="28" rx="2" fill={c} opacity="0.18" stroke={c} strokeWidth="1.5"/>
          <rect x="6" y="4" width="4" height="28" rx="2 0 0 2" fill={c} opacity="0.35"/>
          <line x1="12" y1="12" x2="26" y2="12" stroke={c} strokeWidth="0.8" opacity="0.5"/>
          <line x1="12" y1="17" x2="26" y2="17" stroke={c} strokeWidth="0.8" opacity="0.5"/>
          <line x1="12" y1="22" x2="22" y2="22" stroke={c} strokeWidth="0.8" opacity="0.5"/>
        </>
      )}
      {cat === 'magnet' && (
        <>
          <rect x="5" y="5" width="12" height="12" rx="3" fill={c} opacity="0.25" stroke={c} strokeWidth="1.5"/>
          <rect x="19" y="5" width="12" height="12" rx="3" fill={c} opacity="0.25" stroke={c} strokeWidth="1.5"/>
          <rect x="5" y="19" width="12" height="12" rx="3" fill={c} opacity="0.15" stroke={c} strokeWidth="1.5"/>
          <rect x="19" y="19" width="12" height="12" rx="3" fill={c} opacity="0.15" stroke={c} strokeWidth="1.5"/>
        </>
      )}
      {cat === 'usb' && (
        <>
          <rect x="12" y="6" width="12" height="18" rx="2" fill={c} opacity="0.2" stroke={c} strokeWidth="1.5"/>
          <rect x="14" y="24" width="8" height="6" rx="1" fill={c} opacity="0.35"/>
          <rect x="16" y="10" width="4" height="3" rx="0.5" fill={c} opacity="0.5"/>
          <rect x="16" y="15" width="4" height="3" rx="0.5" fill={c} opacity="0.5"/>
        </>
      )}
      {cat === 'plaque' && (
        <>
          <rect x="4" y="10" width="28" height="18" rx="2" fill={c} opacity="0.2" stroke={c} strokeWidth="1.5"/>
          <path d="M4 14 Q18 12 32 14" stroke={c} strokeWidth="0.7" fill="none" opacity="0.35"/>
          <path d="M4 18 Q18 16 32 18" stroke={c} strokeWidth="0.7" fill="none" opacity="0.28"/>
          <path d="M4 22 Q18 20 32 22" stroke={c} strokeWidth="0.7" fill="none" opacity="0.35"/>
          <rect x="10" y="28" width="4" height="4" rx="1" fill={c} opacity="0.3"/>
          <rect x="22" y="28" width="4" height="4" rx="1" fill={c} opacity="0.3"/>
        </>
      )}
    </svg>
  );
}

// ── Special paper options (Fine Art / Metallic / Textured) ────────────────────
const SPECIAL_PAPERS = [
  { id: 'sp-fas', name: 'Fine Art Silk 300gsm',   desc: 'Museum-quality fine art surface with subtle texture' },
  { id: 'sp-mp',  name: 'Metallic Pearl 270gsm',  desc: 'Lustrous metallic sheen for dramatic impact' },
  { id: 'sp-tl',  name: 'Textured Linen 280gsm',  desc: 'Natural woven linen texture for an artisan feel' },
];

// ── SpEntry: special paper entry component ────────────────────────────────────
function SpEntry({ entry, index, totalPages, onUpdate, onRemove }) {
  const pages = [];
  for (let p = entry.fromPage; p <= entry.toPage; p++) pages.push(p);
  const selected = pages.filter(p => !entry.excludedPages.includes(p));
  const sheets = Math.ceil(selected.length / 2) || 0;

  const togglePage = (p) => {
    const next = entry.excludedPages.includes(p)
      ? entry.excludedPages.filter(x => x !== p)
      : [...entry.excludedPages, p];
    onUpdate('excludedPages', next);
  };

  const handleFrom = (v) => {
    const val = Math.min(Math.max(parseInt(v) || 1, 1), entry.toPage);
    onUpdate('fromPage', val);
    onUpdate('excludedPages', []);
  };

  const handleTo = (v) => {
    const val = Math.min(Math.max(parseInt(v) || entry.fromPage, entry.fromPage), totalPages);
    onUpdate('toPage', val);
    onUpdate('excludedPages', []);
  };

  return (
    <div className="wizard__sp-entry">
      <div className="wizard__sp-entry-header">
        <span className="wizard__sp-entry-title">Entry {index + 1}</span>
        <button className="wizard__sp-remove" onClick={onRemove} type="button">Remove</button>
      </div>

      <div className="wizard__sp-row">
        <div className="wizard__sp-field wizard__sp-field--grow">
          <label className="wizard__field-label">Paper Type</label>
          <select
            className="wizard__select"
            value={entry.paperType}
            onChange={e => onUpdate('paperType', e.target.value)}
          >
            <option value="">Select…</option>
            {SPECIAL_PAPERS.map(sp => (
              <option key={sp.id} value={sp.id}>{sp.name}</option>
            ))}
          </select>
        </div>
        <div className="wizard__sp-field wizard__sp-field--sm">
          <label className="wizard__field-label">From Page</label>
          <input
            type="number" className="wizard__text-input"
            value={entry.fromPage} min={1} max={entry.toPage}
            onChange={e => handleFrom(e.target.value)}
          />
        </div>
        <div className="wizard__sp-field wizard__sp-field--sm">
          <label className="wizard__field-label">To Page</label>
          <input
            type="number" className="wizard__text-input"
            value={entry.toPage} min={entry.fromPage} max={totalPages}
            onChange={e => handleTo(e.target.value)}
          />
        </div>
        <div className="wizard__sp-field wizard__sp-field--xs">
          <label className="wizard__field-label">Sheets</label>
          <div className="wizard__sp-sheets">{sheets}</div>
        </div>
      </div>

      {/* Page pills */}
      <div className="wizard__sp-pills">
        {pages.map(p => (
          <button
            key={p}
            className={`wizard__sp-pill${entry.excludedPages.includes(p) ? ' wizard__sp-pill--excluded' : ''}`}
            onClick={() => togglePage(p)}
            type="button"
            title={entry.excludedPages.includes(p) ? 'Click to include' : 'Click to exclude'}
          >
            {p}
          </button>
        ))}
        {entry.toPage < totalPages && (
          <button
            className="wizard__sp-pill wizard__sp-pill--add"
            onClick={() => { onUpdate('toPage', entry.toPage + 1); }}
            type="button"
          >
            + Add page
          </button>
        )}
      </div>

      {entry.paperType && (
        <p className="wizard__sp-desc">
          {SPECIAL_PAPERS.find(s => s.id === entry.paperType)?.desc}
        </p>
      )}
    </div>
  );
}

// ── Paper FAQ drawer content ──────────────────────────────────────────────────
const PAPER_FAQ = [
  {
    q: "What's the difference between paper types?",
    a: "Matte papers have a smooth, non-reflective finish ideal for classic albums. Glossy produces vibrant, high-contrast images with a shiny surface. Silk is a semi-gloss hybrid that balances both worlds. Pearl and Metallic are specialty papers with shimmer effects for luxury display albums.",
  },
  {
    q: "Which paper works best for wedding albums?",
    a: "Silk is our most popular choice — it reproduces skin tones beautifully and resists fingerprints better than Glossy. Pearl is a premium upgrade with a subtle shimmer that elevates the album. For a timeless, understated look, Matte is a classic choice.",
  },
  {
    q: "Does my paper choice affect lamination?",
    a: "Yes. Soft Touch lamination pairs beautifully with Matte and Pearl papers. Metallic paper is only available without lamination to preserve its natural metallic effect. Glossy lamination is not compatible with Pearl or Metallic specialty papers.",
  },
];

// ── Help modal content (structured: intro + bullets) ─────────────────────────
const HELP = {
  lamination: {
    title: 'About Lamination',
    intro: 'Lamination is a thin protective film applied to each page after printing. It changes how the page feels and reacts to light.',
    bullets: [
      { label: 'Matte', desc: 'Flat, non-reflective surface. Elegant and timeless. No glare — great for black-and-white or editorial styles.' },
      { label: 'Glossy', desc: 'Shiny, vibrant finish. Colors pop and look vivid. Works best for bold, colorful photography.' },
      { label: 'Soft Touch', desc: 'Premium velvet-like feel. Luxurious and tactile. Our most popular premium lamination.' },
      { label: 'No Lamination', desc: 'Natural paper surface. No coating. Best paired with fine art and archival specialty papers.' },
    ],
  },
  paper: {
    title: 'Paper Types',
    intro: 'Paper determines the print surface, weight, and visual finish of every page in your album.',
    bullets: [
      { label: 'Matte', desc: 'Smooth, non-reflective. Classic and timeless. Great for a restrained, editorial feel.' },
      { label: 'Glossy', desc: 'Bright and vibrant. Colors look punchy. Slightly more prone to fingerprints.' },
      { label: 'Silk', desc: 'Semi-gloss hybrid — the best of both worlds. Our most popular paper. Reproduces skin tones beautifully.' },
      { label: 'Pearl ★', desc: 'Subtle shimmer on the page surface. Adds a luxury feel. Premium specialty paper.' },
      { label: 'Metallic ★', desc: 'Dramatic metallic sheen for high-impact display albums. Only available without lamination.' },
    ],
  },
  colorMode: {
    title: 'Colour Printing Modes',
    intro: 'Choose how many ink colors are used to print your album pages.',
    bullets: [
      { label: '4-Color CMYK', desc: 'Industry-standard printing using Cyan, Magenta, Yellow, and Black inks. Excellent quality for all album types.' },
      { label: 'Hexachrome (6-Color)', desc: 'Adds two extra inks — orange and green. Produces a wider color range. Especially noticeable in blues, greens, and skin tones.' },
      { label: 'Which to choose?', desc: 'Most albums look stunning in 4C. Choose Hexachrome if your photos have vivid, saturated colors you want to preserve exactly.' },
    ],
  },
  coverDesign: {
    title: 'Cover Design Styles',
    intro: 'The cover design defines the visual character and layout arrangement of your album cover.',
    bullets: [
      { label: 'Padded Leather', desc: 'Classic raised double-border frame. Formal and timeless. Supports 2 text lines.' },
      { label: 'Fabric Wrap', desc: 'Refined textile surface with woven texture. Elegant and contemporary. Supports 3 text lines.' },
      { label: 'Photo Cover', desc: 'Your image wraps the entire cover. Modern and bold. Supports 1 text line.' },
      { label: 'Wooden Cover', desc: 'Premium hardwood in Walnut or Maple. Unique and artisanal. Supports 2 text lines.' },
    ],
  },
  coverMaterial: {
    title: 'Cover Materials',
    intro: 'Material defines the physical texture, durability, and premium quality of your album cover.',
    bullets: [
      { label: 'Italian Leather', desc: 'Full-grain leather with a rich, natural texture. The most luxurious option.' },
      { label: 'Vegan Leather', desc: 'Cruelty-free faux leather with a smooth soft-touch finish.' },
      { label: 'Linen / Silk', desc: 'Fabric options for the Wrap cover style. Linen is natural and woven; Silk is smooth and elegant.' },
      { label: 'Matte / Glossy Laminate', desc: 'Your photo is printed directly on the cover surface. Choose Matte for a flat finish, Glossy for shine.' },
      { label: 'Walnut / Maple', desc: 'Real hardwood veneer. Bold, distinctive, and unique to Canvera.' },
    ],
  },
  box: {
    title: 'Presentation Box',
    intro: 'A custom-sized keepsake enclosure made specifically for your album.',
    bullets: [
      { label: 'Protection', desc: 'Guards your album during transport and long-term storage from dust, light, and handling.' },
      { label: 'Gifting', desc: 'Elevates the unboxing moment. Makes the album feel like a complete gift from first touch.' },
      { label: 'Archival', desc: 'Museum-quality materials that keep your album safe for decades.' },
      { label: 'Materials', desc: 'Available in Leather, Linen, and Velvet — each with a curated color palette.' },
    ],
  },
  eventDetails: {
    title: 'Why We Need Event Details',
    intro: 'Event information helps our production team process your order accurately.',
    bullets: [
      { label: 'File matching', desc: 'We use event details to identify and correctly match your uploaded files to your order.' },
      { label: 'Documentation', desc: 'Event title appears on your production sheet and order invoice.' },
      { label: 'Support context', desc: 'If our team needs to reach out, they can do so with the right context.' },
      { label: 'Privacy', desc: 'Your event information is used for production only. Never shared with third parties.' },
    ],
  },
};

// ── Price formatter ───────────────────────────────────────────────────────────
function fmt(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }

// ── InfoBtn: small info icon that opens a help modal ──────────────────────────
function InfoBtn({ topic, onOpen }) {
  return (
    <button
      className="wizard__info-btn"
      onClick={() => onOpen(topic)}
      type="button"
      aria-label="Learn more"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <circle cx="12" cy="8" r="0.4" fill="currentColor"/>
      </svg>
    </button>
  );
}

// ── HelpModal: overlay with visual structured content ────────────────────────
function HelpModal({ topic, onClose }) {
  if (!topic || !HELP[topic]) return null;
  const { title, intro, bullets } = HELP[topic];
  return (
    <div className="wizard__help-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="wizard__help-modal" onClick={e => e.stopPropagation()}>
        <div className="wizard__help-header">
          <h3 className="wizard__help-title">{title}</h3>
          <button className="wizard__help-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {intro && <p className="wizard__help-intro">{intro}</p>}
        {bullets && bullets.length > 0 && (
          <div className="wizard__help-bullets">
            {bullets.map((b, i) => (
              <div key={i} className="wizard__help-bullet">
                <span className="wizard__help-bullet-dot"/>
                <div className="wizard__help-bullet-body">
                  <p className="wizard__help-bullet-label">{b.label}</p>
                  <p className="wizard__help-bullet-desc">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PaperFaqModal: paper FAQ in a modal, triggered by link ────────────────────
function PaperFaqModal({ open, onClose }) {
  const [faqIdx, setFaqIdx] = useState(null);
  if (!open) return null;
  return (
    <div className="wizard__help-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="wizard__pfaq-modal" onClick={e => e.stopPropagation()}>
        <div className="wizard__pfaq-header">
          <h3 className="wizard__pfaq-title">Paper Type — FAQ</h3>
          <button className="wizard__help-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="wizard__pfaq-items">
          {PAPER_FAQ.map((item, i) => (
            <div key={i} className="wizard__pfaq-item">
              <button
                className={`wizard__pfaq-q${faqIdx === i ? ' wizard__pfaq-q--open' : ''}`}
                onClick={() => setFaqIdx(faqIdx === i ? null : i)}
                type="button"
              >
                {item.q}
                <svg
                  className={`wizard__pfaq-chevron${faqIdx === i ? ' wizard__pfaq-chevron--open' : ''}`}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {faqIdx === i && <p className="wizard__pfaq-a">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Cover Design SVG schematics ───────────────────────────────────────────────
function CoverSVG({ styleId, color }) {
  const c = color || '#607080';

  if (styleId === 'cs-1') { // Padded Leather — raised double-border frame
    return (
      <svg viewBox="0 0 72 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="wizard__design-svg">
        <rect x="0" y="0" width="72" height="60" rx="4" fill={c} fillOpacity="0.10"/>
        <rect x="5" y="5" width="62" height="50" rx="3" fill={c} fillOpacity="0.08" stroke={c} strokeWidth="1.2" strokeOpacity="0.28"/>
        <rect x="11" y="11" width="50" height="38" rx="2" fill={c} fillOpacity="0.06" stroke={c} strokeWidth="0.8" strokeOpacity="0.18"/>
        <line x1="16" y1="38" x2="56" y2="38" stroke={c} strokeWidth="2.2" strokeOpacity="0.55" strokeLinecap="round"/>
        <line x1="20" y1="46" x2="52" y2="46" stroke={c} strokeWidth="1.4" strokeOpacity="0.38" strokeLinecap="round"/>
      </svg>
    );
  }
  if (styleId === 'cs-2') { // Fabric Wrap — woven grid + 3 text lines
    return (
      <svg viewBox="0 0 72 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="wizard__design-svg">
        <rect x="0" y="0" width="72" height="60" rx="4" fill={c} fillOpacity="0.10"/>
        {[12, 24, 36, 48, 60].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="60" stroke={c} strokeWidth="0.6" strokeOpacity="0.13"/>
        ))}
        {[10, 20, 30, 40].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="72" y2={y} stroke={c} strokeWidth="0.6" strokeOpacity="0.13"/>
        ))}
        <line x1="13" y1="36" x2="59" y2="36" stroke={c} strokeWidth="2.2" strokeOpacity="0.55" strokeLinecap="round"/>
        <line x1="17" y1="43" x2="55" y2="43" stroke={c} strokeWidth="1.4" strokeOpacity="0.40" strokeLinecap="round"/>
        <line x1="21" y1="50" x2="51" y2="50" stroke={c} strokeWidth="1.0" strokeOpacity="0.28" strokeLinecap="round"/>
      </svg>
    );
  }
  if (styleId === 'cs-3') { // Photo Cover — photo frame + 1 text line
    return (
      <svg viewBox="0 0 72 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="wizard__design-svg">
        <rect x="0" y="0" width="72" height="60" rx="4" fill={c} fillOpacity="0.08"/>
        <rect x="7" y="5" width="58" height="38" rx="2" fill={c} fillOpacity="0.14" stroke={c} strokeWidth="0.9" strokeOpacity="0.28"/>
        <circle cx="36" cy="18" r="6" fill={c} fillOpacity="0.22"/>
        <path d="M11 43 L20 28 L28 35 L38 22 L50 36 L58 28 L65 43 Z" fill={c} fillOpacity="0.18"/>
        <line x1="16" y1="52" x2="56" y2="52" stroke={c} strokeWidth="2.2" strokeOpacity="0.55" strokeLinecap="round"/>
      </svg>
    );
  }
  if (styleId === 'cs-4') { // Wooden Cover — wood grain lines + 2 text lines
    return (
      <svg viewBox="0 0 72 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="wizard__design-svg">
        <rect x="0" y="0" width="72" height="60" rx="4" fill={c} fillOpacity="0.12"/>
        <path d="M0 9 Q18 7 36 9 Q54 11 72 9" stroke={c} strokeWidth="1.1" fill="none" strokeOpacity="0.30"/>
        <path d="M0 16 Q22 14 42 16 Q60 18 72 16" stroke={c} strokeWidth="0.8" fill="none" strokeOpacity="0.22"/>
        <path d="M0 23 Q14 21 32 23 Q52 25 72 23" stroke={c} strokeWidth="1.0" fill="none" strokeOpacity="0.28"/>
        <path d="M0 30 Q20 28 44 30 Q62 32 72 30" stroke={c} strokeWidth="0.7" fill="none" strokeOpacity="0.18"/>
        <line x1="13" y1="42" x2="59" y2="42" stroke={c} strokeWidth="2.2" strokeOpacity="0.55" strokeLinecap="round"/>
        <line x1="19" y1="50" x2="53" y2="50" stroke={c} strokeWidth="1.4" strokeOpacity="0.38" strokeLinecap="round"/>
      </svg>
    );
  }
  return null;
}

// ── Material description hints ────────────────────────────────────────────────
const MAT_HINTS = {
  'mat-italian': 'Full-grain Italian leather, rich texture',
  'mat-vegan':   'Cruelty-free, soft-touch faux leather',
  'mat-linen':   'Natural woven linen fabric, refined feel',
  'mat-silk':    'Smooth silk fabric, luxurious and elegant',
  'mat-matte':   'Photo-printed matte laminated cover',
  'mat-glossy':  'Photo-printed high-gloss laminated cover',
  'mat-walnut':  'Premium hardwood walnut veneer',
  'mat-maple':   'Premium hardwood maple veneer',
};

// ──────────────────────────────────────────────────────────────────────────────
export default function OrderWizardPage() {
  const { slug }          = useParams();
  const [searchParams]    = useSearchParams();
  const navigate          = useNavigate();
  const { isLoggedIn, isVerified } = useAuth();
  const { addItem, updateItem, items: cartItems } = useCart();

  const product = useMemo(() => products.find(p => p.slug === slug), [slug]);

  // Pre-selections from PDP
  const preSize        = searchParams.get('size');
  const preOrientation = searchParams.get('orientation');
  const preBinding     = searchParams.get('binding');

  // Cart resume — read saved state once at mount
  const resumeCartId = searchParams.get('resume');
  const rs = resumeCartId
    ? (cartItems.find(i => i.id === resumeCartId)?.savedState ?? null)
    : null;

  const initSizeId = useMemo(() => {
    if (rs?.sizeId) return rs.sizeId;
    if (preSize && SIZES.find(s => s.id === preSize)) return preSize;
    return SIZES[0].id;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Wizard state ────────────────────────────────────────────────────────────
  const [step, setStep] = useState(rs?.step ?? 0);

  // UI state
  const [helpTopic, setHelpTopic]       = useState(null);
  const [paperFaqOpen, setPaperFaqOpen] = useState(false);

  // Step 0 — Files
  const [eventDate, setEventDate]     = useState(rs?.eventDate     ?? '');
  const [eventType, setEventType]     = useState(rs?.eventType     ?? '');
  const [eventTitle, setEventTitle]   = useState(rs?.eventTitle    ?? '');
  const [fileLink, setFileLink]       = useState(rs?.fileLink      ?? '');
  const [totalPages, setTotalPages]   = useState(rs?.totalPages    ?? 20);
  const [orderType, setOrderType]     = useState(rs?.orderType     ?? 'PRINT_READY');
  const [designBrief, setDesignBrief] = useState(rs?.designBrief   ?? '');

  // Step 1 — Paper
  const [lamination, setLamination]                   = useState(rs?.lamination           ?? '');
  const [specialPaperEnabled, setSpecialPaperEnabled] = useState(rs?.specialPaperEnabled  ?? false);
  const [specialPaperEntries, setSpecialPaperEntries] = useState(rs?.specialPaperEntries  ?? []);
  const [paperTypeId, setPaperTypeId]                 = useState(rs?.paperTypeId          ?? '');
  const [colorMode, setColorMode]                     = useState(rs?.colorMode            ?? '4C');

  // Step 2 — Cover
  const [sizeId, setSizeId]                 = useState(initSizeId);
  const [coverStyleId, setCoverStyleId]     = useState(rs?.coverStyleId   ?? '');
  const [coverMatId, setCoverMatId]         = useState(rs?.coverMatId     ?? '');
  const [coverColorHex, setCoverColorHex]   = useState(rs?.coverColorHex  ?? '');
  const [coverColorName, setCoverColorName] = useState(rs?.coverColorName ?? '');
  const [coverText, setCoverText]           = useState(rs?.coverText      ?? ['', '', '']);

  // Step 3 — Accessories
  const [addBox, setAddBox]                 = useState(rs?.addBox          ?? false);
  const [boxMatId, setBoxMatId]             = useState(rs?.boxMatId        ?? '');
  const [boxColorHex, setBoxColorHex]       = useState(rs?.boxColorHex     ?? '');
  const [boxColorName, setBoxColorName]     = useState(rs?.boxColorName    ?? '');
  const [bagOption, setBagOption]           = useState(rs?.bagOption       ?? 'none');
  // Others
  const [eBookEnabled]                      = useState(true);   // mandatory, always on
  const [calendarId, setCalendarId]         = useState(rs?.calendarId      ?? '');
  const [acrylicCalendar, setAcrylicCalendar] = useState(rs?.acrylicCalendar ?? false);
  const [replica, setReplica]               = useState(rs?.replica         ?? false);
  const [bundleItemId, setBundleItemId]     = useState(rs?.bundleItemId    ?? '');
  const [bundleSizeId, setBundleSizeId]     = useState(rs?.bundleSizeId    ?? '');
  const [bundleTextLines, setBundleTextLines] = useState(rs?.bundleTextLines ?? {});

  // Step 4 — Review
  const [specialInstructions, setSpecialInstructions] = useState(rs?.specialInstructions ?? '');

  // ── Derived data ────────────────────────────────────────────────────────────
  const selectedSize  = useMemo(() => SIZES.find(s => s.id === sizeId), [sizeId]);
  const selectedStyle = useMemo(() => COVER_STYLES.find(s => s.id === coverStyleId), [coverStyleId]);
  const selectedMat   = useMemo(() => selectedStyle?.materials.find(m => m.id === coverMatId), [selectedStyle, coverMatId]);
  const selectedPaper = useMemo(() => PAPER_TYPES.find(p => p.id === paperTypeId), [paperTypeId]);
  const selectedBag   = useMemo(() => BAG_OPTIONS.find(b => b.id === bagOption), [bagOption]);
  const selectedBoxMat = useMemo(() => BOX_MATERIALS.find(bm => bm.id === boxMatId), [boxMatId]);

  const compatiblePapers = useMemo(() => {
    if (!lamination) return [];
    const ids = LAM_COMPAT[lamination] || [];
    return PAPER_TYPES.filter(p => ids.includes(p.id));
  }, [lamination]);

  // ── Price calculation ───────────────────────────────────────────────────────
  const pricing = useMemo(() => {
    if (!product) return null;
    return calculatePrice({
      basePrice:             product.price,
      sizeModifier:          selectedSize?.priceModifier ?? 0,
      coverMaterialModifier: selectedMat?.priceModifier ?? 0,
      paperPricePerSheet:    selectedPaper?.pricePerSheet ?? 25,
      totalPages,
      colorMode,
      orderType,
    });
  }, [product, selectedSize, selectedMat, selectedPaper, totalPages, colorMode, orderType]);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (!isLoggedIn) return <Navigate to={`/login?redirect=/order/${slug}`} replace />;
  if (!product) {
    return (
      <div className="wizard-404">
        <div className="wizard-404__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <h2 className="wizard-404__title">Product Not Found</h2>
        <p className="wizard-404__sub">This product doesn't exist or may have been discontinued.</p>
        <Link to="/shop" className="wizard-404__cta">Browse Products</Link>
      </div>
    );
  }

  // ── Step validation ─────────────────────────────────────────────────────────
  const canProceed = () => {
    if (step === 0) return true; // Files — always valid
    if (step === 1) return !!(lamination && paperTypeId);
    if (step === 2) {
      if (!coverStyleId || !coverMatId || !coverColorHex) return false;
      if (selectedStyle && selectedStyle.textLineCount > 0 && !coverText[0].trim()) return false;
      return true;
    }
    if (step === 3) return true;
    return true;
  };

  // ── Change handlers with cascade resets ────────────────────────────────────
  const handleLaminationChange = (id) => {
    setLamination(id);
    const compat = LAM_COMPAT[id] || [];
    if (paperTypeId && !compat.includes(paperTypeId)) {
      setPaperTypeId('');
      // also reset special paper when main paper is reset
      setSpecialPaperEnabled(false);
      setSpecialPaperEntries([]);
    }
  };

  // ── Special paper helpers ───────────────────────────────────────────────────
  const createSpEntry = () => ({
    id: Date.now() + Math.random(),
    paperType: '',
    fromPage: 1,
    toPage: Math.min(4, totalPages),
    excludedPages: [],
  });

  const handleToggleSpecialPaper = () => {
    const next = !specialPaperEnabled;
    setSpecialPaperEnabled(next);
    if (next && specialPaperEntries.length === 0) {
      setSpecialPaperEntries([createSpEntry()]);
    }
    if (!next) setSpecialPaperEntries([]);
  };

  const updateSpEntry = (id, field, val) => {
    setSpecialPaperEntries(prev =>
      prev.map(e => e.id === id ? { ...e, [field]: val } : e)
    );
  };

  const removeSpEntry = (id) => {
    setSpecialPaperEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      if (next.length === 0) setSpecialPaperEnabled(false);
      return next;
    });
  };

  // ── Bundle helpers ──────────────────────────────────────────────────────────
  const handleBundleItemChange = (id) => {
    setBundleItemId(id);
    setBundleSizeId('');
    setBundleTextLines({});
  };

  const handleBundleText = (field, val) => {
    setBundleTextLines(prev => ({ ...prev, [field]: val }));
  };

  const handleStyleChange = (id) => {
    setCoverStyleId(id);
    setCoverMatId('');
    setCoverColorHex('');
    setCoverColorName('');
    setCoverText(['', '', '']);
  };

  const handleMatChange = (id) => {
    setCoverMatId(id);
    setCoverColorHex('');
    setCoverColorName('');
  };

  const handlePagesChange = (val) => {
    const num = parseInt(val) || 20;
    setTotalPages(Math.min(Math.max(num, 20), 80));
  };

  const toggleBox = (checked) => {
    setAddBox(checked);
    if (!checked) { setBoxMatId(''); setBoxColorHex(''); setBoxColorName(''); }
  };

  const handleBoxMatChange = (id) => {
    setBoxMatId(id);
    setBoxColorHex('');
    setBoxColorName('');
  };

  // ── Cart actions ────────────────────────────────────────────────────────────
  const buildSavedState = () => ({
    step,
    eventDate, eventType, eventTitle, fileLink, totalPages, orderType, designBrief,
    lamination, paperTypeId, colorMode, specialPaperEnabled, specialPaperEntries,
    sizeId, coverStyleId, coverMatId, coverColorHex, coverColorName, coverText,
    addBox, boxMatId, boxColorHex, boxColorName, bagOption,
    calendarId, acrylicCalendar, replica, bundleItemId, bundleSizeId, bundleTextLines,
    specialInstructions,
  });

  const buildCartItem = (complete) => ({
    productId: product.id,
    productName: product.name,
    productSlug: product.slug,
    collectionName: product.collection,
    price: pricing?.total ?? product.price,
    isComplete: complete,
    image: product.image,
    savedState: buildSavedState(),
    configuration: {
      eventDate, eventType, eventTitle,
      size: selectedSize?.label,
      orientation: preOrientation || undefined,
      binding: preBinding || undefined,
      pages: `${totalPages} sheets`,
      orderType: orderType === 'PRINT_READY' ? 'Print-Ready' : 'Design Service',
      fileLink,
      designBrief: orderType === 'DESIGN_SERVICE' ? designBrief : undefined,
      lamination: LAMINATIONS.find(l => l.id === lamination)?.name || '',
      paper: selectedPaper ? `${selectedPaper.name} · ${colorMode === '6C' ? '6-Color' : '4-Color'}` : '',
      cover: selectedStyle
        ? `${selectedStyle.name}${selectedMat ? ' — ' + selectedMat.name : ''}${coverColorName ? ' — ' + coverColorName : ''}`
        : '',
      coverText: coverText.filter(Boolean),
      box: addBox ? `Yes — ${selectedBoxMat?.name || ''} ${boxColorName}` : 'No',
      bag: selectedBag?.label || '',
      specialInstructions,
    },
  });

  const persistCart = (complete) => {
    const item = buildCartItem(complete);
    if (resumeCartId) updateItem(resumeCartId, item);
    else addItem(item);
  };

  const handleSaveToCart      = () => { persistCart(false); navigate('/cart'); };
  const handleProceedCheckout = () => { persistCart(true);  navigate('/checkout'); };

  const goToStep = (i) => { if (i < step) setStep(i); };

  return (
    <div className="wizard">
      <Breadcrumb />

      {/* ── Topbar ─────────────────────────────────────────────────────────── */}
      <div className="wizard__topbar">
        <div className="wizard__topbar-inner">
          <button className="wizard__back" onClick={() => navigate(-1)} aria-label="Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div>
            <h1 className="wizard__product-name">{product.name}</h1>
            <p className="wizard__product-collection">{product.collection} Collection</p>
          </div>
        </div>
      </div>

      {/* ── Stepper ────────────────────────────────────────────────────────── */}
      <div className="wizard__stepper-wrap">
        <div className="wizard__stepper">
          {STEPS.map((s, i) => (
            <div key={s} className="wizard__step-item">
              {i > 0 && (
                <div className={`wizard__step-line${i <= step ? ' wizard__step-line--done' : ''}`} />
              )}
              <button
                className={`wizard__step-circle${i === step ? ' wizard__step-circle--active' : i < step ? ' wizard__step-circle--done' : ''}`}
                onClick={() => goToStep(i)}
                disabled={i > step}
              >
                {i < step ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </button>
              <span className={`wizard__step-label${i === step ? ' wizard__step-label--active' : ''}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="wizard__body">
        <div className="wizard__content">

          {/* ════════════════════════════════════════════════════════════════
              STEP 0 — FILES
          ════════════════════════════════════════════════════════════════ */}
          {step === 0 && (
            <div className="wizard__section">
              <h2 className="wizard__section-title">Files &amp; Order Details</h2>

              {/* Event Details */}
              <div className="wizard__group">
                <p className="wizard__group-label">
                  Event Details
                  <InfoBtn topic="eventDetails" onOpen={setHelpTopic}/>
                  <span className="wizard__group-optional">optional</span>
                </p>
                <div className="wizard__event-row">
                  <div className="wizard__event-field">
                    <label className="wizard__field-label">Event Date</label>
                    <input
                      type="date"
                      className="wizard__text-input"
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                    />
                  </div>
                  <div className="wizard__event-field">
                    <label className="wizard__field-label">Event Type</label>
                    <select
                      className="wizard__select"
                      value={eventType}
                      onChange={e => setEventType(e.target.value)}
                    >
                      <option value="">Select type</option>
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="wizard__event-field wizard__event-field--wide">
                    <label className="wizard__field-label">Event Title</label>
                    <input
                      type="text"
                      className="wizard__text-input"
                      placeholder="e.g. Raj & Priya Wedding or Sharma Family Portrait"
                      value={eventTitle}
                      onChange={e => setEventTitle(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* File Link */}
              <div className="wizard__group">
                <p className="wizard__group-label">
                  File Link <span className="wizard__req">*</span>
                </p>
                <input
                  type="url"
                  className="wizard__text-input"
                  placeholder="https://drive.google.com/ or Dropbox / WeTransfer link"
                  value={fileLink}
                  onChange={e => setFileLink(e.target.value)}
                />
                <p className="wizard__field-note">Google Drive, Dropbox, WeTransfer, or any shareable cloud link. You can also send it to us after placing the order.</p>
              </div>

              {/* Number of Pages */}
              <div className="wizard__group">
                <p className="wizard__group-label">Number of Pages <span className="wizard__req">*</span></p>
                <div className="wizard__pages-row">
                  <div className="wizard__pages-stepper">
                    <button
                      className="wizard__pages-step-btn"
                      onClick={() => setTotalPages(p => Math.max(20, p - 2))}
                      disabled={totalPages <= 20}
                      type="button"
                    >−</button>
                    <input
                      type="number"
                      className="wizard__pages-input"
                      value={totalPages}
                      min={20}
                      max={80}
                      onChange={e => handlePagesChange(e.target.value)}
                    />
                    <button
                      className="wizard__pages-step-btn"
                      onClick={() => setTotalPages(p => Math.min(80, p + 2))}
                      disabled={totalPages >= 80}
                      type="button"
                    >+</button>
                  </div>
                  <span className="wizard__pages-hint">sheets · Min 20 · Max 80 · 1 sheet = 2 printed pages</span>
                </div>
              </div>

              {/* Order Type */}
              <div className="wizard__group">
                <p className="wizard__group-label">Order Type</p>
                <div className="wizard__order-types">
                  {[
                    {
                      id: 'PRINT_READY',
                      label: 'Print-Ready Files',
                      sub: 'You provide fully designed, print-ready files.',
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="9" y1="13" x2="15" y2="13"/>
                          <line x1="9" y1="17" x2="13" y2="17"/>
                        </svg>
                      ),
                    },
                    {
                      id: 'DESIGN_SERVICE',
                      label: 'Design Service',
                      sub: 'Our design team creates your album layout from raw photos.',
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M12 20h9"/>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                      ),
                    },
                  ].map(ot => (
                    <label
                      key={ot.id}
                      className={`wizard__order-type-card${orderType === ot.id ? ' wizard__order-type-card--active' : ''}`}
                    >
                      <input type="radio" name="orderType" value={ot.id} checked={orderType === ot.id} onChange={() => setOrderType(ot.id)}/>
                      <div className="wizard__ot-icon">{ot.icon}</div>
                      <div className="wizard__ot-info">
                        <p className="wizard__ot-label">{ot.label}</p>
                        <p className="wizard__ot-sub">{ot.sub}</p>
                      </div>
                      {orderType === ot.id && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="wizard__ot-check">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Design Brief — conditional on Design Service */}
              {orderType === 'DESIGN_SERVICE' && (
                <div className="wizard__group">
                  <p className="wizard__group-label">Design Brief <span className="wizard__group-optional">optional</span></p>
                  <textarea
                    className="wizard__textarea"
                    rows={4}
                    placeholder="e.g. Modern minimalist style, warm tones, candid-focused layout with full-bleed spreads…"
                    value={designBrief}
                    onChange={e => setDesignBrief(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 1 — PAPER
          ════════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="wizard__section">
              <h2 className="wizard__section-title">Paper &amp; Printing</h2>

              {/* Pages read-only summary */}
              <div className="wizard__pages-summary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span><strong>{totalPages} sheets</strong> · {totalPages * 2} printed pages</span>
                <button className="wizard__pages-edit-link" onClick={() => setStep(0)} type="button">Edit</button>
              </div>

              {/* Lamination */}
              <div className="wizard__group">
                <p className="wizard__group-label">
                  Lamination
                  <InfoBtn topic="lamination" onOpen={setHelpTopic}/>
                </p>
                <div className="wizard__lam-grid">
                  {LAMINATIONS.map(lam => (
                    <button
                      key={lam.id}
                      className={`wizard__lam-card${lamination === lam.id ? ' wizard__lam-card--active' : ''}`}
                      onClick={() => handleLaminationChange(lam.id)}
                      type="button"
                    >
                      <div className="wizard__lam-swatch" style={{ background: lam.bg }}/>
                      <div className="wizard__lam-info">
                        <p className="wizard__lam-name">{lam.name}</p>
                        <p className="wizard__lam-sub">{lam.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper Type — dropdown, revealed after lamination */}
              {lamination && (
                <div className="wizard__group">
                  <div className="wizard__paper-label-row">
                    <p className="wizard__group-label" style={{ marginBottom: 0 }}>
                      Paper Type
                      <InfoBtn topic="paper" onOpen={setHelpTopic}/>
                    </p>
                    <button
                      className="wizard__paper-faq-link"
                      onClick={() => setPaperFaqOpen(true)}
                      type="button"
                    >
                      Not sure which paper?
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                  <div className="wizard__paper-select-wrap">
                    <select
                      className="wizard__paper-select"
                      value={paperTypeId}
                      onChange={e => {
                        setPaperTypeId(e.target.value);
                        setSpecialPaperEnabled(false);
                        setSpecialPaperEntries([]);
                      }}
                    >
                      <option value="">Select paper type…</option>
                      {compatiblePapers.map(pt => (
                        <option key={pt.id} value={pt.id}>
                          {pt.isSpecial ? '★ ' : ''}{pt.name}
                        </option>
                      ))}
                    </select>
                    <svg className="wizard__paper-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>

                  {/* Selected paper detail panel */}
                  {selectedPaper && (
                    <div className="wizard__paper-detail">
                      <div className="wizard__paper-detail-header">
                        <span className="wizard__paper-detail-name">{selectedPaper.name}</span>
                        {selectedPaper.isSpecial && <span className="wizard__paper-special">Special</span>}
                      </div>
                      <p className="wizard__paper-detail-desc">{selectedPaper.description}</p>
                      <p className="wizard__paper-detail-range">Compatible with {selectedPaper.minPages}–{selectedPaper.maxPages} sheets</p>
                    </div>
                  )}
                </div>
              )}

              {/* Special Paper for Select Pages — gated behind paper selection */}
              {paperTypeId && (
                <div className="wizard__group">
                  <div className="wizard__sp-toggle-row">
                    <div>
                      <p className="wizard__group-label" style={{ marginBottom: 0 }}>Special Paper for Select Pages</p>
                      <p className="wizard__field-note" style={{ marginTop: '4px' }}>Apply a different paper to specific page ranges</p>
                    </div>
                    <button
                      className={`wizard__toggle-switch${specialPaperEnabled ? ' wizard__toggle-switch--on' : ''}`}
                      onClick={handleToggleSpecialPaper}
                      type="button"
                      role="switch"
                      aria-checked={specialPaperEnabled}
                    >
                      <span className="wizard__toggle-knob"/>
                    </button>
                  </div>

                  {specialPaperEnabled && (
                    <div className="wizard__sp-entries">
                      {specialPaperEntries.map((entry, ei) => (
                        <SpEntry
                          key={entry.id}
                          entry={entry}
                          index={ei}
                          totalPages={totalPages}
                          onUpdate={(field, val) => updateSpEntry(entry.id, field, val)}
                          onRemove={() => removeSpEntry(entry.id)}
                        />
                      ))}
                      {specialPaperEntries.length < 3 && (
                        <button
                          className="wizard__sp-add-btn"
                          onClick={() => setSpecialPaperEntries(prev => [...prev, createSpEntry()])}
                          type="button"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                          Add another special paper
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Color Printing — revealed after paper selection */}
              {paperTypeId && (
                <div className="wizard__group">
                  <p className="wizard__group-label">
                    Color Printing
                    <InfoBtn topic="colorMode" onOpen={setHelpTopic}/>
                  </p>
                  <div className="wizard__color-cards">
                    {[
                      {
                        id: '4C',
                        label: '4-Color CMYK',
                        sub: 'Standard high-quality colour printing. Included.',
                        icon: (
                          <div className="wizard__color-dots">
                            {['#00B4D8','#E63946','#FFBA08','#1a1a1a'].map(c => (
                              <span key={c} style={{ background: c }}/>
                            ))}
                          </div>
                        ),
                      },
                      {
                        id: '6C',
                        label: 'Hexachrome',
                        sub: 'Extended gamut for vivid, true-to-life colours.',
                        badge: null,
                        icon: (
                          <div className="wizard__color-dots">
                            {['#00B4D8','#E63946','#FFBA08','#1a1a1a','#2DC653','#FF6B35'].map(c => (
                              <span key={c} style={{ background: c }}/>
                            ))}
                          </div>
                        ),
                      },
                    ].map(cm => (
                      <button
                        key={cm.id}
                        className={`wizard__color-card${colorMode === cm.id ? ' wizard__color-card--active' : ''}`}
                        onClick={() => setColorMode(cm.id)}
                        type="button"
                      >
                        {cm.icon}
                        <div className="wizard__color-card-info">
                          <p className="wizard__color-card-label">{cm.label}</p>
                          <p className="wizard__color-card-sub">{cm.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 2 — COVER
          ════════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="wizard__section">
              <h2 className="wizard__section-title">Cover Configuration</h2>

              {/* Cover Design Style */}
              <div className="wizard__group">
                <p className="wizard__group-label">
                  Cover Design Style
                  <InfoBtn topic="coverDesign" onOpen={setHelpTopic}/>
                </p>
                <div className="wizard__design-grid">
                  {COVER_STYLES.map(cs => (
                    <button
                      key={cs.id}
                      className={`wizard__design-card${coverStyleId === cs.id ? ' wizard__design-card--active' : ''}`}
                      onClick={() => handleStyleChange(cs.id)}
                      type="button"
                    >
                      <div className="wizard__design-schematic">
                        <CoverSVG styleId={cs.id} color={cs.previewColor}/>
                      </div>
                      <div className="wizard__design-info">
                        <p className="wizard__design-name">{cs.name}</p>
                        <p className="wizard__design-lines">
                          {cs.textLineCount === 1 ? '1 text line' : `${cs.textLineCount} text lines`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Material — revealed after design selection */}
              {selectedStyle && (
                <div className="wizard__group">
                  <p className="wizard__group-label">
                    Material
                    <InfoBtn topic="coverMaterial" onOpen={setHelpTopic}/>
                  </p>
                  <div className="wizard__mat-list">
                    {selectedStyle.materials.map(m => (
                      <button
                        key={m.id}
                        className={`wizard__mat-card${coverMatId === m.id ? ' wizard__mat-card--active' : ''}`}
                        onClick={() => handleMatChange(m.id)}
                        type="button"
                      >
                        <div
                          className="wizard__mat-strip"
                          style={{ background: m.colors[0]?.hex || '#ccc' }}
                        />
                        <div className="wizard__mat-body">
                          <p className="wizard__mat-name">{m.name}</p>
                          <p className="wizard__mat-hint">{MAT_HINTS[m.id] || ''}</p>
                        </div>
                        <div className="wizard__mat-right">
                          <span className="wizard__mat-colors">
                            {m.colors.map(c => (
                              <span
                                key={c.hex}
                                className="wizard__mat-color-dot"
                                style={{ background: c.hex }}
                                title={c.name}
                              />
                            ))}
                          </span>
                        </div>
                        {coverMatId === m.id && (
                          <svg className="wizard__mat-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color — revealed after material selection */}
              {selectedMat && (
                <div className="wizard__group">
                  <p className="wizard__group-label">Colour</p>
                  <div className="wizard__swatches">
                    {selectedMat.colors.map(c => (
                      <button
                        key={c.hex}
                        className={`wizard__swatch${coverColorHex === c.hex ? ' wizard__swatch--active' : ''}`}
                        style={{ background: c.hex }}
                        title={c.name}
                        onClick={() => { setCoverColorHex(c.hex); setCoverColorName(c.name); }}
                        type="button"
                      />
                    ))}
                  </div>
                  {coverColorName && <p className="wizard__color-name">{coverColorName}</p>}
                </div>
              )}

              {/* Cover Text — revealed after color selection */}
              {selectedStyle && selectedStyle.textLineCount > 0 && coverColorHex && (
                <div className="wizard__group">
                  <p className="wizard__group-label">Cover Text</p>
                  {Array.from({ length: selectedStyle.textLineCount }).map((_, i) => (
                    <input
                      key={i}
                      className="wizard__text-input"
                      placeholder={i === 0 ? 'Line 1 (required)' : `Line ${i + 1} (optional)`}
                      value={coverText[i] || ''}
                      onChange={e => {
                        const next = [...coverText];
                        next[i] = e.target.value;
                        setCoverText(next);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 3 — ACCESSORIES
          ════════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="wizard__section">
              <h2 className="wizard__section-title">Accessories</h2>

              {/* Presentation Box toggle */}
              <div className="wizard__group">
                <p className="wizard__group-label">
                  Presentation Box
                  <InfoBtn topic="box" onOpen={setHelpTopic}/>
                </p>
                <label className={`wizard__box-toggle${addBox ? ' wizard__box-toggle--active' : ''}`}>
                  <input type="checkbox" checked={addBox} onChange={e => toggleBox(e.target.checked)}/>
                  <div className="wizard__box-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 8V21H3V8"/><path d="M23 3H1v5h22V3z"/><path d="M10 12h4"/>
                    </svg>
                  </div>
                  <div className="wizard__box-info">
                    <p className="wizard__box-label">Add Presentation Box</p>
                    <p className="wizard__box-sub">Premium keepsake box for gift presentation</p>
                  </div>
                  <div className={`wizard__box-check${addBox ? ' wizard__box-check--on' : ''}`}>
                    {addBox && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                </label>

                {/* Box Material — revealed when box is on */}
                {addBox && (
                  <div className="wizard__box-config">
                    <p className="wizard__group-label" style={{ marginTop: 'var(--space-5)' }}>Box Material</p>
                    <div className="wizard__mat-list">
                      {BOX_MATERIALS.map(bm => (
                        <button
                          key={bm.id}
                          className={`wizard__mat-card${boxMatId === bm.id ? ' wizard__mat-card--active' : ''}`}
                          onClick={() => handleBoxMatChange(bm.id)}
                          type="button"
                        >
                          <div
                            className="wizard__mat-strip"
                            style={{ background: bm.colors[0]?.hex || '#ccc' }}
                          />
                          <div className="wizard__mat-body">
                            <p className="wizard__mat-name">{bm.name}</p>
                            <p className="wizard__mat-hint">{bm.colors.length} colour options</p>
                          </div>
                          <div className="wizard__mat-right">
                            <span className="wizard__mat-colors">
                              {bm.colors.map(c => (
                                <span
                                  key={c.hex}
                                  className="wizard__mat-color-dot"
                                  style={{ background: c.hex }}
                                  title={c.name}
                                />
                              ))}
                            </span>
                          </div>
                          {boxMatId === bm.id && (
                            <svg className="wizard__mat-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Box Color — revealed when material selected */}
                    {boxMatId && (
                      <>
                        <p className="wizard__group-label" style={{ marginTop: 'var(--space-4)' }}>Box Colour</p>
                        <div className="wizard__swatches">
                          {selectedBoxMat?.colors.map(c => (
                            <button
                              key={c.hex}
                              className={`wizard__swatch${boxColorHex === c.hex ? ' wizard__swatch--active' : ''}`}
                              style={{ background: c.hex }}
                              title={c.name}
                              onClick={() => { setBoxColorHex(c.hex); setBoxColorName(c.name); }}
                              type="button"
                            />
                          ))}
                        </div>
                        {boxColorName && <p className="wizard__color-name">{boxColorName}</p>}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Bag Options */}
              <div className="wizard__group">
                <p className="wizard__group-label">Delivery Bag</p>
                <div className="wizard__bag-grid">
                  {BAG_OPTIONS.map(b => (
                    <button
                      key={b.id}
                      className={`wizard__bag-card${bagOption === b.id ? ' wizard__bag-card--active' : ''}`}
                      onClick={() => setBagOption(b.id)}
                      type="button"
                    >
                      <p className="wizard__bag-label">{b.label}</p>
                      <p className="wizard__bag-sub">{b.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Others — single grouped panel ──────────────────────── */}
              <div className="wizard__others-panel">
                <p className="wizard__others-heading">Others</p>

                {/* E-Book — mandatory, always on */}
                <div className="wizard__ebook-card">
                  <div className="wizard__ebook-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                  <div className="wizard__ebook-info">
                    <p className="wizard__ebook-label">Digital E-Book</p>
                    <p className="wizard__ebook-sub">A digital version of your album delivered via download link</p>
                  </div>
                  <span className="wizard__ebook-required">Required</span>
                </div>

                <div className="wizard__others-divider"/>

                {/* Calendar */}
                <p className="wizard__others-sub-label">
                  Calendar
                  <span className="wizard__group-optional">optional</span>
                </p>
                <div className="wizard__cal-grid">
                  {CALENDAR_OPTIONS.map(cal => (
                    <button
                      key={cal.id}
                      className={`wizard__cal-card${calendarId === cal.id ? ' wizard__cal-card--active' : ''}`}
                      onClick={() => setCalendarId(calendarId === cal.id ? '' : cal.id)}
                      type="button"
                    >
                      <div className="wizard__cal-schematic" style={{ background: cal.bg }}>
                        <CalendarSVG id={cal.id}/>
                      </div>
                      <p className="wizard__cal-name">{cal.name}</p>
                    </button>
                  ))}
                </div>

                {/* Acrylic Calendar + Replica */}
                <div className="wizard__toggle-row" style={{ marginTop: 'var(--space-3)' }}>
                  <label className={`wizard__simple-toggle${acrylicCalendar ? ' wizard__simple-toggle--on' : ''}`}>
                    <input type="checkbox" checked={acrylicCalendar} onChange={e => setAcrylicCalendar(e.target.checked)}/>
                    <div className="wizard__st-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div className="wizard__st-info">
                      <p className="wizard__st-label">Acrylic Calendar</p>
                      <p className="wizard__st-sub">Crystal-clear acrylic desk calendar</p>
                    </div>
                    <div className={`wizard__st-check${acrylicCalendar ? ' wizard__st-check--on' : ''}`}>
                      {acrylicCalendar && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </label>
                  <label className={`wizard__simple-toggle${replica ? ' wizard__simple-toggle--on' : ''}`}>
                    <input type="checkbox" checked={replica} onChange={e => setReplica(e.target.checked)}/>
                    <div className="wizard__st-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </div>
                    <div className="wizard__st-info">
                      <p className="wizard__st-label">Replica</p>
                      <p className="wizard__st-sub">A miniature copy of your album</p>
                    </div>
                    <div className={`wizard__st-check${replica ? ' wizard__st-check--on' : ''}`}>
                      {replica && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </label>
                </div>

                <div className="wizard__others-divider"/>

                {/* Bundle */}
                <p className="wizard__others-sub-label">
                  Bundle
                  <span className="wizard__group-optional">optional</span>
                </p>
                <div className="wizard__bundle-grid">
                  {BUNDLE_ITEMS.map(b => {
                    const cs = BUNDLE_CAT[b.cat] || { bg: '#eee', color: '#888' };
                    return (
                      <button
                        key={b.id}
                        className={`wizard__bundle-card${bundleItemId === b.id ? ' wizard__bundle-card--active' : ''}`}
                        onClick={() => handleBundleItemChange(bundleItemId === b.id ? '' : b.id)}
                        type="button"
                      >
                        <div className="wizard__bundle-icon-wrap" style={{ background: cs.bg }}>
                          <BundleIcon cat={b.cat}/>
                        </div>
                        <p className="wizard__bundle-name">{b.name}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Bundle config — appears inline as grouped panel when item selected */}
                {bundleItemId && (() => {
                  const b = BUNDLE_ITEMS.find(x => x.id === bundleItemId);
                  if (!b) return null;
                  const cs = BUNDLE_CAT[b.cat] || { bg: '#eee', color: '#888' };
                  return (
                    <div className="wizard__bundle-config">
                      <div className="wizard__bundle-config-header">
                        <div className="wizard__bundle-config-identity">
                          <span className="wizard__bundle-config-icon" style={{ background: cs.bg }}>
                            <BundleIcon cat={b.cat} size={18}/>
                          </span>
                          <span className="wizard__bundle-config-name">{b.name}</span>
                        </div>
                        <button
                          className="wizard__bundle-config-clear"
                          onClick={() => handleBundleItemChange('')}
                          type="button"
                        >Clear</button>
                      </div>

                      {b.needsSize && (
                        <div className="wizard__bundle-config-body">
                          <p className="wizard__bundle-config-label">Choose size</p>
                          <div className="wizard__bundle-sizes">
                            {b.sizes?.map(sz => (
                              <button
                                key={sz.id}
                                className={`wizard__bundle-size-card${bundleSizeId === sz.id ? ' wizard__bundle-size-card--active' : ''}`}
                                onClick={() => setBundleSizeId(sz.id)}
                                type="button"
                              >
                                {sz.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {b.needsText && (
                        <div className="wizard__bundle-config-body">
                          <p className="wizard__bundle-config-label">Personalisation text</p>
                          {b.textFields?.map(field => (
                            <div key={field} className="wizard__bundle-config-field">
                              <label className="wizard__field-label">{field}</label>
                              <input
                                type="text"
                                className="wizard__text-input"
                                placeholder={`Enter ${field.toLowerCase()}…`}
                                value={bundleTextLines[field] || ''}
                                onChange={e => handleBundleText(field, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 4 — REVIEW
          ════════════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="wizard__section">
              <h2 className="wizard__section-title">Review Your Order</h2>
              <p className="wizard__review-sub">{product.name} · {product.collection} Collection</p>

              {[
                {
                  title: 'Files & Event Details',
                  stepIdx: 0,
                  rows: [
                    eventDate && ['Event Date', new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
                    eventType && ['Event Type', eventType],
                    eventTitle && ['Event Title', eventTitle],
                    ['Pages', `${totalPages} sheets (${totalPages * 2} printed pages)`],
                    ['Order Type', orderType === 'PRINT_READY' ? 'Print-Ready Files' : 'Design Service'],
                    fileLink && ['File Link', fileLink.length > 48 ? fileLink.slice(0, 48) + '…' : fileLink],
                    (orderType === 'DESIGN_SERVICE' && designBrief) && ['Design Brief', designBrief.slice(0, 60) + (designBrief.length > 60 ? '…' : '')],
                  ].filter(Boolean),
                },
                {
                  title: 'Paper & Printing',
                  stepIdx: 1,
                  rows: (() => {
                    const lam = LAMINATIONS.find(l => l.id === lamination);
                    return [
                      lamination && ['Lamination', lam?.name || '—',
                        <span key="ls" className="wizard__rv-swatch" style={{ background: lam?.bg }}/>],
                      selectedPaper && ['Paper Type', selectedPaper.name,
                        selectedPaper.isSpecial
                          ? <span key="sp" className="wizard__rv-badge">★ Special</span>
                          : null],
                      ['Color Printing', colorMode === '6C' ? 'Hexachrome (6-Color)' : '4-Color CMYK',
                        <span key="cd" className="wizard__rv-dots">
                          {(colorMode === '6C'
                            ? ['#00B4D8','#E63946','#FFBA08','#1a1a1a','#2DC653','#FF6B35']
                            : ['#00B4D8','#E63946','#FFBA08','#1a1a1a']
                          ).map(c => <span key={c} style={{ background: c }}/>)}
                        </span>],
                    ].filter(Boolean);
                  })(),
                },
                {
                  title: 'Cover Configuration',
                  stepIdx: 2,
                  rows: [
                    ['Size', selectedSize?.label || '—'],
                    preOrientation && ['Orientation', preOrientation],
                    preBinding && ['Binding', preBinding],
                    selectedStyle && ['Cover Style', selectedStyle.name,
                      <span key="csv" className="wizard__rv-cover">
                        <CoverSVG styleId={selectedStyle.id} color={selectedStyle.previewColor}/>
                      </span>],
                    selectedMat && ['Material', selectedMat.name,
                      <span key="ms" className="wizard__rv-swatch" style={{ background: selectedMat.colors[0]?.hex }}/>],
                    coverColorName && ['Colour', coverColorName,
                      <span key="cc" className="wizard__rv-swatch wizard__rv-swatch--circle" style={{ background: coverColorHex }}/>],
                    ...coverText.filter(Boolean).map((t, i) => ([`Cover Line ${i + 1}`, t])),
                  ].filter(Boolean),
                },
                {
                  title: 'Accessories',
                  stepIdx: 3,
                  rows: [
                    ['Presentation Box',
                      addBox ? `Yes — ${selectedBoxMat?.name || ''}${boxColorName ? ' · ' + boxColorName : ''}` : 'No',
                      addBox && boxColorHex
                        ? <span key="bc" className="wizard__rv-swatch wizard__rv-swatch--circle" style={{ background: boxColorHex }}/>
                        : null],
                    ['Delivery Bag', selectedBag?.label || 'No Bag'],
                    ['Digital E-Book', 'Included'],
                    calendarId && ['Calendar', CALENDAR_OPTIONS.find(c => c.id === calendarId)?.name || '',
                      <span key="calv" className="wizard__rv-cal"><CalendarSVG id={calendarId}/></span>],
                    acrylicCalendar && ['Acrylic Calendar', 'Yes'],
                    replica && ['Replica', 'Yes'],
                    bundleItemId && (() => {
                      const b = BUNDLE_ITEMS.find(x => x.id === bundleItemId);
                      if (!b) return null;
                      let label = b.name;
                      if (b.needsSize && bundleSizeId) label += ` — ${b.sizes.find(s => s.id === bundleSizeId)?.name || ''}`;
                      return ['Bundle', label, <BundleIcon key="biv" cat={b.cat} size={20}/>];
                    })(),
                  ].filter(Boolean),
                },
              ].map(section => (
                <div key={section.title} className="wizard__review-section">
                  <div className="wizard__review-header">
                    <h3 className="wizard__review-title">{section.title}</h3>
                    <button className="wizard__review-edit" onClick={() => setStep(section.stepIdx)}>Edit</button>
                  </div>
                  <div className="wizard__review-rows">
                    {section.rows.map(([k, v, visual]) => (
                      <div key={k} className="wizard__review-row">
                        <span className="wizard__review-key">{k}</span>
                        <div className="wizard__review-val-cell">
                          {visual && <span className="wizard__review-visual">{visual}</span>}
                          <span className="wizard__review-val">{v}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="wizard__group">
                <p className="wizard__group-label">Special Instructions <span className="wizard__group-optional">optional</span></p>
                <textarea
                  className="wizard__textarea"
                  rows={3}
                  placeholder="Any additional notes or requests for our production team…"
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── Step Navigation ─────────────────────────────────────────────── */}
          <div className="wizard__nav">
            {/* Left: always-available save draft */}
            <button className="wizard__nav-save-draft" onClick={handleSaveToCart} type="button">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save &amp; exit
            </button>

            {/* Right: back + step action */}
            <div className="wizard__nav-right">
              {step > 0 && (
                <button className="wizard__nav-back" onClick={() => setStep(s => s - 1)}>← Back</button>
              )}
              {step < 4 ? (
                <button
                  className="wizard__nav-next"
                  disabled={!canProceed()}
                  onClick={() => setStep(s => s + 1)}
                >
                  {step === 3 ? 'Review Order' : `Next: ${STEPS[step + 1]}`}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              ) : (
                <div className="wizard__nav-final">
                  <button className="wizard__nav-save" onClick={handleSaveToCart}>Save to Cart</button>
                  <button className="wizard__nav-checkout" onClick={handleProceedCheckout}>
                    Proceed to Checkout
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Price Sidebar ──────────────────────────────────────────────────── */}
        <div className="wizard__sidebar">
          <div className="wizard__sidebar-card">
            <div className="wizard__sidebar-thumb">
              <img src={product.image} alt={product.name}/>
            </div>
            <p className="wizard__sidebar-product">{product.name}</p>
            <p className="wizard__sidebar-collection">{product.collection} Collection</p>

            {isVerified && (
              <div className="wizard__pro-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Verified pricing applied
              </div>
            )}

            {pricing && (
              <div className="wizard__price-breakdown">
                <div className="wizard__price-line">
                  <span>Base ({selectedSize?.label})</span>
                  <span>{fmt(pricing.base)}</span>
                </div>
                {pricing.cover > 0 && (
                  <div className="wizard__price-line">
                    <span>Cover material</span>
                    <span>{fmt(pricing.cover)}</span>
                  </div>
                )}
                {pricing.paper > 0 && (
                  <div className="wizard__price-line">
                    <span>Paper ({totalPages} sheets)</span>
                    <span>{fmt(pricing.paper)}</span>
                  </div>
                )}
                {pricing.colorSurcharge > 0 && (
                  <div className="wizard__price-line">
                    <span>Hexachrome (+15%)</span>
                    <span>{fmt(pricing.colorSurcharge)}</span>
                  </div>
                )}
                {pricing.designFee > 0 && (
                  <div className="wizard__price-line">
                    <span>Design service</span>
                    <span>{fmt(pricing.designFee)}</span>
                  </div>
                )}
                <div className="wizard__price-line wizard__price-line--sub">
                  <span>Subtotal</span>
                  <span>{fmt(pricing.subtotal)}</span>
                </div>
                <div className="wizard__price-line">
                  <span>GST (18%)</span>
                  <span>{fmt(pricing.tax)}</span>
                </div>
                <div className="wizard__price-line wizard__price-line--total">
                  <span>Total</span>
                  <span>{fmt(pricing.total)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile price bar ───────────────────────────────────────────────── */}
      {pricing && (
        <div className="wizard__mobile-bar">
          <div>
            <p className="wizard__mobile-label">Total</p>
            <p className="wizard__mobile-price">{fmt(pricing.total)}</p>
          </div>
          {step < 4 ? (
            <button
              className="wizard__mobile-next"
              disabled={!canProceed()}
              onClick={() => setStep(s => s + 1)}
            >
              {step === 3 ? 'Review' : 'Next'}
            </button>
          ) : (
            <button className="wizard__mobile-next" onClick={handleProceedCheckout}>
              Checkout
            </button>
          )}
        </div>
      )}

      {/* ── Help Modal overlay ─────────────────────────────────────────────── */}
      <HelpModal topic={helpTopic} onClose={() => setHelpTopic(null)}/>

      {/* ── Paper FAQ modal ────────────────────────────────────────────────── */}
      <PaperFaqModal open={paperFaqOpen} onClose={() => setPaperFaqOpen(false)}/>
    </div>
  );
}
