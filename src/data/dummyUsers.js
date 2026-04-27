/**
 * Demo user presets — for UI development reference only.
 * The actual auth state is managed entirely in AuthContext (React state + localStorage).
 *
 * Pricing tiers:
 *   verified      → base price (photographer pro pricing)
 *   registered    → base price × 1.5 (non-verified / non-photographer)
 *   nonPhotographer → base price × 1.5 (regular retail customer)
 */
export const DEMO_USERS = {
  /** Regular retail customer — not a photographer */
  nonPhotographer: {
    id: 'u0',
    email: 'rahul@gmail.com',
    password: 'password123',
    name: 'Rahul Verma',
    city: 'Delhi',
    isPhotographer: false,
    status: 'registered',
    plan: null,
  },
  /** Registered photographer — pending verification */
  registered: {
    id: 'u1',
    email: 'honda@gmail.com',
    password: 'password123',
    name: 'Honda Mehta',
    city: 'Pune',
    isPhotographer: true,
    studioName: 'Honda Photography',
    status: 'registered',
    plan: null,
  },
  /** Verified photographer — full PRO access + pro pricing */
  verified: {
    id: 'u2',
    email: 'pixel@studio.com',
    password: 'password123',
    name: 'Pixel Sharma',
    city: 'Mumbai',
    isPhotographer: true,
    studioName: 'Pixel Studio',
    status: 'verified',
    plan: 'pro',
  },
};
