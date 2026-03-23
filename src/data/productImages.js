/** Auto-generated mapping of product slug → image paths */
const productImages = {
  'acroluxe': ['/images/products/acroluxe/1.jpg', '/images/products/acroluxe/2.jpg', '/images/products/acroluxe/3.jpg', '/images/products/acroluxe/4.jpg', '/images/products/acroluxe/5.jpg', '/images/products/acroluxe/6.jpg'],
  'amora': ['/images/products/amora/1.jpg', '/images/products/amora/2.jpg', '/images/products/amora/3.jpg', '/images/products/amora/4.jpg', '/images/products/amora/5.jpg'],
  'arto': ['/images/products/arto/1.jpg', '/images/products/arto/2.jpg', '/images/products/arto/3.jpg', '/images/products/arto/4.jpg'],
  'eleganza-celestial': ['/images/products/eleganza-celestial/1.jpg', '/images/products/eleganza-celestial/2.jpg', '/images/products/eleganza-celestial/3.jpg', '/images/products/eleganza-celestial/4.jpg', '/images/products/eleganza-celestial/5.jpg'],
  'encanto': ['/images/products/encanto/1.jpg', '/images/products/encanto/2.jpg', '/images/products/encanto/3.jpg', '/images/products/encanto/4.jpg', '/images/products/encanto/5.jpg'],
  'premium-fab-leather': ['/images/products/premium-fab-leather/1.jpg', '/images/products/premium-fab-leather/2.jpg', '/images/products/premium-fab-leather/3.jpg', '/images/products/premium-fab-leather/4.jpg', '/images/products/premium-fab-leather/5.jpg', '/images/products/premium-fab-leather/6.jpg'],
  'fab-leather': ['/images/products/fab-leather/1.jpg', '/images/products/fab-leather/2.jpg', '/images/products/fab-leather/3.png', '/images/products/fab-leather/4.png'],
  'fusion-cover': ['/images/products/fusion-cover/1.jpg', '/images/products/fusion-cover/2.jpg', '/images/products/fusion-cover/3.jpg', '/images/products/fusion-cover/4.jpg', '/images/products/fusion-cover/5.jpg'],
  'gala-cover': ['/images/products/gala-cover/1.jpg', '/images/products/gala-cover/2.jpg', '/images/products/gala-cover/3.jpg', '/images/products/gala-cover/4.jpg', '/images/products/gala-cover/5.jpg'],
  'infiniti': ['/images/products/infiniti/1.jpg', '/images/products/infiniti/2.jpg', '/images/products/infiniti/3.jpg', '/images/products/infiniti/4.jpg', '/images/products/infiniti/5.jpg'],
  'luna': ['/images/products/luna/1.jpg', '/images/products/luna/2.jpg', '/images/products/luna/3.jpg', '/images/products/luna/4.jpg', '/images/products/luna/5.jpg'],
  'luxury-celestial': ['/images/products/luxury-celestial/1.jpg', '/images/products/luxury-celestial/2.jpg', '/images/products/luxury-celestial/3.png', '/images/products/luxury-celestial/4.png'],
  'standard-melange': ['/images/products/standard-melange/1.jpg', '/images/products/standard-melange/2.jpg', '/images/products/standard-melange/3.jpg', '/images/products/standard-melange/4.jpg', '/images/products/standard-melange/5.jpg'],
  'premium-mesmera': ['/images/products/premium-mesmera/1.jpg', '/images/products/premium-mesmera/2.jpg', '/images/products/premium-mesmera/3.jpg', '/images/products/premium-mesmera/4.jpg'],
  'mirage': ['/images/products/mirage/1.jpg', '/images/products/mirage/2.jpg', '/images/products/mirage/3.jpg', '/images/products/mirage/4.jpg'],
  'moment-book': ['/images/products/moment-book/1.jpg', '/images/products/moment-book/2.jpg', '/images/products/moment-book/3.jpg', '/images/products/moment-book/4.jpg', '/images/products/moment-book/5.jpg'],
  'mystique-suede': ['/images/products/mystique-suede/1.jpg', '/images/products/mystique-suede/2.jpg', '/images/products/mystique-suede/3.jpg'],
  'ornato': ['/images/products/ornato/1.jpg', '/images/products/ornato/2.jpg', '/images/products/ornato/3.jpg', '/images/products/ornato/4.jpg', '/images/products/ornato/5.jpg', '/images/products/ornato/6.jpg', '/images/products/ornato/7.jpg', '/images/products/ornato/8.jpg'],
  'plush-leather-cover': ['/images/products/plush-leather-cover/1.jpg', '/images/products/plush-leather-cover/2.jpg', '/images/products/plush-leather-cover/3.jpg', '/images/products/plush-leather-cover/4.jpg', '/images/products/plush-leather-cover/5.jpg', '/images/products/plush-leather-cover/6.jpg'],
  'premium-celestial': ['/images/products/premium-celestial/1.jpg', '/images/products/premium-celestial/2.jpg', '/images/products/premium-celestial/3.jpg', '/images/products/premium-celestial/4.jpg', '/images/products/premium-celestial/5.jpg'],
  'regal': ['/images/products/regal/1.png', '/images/products/regal/2.png', '/images/products/regal/3.jpg'],
  'royal-relics': ['/images/products/royal-relics/1.jpg', '/images/products/royal-relics/2.jpg', '/images/products/royal-relics/3.jpg'],
  'royalty': ['/images/products/royalty/1.jpg', '/images/products/royalty/2.jpg', '/images/products/royalty/3.jpg', '/images/products/royalty/4.jpg', '/images/products/royalty/5.jpg'],
  'spectra': ['/images/products/spectra/1.jpg', '/images/products/spectra/2.jpg', '/images/products/spectra/3.jpg', '/images/products/spectra/4.jpg'],
  'standard-custom': ['/images/products/standard-custom/1.jpg', '/images/products/standard-custom/2.jpg', '/images/products/standard-custom/3.jpg'],
  'standard-plus': ['/images/products/standard-plus/1.jpg', '/images/products/standard-plus/2.jpg', '/images/products/standard-plus/3.jpg', '/images/products/standard-plus/4.png'],
  'vintage-wood-cover': ['/images/products/vintage-wood-cover/1.jpg', '/images/products/vintage-wood-cover/2.jpg', '/images/products/vintage-wood-cover/3.png', '/images/products/vintage-wood-cover/4.png'],
};

/** Get images for a product by slug. Returns array of paths, or empty array. */
export function getProductImages(slug) {
  return productImages[slug] || [];
}

/** Get the first (hero/thumbnail) image for a product. Returns path or null. */
export function getProductThumbnail(slug) {
  const imgs = productImages[slug];
  return imgs && imgs.length > 0 ? imgs[0] : null;
}

export default productImages;
