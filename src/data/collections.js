/**
 * Collection ranges — each maps a material/style range to its products.
 * Display name shown in the header dropdown is just the first word (e.g. "Celestial").
 */

const collections = [
  {
    id: 'celestial',
    name: 'Celestial',
    slug: 'celestial',
    fullName: 'Celestial Range',
    description: 'Premium and luxury albums with celestial-inspired patterns and exquisite detailing.',
    imageVariant: 'petrol',
    productNames: ['Premium Celestial', 'Luxury Celestial', 'Eleganza Celestial'],
  },
  {
    id: 'wood',
    name: 'Wood',
    slug: 'wood',
    fullName: 'Wood Range',
    description: 'Albums with natural wood finishes and organic textures.',
    imageVariant: 'warm',
    productNames: ['Vintage Wood'],
  },
  {
    id: 'leatherette',
    name: 'Leatherette',
    slug: 'leatherette',
    fullName: 'Leatherette Range',
    description: 'Classic leatherette-bound albums in a wide variety of styles and colours.',
    imageVariant: 'amber',
    productNames: [
      'Mesmera', 'Plush Leather', 'Vintage Keep', 'Gala', 'Mirage',
      'Fab Leather', 'Dualuxe Photobook', 'Picture Paradise',
      'Majestic Marvel', 'Eco Leather', 'Aura', 'Acroluxe', 'Melange',
    ],
  },
  {
    id: 'suede',
    name: 'Suede',
    slug: 'suede',
    fullName: 'Suede Range',
    description: 'Soft-touch suede albums with a luxurious hand-feel.',
    imageVariant: 'neutral',
    productNames: ['Regal', 'Mystique Suede'],
  },
  {
    id: 'foiling',
    name: 'Foiling',
    slug: 'foiling',
    fullName: 'Foiling Range',
    description: 'Albums with premium foiling techniques and intricate metallic accents.',
    imageVariant: 'deep',
    productNames: ['Sterra', 'Amora', 'Luna'],
  },
  {
    id: 'luxury',
    name: 'Luxury',
    slug: 'luxury',
    fullName: 'Luxury Range',
    description: 'The finest in luxury album craftsmanship with premium materials throughout.',
    imageVariant: 'dark',
    productNames: ['Royalty', 'Arto', 'Spectra', 'Infiniti', 'Fusion', 'Luxury', 'Standard Plus'],
  },
  {
    id: 'signature',
    name: 'Signature',
    slug: 'signature',
    fullName: 'Signature Range',
    description: 'Signature-grade materials and distinctive design for the discerning photographer.',
    imageVariant: 'leaf',
    productNames: ['Royal Relics', 'Signature'],
  },
  {
    id: 'fabric',
    name: 'Fabric',
    slug: 'fabric',
    fullName: 'Fabric Range',
    description: 'Fabric-covered albums with rich textures and artisan craftsmanship.',
    imageVariant: 'warm',
    productNames: ['Ornato'],
  },
  {
    id: 'custom-cover',
    name: 'Custom Cover',
    slug: 'custom-cover',
    fullName: 'Custom Cover Range',
    description: 'Fully customisable cover designs tailored to your creative vision.',
    imageVariant: 'mixed',
    productNames: ['Premium Regular', 'Standard Regular'],
  },
]

export default collections
