/* ==========================================================================
   Make Your Own — Builder Options
   Provides material ranges and filtering helpers for the visual builder flow.
   Derives available options from products.js and pdpOptions.js.
   ========================================================================== */

import products from './products'
import {
  sizeLabels,
  orientationOptions,
  bindingDescriptions,
  laminations,
  coverDesignPatterns,
  coverMaterials,
} from './pdpOptions'

/* ---------- Photobook products only ---------- */
const photobooks = products.filter(p => p.category === 'Photobooks')

/* ==========================================================================
   Step 1 — Material Ranges
   Each range is a material family with visual metadata.
   ========================================================================== */
export const materialRanges = [
  {
    id: 'Leather',
    name: 'Leather',
    description: 'Full-grain leather with a rich, timeless finish',
    swatch: '#4A2C1A',
    icon: 'leather',
  },
  {
    id: 'Suede',
    name: 'Suede',
    description: 'Soft, velvety surface with a luxurious tactile feel',
    swatch: '#3B4D6B',
    icon: 'suede',
  },
  {
    id: 'Fab Leather',
    name: 'Fab Leather',
    description: 'Designer fabric leather with contemporary patterns',
    swatch: '#6B4F3A',
    icon: 'fab-leather',
  },
  {
    id: 'Plush Leather',
    name: 'Plush Leather',
    description: 'Ultra-soft premium leather with cushioned texture',
    swatch: '#5C3A28',
    icon: 'plush-leather',
  },
  {
    id: 'Eco Leather',
    name: 'Eco Leather',
    description: 'Sustainably sourced leather, eco-conscious choice',
    swatch: '#7A8B6E',
    icon: 'eco-leather',
  },
  {
    id: 'Signature',
    name: 'Signature',
    description: 'Canvera\'s most elegant range in 13 rich colours',
    swatch: '#1A2028',
    icon: 'signature',
  },
  {
    id: 'Wood',
    name: 'Wood',
    description: 'Natural wood covers with organic grain textures',
    swatch: '#8B6E4E',
    icon: 'wood',
  },
  {
    id: 'Melange Fabric',
    name: 'Melange Fabric',
    description: 'Woven melange fabric with artisan character',
    swatch: '#9B8F80',
    icon: 'fabric',
  },
  {
    id: 'Metallic Gala',
    name: 'Metallic Gala',
    description: 'Shimmering metallic finish for a bold statement',
    swatch: '#B8A88A',
    icon: 'metallic',
  },
  {
    id: 'Printed Paper with Foiling',
    name: 'Printed Paper & Foil',
    description: 'Foil-accented printed covers with artistic flair',
    swatch: '#C4A96A',
    icon: 'foil',
  },
  {
    id: 'Printed Paper',
    name: 'Printed Paper',
    description: 'Custom printed covers, full creative control',
    swatch: '#E8E4DE',
    icon: 'paper',
  },
  {
    id: 'Mixed Material',
    name: 'Mixed Material',
    description: 'Multi-material cover for a unique design',
    swatch: '#7A7068',
    icon: 'mixed',
  },
]

/* ==========================================================================
   Step 2 — Sizes & Orientations filtered by material
   ========================================================================== */
export function getSizesForMaterial(material) {
  const matching = photobooks.filter(p => p.material === material)
  const sizeSet = new Set()
  matching.forEach(p => p.sizes.forEach(s => sizeSet.add(s)))
  return [...sizeSet]
    .filter(s => sizeLabels[s])
    .map(s => ({ id: s, ...sizeLabels[s] }))
}

export function getOrientationsForMaterial(material) {
  const matching = photobooks.filter(p => p.material === material)
  const oriSet = new Set()
  matching.forEach(p => p.orientations.forEach(o => oriSet.add(o)))
  return orientationOptions.filter(o => oriSet.has(o.id))
}

/* ==========================================================================
   Step 3 — Bindings filtered by material + size + orientation
   ========================================================================== */
export function getBindingsForSelection(material, size, orientation) {
  const matching = photobooks.filter(p =>
    p.material === material &&
    p.sizes.includes(size) &&
    p.orientations.includes(orientation)
  )
  const bindSet = new Set()
  matching.forEach(p => p.bindings.forEach(b => bindSet.add(b)))
  return [...bindSet].map(b => ({
    id: b,
    name: b,
    ...(bindingDescriptions[b] || {}),
  }))
}

/* ==========================================================================
   Step 4 — Laminations (all available for photobooks)
   ========================================================================== */
export function getLaminations() {
  return laminations
}

/* ==========================================================================
   Step 5 — Cover Design Patterns
   ========================================================================== */
export function getCoverDesigns() {
  return coverDesignPatterns
}

/* ==========================================================================
   Step 6 — Cover Materials & Colors
   ========================================================================== */
export function getCoverMaterials() {
  return coverMaterials
}

export function getCoverColors(coverMaterialId) {
  const mat = coverMaterials.find(m => m.id === coverMaterialId)
  return mat ? mat.colors : []
}

/* ==========================================================================
   Step 7 — Find similar products
   ========================================================================== */
export function findSimilarProducts(state) {
  // Score products by how many attributes match the builder selections
  return photobooks
    .map(p => {
      let score = 0
      if (p.material === state.material) score += 3
      if (p.sizes.includes(state.size)) score += 2
      if (p.orientations.includes(state.orientation)) score += 1
      if (p.bindings.includes(state.binding)) score += 1
      return { ...p, score }
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
}

/* Re-export for convenience */
export { sizeLabels, orientationOptions, bindingDescriptions, laminations as laminationOptions, coverDesignPatterns, coverMaterials as coverMaterialOptions }
