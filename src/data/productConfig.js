/**
 * Product configuration data for the Order Wizard & Custom Builder.
 * Shared across all products unless overridden.
 */

export const SIZES = [
  { id: 'sz-1', label: '8×10"',  widthIn: 8,  heightIn: 10, priceModifier: 0 },
  { id: 'sz-2', label: '10×12"', widthIn: 10, heightIn: 12, priceModifier: 800 },
  { id: 'sz-3', label: '12×15"', widthIn: 12, heightIn: 15, priceModifier: 1600 },
  { id: 'sz-4', label: '12×18"', widthIn: 12, heightIn: 18, priceModifier: 2400 },
  { id: 'sz-5', label: '14×20"', widthIn: 14, heightIn: 20, priceModifier: 3600 },
];

export const COVER_STYLES = [
  {
    id: 'cs-1',
    name: 'Padded Leather',
    previewColor: '#4a3728',
    textLineCount: 2,
    materials: [
      {
        id: 'mat-italian',
        name: 'Italian Leather',
        priceModifier: 1200,
        colors: [
          { name: 'Espresso', hex: '#3c2415' },
          { name: 'Burgundy', hex: '#6b1c23' },
          { name: 'Navy', hex: '#1b2838' },
          { name: 'Forest', hex: '#2d4a2d' },
        ],
      },
      {
        id: 'mat-vegan',
        name: 'Vegan Leather',
        priceModifier: 800,
        colors: [
          { name: 'Black', hex: '#1a1a1a' },
          { name: 'Tan', hex: '#c4a882' },
          { name: 'White', hex: '#f5f0eb' },
        ],
      },
    ],
  },
  {
    id: 'cs-2',
    name: 'Fabric Wrap',
    previewColor: '#8b7d6b',
    textLineCount: 3,
    materials: [
      {
        id: 'mat-linen',
        name: 'Linen',
        priceModifier: 600,
        colors: [
          { name: 'Natural', hex: '#d4c5a9' },
          { name: 'Sage', hex: '#9caf88' },
          { name: 'Dusty Rose', hex: '#c4a0a0' },
        ],
      },
      {
        id: 'mat-silk',
        name: 'Silk',
        priceModifier: 1500,
        colors: [
          { name: 'Ivory', hex: '#f5f0e1' },
          { name: 'Champagne', hex: '#f7e7ce' },
          { name: 'Blush', hex: '#de98ab' },
        ],
      },
    ],
  },
  {
    id: 'cs-3',
    name: 'Photo Cover',
    previewColor: '#607080',
    textLineCount: 1,
    materials: [
      {
        id: 'mat-matte',
        name: 'Matte Laminate',
        priceModifier: 400,
        colors: [{ name: 'Standard', hex: '#e0e0e0' }],
      },
      {
        id: 'mat-glossy',
        name: 'Glossy Laminate',
        priceModifier: 400,
        colors: [{ name: 'Standard', hex: '#f0f0f0' }],
      },
    ],
  },
  {
    id: 'cs-4',
    name: 'Wooden Cover',
    previewColor: '#a0845c',
    textLineCount: 2,
    materials: [
      {
        id: 'mat-walnut',
        name: 'Walnut',
        priceModifier: 2000,
        colors: [{ name: 'Natural Walnut', hex: '#5c4033' }],
      },
      {
        id: 'mat-maple',
        name: 'Maple',
        priceModifier: 1800,
        colors: [{ name: 'Natural Maple', hex: '#c4a672' }],
      },
    ],
  },
];

export const PAPER_TYPES = [
  {
    id: 'pt-1',
    name: 'Matte',
    description: 'Smooth, non-reflective finish for a classic look',
    isSpecial: false,
    pricePerSheet: 25,
    minPages: 20,
    maxPages: 80,
  },
  {
    id: 'pt-2',
    name: 'Glossy',
    description: 'High-shine finish that makes colors vibrant',
    isSpecial: false,
    pricePerSheet: 25,
    minPages: 20,
    maxPages: 80,
  },
  {
    id: 'pt-3',
    name: 'Silk',
    description: 'Semi-gloss hybrid — the best of matte and glossy',
    isSpecial: false,
    pricePerSheet: 30,
    minPages: 20,
    maxPages: 80,
  },
  {
    id: 'pt-4',
    name: 'Pearl',
    description: 'Subtle shimmer for a truly luxurious feel',
    isSpecial: true,
    pricePerSheet: 45,
    minPages: 20,
    maxPages: 60,
  },
  {
    id: 'pt-5',
    name: 'Metallic',
    description: 'Striking metallic sheen for dramatic impact',
    isSpecial: true,
    pricePerSheet: 55,
    minPages: 20,
    maxPages: 40,
  },
];

export const BOX_MATERIALS = [
  {
    id: 'box-leather',
    name: 'Leather',
    colors: [
      { name: 'Espresso', hex: '#3c2415' },
      { name: 'Navy', hex: '#1b2838' },
      { name: 'Burgundy', hex: '#6b1c23' },
    ],
  },
  {
    id: 'box-linen',
    name: 'Linen',
    colors: [
      { name: 'Natural', hex: '#d4c5a9' },
      { name: 'Sage', hex: '#9caf88' },
      { name: 'Dusty Rose', hex: '#c4a0a0' },
    ],
  },
  {
    id: 'box-velvet',
    name: 'Velvet',
    colors: [
      { name: 'Midnight', hex: '#2d1b4e' },
      { name: 'Petrol', hex: '#1b3a4e' },
      { name: 'Merlot', hex: '#4e1b2d' },
    ],
  },
];

/**
 * Calculate the total price for a configured order.
 * Returns a full breakdown object.
 */
export function calculatePrice({
  basePrice,
  sizeModifier = 0,
  coverMaterialModifier = 0,
  paperPricePerSheet = 25,
  totalPages = 20,
  colorMode = '4C',
  orderType = 'PRINT_READY',
}) {
  const base = basePrice + sizeModifier;
  const cover = coverMaterialModifier;
  const paper = paperPricePerSheet * totalPages;
  const colorSurcharge = colorMode === '6C' ? Math.round(base * 0.15) : 0;
  const designFee = orderType === 'DESIGN_SERVICE' ? 500 + 50 * totalPages : 0;
  const subtotal = base + cover + paper + colorSurcharge + designFee;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  return { base, cover, paper, colorSurcharge, designFee, subtotal, tax, total };
}

/** FAQ data */
export const FAQ_ITEMS = [
  {
    category: 'Ordering',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'You can place your order directly through the Canvera website by selecting the product, size, paper type, and customization options.',
      },
      {
        q: 'Can I fully customize the album?',
        a: 'Yes, full cover and design customization options are available.',
      },
      {
        q: 'Which paper and binding options are supported?',
        a: 'Multiple paper types and Layflat, Absolute Layflat, & Neo Flushmount bindings are supported.',
      },
      {
        q: 'Can I add my studio branding?',
        a: 'Yes, logo engraving and co-branding options are available for selected products.',
      },
      {
        q: 'Are bulk wedding album orders supported?',
        a: 'Yes, bulk and repeat orders are supported for photographers and studios.',
      },
      {
        q: 'Does the product include a box and bag?',
        a: 'Yes, selected premium products include matching boxes and premium bags.',
      },
      {
        q: 'Is express delivery available?',
        a: 'Yes, express delivery is available for selected products.',
      },
      {
        q: 'Can I reorder the same design later?',
        a: 'Yes, repeat orders can be placed with the same specifications.',
      },
      {
        q: 'How can I contact support?',
        a: 'Support is available through customer care, email, and WhatsApp.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    questions: [
      {
        q: 'What are the pricing options available?',
        a: 'Pricing varies based on size, paper type, binding, cover material, and customization options selected.',
      },
      {
        q: 'Is GST included in the product price?',
        a: 'GST will be applied additionally as per the applicable rate unless mentioned otherwise.',
      },
      {
        q: 'What payment methods are supported?',
        a: 'Online payment options such as UPI, Credit/Debit Cards, Net Banking, and other supported payment gateways are available.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Not available.',
      },
      {
        q: 'Can I get special pricing for bulk orders?',
        a: 'Yes, special pricing is available for bulk wedding album and studio orders.',
      },
      {
        q: 'Are advance payments required?',
        a: 'Yes, orders are processed based on the applicable advance payment terms.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'What are the shipping options available?',
        a: 'Standard and Express Delivery options are available for selected products and locations.',
      },
      {
        q: 'How long will delivery take?',
        a: 'Delivery timelines depend on the product type, customization, and shipping location.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes, tracking details will be shared once the order is shipped.',
      },
      {
        q: 'Is express delivery available?',
        a: 'Yes, express delivery is supported for selected photobook categories.',
      },
      {
        q: 'Do you ship across India?',
        a: 'Yes, shipping is available across most locations in India.',
      },
      {
        q: 'Will the product be packed safely?',
        a: 'Yes, all products are securely packed to ensure safe delivery.',
      },
    ],
  },
  {
    category: 'Product Quality',
    questions: [
      {
        q: 'What makes this product premium?',
        a: 'The product is made using high-quality materials, professional printing, premium binding, and elegant packaging for a luxurious finish.',
      },
      {
        q: 'Are the prints durable?',
        a: 'Yes, the prints are designed for long-lasting quality and vibrant color reproduction.',
      },
      {
        q: 'Will the colors match my screen?',
        a: 'Minor color variations may occur due to screen settings and material differences.',
      },
      {
        q: 'What paper options are available?',
        a: 'Multiple premium paper options such as Glossy, Matte, Luster, and Silky Matte etc. are supported.',
      },
      {
        q: 'Is the album durable for long-term use?',
        a: 'Yes, the album is designed with strong binding and premium materials for durability and long-lasting preservation.',
      },
    ],
  },
];

/** Mock orders for profile/track demo */
export const MOCK_ORDERS = [
  {
    id: 'ord-001',
    orderNumber: 'CNV-00123456',
    productName: 'Luxury Celestial',
    productSlug: 'luxury-celestial',
    collectionName: 'Celestial',
    status: 'DELIVERED',
    placedAt: '2026-03-15',
    amount: 9441,
    config: {
      size: '12×15"',
      cover: 'Padded Leather — Italian Leather — Espresso',
      paper: 'Pearl · 40 pages · 6-Color',
      fileType: 'Print-Ready',
      bag: 'Standard Bag',
    },
    timeline: [
      { label: 'Order Placed', date: '15 Mar 2026', done: true },
      { label: 'Processing', date: '16 Mar 2026', done: true },
      { label: 'Shipped', date: '20 Mar 2026', done: true },
      { label: 'Delivered', date: '25 Mar 2026', done: true },
    ],
  },
  {
    id: 'ord-002',
    orderNumber: 'CNV-00234567',
    productName: 'Mesmera Gold',
    productSlug: 'mesmera-gold',
    collectionName: 'Suede',
    status: 'SHIPPED',
    placedAt: '2026-04-05',
    amount: 6608,
    config: {
      size: '10×12"',
      cover: 'Fabric Wrap — Silk — Ivory',
      paper: 'Silk · 30 pages · 4-Color',
      fileType: 'Design Service',
      bag: 'Premium Bag',
    },
    timeline: [
      { label: 'Order Placed', date: '05 Apr 2026', done: true },
      { label: 'Processing', date: '06 Apr 2026', done: true },
      { label: 'Shipped', date: '12 Apr 2026', done: true },
      { label: 'Delivered', date: null, done: false },
    ],
  },
  {
    id: 'ord-003',
    orderNumber: 'CNV-00345678',
    productName: 'Melange',
    productSlug: 'melange',
    collectionName: 'Wood',
    status: 'PROCESSING',
    placedAt: '2026-04-17',
    amount: 12744,
    config: {
      size: '14×20"',
      cover: 'Wooden Cover — Walnut — Natural Walnut',
      paper: 'Metallic · 30 pages · 6-Color',
      fileType: 'Print-Ready',
      bag: 'No Bag',
    },
    timeline: [
      { label: 'Order Placed', date: '17 Apr 2026', done: true },
      { label: 'Processing', date: '18 Apr 2026', done: true },
      { label: 'Shipped', date: null, done: false },
      { label: 'Delivered', date: null, done: false },
    ],
  },
];
