/**
 * Canvera Pricing Utility
 *
 * PRO (verified photographer) pricing is the base price stored in product data.
 * All other users (registered non-photographers + registered non-verified
 * photographers) see a retail price that is at least 50% higher.
 *
 * Rule:
 *   isVerified === true  → base price  (photographer wholesale / PRO rate)
 *   everything else      → Math.ceil(basePrice * 1.5)  (retail rate)
 */

/**
 * Returns the price to display for a given user tier.
 * @param {number} basePrice   - The PRO base price from product data
 * @param {boolean} isVerified - Whether the logged-in user is a verified photographer
 * @returns {number}
 */
export function getDisplayPrice(basePrice, isVerified) {
  if (!basePrice || basePrice <= 0) return basePrice;
  return isVerified ? basePrice : Math.ceil(basePrice * 1.5);
}

/**
 * Formats a price as Indian Rupees.
 * @param {number} amount
 * @returns {string}  e.g. "₹10,510"
 */
export function formatINR(amount) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}
