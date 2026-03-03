/**
 * Dummy user accounts for testing post-login scenarios.
 *
 * 1. Verified professional photographer – full access to every feature.
 * 2. Unverified photographer – restricted access, pending verification.
 */

const dummyUsers = [
  {
    id: 'usr_verified_01',
    name: 'Pixel Sharma',
    email: 'pixel@studio.com',
    phone: '9876543210',
    password: 'password123',
    status: 'verified',
    businessProof: 'https://instagram.com/pixelsharma_photography',
    idFileName: 'govt_id_pixel.pdf',
    registeredAt: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days ago
    verifiedAt: Date.now() - 85 * 24 * 60 * 60 * 1000,   // verified 5 days after registration
    studio: 'Pixel Sharma Photography',
    city: 'Mumbai',
    specialization: ['Weddings', 'Pre-wedding', 'Portraits'],
    plan: 'pro',
  },
  {
    id: 'usr_unverified_02',
    name: 'Honda Mehta',
    email: 'honda@gmail.com',
    phone: '9123456789',
    password: 'password123',
    status: 'registered',
    businessProof: '',
    idFileName: '',
    registeredAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    verifiedAt: null,
    studio: '',
    city: 'Pune',
    specialization: [],
    plan: 'free',
  },
]

export default dummyUsers

/**
 * Quick-reference login credentials:
 *
 * ┌──────────────────────┬─────────────────────┬──────────────┐
 * │ Role                 │ Email               │ Password     │
 * ├──────────────────────┼─────────────────────┼──────────────┤
 * │ Verified Pro         │ pixel@studio.com    │ password123  │
 * │ Unverified           │ honda@gmail.com     │ password123  │
 * └──────────────────────┴─────────────────────┴──────────────┘
 */
