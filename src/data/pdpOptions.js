// ─────────────────────────────────────────────────────────────────────────────
// PDP & MYO Option Metadata
// ─────────────────────────────────────────────────────────────────────────────

export const sizeLabels = {
  '12x18': { id: '12x18', label: '12 × 18"', format: 'Large Landscape',      printArea: '12×18 inches', cm: '30 × 46 cm' },
  '12x15': { id: '12x15', label: '12 × 15"', format: 'Classic Landscape',    printArea: '12×15 inches', cm: '30 × 38 cm' },
  '12x12': { id: '12x12', label: '12 × 12"', format: 'Square Format',         printArea: '12×12 inches', cm: '30 × 30 cm' },
  '11x16': { id: '11x16', label: '11 × 16"', format: 'Standard Landscape',   printArea: '11×16 inches', cm: '28 × 41 cm' },
  '10x14': { id: '10x14', label: '10 × 14"', format: 'Compact Landscape',    printArea: '10×14 inches', cm: '25 × 36 cm' },
  'a4':    { id: 'a4',    label: 'A4',        format: 'International Standard',printArea: 'A4',           cm: '21 × 30 cm' },
};

export const orientationOptions = [
  {
    id: 'Landscape',
    name: 'Landscape',
    description: 'Wider than tall — panoramic, cinematic feel',
    bestFor: 'Wedding photography, group shots, wide spreads',
  },
  {
    id: 'Portrait',
    name: 'Portrait',
    description: 'Taller than wide — editorial, refined feel',
    bestFor: 'Portraits, fashion, maternity, ceremonies',
  },
  {
    id: 'Square',
    name: 'Square',
    description: 'Equal width and height — modern, balanced',
    bestFor: 'Lifestyle, baby & kids, Instagram-era photography',
  },
];

export const bindingDescriptions = {
  'Layflat': {
    id: 'Layflat',
    name: 'Layflat',
    description:
      'Pages lie completely flat when open with no crease at the centre. Essential for double-page spread photography.',
    specs: [
      'Pages lie completely flat',
      'No gutter loss on spreads',
      'Recommended for 10–50 sheets',
      'Duplex Indigo printing',
    ],
  },
  'Absolute Layflat': {
    id: 'Absolute Layflat',
    name: 'Absolute Layflat',
    description:
      'Our premium binding — pages open to a perfect 180° with thicker, rigid sheets that feel substantial and luxurious.',
    specs: [
      'Perfect 180° open',
      'Thick, rigid sheets',
      'Luxury look and feel',
      'Ideal for premium albums',
    ],
  },
  'Flushmount': {
    id: 'Flushmount',
    name: 'Flushmount',
    description:
      'Pages mounted flush to backing boards for a seamless, borderless spread with no visible binding gap.',
    specs: [
      'Seamless photo spreads',
      'Mounted flush to boards',
      'No white borders',
      'Long-lasting durability',
    ],
  },
  'Neo Flushmount': {
    id: 'Neo Flushmount',
    name: 'Neo Flushmount',
    description:
      'Next-generation flushmount with hot-glue bonded pages for extra rigidity and a clean, modern spine.',
    specs: [
      'Hot-glue bonded pages',
      'Extra page rigidity',
      'Contemporary finish',
      'Ideal for thick paper',
    ],
  },
  'Continuous': {
    id: 'Continuous',
    name: 'Continuous',
    description:
      'Seamless page-to-page flow without a visible binding seam. Great for magazine-style and modern layouts.',
    specs: [
      'No visible binding seam',
      'Seamless page flow',
      'Magazine-style aesthetic',
      'Lightweight construction',
    ],
  },
};

export const laminations = [
  {
    id: 'glossy',
    name: 'Glossy',
    description: 'High-sheen finish for vivid, mirror-like colour reproduction',
  },
  {
    id: 'matte',
    name: 'Matte',
    description: 'Non-reflective surface with a sophisticated, understated feel',
  },
  {
    id: 'soft-touch',
    name: 'Soft Touch',
    description: 'Velvety coating with a luxurious tactile quality and muted sheen',
  },
  {
    id: 'none',
    name: 'No Lamination',
    description: 'Natural paper surface with no added coating — purist feel',
  },
];

export const coverDesignPatterns = [
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'Single material, full bleed — no visible join lines',
  },
  {
    id: 'split-duo',
    name: 'Split Duo',
    description: 'Two-material split with a visible join at centre',
  },
  {
    id: 'window-frame',
    name: 'Window Frame',
    description: 'Material frame with an acrylic photo window inset',
  },
  {
    id: 'nameplate-classic',
    name: 'Nameplate Classic',
    description: 'Full material cover with an inset nameplate area',
  },
];

export const coverMaterials = [
  {
    id: 'black-linen',
    name: 'Black Linen',
    description: 'Deep black woven linen with a crisp, modern texture',
    colors: ['Jet Black', 'Charcoal'],
  },
  {
    id: 'ivory-linen',
    name: 'Ivory Linen',
    description: 'Soft ivory woven linen with a classic, understated feel',
    colors: ['Ivory', 'Pearl White', 'Cream'],
  },
  {
    id: 'midnight-leather',
    name: 'Midnight Leather',
    description: 'Dark, full-grain leather in deep, moody tones',
    colors: ['Midnight Blue', 'Burgundy', 'Ebony Black'],
  },
  {
    id: 'tan-leather',
    name: 'Tan Leather',
    description: 'Warm earthy leather in natural, sun-kissed shades',
    colors: ['Saddle Brown', 'Camel Tan', 'Desert Gold'],
  },
  {
    id: 'burgundy-leather',
    name: 'Burgundy Leather',
    description: 'Rich, deep red leather for a bold, statement finish',
    colors: ['Burgundy Red', 'Crimson', 'Wine Red'],
  },
  {
    id: 'navy-suede',
    name: 'Navy Suede',
    description: 'Soft, velvety suede in refined navy and teal tones',
    colors: ['Navy Blue', 'Midnight Blue', 'Royal Teal'],
  },
  {
    id: 'charcoal-suede',
    name: 'Charcoal Suede',
    description: 'Muted, sophisticated suede in cool, dark tones',
    colors: ['Stone Grey', 'Charcoal', 'Slate'],
  },
];
