/* ==========================================================================
   PDP Options Data
   Structured option sets that drive all section UIs in the config flow.
   ========================================================================== */

export const sizeLabels = {
  '12x18': { label: '12 \u00d7 18\u2033', format: 'Large Landscape', printArea: '11.5 \u00d7 17.5\u2033' },
  '12x16': { label: '12 \u00d7 16\u2033', format: 'Medium Landscape', printArea: '11.5 \u00d7 15.5\u2033' },
  '12x15': { label: '12 \u00d7 15\u2033', format: 'Classic Landscape', printArea: '11.5 \u00d7 14.5\u2033' },
  '12x12': { label: '12 \u00d7 12\u2033', format: 'Large Square', printArea: '11.5 \u00d7 11.5\u2033' },
  '10x14': { label: '10 \u00d7 14\u2033', format: 'Standard Landscape', printArea: '9.5 \u00d7 13.5\u2033' },
  '8x12':  { label: '8 \u00d7 12\u2033', format: 'Compact Landscape', printArea: '7.5 \u00d7 11.5\u2033' },
  '8x10':  { label: '8 \u00d7 10\u2033', format: 'Compact', printArea: '7.5 \u00d7 9.5\u2033' },
  '16x20': { label: '16 \u00d7 20\u2033', format: 'Extra Large', printArea: '15.5 \u00d7 19.5\u2033' },
  '16x16': { label: '16 \u00d7 16\u2033', format: 'Square', printArea: '15.5 \u00d7 15.5\u2033' },
  '3x3':   { label: '3 \u00d7 3\u2033', format: 'Mini Square', printArea: '2.75 \u00d7 2.75\u2033' },
  '11oz':  { label: '11 oz', format: 'Standard Mug', printArea: 'Wrap-around' },
  '15oz':  { label: '15 oz', format: 'Large Mug', printArea: 'Wrap-around' },
  'A3':    { label: 'A3', format: 'Large Calendar', printArea: '11.7 \u00d7 16.5\u2033' },
  'A4':    { label: 'A4', format: 'Standard Calendar', printArea: '8.3 \u00d7 11.7\u2033' },
  'Desktop': { label: 'Desktop', format: 'Table Calendar', printArea: '6 \u00d7 4\u2033' },
}

export const orientationOptions = [
  {
    id: 'Landscape',
    name: 'Landscape',
    description: 'Wide format \u2014 ideal for panoramic spreads and cinematic compositions',
    bestFor: 'Double-page spreads, landscape photography',
  },
  {
    id: 'Portrait',
    name: 'Portrait',
    description: 'Tall format \u2014 ideal for editorial portraiture and fashion work',
    bestFor: 'Single-page portraits, editorial layouts',
  },
  {
    id: 'Square',
    name: 'Square',
    description: 'Equal-sided format \u2014 balanced compositions with modern appeal',
    bestFor: 'Versatile layouts, Instagram-style collections',
  },
]

export const bindingDescriptions = {
  'Layflat': {
    description: 'Pages lie completely flat when open with no crease at the centre. Essential for double-page spread photography.',
    specs: ['Pages lie completely flat', 'No gutter loss on spreads', 'Recommended for 10\u201350 sheets'],
  },
  'Absolute Layflat': {
    description: 'Our premium binding \u2014 pages open to a perfect 180\u00b0 with thicker, rigid sheets that feel substantial and luxurious.',
    specs: ['Perfect 180\u00b0 flat opening', 'Thicker rigid sheets', 'Premium feel and weight', 'Recommended for 10\u201340 sheets'],
  },
  'Continuous': {
    description: 'Seamless page-to-page flow without visible binding. Great for magazine-style layouts.',
    specs: ['Seamless page flow', 'Magazine-style feel', 'Lightweight', 'Recommended for 10\u201360 sheets'],
  },
  'Splicing': {
    description: 'Pages joined at the spine with a visible seam. Traditional album feel with sturdy construction.',
    specs: ['Traditional album construction', 'Visible spine seam', 'Sturdy and durable', 'Recommended for 10\u201350 sheets'],
  },
  'Spiral': {
    description: 'Wire spiral binding. Pages flip freely. Standard for calendars.',
    specs: ['Wire spiral', 'Pages flip 360\u00b0', 'Calendar standard'],
  },
}

export const pageTiers = [
  { sheets: 10, pages: 20, label: '20 pages / 10 sheets', isBase: true },
  { sheets: 20, pages: 40, label: '40 pages / 20 sheets' },
  { sheets: 30, pages: 60, label: '60 pages / 30 sheets' },
  { sheets: 40, pages: 80, label: '80 pages / 40 sheets' },
  { sheets: 50, pages: 100, label: '100 pages / 50 sheets' },
]

export const laminations = [
  {
    id: 'Matte',
    name: 'Matte',
    description: 'Smooth, non-reflective finish that reduces glare. Clean and professional.',
    swatch: '#E8E4DE',
    tooltip: 'Matte lamination gives a flat, non-reflective surface. Ideal for fine art and minimalist aesthetics. No additional cost.',
  },
  {
    id: 'Glossy',
    name: 'Glossy',
    description: 'High-shine reflective finish that enhances colour vibrancy.',
    swatch: '#F5F5F5',
    tooltip: 'Glossy lamination adds shine and makes colours pop. Great for vivid, high-contrast photography. No additional cost.',
  },
  {
    id: 'Soft Touch',
    name: 'Soft Touch',
    description: 'Velvety, premium tactile surface with a luxurious feel.',
    swatch: '#E5E0D8',
    tooltip: 'Soft Touch creates a velvety, premium tactile surface \u2014 the most premium option. Adds a flat premium per book.',
  },
  {
    id: 'No Lamination',
    name: 'No Lamination',
    description: 'Suitable for fine art papers that are pre-finished.',
    swatch: '#F0EDE8',
    tooltip: 'No protective coating applied. Suitable for pre-finished fine art paper types only. No additional cost.',
  },
]

export const papers = [
  {
    id: 'Standard Silk 200gsm',
    name: 'Standard Silk',
    weight: '200gsm',
    surface: 'Smooth silk finish',
    description: 'Versatile all-purpose paper with a subtle silk texture. Excellent colour reproduction.',
    recommended: 'Weddings, events, general photography',
    compatibleLaminations: ['Matte', 'Glossy', 'Soft Touch'],
    tooltip: 'Standard silk paper with balanced colour reproduction. Compatible with all laminations. Included in base price.',
  },
  {
    id: 'Fine Art Matte 250gsm',
    name: 'Fine Art Matte',
    weight: '250gsm',
    surface: 'Textured cotton-feel',
    description: 'A textured, cotton-feel surface with exceptional tonal depth. Preferred for monochrome and fine art colour work.',
    recommended: 'Fine art, B&W photography, portraits',
    compatibleLaminations: ['Matte', 'No Lamination'],
    tooltip: 'Textured cotton-feel surface with exceptional tonal depth. Best for fine art and monochrome. Premium add-on.',
  },
  {
    id: 'Lustre Satin 280gsm',
    name: 'Lustre Satin',
    weight: '280gsm',
    surface: 'Semi-gloss pearl finish',
    description: 'A balanced semi-gloss finish that combines vibrancy with reduced glare. The photographer\u2019s all-rounder.',
    recommended: 'Weddings, portraits, versatile',
    compatibleLaminations: ['Matte', 'Glossy'],
    tooltip: 'Semi-gloss pearl finish balancing vibrancy with reduced glare. Versatile for most photography. Premium add-on.',
  },
  {
    id: 'Archival Cotton 310gsm',
    name: 'Archival Cotton',
    weight: '310gsm',
    surface: 'Museum-grade rag paper',
    description: 'Museum-grade cotton rag paper with exceptional longevity. The highest quality choice for archival prints.',
    recommended: 'Gallery prints, archival, heirloom albums',
    compatibleLaminations: ['No Lamination'],
    tooltip: 'Museum-grade cotton rag. Highest quality for archival prints. Must be used without lamination. Premium add-on.',
  },
]

export const specialPapers = [
  { id: 'Fine Art Silk 300gsm', name: 'Fine Art Silk 300gsm' },
  { id: 'Metallic Pearl 270gsm', name: 'Metallic Pearl 270gsm' },
  { id: 'Textured Linen 280gsm', name: 'Textured Linen 280gsm' },
]

export const coverDesignPatterns = [
  { id: 'clean-minimal', name: 'Clean Minimal', description: 'Single material, full bleed \u2014 no visible join lines', mirrorBack: true },
  { id: 'split-duo', name: 'Split Duo', description: 'Two-material split with a visible join at centre', mirrorBack: false },
  { id: 'window-frame', name: 'Window Frame', description: 'Material frame with acrylic photo window inset', mirrorBack: true },
  { id: 'nameplate-classic', name: 'Nameplate Classic', description: 'Full material cover with an inset nameplate area', mirrorBack: true },
]

export const coverMaterials = [
  {
    id: 'Black Linen',
    name: 'Black Linen',
    description: 'Woven linen texture, deep matte black \u2014 classic and professional',
    colors: ['Midnight Black', 'Charcoal', 'Slate Gray'],
    tooltip: 'Premium woven linen with a deep matte finish. Classic and professional. Included in base price.',
  },
  {
    id: 'Ivory Linen',
    name: 'Ivory Linen',
    description: 'Soft ivory linen with a warm, inviting texture',
    colors: ['Ivory', 'Cream', 'Pearl White'],
    tooltip: 'Soft ivory linen with warm undertones. Elegant for light-themed albums. Included in base price.',
  },
  {
    id: 'Midnight Leather',
    name: 'Midnight Leather',
    description: 'Full-grain leather in deep midnight blue \u2014 rich and timeless',
    colors: ['Midnight Blue', 'Deep Navy', 'Oxford Blue'],
    tooltip: 'Full-grain leather with a rich midnight finish. Premium feel and durability. Adds a material premium.',
  },
  {
    id: 'Tan Leather',
    name: 'Tan Leather',
    description: 'Warm tan leather with natural grain texture',
    colors: ['Natural Tan', 'Saddle Brown', 'Honey'],
    tooltip: 'Warm tan leather with natural grain. Ages beautifully over time. Adds a material premium.',
  },
  {
    id: 'Burgundy Leather',
    name: 'Burgundy Leather',
    description: 'Deep burgundy leather with subtle sheen',
    colors: ['Burgundy', 'Wine Red', 'Oxblood'],
    tooltip: 'Deep burgundy leather with a subtle sheen. Bold and sophisticated. Adds a material premium.',
  },
  {
    id: 'Navy Suede',
    name: 'Navy Suede',
    description: 'Soft suede in rich navy \u2014 velvety and tactile',
    colors: ['Navy', 'Royal Blue', 'Denim Blue'],
    tooltip: 'Soft suede with a velvety feel. Rich navy tones. Moderate material premium.',
  },
  {
    id: 'Charcoal Suede',
    name: 'Charcoal Suede',
    description: 'Suede in sophisticated charcoal grey',
    colors: ['Charcoal', 'Stone Gray', 'Graphite'],
    tooltip: 'Sophisticated charcoal suede. Modern and understated. Moderate material premium.',
  },
]

export const namingTreatments = [
  {
    id: 'Gold Foil',
    name: 'Gold Foil',
    description: 'Hot-stamped metallic gold leaf. Premium finish, catches light.',
    tooltip: 'Hot-stamped metallic gold leaf. Premium finish that catches light. Recommended for dark cover materials.',
  },
  {
    id: 'Silver Foil',
    name: 'Silver Foil',
    description: 'Hot-stamped metallic silver. Clean and modern.',
    tooltip: 'Hot-stamped metallic silver. Clean and modern. Works on both light and dark covers.',
  },
  {
    id: 'Rose Gold Foil',
    name: 'Rose Gold Foil',
    description: 'Warm rose gold metallic foil. Elegant and contemporary.',
    tooltip: 'Warm rose gold metallic foil stamping. Elegant and contemporary. Premium naming option.',
  },
  {
    id: 'Deboss',
    name: 'Deboss',
    description: 'An indented impression with no colour \u2014 subtle, tactile, and elegant.',
    tooltip: 'An indented impression of the text with no colour. Subtle, tactile, and elegant. Moderate cost.',
  },
  {
    id: 'Printed',
    name: 'Printed',
    description: 'Standard ink printing matched to a specified colour.',
    tooltip: 'Standard ink printing matched to a specified colour. Most cost-effective naming option. Included.',
  },
]

export const boxOptions = [
  { id: 'none', name: 'No Box', description: 'Skip the box \u2014 not required' },
  { id: 'Matching Box', name: 'Matching Box', description: 'Coordinated box matching your album material and colour' },
  { id: 'Sleeve Box', name: 'Sleeve Box', description: 'Elegant sleeve-style packaging for a clean presentation' },
  { id: 'Wood Box', name: 'Wood Box', description: 'Premium wooden presentation box with soft interior lining' },
  { id: 'Standard Box', name: 'Standard Box', description: 'Classic protective box in neutral finish' },
  { id: 'Gift Box', name: 'Gift Box', description: 'Gift-ready packaging with ribbon closure' },
]

export const bagOptions = [
  { id: 'none', name: 'No Bag', description: 'Skip the bag \u2014 not required' },
  { id: 'Matching Bag', name: 'Matching Bag', description: 'Coordinated carry bag matching your album' },
  { id: 'Jute Bag', name: 'Jute Bag', description: 'Eco-friendly jute carry bag with cotton handles' },
  { id: 'Royal Jute Bag', name: 'Royal Jute Bag', description: 'Premium jute bag with reinforced handles' },
  { id: 'Matching Acroluxe Bag', name: 'Acroluxe Bag', description: 'Premium branded carry bag with padded interior' },
]

// Sections definition for the config flow
export const configSections = [
  { id: 'size', title: 'Size', subtitle: 'The foundation of your photobook.', required: true, block: 'A' },
  { id: 'orientation', title: 'Orientation', subtitle: 'How your book is held and read.', required: true, block: 'A' },
  { id: 'binding', title: 'Binding', subtitle: 'How your pages open and lie flat.', required: true, block: 'A' },
  { id: 'pages', title: 'Pages', subtitle: 'How much your book holds.', required: true, block: 'B' },
  { id: 'paper', title: 'Paper', subtitle: 'Your primary printing surface.', required: true, block: 'C' },
  { id: 'cover', title: 'Cover', subtitle: 'The face and identity of your book.', required: true, block: 'C' },
  { id: 'box', title: 'Box', subtitle: 'Protective and presentational packaging.', required: false, block: 'C' },
  { id: 'bag', title: 'Bag', subtitle: 'Presentation packaging for delivery.', required: false, block: 'C' },
  { id: 'imageLink', title: 'Images', subtitle: 'Share your files for production.', required: true, block: 'D' },
  { id: 'orderType', title: 'Order Type', subtitle: 'Tell us how your files are prepared.', required: true, block: 'D' },
  { id: 'notes', title: 'Notes', subtitle: 'Instructions for our production team.', required: false, block: 'E' },
]
