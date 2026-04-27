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
        a: 'Browse our products, select the one you want, and click "Order Now". You will be guided through a 5-step configuration wizard to customise your album — cover, paper, files, accessories, and review. Once done, proceed to checkout.',
      },
      {
        q: 'What file formats do you accept?',
        a: 'We accept print-ready files in PDF (300 DPI, CMYK), PSD, TIFF, and JPEG formats. Files should be uploaded to Google Drive, Dropbox, or any cloud storage link — you simply share the link with us during the order wizard.',
      },
      {
        q: 'Can I modify my order after placing it?',
        a: 'Orders can be modified within 24 hours of placement by contacting our support team via WhatsApp or the contact form. Once production has started, modifications may not be possible.',
      },
      {
        q: 'What is the difference between Print-Ready and Design Service?',
        a: 'Print-Ready means you provide fully designed, production-ready files. Design Service means our in-house design team will create your album layout from raw photos — this incurs an additional fee based on pages.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    questions: [
      {
        q: 'How is pricing calculated?',
        a: 'Pricing is based on product base price + size modifier + cover material + paper type × pages + any surcharges (6-color printing, design service). GST at 18% is applied on the subtotal. Verified photographers get wholesale pricing.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI (PhonePe, Google Pay, Paytm), Credit/Debit cards (Visa, Mastercard, RuPay), Net Banking, and wallets. All payments are secured and processed through industry-standard gateways.',
      },
      {
        q: 'How do I get verified as a PRO photographer?',
        a: 'Go to Profile → Account Settings → Pro Verification. Submit your GST certificate number, portfolio link, and any supporting documents. Our team reviews applications within 2–3 business days.',
      },
      {
        q: 'Are there any discount codes available?',
        a: 'Yes — coupon code CANVERA10 gives 10% off any order. Verified photographers also get access to the PRO2026 code (10% additional off orders above ₹10,000). Codes are applied at checkout before tax.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 10–14 business days from order confirmation. Express options may be available — contact us to check availability for your location.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently we ship within India only. International shipping is planned for a future release. Check back or subscribe to our newsletter for updates.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is shipped, you will receive a tracking number via SMS and email. You can also track orders on the Track Order page using your order number (format: CNV-XXXXXXXX).',
      },
    ],
  },
  {
    category: 'Product Quality',
    questions: [
      {
        q: 'What paper types do you offer?',
        a: 'We offer five paper types: Matte (non-reflective, classic), Glossy (vibrant, high-shine), Silk (semi-gloss hybrid), Pearl (subtle shimmer, premium), and Metallic (dramatic metallic sheen). Pearl and Metallic are premium specialty papers.',
      },
      {
        q: 'What is a genuineness check?',
        a: 'Every Canvera product ships with a unique authenticity code printed inside. You or your client can verify authenticity at canvera.com/genuine — simply enter the code to confirm it is a genuine Canvera product.',
      },
      {
        q: 'How do you ensure print quality?',
        a: 'Every order goes through a multi-point quality inspection. We use 6-color Hexachrome printing for premium products, archival-grade inks, and museum-quality papers. Each album is hand-finished and checked before dispatch.',
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
