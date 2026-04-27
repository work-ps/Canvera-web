/**
 * Photographer Referral Codes
 *
 * Verified Canvera photographers can share these codes with their clients.
 * Non-photographer customers enter the code at checkout for exclusive pricing.
 *
 * Business rules:
 *  - Codes are generated per verified photographer (real-world: server-side)
 *  - Discount stacks with regular coupon codes (both apply to subtotal)
 *  - Not available to verified photographers (they have PRO pricing already)
 *  - Codes are case-insensitive (normalise to uppercase before lookup)
 */

export const PHOTOGRAPHER_REFERRALS = {
  PIXEL10: {
    photographerName: 'Pixel Studio',
    city:             'Mumbai',
    discount:         0.10,
    label:            '10% off referred by Pixel Studio',
  },
  HONDA12: {
    photographerName: 'Honda Photography',
    city:             'Pune',
    discount:         0.12,
    label:            '12% off referred by Honda Photography',
  },
  CLICK08: {
    photographerName: 'Click Studio',
    city:             'Delhi',
    discount:         0.08,
    label:            '8% off referred by Click Studio',
  },
  FRAME10: {
    photographerName: 'Frame House',
    city:             'Bengaluru',
    discount:         0.10,
    label:            '10% off referred by Frame House',
  },
  SHUTTER7: {
    photographerName: 'Shutter Co.',
    city:             'Chennai',
    discount:         0.07,
    label:            '7% off referred by Shutter Co.',
  },
};
