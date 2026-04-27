import { useReducer, useMemo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  materialRanges, materialColorMap, coverColorHex,
  getSizesForMaterial, getOrientationsForMaterial, getBindingsForSelection,
  getLaminations, getCoverDesigns, getCoverMaterials, getCoverColors,
  findSimilarProducts,
} from '../data/builderOptions';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import './MakeYourOwnPage.css';

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  step: 1,
  material: null,
  size: null,
  orientation: null,
  binding: null,
  lamination: null,
  coverDesign: null,
  coverMaterial: null,
  coverColor: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MATERIAL':
      return { ...initialState, step: 2, material: action.value };
    case 'SET_SIZE':
      return { ...state, size: action.value };
    case 'SET_ORIENTATION':
      return { ...state, orientation: action.value, step: 3 };
    case 'SET_BINDING':
      return { ...state, binding: action.value, step: 4 };
    case 'SET_LAMINATION':
      return { ...state, lamination: action.value, step: 5 };
    case 'SET_COVER_DESIGN':
      return { ...state, coverDesign: action.value, coverMaterial: null, coverColor: null, step: 6 };
    case 'SET_COVER_MATERIAL':
      return { ...state, coverMaterial: action.value, coverColor: null };
    case 'SET_COVER_COLOR':
      return { ...state, coverColor: action.value, step: 7 };
    case 'GO_TO_STEP': {
      const t = action.step;
      if (t <= 1) return { ...initialState };
      const cleared = {};
      if (t <= 2) Object.assign(cleared, { size: null, orientation: null, binding: null, lamination: null, coverDesign: null, coverMaterial: null, coverColor: null });
      else if (t <= 3) Object.assign(cleared, { binding: null, lamination: null, coverDesign: null, coverMaterial: null, coverColor: null });
      else if (t <= 4) Object.assign(cleared, { lamination: null, coverDesign: null, coverMaterial: null, coverColor: null });
      else if (t <= 5) Object.assign(cleared, { coverDesign: null, coverMaterial: null, coverColor: null });
      else if (t <= 6) Object.assign(cleared, { coverMaterial: null, coverColor: null });
      return { ...state, ...cleared, step: t };
    }
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Lamination Icon SVG
// ─────────────────────────────────────────────────────────────────────────────
function LaminationIcon({ id }) {
  if (id === 'glossy') return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="myo-card__icon" aria-hidden="true">
      <rect x="4" y="4" width="32" height="32" rx="8" fill="var(--brand-petrol)" fillOpacity="0.1" />
      <line x1="10" y1="13" x2="24" y2="8"  stroke="var(--brand-petrol)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="14" y1="20" x2="30" y2="12" stroke="var(--brand-petrol)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
  if (id === 'matte') return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="myo-card__icon" aria-hidden="true">
      <rect x="4" y="4" width="32" height="32" rx="8" fill="var(--brand-petrol)" fillOpacity="0.1" />
      {[11,17,23,29].map(y => (
        <line key={y} x1="10" y1={y} x2="30" y2={y} stroke="var(--brand-petrol)" strokeWidth="1.5" strokeOpacity="0.4" />
      ))}
    </svg>
  );
  if (id === 'soft-touch') return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="myo-card__icon" aria-hidden="true">
      <rect x="4" y="4" width="32" height="32" rx="8" fill="var(--brand-petrol)" fillOpacity="0.1" />
      {[0,1,2].map(i => (
        <path key={i} d={`M 8 ${14+i*6} Q 14 ${10+i*6} 20 ${14+i*6} Q 26 ${18+i*6} 32 ${14+i*6}`}
          fill="none" stroke="var(--brand-petrol)" strokeWidth="1.5" strokeOpacity="0.45" />
      ))}
    </svg>
  );
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="myo-card__icon" aria-hidden="true">
      <rect x="4" y="4" width="32" height="32" rx="8" fill="var(--neutral-100)" />
      <line x1="12" y1="12" x2="28" y2="28" stroke="var(--text-disabled)" strokeWidth="1.5" />
      <line x1="28" y1="12" x2="12" y2="28" stroke="var(--text-disabled)" strokeWidth="1.5" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover Pattern Icon SVG
// ─────────────────────────────────────────────────────────────────────────────
function CoverPatternIcon({ id, color }) {
  const fill = color || '#005780';
  if (id === 'clean-minimal') return (
    <svg width="48" height="64" viewBox="0 0 48 64" className="myo-card__icon" aria-hidden="true">
      <rect x="2" y="2" width="44" height="60" rx="4" fill={fill} fillOpacity="0.14" stroke={fill} strokeWidth="1.5" strokeOpacity="0.35" />
    </svg>
  );
  if (id === 'split-duo') return (
    <svg width="48" height="64" viewBox="0 0 48 64" className="myo-card__icon" aria-hidden="true">
      <rect x="2" y="2" width="44" height="60" rx="4" fill={fill} fillOpacity="0.1" stroke={fill} strokeWidth="1.5" strokeOpacity="0.35" />
      <rect x="2" y="2" width="22" height="60" rx="4" fill={fill} fillOpacity="0.18" />
      <line x1="24" y1="2" x2="24" y2="62" stroke={fill} strokeWidth="2" strokeOpacity="0.4" />
    </svg>
  );
  if (id === 'window-frame') return (
    <svg width="48" height="64" viewBox="0 0 48 64" className="myo-card__icon" aria-hidden="true">
      <rect x="2" y="2" width="44" height="60" rx="4" fill={fill} fillOpacity="0.14" stroke={fill} strokeWidth="1.5" strokeOpacity="0.35" />
      <rect x="10" y="13" width="28" height="34" rx="2" fill="none" stroke={fill} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.55" />
    </svg>
  );
  return (
    <svg width="48" height="64" viewBox="0 0 48 64" className="myo-card__icon" aria-hidden="true">
      <rect x="2" y="2" width="44" height="60" rx="4" fill={fill} fillOpacity="0.14" stroke={fill} strokeWidth="1.5" strokeOpacity="0.35" />
      <line x1="8" y1="42" x2="40" y2="42" stroke={fill} strokeWidth="1" strokeOpacity="0.3" />
      <rect x="8" y="44" width="32" height="12" rx="2" fill={fill} fillOpacity="0.15" />
      <rect x="14" y="48" width="16" height="2.5" rx="1" fill={fill} fillOpacity="0.4" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Size Chart Modal
// ─────────────────────────────────────────────────────────────────────────────
function SizeChartModal({ sizes, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="myo__modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Size chart">
      <div className="myo__modal" onClick={e => e.stopPropagation()}>
        <div className="myo__modal-header">
          <h3 className="myo__modal-title">Size Chart</h3>
          <button className="myo__modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="myo__modal-body">
          <table className="myo__size-table">
            <thead>
              <tr><th>Size</th><th>Format</th><th>Dimensions</th><th>Print Area</th></tr>
            </thead>
            <tbody>
              {sizes.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.label}</strong></td>
                  <td>{s.format}</td>
                  <td>{s.cm}</td>
                  <td>{s.printArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step metadata
// ─────────────────────────────────────────────────────────────────────────────
const STEP_META = [
  null, // 1-indexed
  { label: 'Choose a Range' },
  { label: 'Size & Orientation' },
  { label: 'Binding Style' },
  { label: 'Lamination Finish' },
  { label: 'Cover Design' },
  { label: 'Cover Material & Colour' },
  { label: 'Your Photobook' },
];

const TOTAL_STEPS = 7;

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function MakeYourOwnPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [shareCopied,   setShareCopied]   = useState(false);

  // Colour for cover pattern previews
  const vizColor = useMemo(() => {
    if (state.coverColor && coverColorHex[state.coverColor]) return coverColorHex[state.coverColor];
    if (state.material && materialColorMap[state.material])  return materialColorMap[state.material];
    return '#005780';
  }, [state.coverColor, state.material]);

  // Selection trail — clickable chips
  const trail = useMemo(() => {
    const crumbs = [];
    const mat = materialRanges.find(m => m.id === state.material);
    if (mat) crumbs.push({ label: mat.name, step: 1 });
    if (state.size) {
      const s = getSizesForMaterial(state.material).find(x => x.id === state.size);
      if (s) crumbs.push({ label: s.label, step: 2 });
    }
    if (state.orientation) crumbs.push({ label: state.orientation, step: 2 });
    if (state.binding)     crumbs.push({ label: state.binding, step: 3 });
    if (state.lamination) {
      const l = getLaminations().find(x => x.id === state.lamination);
      if (l) crumbs.push({ label: l.name, step: 4 });
    }
    if (state.coverDesign) {
      const d = getCoverDesigns().find(x => x.id === state.coverDesign);
      if (d) crumbs.push({ label: d.name, step: 5 });
    }
    if (state.coverMaterial) {
      const m = getCoverMaterials().find(x => x.id === state.coverMaterial);
      if (m) crumbs.push({ label: m.name, step: 6 });
    }
    if (state.coverColor) crumbs.push({ label: state.coverColor, step: 6 });
    return crumbs;
  }, [state]);

  // Similar products for step 7
  const similarProducts = useMemo(() => {
    if (state.step !== 7) return [];
    return findSimilarProducts(state);
  }, [state]);

  const handleShare = useCallback(() => {
    const params = new URLSearchParams();
    ['material','size','orientation','binding','lamination','coverDesign','coverMaterial','coverColor']
      .forEach(k => { if (state[k]) params.set(k, state[k]); });
    navigator.clipboard.writeText(`${window.location.origin}/custom?${params.toString()}`).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  }, [state]);

  const handleFindSimilar = useCallback(() => {
    navigate(similarProducts.length > 0 ? `/products/${similarProducts[0].slug}` : '/shop');
  }, [similarProducts, navigate]);

  const progressPct  = ((state.step - 1) / (TOTAL_STEPS - 1)) * 100;
  const stepMeta     = STEP_META[state.step];

  // Derived option data
  const sizes       = state.material ? getSizesForMaterial(state.material) : [];
  const orientations = state.material ? getOrientationsForMaterial(state.material) : [];
  const bindings    = state.material ? getBindingsForSelection(state.material, state.size, state.orientation) : [];
  const lams        = getLaminations();
  const designs     = getCoverDesigns();
  const covMats     = getCoverMaterials();
  const colors      = state.coverMaterial ? getCoverColors(state.coverMaterial) : [];

  return (
    <div className="myo">
      <Breadcrumb />

      <div className="myo__bounded">

        {/* ── Progress ─────────────────────────────────────────────────── */}
        <div className="myo__progress-wrap">
          <div className="myo__progress-bar">
            <div className="myo__progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="myo__progress-label">Step {state.step} of {TOTAL_STEPS}</span>
        </div>

        {/* ── Selection trail ───────────────────────────────────────────── */}
        {trail.length > 0 && (
          <div className="myo__trail">
            {trail.map((crumb, i) => (
              <button
                key={i}
                className="myo__trail-chip"
                onClick={() => dispatch({ type: 'GO_TO_STEP', step: crumb.step })}
              >
                {crumb.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Step header ───────────────────────────────────────────────── */}
        <div className="myo__step-header" key={`h-${state.step}`}>
          <p className="myo__step-eyebrow">Step {state.step}</p>
          <h1 className="myo__step-title">{stepMeta?.label}</h1>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            STEP 1 — Material Range (12 options)
            4-col visual grid: colour swatch + name
        ════════════════════════════════════════════════════════════════ */}
        {state.step === 1 && (
          <div className="myo-fade-in">
            <div className="myo-grid myo-grid--4">
              {materialRanges.map(mat => (
                <button
                  key={mat.id}
                  className={`myo-card myo-card--center ${state.material === mat.id ? 'myo-card--selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_MATERIAL', value: mat.id })}
                >
                  <span className="myo-card__swatch" style={{ background: mat.swatch }} />
                  <span className="myo-card__name">{mat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 2 — Size & Orientation
            Sizes as compact pill-chips; orientation as 3 visual cards
        ════════════════════════════════════════════════════════════════ */}
        {state.step === 2 && (
          <div className="myo-fade-in">
            {/* Size */}
            <div className="myo__sub-step">
              <div className="myo__sub-step-header">
                <h4 className="myo__sub-step-title">Size</h4>
                <button className="myo__chart-link" onClick={() => setShowSizeChart(true)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 3h18v18H3zM3 9h18M9 3v18"/>
                  </svg>
                  Size chart
                </button>
              </div>
              <div className="myo-chips">
                {sizes.map(s => (
                  <button
                    key={s.id}
                    className={`myo-chip ${state.size === s.id ? 'myo-chip--active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_SIZE', value: s.id })}
                  >
                    <span className="myo-chip__label">{s.label}</span>
                    <span className="myo-chip__sub">{s.cm}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation — appears after size selected */}
            {state.size && (
              <div className="myo__sub-step myo-fade-in">
                <h4 className="myo__sub-step-title">Orientation</h4>
                <div className="myo-grid myo-grid--3">
                  {orientations.map(o => (
                    <button
                      key={o.id}
                      className={`myo-card myo-card--center ${state.orientation === o.id ? 'myo-card--selected' : ''}`}
                      onClick={() => dispatch({ type: 'SET_ORIENTATION', value: o.id })}
                    >
                      <span className={`myo-ori-glyph myo-ori-glyph--${o.id.toLowerCase()}`} aria-hidden="true" />
                      <span className="myo-card__name">{o.name}</span>
                      <span className="myo-card__hint">{o.bestFor}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 3 — Binding Style (2–3 options)
            2-col cards: name + one-line description
        ════════════════════════════════════════════════════════════════ */}
        {state.step === 3 && (
          <div className="myo-fade-in">
            <div className="myo-grid myo-grid--2">
              {bindings.map(b => (
                <button
                  key={b.id}
                  className={`myo-card myo-card--binding ${state.binding === b.id ? 'myo-card--selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_BINDING', value: b.id })}
                >
                  <span className="myo-card__name">{b.name}</span>
                  <span className="myo-card__desc">{b.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 4 — Lamination (4 options)
            4-col visual tiles: icon + name
        ════════════════════════════════════════════════════════════════ */}
        {state.step === 4 && (
          <div className="myo-fade-in">
            <div className="myo-grid myo-grid--4">
              {lams.map(lam => (
                <button
                  key={lam.id}
                  className={`myo-card myo-card--center ${state.lamination === lam.id ? 'myo-card--selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_LAMINATION', value: lam.id })}
                >
                  <LaminationIcon id={lam.id} />
                  <span className="myo-card__name">{lam.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 5 — Cover Design (4 options)
            4-col: pattern SVG preview + name
        ════════════════════════════════════════════════════════════════ */}
        {state.step === 5 && (
          <div className="myo-fade-in">
            <div className="myo-grid myo-grid--4">
              {designs.map(d => (
                <button
                  key={d.id}
                  className={`myo-card myo-card--center ${state.coverDesign === d.id ? 'myo-card--selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_COVER_DESIGN', value: d.id })}
                >
                  <CoverPatternIcon id={d.id} color={vizColor} />
                  <span className="myo-card__name">{d.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 6 — Cover Material & Colour
            Material as compact pills; colours as swatches
        ════════════════════════════════════════════════════════════════ */}
        {state.step === 6 && (
          <div className="myo-fade-in">
            {/* Material */}
            <div className="myo__sub-step">
              <h4 className="myo__sub-step-title">Cover Material</h4>
              <div className="myo-chips">
                {covMats.map(m => (
                  <button
                    key={m.id}
                    className={`myo-chip ${state.coverMaterial === m.id ? 'myo-chip--active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_COVER_MATERIAL', value: m.id })}
                  >
                    <span className="myo-chip__label">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colour — only after material selected */}
            {state.coverMaterial && colors.length > 0 && (
              <div className="myo__sub-step myo-fade-in">
                <h4 className="myo__sub-step-title">Colour</h4>
                <div className="myo__color-grid">
                  {colors.map(c => (
                    <button
                      key={c}
                      className={`myo-color-swatch ${state.coverColor === c ? 'myo-color-swatch--selected' : ''}`}
                      style={{ background: coverColorHex[c] || '#ccc' }}
                      title={c}
                      onClick={() => dispatch({ type: 'SET_COVER_COLOR', value: c })}
                      aria-label={c}
                      aria-pressed={state.coverColor === c}
                    >
                      {state.coverColor === c && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                <div className="myo__color-labels">
                  {colors.map(c => (
                    <span key={c} className={`myo__color-label ${state.coverColor === c ? 'myo__color-label--active' : ''}`}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 7 — Your Photobook
        ════════════════════════════════════════════════════════════════ */}
        {state.step === 7 && (
          <div className="myo-fade-in">

            {/* Compact summary */}
            <div className="myo__summary">
              {[
                ['Range',          materialRanges.find(m => m.id === state.material)?.name],
                ['Size',           getSizesForMaterial(state.material).find(s => s.id === state.size)?.label],
                ['Orientation',    state.orientation],
                ['Binding',        state.binding],
                ['Lamination',     getLaminations().find(l => l.id === state.lamination)?.name],
                ['Cover Design',   getCoverDesigns().find(d => d.id === state.coverDesign)?.name],
                ['Cover Material', getCoverMaterials().find(m => m.id === state.coverMaterial)?.name],
                ['Cover Colour',   state.coverColor],
              ].filter(([, v]) => v).map(([key, val]) => (
                <div key={key} className="myo__summary-item">
                  <span className="myo__summary-key">{key}</span>
                  <span className="myo__summary-val">{val}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="myo__actions">
              <button
                className={`myo__btn myo__btn--primary ${shareCopied ? 'myo__btn--copied' : ''}`}
                onClick={handleShare}
              >
                {shareCopied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Link Copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Share Configuration
                  </>
                )}
              </button>

              <button className="myo__btn myo__btn--secondary" onClick={handleFindSimilar}>
                Browse Similar Products
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <button
                className="myo__restart-btn"
                onClick={() => dispatch({ type: 'GO_TO_STEP', step: 1 })}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
                </svg>
                Start over
              </button>
            </div>

            {/* Matching products — uses platform ProductCard component */}
            {similarProducts.length > 0 && (
              <div className="myo__similar">
                <h3 className="myo__similar-title">Products matching your selections</h3>
                <div className="myo-grid myo-grid--3">
                  {similarProducts.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <SizeChartModal sizes={sizes} onClose={() => setShowSizeChart(false)} />
      )}
    </div>
  );
}
