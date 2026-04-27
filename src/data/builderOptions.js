// ─────────────────────────────────────────────────────────────────────────────
// MYO Builder Options — Material ranges, filtering helpers, similarity scoring
// ─────────────────────────────────────────────────────────────────────────────
import { products } from './products';
import { sizeLabels, orientationOptions, bindingDescriptions, laminations, coverDesignPatterns, coverMaterials } from './pdpOptions';

// ── 12 Material Ranges ────────────────────────────────────────────────────────
export const materialRanges = [
  { id: 'leather',           name: 'Leather',            description: 'Full-grain leather with a rich, timeless finish',          swatch: '#4A2C1A' },
  { id: 'suede',             name: 'Suede',               description: 'Soft, velvety surface with a luxurious tactile feel',       swatch: '#7B6B57' },
  { id: 'fab-leather',       name: 'Fab Leather',         description: 'Designer fabric leather with contemporary patterns',        swatch: '#2D4A3E' },
  { id: 'plush-leather',     name: 'Plush Leather',       description: 'Ultra-soft premium leather with cushioned texture',         swatch: '#3D3D3D' },
  { id: 'eco-leather',       name: 'Eco Leather',         description: 'Sustainably sourced leatherette, eco-conscious choice',     swatch: '#5C4033' },
  { id: 'signature',         name: 'Signature',           description: "Canvera's most elegant range in 13 rich colours",           swatch: '#1A237E' },
  { id: 'wood',              name: 'Wood',                description: 'Natural wood covers with organic grain textures',           swatch: '#795548' },
  { id: 'melange-fabric',    name: 'Melange Fabric',      description: 'Woven melange fabric with artisan character',               swatch: '#8D6E63' },
  { id: 'metallic-gala',     name: 'Metallic Gala',       description: 'Shimmering metallic finish for a bold statement',           swatch: '#B0871C' },
  { id: 'printed-paper-foil',name: 'Printed Paper & Foil','description': 'Foil-accented printed covers with artistic flair',       swatch: '#4A148C' },
  { id: 'printed-paper',     name: 'Printed Paper',       description: 'Custom printed covers, full creative control',             swatch: '#0277BD' },
  { id: 'mixed-material',    name: 'Mixed Material',      description: 'Multi-material cover for a truly unique design',           swatch: '#1B5E20' },
];

// ── Material → Visualizer hex ─────────────────────────────────────────────────
export const materialColorMap = {
  'leather':            '#4A2C1A',
  'suede':              '#7B6B57',
  'fab-leather':        '#2D4A3E',
  'plush-leather':      '#3D3D3D',
  'eco-leather':        '#5C4033',
  'signature':          '#1A237E',
  'wood':               '#795548',
  'melange-fabric':     '#8D6E63',
  'metallic-gala':      '#B0871C',
  'printed-paper-foil': '#4A148C',
  'printed-paper':      '#0277BD',
  'mixed-material':     '#1B5E20',
};

// ── Cover colour → hex ────────────────────────────────────────────────────────
export const coverColorHex = {
  'Jet Black':     '#1A1A1A',
  'Charcoal':      '#36454F',
  'Ivory':         '#FFFFF0',
  'Pearl White':   '#F0EDE8',
  'Cream':         '#FFF8DC',
  'Midnight Blue': '#191970',
  'Burgundy':      '#800020',
  'Ebony Black':   '#1B1B1B',
  'Saddle Brown':  '#8B4513',
  'Camel Tan':     '#C19A6B',
  'Desert Gold':   '#C9A84C',
  'Burgundy Red':  '#8B0000',
  'Crimson':       '#DC143C',
  'Wine Red':      '#722F37',
  'Navy Blue':     '#000080',
  'Royal Teal':    '#005F60',
  'Stone Grey':    '#928E85',
  'Slate':         '#708090',
};

// ── Per-product metadata (material range, sizes, orientations, bindings) ──────
// Drives all MYO filtering logic without bloating products.js
const productMeta = {
  'luxury-celestial':      { materialRange: 'signature',          sizes: ['12x18','12x15'],                           orientations: ['Landscape','Portrait'],          bindings: ['Layflat','Flushmount'] },
  'eleganza-celestial':    { materialRange: 'signature',          sizes: ['12x18','12x15'],                           orientations: ['Landscape','Portrait'],          bindings: ['Layflat','Flushmount'] },
  'premium-mesmera':       { materialRange: 'leather',            sizes: ['12x18','12x15','12x12','11x16','10x14','a4'],orientations: ['Landscape','Portrait'],         bindings: ['Layflat','Absolute Layflat','Flushmount','Neo Flushmount'] },
  'premium-plush-leather': { materialRange: 'plush-leather',      sizes: ['12x18','12x15','12x12'],                   orientations: ['Landscape','Portrait'],          bindings: ['Layflat','Absolute Layflat','Flushmount','Neo Flushmount'] },
  'encanto':               { materialRange: 'melange-fabric',     sizes: ['12x18','12x15','12x12'],                   orientations: ['Landscape','Portrait','Square'],  bindings: ['Layflat','Absolute Layflat'] },
  'premium-vintage-wood':  { materialRange: 'wood',               sizes: ['12x18','12x15','12x12'],                   orientations: ['Landscape','Portrait','Square'],  bindings: ['Flushmount','Neo Flushmount'] },
  'premium-royalty':       { materialRange: 'mixed-material',     sizes: ['12x18','12x15','11x16','10x14','a4','12x12'],orientations: ['Landscape','Portrait'],         bindings: ['Absolute Layflat'] },
  'mirage':                { materialRange: 'fab-leather',        sizes: ['12x18','12x15','12x12'],                   orientations: ['Landscape','Portrait','Square'],  bindings: ['Layflat','Absolute Layflat','Flushmount','Neo Flushmount'] },
  'premium-metallica-gala':{ materialRange: 'metallic-gala',      sizes: ['12x18','12x15','12x12','a4'],              orientations: ['Landscape','Portrait'],          bindings: ['Layflat','Absolute Layflat','Flushmount','Neo Flushmount'] },
  'suede-leather':         { materialRange: 'suede',              sizes: ['12x18','12x15','12x12'],                   orientations: ['Landscape','Portrait'],          bindings: ['Layflat','Flushmount','Neo Flushmount','Absolute Layflat'] },
  'fab-leather':           { materialRange: 'fab-leather',        sizes: ['12x18','12x15','12x12','11x16','10x14','a4'],orientations: ['Landscape','Portrait'],         bindings: ['Layflat','Absolute Layflat','Flushmount','Neo Flushmount'] },
  'premium-ornato':        { materialRange: 'melange-fabric',     sizes: ['12x18','12x15','12x12'],                   orientations: ['Landscape'],                     bindings: ['Layflat','Absolute Layflat','Flushmount','Neo Flushmount'] },
  'luxury-cover':          { materialRange: 'leather',            sizes: ['12x18','12x15','11x16','10x14','a4','12x12'],orientations: ['Landscape','Portrait'],         bindings: ['Layflat','Absolute Layflat','Flushmount','Neo Flushmount'] },
  'premium-amora':         { materialRange: 'printed-paper-foil', sizes: ['12x18','12x15','12x12'],                   orientations: ['Landscape','Portrait','Square'],  bindings: ['Layflat','Absolute Layflat','Flushmount','Neo Flushmount'] },
  'allura':                { materialRange: 'mixed-material',     sizes: ['12x18','12x15','12x12','10x14','a4'],       orientations: ['Landscape','Portrait'],          bindings: ['Layflat','Absolute Layflat'] },
  'premium-signature':     { materialRange: 'signature',          sizes: ['12x18','12x15','11x16','10x14','a4','12x12'],orientations: ['Landscape','Portrait'],         bindings: ['Layflat','Absolute Layflat','Flushmount','Neo Flushmount'] },
  'premium-fusion':        { materialRange: 'printed-paper',      sizes: ['12x18','12x15','12x12','a4'],              orientations: ['Landscape','Portrait'],          bindings: ['Layflat','Absolute Layflat','Continuous'] },
  'standard-melange':      { materialRange: 'melange-fabric',     sizes: ['12x18','12x15','12x12','a4'],              orientations: ['Landscape','Portrait','Square'],  bindings: ['Layflat','Absolute Layflat'] },
  'acroluxe':              { materialRange: 'eco-leather',        sizes: ['12x18','12x15','12x12','a4'],              orientations: ['Landscape','Portrait'],          bindings: ['Layflat','Absolute Layflat'] },
  'standard-custom':       { materialRange: 'printed-paper',      sizes: ['12x18','12x15','12x12','a4'],              orientations: ['Landscape','Portrait','Square'],  bindings: ['Layflat','Absolute Layflat'] },
};

// ── Filtering helpers ─────────────────────────────────────────────────────────

export function getSizesForMaterial(material) {
  const photobooks = products.filter(p => p.category === 'Photobooks');
  const sizeSet = new Set();
  photobooks.forEach(p => {
    const meta = productMeta[p.slug];
    if (meta && meta.materialRange === material) {
      meta.sizes.forEach(s => sizeSet.add(s));
    }
  });
  // Maintain consistent display order
  const order = ['12x18','12x15','11x16','10x14','12x12','a4'];
  return order.filter(id => sizeSet.has(id)).map(id => sizeLabels[id]);
}

export function getOrientationsForMaterial(material) {
  const photobooks = products.filter(p => p.category === 'Photobooks');
  const orientSet = new Set();
  photobooks.forEach(p => {
    const meta = productMeta[p.slug];
    if (meta && meta.materialRange === material) {
      meta.orientations.forEach(o => orientSet.add(o));
    }
  });
  return orientationOptions.filter(o => orientSet.has(o.id));
}

export function getBindingsForSelection(material, size, orientation) {
  const photobooks = products.filter(p => p.category === 'Photobooks');
  const bindingSet = new Set();
  photobooks.forEach(p => {
    const meta = productMeta[p.slug];
    if (
      meta &&
      meta.materialRange === material &&
      (!size || meta.sizes.includes(size)) &&
      (!orientation || meta.orientations.includes(orientation))
    ) {
      meta.bindings.forEach(b => bindingSet.add(b));
    }
  });
  const order = ['Layflat','Absolute Layflat','Flushmount','Neo Flushmount','Continuous'];
  return order
    .filter(id => bindingSet.has(id))
    .map(id => bindingDescriptions[id])
    .filter(Boolean);
}

export function getLaminations() {
  return laminations;
}

export function getCoverDesigns() {
  return coverDesignPatterns;
}

export function getCoverMaterials() {
  return coverMaterials;
}

export function getCoverColors(coverMaterialId) {
  const mat = coverMaterials.find(m => m.id === coverMaterialId);
  return mat ? mat.colors : [];
}

// ── Similarity scoring ─────────────────────────────────────────────────────────
// material match +3 | size match +2 | orientation match +1 | binding match +1
export function findSimilarProducts(state) {
  const photobooks = products.filter(p => p.category === 'Photobooks');
  return photobooks
    .map(p => {
      const meta = productMeta[p.slug];
      if (!meta) return { product: p, score: 0 };
      let score = 0;
      if (meta.materialRange === state.material)              score += 3;
      if (state.size        && meta.sizes.includes(state.size))        score += 2;
      if (state.orientation && meta.orientations.includes(state.orientation)) score += 1;
      if (state.binding     && meta.bindings.includes(state.binding))  score += 1;
      return { product: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ product }) => product);
}
