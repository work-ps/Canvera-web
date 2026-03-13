/* ==========================================================================
   PDP Pricing Data
   Base prices per product+size and surcharges for all configurable options.
   All prices in INR (₹).
   ========================================================================== */

// Base prices keyed by product ID → size
export const basePrices = {
  1:  { '12x18': 8999, '12x16': 7999, '12x15': 6999, '12x12': 5999 },
  2:  { '12x18': 9499, '12x15': 8499 },
  3:  { '12x18': 7999, '12x15': 6999, '12x12': 5999 },
  4:  { '12x18': 9999, '12x16': 8999, '12x15': 7999, '12x12': 6999 },
  5:  { '12x18': 7499, '12x15': 6499, '12x12': 5499 },
  6:  { '12x18': 10999, '12x15': 9999, '12x12': 8999 },
  7:  { '12x18': 6999, '12x15': 5999, '12x12': 4999 },
  8:  { '12x18': 7499, '12x15': 6499, '12x12': 5499 },
  9:  { '12x18': 7999, '12x15': 6999, '12x12': 5999 },
  10: { '12x18': 8499, '12x15': 7499, '12x12': 6499 },
  11: { '12x18': 4999, '12x15': 4499, '12x12': 3999 },
  12: { '12x18': 4499, '12x15': 3999, '12x12': 3499 },
  13: { '10x14': 2999, '12x15': 3999 },
  14: { '8x10': 1999, '10x14': 2999 },
  15: { '8x12': 2499, '10x14': 3499 },
  16: { '10x14': 3999, '12x15': 4999 },
  17: { '8x10': 1499, '12x18': 2999, '16x20': 4499 },
  18: { '8x10': 1999, '12x18': 3499, '16x20': 5499 },
  19: { '8x10': 2499, '12x18': 4499, '16x20': 6999 },
  20: { '8x10': 2999, '12x18': 5499, '16x20': 7999 },
  21: { '11oz': 499, '15oz': 699 },
  22: { '16x16': 999 },
  23: { '3x3': 599 },
  24: { 'A3': 1499, 'A4': 999 },
  25: { 'Desktop': 799 },
}

// Minimum starting price per product (smallest size, base config)
export function getStartingPrice(productId) {
  const prices = basePrices[productId]
  if (!prices) return null
  return Math.min(...Object.values(prices))
}

// Surcharges for each option category
export const surcharges = {
  bindings: {
    'Layflat': 0,
    'Absolute Layflat': 1200,
    'Continuous': 0,
    'Splicing': 400,
    'Spiral': 0,
  },

  // Sheet-based pricing: { sheetCount: surcharge }
  // Base always includes 10 sheets (20 pages). Additional sheets priced per-sheet.
  sheetsPerUnit: 60,       // ₹60 per additional sheet beyond base 10
  baseSheets: 10,          // included in base price

  laminations: {
    'Matte': 0,
    'Glossy': 0,
    'Soft Touch': 600,
    'No Lamination': 0,
  },

  papers: {
    'Standard Silk 200gsm': 0,
    'Fine Art Matte 250gsm': 800,
    'Lustre Satin 280gsm': 500,
    'Archival Cotton 310gsm': 1200,
  },

  specialPaperPerSheet: 120,  // ₹120 per special paper sheet

  coverMaterials: {
    'Black Linen': 0,
    'Ivory Linen': 0,
    'Midnight Leather': 400,
    'Tan Leather': 400,
    'Burgundy Leather': 400,
    'Navy Suede': 200,
    'Charcoal Suede': 200,
    'Forest Suede': 200,
    'Printed Matte': 0,
    'Printed Glossy': 0,
  },

  namingTreatments: {
    'Gold Foil': 350,
    'Silver Foil': 350,
    'Rose Gold Foil': 400,
    'Deboss': 200,
    'Printed': 0,
  },

  boxes: {
    'none': 0,
    'Matching Box': 800,
    'Sleeve Box': 600,
    'Wood Box': 1500,
    'Standard Box': 400,
    'Gift Box': 200,
  },

  bags: {
    'none': 0,
    'Matching Bag': 300,
    'Jute Bag': 200,
    'Royal Jute Bag': 400,
    'Matching Acroluxe Bag': 500,
  },

  prepressReview: 500,  // Raw files pre-press fee
}

// Calculate total price from config
export function calculatePrice(config, productId) {
  const prices = basePrices[productId]
  if (!prices || !config.size) return { basePrice: 0, lineItems: [], total: 0 }

  const lineItems = []
  let base = prices[config.size] || 0

  lineItems.push({
    key: 'base',
    label: `Base \u2014 ${config.size} Photobook`,
    amount: base,
    type: 'base',
  })

  // Binding
  if (config.binding && surcharges.bindings[config.binding]) {
    const amt = surcharges.bindings[config.binding]
    if (amt > 0) {
      lineItems.push({
        key: 'binding',
        label: `${config.binding} Binding`,
        amount: amt,
        type: 'addon',
      })
    }
  }

  // Additional sheets
  const sheets = config.sheets || surcharges.baseSheets
  if (sheets > surcharges.baseSheets) {
    const extra = sheets - surcharges.baseSheets
    const amt = extra * surcharges.sheetsPerUnit
    lineItems.push({
      key: 'sheets',
      label: `Additional ${extra} sheets (${extra * 2} pages) \u00d7 \u20b9${surcharges.sheetsPerUnit}/sheet`,
      amount: amt,
      type: 'addon',
    })
  }

  // Lamination
  if (config.lamination && surcharges.laminations[config.lamination]) {
    const amt = surcharges.laminations[config.lamination]
    if (amt > 0) {
      lineItems.push({
        key: 'lamination',
        label: `${config.lamination} Lamination`,
        amount: amt,
        type: 'addon',
      })
    }
  }

  // Main Paper
  if (config.paper && surcharges.papers[config.paper]) {
    const amt = surcharges.papers[config.paper]
    if (amt > 0) {
      lineItems.push({
        key: 'paper',
        label: config.paper,
        amount: amt,
        type: 'addon',
      })
    }
  }

  // Special Paper
  if (config.specialPaperEnabled && config.specialPaperRanges?.length > 0) {
    let totalSpecialSheets = 0
    config.specialPaperRanges.forEach(range => {
      const rangeSheets = Math.ceil((range.to - range.from + 1) / 2)
      totalSpecialSheets += rangeSheets
    })
    if (totalSpecialSheets > 0) {
      const amt = totalSpecialSheets * surcharges.specialPaperPerSheet
      lineItems.push({
        key: 'specialPaper',
        label: `Special Paper \u2014 ${totalSpecialSheets} sheets \u00d7 \u20b9${surcharges.specialPaperPerSheet}/sheet`,
        amount: amt,
        type: 'addon',
      })
    }
  }

  // Cover Material
  if (config.coverMaterial && surcharges.coverMaterials[config.coverMaterial]) {
    const amt = surcharges.coverMaterials[config.coverMaterial]
    if (amt > 0) {
      lineItems.push({
        key: 'coverMaterial',
        label: `${config.coverMaterial} Cover`,
        amount: amt,
        type: 'addon',
      })
    }
  }

  // Naming Treatment
  if (config.namingTreatment && surcharges.namingTreatments[config.namingTreatment]) {
    const amt = surcharges.namingTreatments[config.namingTreatment]
    const lines = [config.coverName1, config.coverName2].filter(Boolean).length || 1
    if (amt > 0) {
      lineItems.push({
        key: 'naming',
        label: `${config.namingTreatment} Naming (${lines} line${lines > 1 ? 's' : ''})`,
        amount: amt * lines,
        type: 'addon',
      })
    }
  }

  // Box
  if (config.boxType && config.boxType !== 'none' && surcharges.boxes[config.boxType]) {
    const amt = surcharges.boxes[config.boxType]
    if (amt > 0) {
      lineItems.push({
        key: 'box',
        label: `${config.boxType}`,
        amount: amt,
        type: 'addon',
      })
    }
  }

  // Bag
  if (config.bagType && config.bagType !== 'none' && surcharges.bags[config.bagType]) {
    const amt = surcharges.bags[config.bagType]
    if (amt > 0) {
      lineItems.push({
        key: 'bag',
        label: `${config.bagType}`,
        amount: amt,
        type: 'addon',
      })
    }
  }

  // Pre-press fee (raw files)
  if (config.orderType === 'raw') {
    lineItems.push({
      key: 'prepress',
      label: 'Pre-press Review Fee',
      amount: surcharges.prepressReview,
      type: 'addon',
    })
  }

  const total = lineItems.reduce((sum, item) => sum + item.amount, 0)

  return { basePrice: base, lineItems, total }
}
