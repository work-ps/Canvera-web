/**
 * Canvera Assistant Engine — "Cana"
 *
 * Architecture:
 *   getPageContext()   → context object for the current route (greeting, actions, proactive)
 *   detectIntent()     → scored pattern-matching across 25+ intents
 *   searchProducts()   → natural-language product filter (budget + occasion + collection)
 *   getResponse()      → structured message list per intent
 *
 * Message object shapes:
 *   { type: 'text',     text: string }
 *   { type: 'list',     items: string[] }
 *   { type: 'action',   label: string, path: string }
 *   { type: 'products', products: Product[] }
 *   { type: 'contact',  options: ContactOption[] }
 *
 * Response shape:
 *   { messages: Message[], quickReplies?: string[], resolvable?: boolean }
 *
 * No network calls — fully client-side, rule-based engine.
 */

import { products, collections } from '../../data/products';

/* ── Contact details ──────────────────────────────────────────── */
export const CONTACT = {
  whatsapp:       'https://wa.me/919108108108',
  whatsappSales:  'https://wa.me/919108100100',
  phone:          'tel:+919108108108',
  email:          'mailto:support@canvera.com',
  salesEmail:     'mailto:sales@canvera.com',
};

/* ─────────────────────────────────────────────────────────────────
   SMART PRODUCT SEARCH
   Parses natural-language queries → filtered, ranked product list
───────────────────────────────────────────────────────────────── */
export function searchProducts(query) {
  const t = query.toLowerCase();

  // Budget extraction — handles "under 5000", "below ₹8k", "within 10,000"
  const budgetRx = /(?:under|below|within|up\s*to|less\s*than|max(?:imum)?|upto)\s*₹?\s*(\d[\d,]*(?:k)?)/i;
  const bm = t.match(budgetRx);
  let maxBudget = null;
  if (bm) {
    let raw = bm[1].replace(/,/g, '');
    if (raw.toLowerCase().endsWith('k')) raw = parseFloat(raw) * 1000;
    maxBudget = parseInt(raw);
  }

  // Occasion extraction
  const OCCASIONS = ['wedding', 'pre-wedding', 'prewedding', 'maternity', 'baby',
                     'birthday', 'corporate', 'portrait', 'lifestyle'];
  const matchedOccasion = OCCASIONS.find(o => t.replace('-', '').includes(o.replace('-', '')));

  // Collection/material extraction
  const COLLECTION_KEYS = ['celestial', 'luxury', 'suede', 'fabric', 'wood', 'leatherette', 'signature'];
  const matchedCollection = COLLECTION_KEYS.find(c => t.includes(c));

  // Badge extraction
  const isBestseller = /bestseller|popular|top|best/i.test(t);
  const isPremium    = /premium|luxury|high.?end|top.?tier/i.test(t);

  // Filter
  let filtered = [...products];

  if (maxBudget)         filtered = filtered.filter(p => p.price <= maxBudget);
  if (matchedOccasion)   filtered = filtered.filter(p =>
    p.occasions?.some(o => o.toLowerCase().replace('-', '').includes(matchedOccasion.replace('-', ''))));
  if (matchedCollection) filtered = filtered.filter(p =>
    p.collection?.toLowerCase().includes(matchedCollection));
  if (isBestseller)      filtered = filtered.filter(p =>
    ['bestseller', 'popular', 'top'].includes(p.badge?.toLowerCase()));
  if (isPremium)         filtered = filtered.filter(p => p.price >= 5000);

  // Fallback: return top products if too aggressive filter
  if (filtered.length === 0) filtered = products.slice(0, 4);

  return { products: filtered.slice(0, 4), maxBudget, matchedOccasion, matchedCollection };
}

/* ─────────────────────────────────────────────────────────────────
   PAGE CONTEXT MAP
   Returns: { page, greeting, quickReplies, homeActions, proactiveMsg, product? }

   homeActions: Array<{ icon, label, desc, intent }>
     — shown as clickable cards on the home screen
   proactiveMsg: string
     — shown in the floating notification bubble above the FAB
───────────────────────────────────────────────────────────────── */
export function getPageContext(pathname, userCtx = {}) {
  const isPhotographer = userCtx.isPhotographer ?? false;
  const isVerified     = userCtx.isVerified ?? false;

  /* ── Home ── */
  if (pathname === '/') return {
    page: 'Home',
    greeting: "Looking to explore our album collections? I can help you find the perfect one for your photography.",
    quickReplies: ['Show Bestsellers', 'Find My Album', 'Albums Under ₹5,000', 'Talk to Expert'],
    proactiveMsg: "Looking for the perfect album? I can find one in 30 seconds.",
    homeActions: [
      { icon: '🎯', label: 'Find my perfect album', desc: 'Personalised in 30 seconds', intent: 'recommend an album' },
      { icon: '💰', label: 'Pricing & deals',        desc: 'Albums from ₹499',          intent: 'pricing info' },
      { icon: '📦', label: 'Track my order',         desc: 'Check delivery status',     intent: 'track my order' },
    ],
  };

  /* ── Shop ── */
  if (pathname === '/shop') return {
    page: 'Shop',
    greeting: "Browsing our catalogue? I can recommend albums based on your occasion, budget, or style — just ask.",
    quickReplies: ['Best for Weddings', 'Under ₹5,000', 'Premium Albums', 'Talk to Expert'],
    proactiveMsg: "Need help picking the right album? Tell me your budget and occasion.",
    homeActions: [
      { icon: '🎯', label: 'Help me choose',   desc: 'Personalised recommendation', intent: 'recommend an album' },
      { icon: '💸', label: 'Budget options',   desc: 'Great albums under ₹5,000',   intent: 'show albums under 5000' },
      { icon: '⭐', label: 'See bestsellers',  desc: 'Most loved by photographers', intent: 'show bestsellers' },
    ],
  };

  /* ── Collections listing ── */
  if (pathname === '/collections') return {
    page: 'Collections',
    greeting: "Exploring our collections? I can tell you what makes each one special — materials, occasions, price range.",
    quickReplies: ['Celestial Range', 'Fabric & Wood', 'Custom Cover', 'Compare Ranges'],
    proactiveMsg: "Not sure which collection fits you? I can explain what makes each one unique.",
    homeActions: [
      { icon: '✨', label: 'Celestial Collection',  desc: 'Crystal-adorned luxury',        intent: 'celestial collection' },
      { icon: '🪵', label: 'Fabric & Wood',          desc: 'Handcrafted natural materials', intent: 'fabric wood collection' },
      { icon: '🎨', label: 'Custom cover options',   desc: 'Make it uniquely yours',        intent: 'customize my album' },
    ],
  };

  /* ── Collection detail ── */
  if (pathname.startsWith('/collections/')) {
    const slug = pathname.slice('/collections/'.length);
    const col  = collections.find(c => c.slug === slug);
    return {
      page: col ? col.name + ' Collection' : 'Collection',
      greeting: col
        ? `The **${col.name}** collection — ${col.description} Want to know more or see available products?`
        : "Exploring this collection? Ask me anything about it.",
      quickReplies: ['See Products', 'Pricing', 'Compare Collections', 'Talk to Expert'],
      proactiveMsg: col ? `Questions about the ${col.name} collection? I can help.` : "Questions about this collection?",
      homeActions: [
        { icon: '🖼️', label: 'See products',         desc: 'Browse this collection',          intent: 'see products in this collection' },
        { icon: '💰', label: 'Pricing for this',      desc: 'What does it cost?',              intent: 'pricing info' },
        { icon: '⚖️', label: 'Compare collections',   desc: 'Find the right one for you',      intent: 'compare collections' },
      ],
    };
  }

  /* ── Product detail ── */
  if (pathname.startsWith('/products/')) {
    const slug    = pathname.slice('/products/'.length);
    const product = products.find(p => p.slug === slug);
    return {
      page: product?.name || 'Product',
      product,
      greeting: product
        ? `Interested in the **${product.name}**? I can help with pricing, sizes, delivery timelines, or anything else.`
        : "Interested in this product? Ask me anything.",
      quickReplies: ['Pricing Info', 'Size Options', 'Delivery Time', 'Similar Products'],
      proactiveMsg: product
        ? `Questions about the ${product.name}? Ask me anything.`
        : "Questions about this product? I'm here.",
      homeActions: [
        { icon: '💰', label: 'Pricing for this',   desc: 'Starting price & options',   intent: 'pricing info' },
        { icon: '📐', label: 'Size & spec guide',  desc: 'Which size fits your work',  intent: 'size options' },
        { icon: '🚚', label: 'Delivery timeline',  desc: 'When will it arrive?',       intent: 'delivery timeline' },
      ],
    };
  }

  /* ── Product Finder ── */
  if (pathname === '/finder') return {
    page: 'Product Finder',
    greeting: "Using the Album Finder? I can also help — just tell me the occasion, budget, and style you prefer.",
    quickReplies: ['Wedding Albums', 'Pre-Wedding', 'Premium Range', 'Budget Albums'],
    proactiveMsg: "Want a personalised recommendation instead? Just tell me your occasion.",
    homeActions: [
      { icon: '💒', label: 'Wedding albums',     desc: 'Top picks for weddings',       intent: 'wedding albums' },
      { icon: '💰', label: 'Set my budget',      desc: 'Filter by price range',        intent: 'pricing info' },
      { icon: '🎨', label: 'Custom design',      desc: 'Build it exactly your way',    intent: 'customize my album' },
    ],
  };

  /* ── Make Your Own ── */
  if (pathname === '/custom') return {
    page: 'Make Your Own',
    greeting: "Creating a custom album? Ask me about materials, sizes, binding styles, or cover options — I know every spec.",
    quickReplies: ['Material Guide', 'Binding Types', 'Best for Weddings', 'Talk to Designer'],
    proactiveMsg: "Need help choosing materials or cover styles for your custom album?",
    homeActions: [
      { icon: '📋', label: 'Material guide',     desc: 'Compare paper & cover types',  intent: 'material guide' },
      { icon: '📚', label: 'Binding types',      desc: 'Layflat, flush, absolute…',   intent: 'binding types' },
      { icon: '👨‍🎨', label: 'Talk to designer', desc: 'Get expert advice',            intent: 'talk to expert' },
    ],
  };

  /* ── Order Wizard ── */
  if (pathname.startsWith('/order/')) {
    const slug    = pathname.slice('/order/'.length);
    const product = products.find(p => p.slug === slug);
    return {
      page: product ? `Customising ${product.name}` : 'Order Wizard',
      product,
      greeting: product
        ? `Configuring the **${product.name}**? I can explain any option — paper type, cover, lamination, or binding.`
        : "Configuring your order? Ask me about any step.",
      quickReplies: ['Paper Types', 'Cover Options', 'Lamination Guide', 'Delivery Time'],
      proactiveMsg: "Unsure about any option on this page? I can explain each one.",
      homeActions: [
        { icon: '📄', label: 'Paper types explained', desc: 'NT, glossy, matte & more',     intent: 'paper types' },
        { icon: '🔲', label: 'Lamination guide',       desc: 'Glossy vs matte vs soft-touch', intent: 'lamination guide' },
        { icon: '📚', label: 'Binding options',        desc: 'Layflat, flush, absolute',      intent: 'binding types' },
      ],
    };
  }

  /* ── Cart ── */
  if (pathname === '/cart') return {
    page: 'Cart',
    greeting: "Ready to checkout? I can help with promo codes, delivery estimates, or payment options.",
    quickReplies: ['Apply Promo Code', 'Delivery Timeline', 'Payment Methods', 'Talk to Support'],
    proactiveMsg: "Got a promo code? Or need help with checkout? I can assist.",
    homeActions: [
      { icon: '🏷️', label: 'Apply promo code', desc: 'Enter a discount code',      intent: 'promo code' },
      { icon: '🚚', label: 'Delivery info',     desc: 'Timeline & coverage',         intent: 'delivery timeline' },
      { icon: '💳', label: 'Payment options',   desc: 'UPI, cards, EMI & more',     intent: 'payment options' },
    ],
  };

  /* ── Checkout ── */
  if (pathname === '/checkout') return {
    page: 'Checkout',
    greeting: "Almost there! Any issues with address, payment, or the order summary? I'm right here.",
    quickReplies: ['Payment Failed?', 'Address Help', 'Promo Code', 'Talk to Support'],
    proactiveMsg: "Anything holding you back from placing your order? Let me help.",
    homeActions: [
      { icon: '💳', label: 'Payment help',    desc: 'Issues or payment methods',   intent: 'payment help' },
      { icon: '📍', label: 'Address query',   desc: 'Delivery address issues',     intent: 'address help' },
      { icon: '🏷️', label: 'Promo code',     desc: 'Apply a discount',            intent: 'promo code' },
    ],
  };

  /* ── Profile ── */
  if (pathname === '/profile') return {
    page: 'My Account',
    greeting: isPhotographer && !isVerified
      ? "Managing your account? I can help with orders, Pro verification, or subscription details."
      : "Managing your account? I can help with orders, address details, or support queries.",
    quickReplies: isPhotographer && !isVerified
      ? ['Track My Order', 'Get Pro Verified', 'Subscription Info', 'Talk to Support']
      : ['Track My Order', 'Subscription Info', 'Account Help', 'Talk to Support'],
    proactiveMsg: isPhotographer && !isVerified
      ? "Need help with your account, orders, or Pro verification?"
      : "Need help with your account or orders?",
    homeActions: [
      { icon: '📦', label: 'Track my order',    desc: 'Check delivery status',       intent: 'track my order' },
      isPhotographer && !isVerified
        ? { icon: '✅', label: 'Get Pro verified',  desc: 'Unlock wholesale pricing',  intent: 'pro verification' }
        : { icon: '🛍️', label: 'Browse albums',     desc: 'Explore our catalogue',     intent: 'browse albums' },
      { icon: '💬', label: 'Account support',   desc: 'Issues with your account',    intent: 'talk to support' },
    ],
  };

  /* ── Track Order ── */
  if (pathname === '/track') return {
    page: 'Track Order',
    greeting: "Tracking your order? Enter your Order ID on this page, or ask me about typical delivery timelines.",
    quickReplies: ['Delivery Timeline', 'Order Delayed?', 'Talk to Support'],
    proactiveMsg: "Need help tracking your order? I can explain what to expect.",
    homeActions: [
      { icon: '🕐', label: 'Delivery timeline',  desc: 'How long does it take?',    intent: 'delivery timeline' },
      { icon: '⚠️', label: 'Order delayed?',      desc: "It's been longer than usual", intent: 'order delayed' },
      { icon: '💬', label: 'Talk to support',    desc: 'Get human assistance',       intent: 'talk to support' },
    ],
  };

  /* ── FAQ ── */
  if (pathname === '/faq') return {
    page: 'FAQ & Support',
    greeting: "Looking for answers? Ask me directly and I'll find the right response — or connect you to our team instantly.",
    quickReplies: ['Refund Policy', 'Delivery Info', 'Verify Product', 'Talk to Human'],
    proactiveMsg: "Can't find what you're looking for? Ask me directly.",
    homeActions: [
      { icon: '↩️', label: 'Returns & refunds',  desc: 'Our replacement policy',     intent: 'refund policy' },
      { icon: '🚚', label: 'Delivery info',       desc: 'Timelines, coverage & more', intent: 'delivery timeline' },
      { icon: '🧑‍💼', label: 'Talk to a human',  desc: 'Our team is standing by',   intent: 'talk to someone' },
    ],
  };

  /* ── Contact ── */
  if (pathname === '/contact') return {
    page: 'Contact',
    greeting: "Reaching out? Tell me what you need and I'll route you to exactly the right person right away.",
    quickReplies: ['Sales Inquiry', 'Support Issue', 'Bulk Order', 'Partnership'],
    proactiveMsg: "I can connect you with the right Canvera team member instantly.",
    homeActions: [
      { icon: '💬', label: 'WhatsApp us',       desc: 'Fastest response',            intent: 'whatsapp' },
      { icon: '📞', label: 'Call us',            desc: 'Mon–Sat, 9 AM–7 PM',         intent: 'call us' },
      { icon: '💼', label: 'Bulk orders',        desc: 'Studio & wholesale pricing',  intent: 'bulk orders' },
    ],
  };

  /* ── Verify / Genuine ── */
  if (pathname === '/genuine' || pathname === '/verify') return {
    page: 'Verify Product',
    greeting: "Verifying a Canvera product? I can guide you through the process — or escalate immediately if you've spotted a counterfeit.",
    quickReplies: ['How to Verify', 'Report Fake', 'Talk to Support'],
    proactiveMsg: "Need help verifying your Canvera product's authenticity?",
    homeActions: [
      { icon: '🔍', label: 'How to verify',     desc: 'Step-by-step guide',          intent: 'how to verify' },
      { icon: '🚨', label: 'Report a fake',      desc: 'We take this seriously',      intent: 'report counterfeit' },
      { icon: '💬', label: 'Talk to support',   desc: 'Get direct help',             intent: 'talk to support' },
    ],
  };

  /* ── About ── */
  if (pathname === '/about') return {
    page: 'About Canvera',
    greeting: "Learning about us? Happy to share our story, the Photographer Pro Programme, or connect you with the right team.",
    quickReplies: ['Photographer Program', 'Partnership', 'Our Collections', 'Contact Team'],
    proactiveMsg: "Want to know more about Canvera or our photographer programme?",
    homeActions: [
      { icon: '📸', label: 'Photographer Pro',  desc: 'Wholesale & priority access',  intent: 'pro verification' },
      { icon: '🤝', label: 'Partnership inquiry', desc: 'Work with us',               intent: 'partnership' },
      { icon: '💬', label: 'Talk to the team',  desc: 'Direct connection',            intent: 'talk to someone' },
    ],
  };

  /* ── Fallback ── */
  return {
    page: 'Page',
    greeting: "Hi there! I'm Cana — your Canvera assistant. How can I help you today?",
    quickReplies: ['Browse Albums', 'Track Order', 'Pricing Info', 'Talk to Support'],
    proactiveMsg: "Got a question about Canvera? I'm here to help.",
    homeActions: [
      { icon: '🖼️', label: 'Browse albums',     desc: 'Explore our catalogue',       intent: 'browse albums' },
      { icon: '📦', label: 'Track my order',    desc: 'Check delivery status',       intent: 'track my order' },
      { icon: '💬', label: 'Talk to someone',   desc: 'Our team replies fast',       intent: 'talk to someone' },
    ],
  };
}

/* ─────────────────────────────────────────────────────────────────
   INTENT DETECTION — Scored pattern matching
   Each intent has patterns and a confidence weight.
   The highest cumulative score wins. Minimum score of 2 required.
───────────────────────────────────────────────────────────────── */
const INTENT_PATTERNS = [
  ['greeting',      /\b(hi|hello|hey|helo|namaste|good\s+morning|good\s+evening|howdy)\b/gi, 4],
  ['whatsapp',      /whatsapp|watsapp|wa\.me|whats\s*app/gi, 5],
  ['call',          /\b(call|phone|speak|talk\s+to\s+(someone|team|agent|person|human|you)|ring)\b/gi, 4],
  ['track',         /\b(track|order\s+status|where.*order|shipment|dispatch|delivery\s+status|shipped)\b/gi, 4],
  ['pricing',       /\b(price|cost|how\s+much|rate|pricing|expensive|budget|afford|cheap|₹|per\s+album|quote)\b/gi, 3],
  ['search',        /\b(show\s+me|find\s+me|search\s+for|looking\s+for|want)\b.*(album|book|product)/gi, 5],
  ['occasion',      /\b(wedding|pre.?wedding|maternity|baby|newborn|birthday|corporate|portrait|lifestyle)\b/gi, 4],
  ['refund',        /\b(refund|cancel|return|replace|money\s+back|dispute|damaged|broken|wrong)\b/gi, 4],
  ['size',          /\b(size|dimension|cm|inch|format|landscape|portrait\s+format|square|large\s+format)\b/gi, 3],
  ['offers',        /\b(discount|offer|promo|coupon|code|deal|sale|cashback|voucher)\b/gi, 4],
  ['authenticity',  /\b(verify|genuine|authentic|original|fake|counterfeit|real|legit)\b/gi, 4],
  ['account',       /\b(login|sign.?up|register|account|password|forgot|access|sign\s+in)\b/gi, 3],
  ['delivery',      /\b(deliver|ship|arrive|dispatch|when\s+will|how\s+long|eta|expected)\b/gi, 3],
  ['collection',    /\b(celestial|luxury|suede|fabric|wood|leatherette|signature|foiling|collection)\b/gi, 4],
  ['customize',     /\b(custom|make.*own|build.*album|design\s+my|create\s+my|personalise)\b/gi, 4],
  ['support',       /\b(help|support|issue|problem|complaint|bug|error|not\s+working|broken)\b/gi, 3],
  ['recommend',     /\b(suggest|recommend|best|which\s+album|what.*album|find.*album|best.*for|top\s+pick)\b/gi, 4],
  ['specs',         /\b(paper|binding|layflat|lamination|cover|flush|absolute|neo|matte|glossy|soft.?touch)\b/gi, 4],
  ['payment',       /\b(pay|payment|upi|card|bank|razorpay|failed|declined|transaction)\b/gi, 4],
  ['bulk',          /\b(bulk|wholesale|business|studio|quantity|multiple\s+orders|volume)\b/gi, 4],
  ['pro',           /\b(pro|verified|verification|photographer\s+pro|plan|subscription|wholesale)\b/gi, 3],
  ['thanks',        /\b(thank|thanks|thank\s+you|great|awesome|perfect|helpful|excellent)\b/gi, 3],
  ['bye',           /\b(bye|goodbye|exit|close|later|see\s+you|ciao)\b/gi, 4],
  ['navigate',      /\b(navigate|go\s+to|take\s+me|open\s+the|show\s+me\s+the|visit)\b/gi, 4],
  ['promoCode',     /\b(promo|code|coupon|voucher|discount\s+code|apply\s+code)\b/gi, 4],
];

export function detectIntent(text) {
  const t = text.toLowerCase().trim();
  let best = 'unknown';
  let bestScore = 0;

  for (const [intent, pattern, weight] of INTENT_PATTERNS) {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    const matches = (t.match(pattern) || []).length;
    const score = matches * weight;
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  // Minimum confidence threshold
  return bestScore >= 3 ? best : 'unknown';
}

/* ─────────────────────────────────────────────────────────────────
   RESPONSE GENERATOR
   Returns: { messages: Message[], quickReplies?: string[], resolvable?: boolean }

   resolvable: true → show "Was this helpful?" after delivery
───────────────────────────────────────────────────────────────── */
export function getResponse(intent, context, user, rawText) {
  const { page, product, quickReplies: ctxQR } = context;
  const isLoggedIn     = !!user;
  const isVerified     = user?.status === 'verified';
  const isPhotographer = user?.isPhotographer;
  const userName       = user?.name?.split(' ')[0] || '';
  const t              = rawText.toLowerCase();

  switch (intent) {

    /* ── greeting ── */
    case 'greeting':
      return {
        messages: [
          { type: 'text', text: `Hey${userName ? ` ${userName}` : ''}! 👋 Great to have you here on Canvera.` },
          { type: 'text', text: context.greeting },
        ],
        quickReplies: ctxQR,
      };

    /* ── whatsapp ── */
    case 'whatsapp':
      return {
        messages: [
          { type: 'text', text: "Absolutely! Choose who you'd like to reach on WhatsApp:" },
          { type: 'contact', options: [
            { icon: '🛠️', label: 'Customer Support', sub: 'Orders, issues, delivery — fastest resolution', href: `${CONTACT.whatsapp}?text=Hi Canvera team, I need help with: `, primary: true },
            { icon: '💼', label: 'Sales Team',        sub: 'Pricing, bulk orders, studio accounts',        href: `${CONTACT.whatsappSales}?text=Hi, I'm interested in Canvera products`, primary: false },
          ]},
        ],
      };

    /* ── call ── */
    case 'call':
    case 'talk to someone':
    case 'talk to support':
    case 'talk to expert':
      return {
        messages: [
          { type: 'text', text: "Happy to connect you with a real person. Choose your preferred channel:" },
          { type: 'contact', options: [
            { icon: '💬', label: 'WhatsApp',        sub: 'Usually replies in minutes',     href: `${CONTACT.whatsapp}?text=Hi, I'd like to speak with someone from Canvera`, primary: true },
            { icon: '📞', label: 'Call Support',    sub: 'Mon–Sat, 9 AM–7 PM IST',         href: CONTACT.phone, primary: false },
            { icon: '✉️', label: 'Email Us',        sub: 'Response within 24 hours',       href: CONTACT.email, primary: false },
          ]},
        ],
      };

    /* ── track order ── */
    case 'track':
      return {
        messages: [
          { type: 'text', text: "To track your order, you'll need the **Order ID** from your confirmation email or SMS." },
          { type: 'action', label: 'Track My Order', path: '/track' },
          { type: 'text', text: "**Typical timeline:** production (5–7 days) + quality check (1 day) + shipping (2–4 days) = **8–12 working days** total. If it's been longer, contact support with your Order ID and we'll look it up immediately." },
        ],
        quickReplies: ['Order Delayed?', 'Delivery Timeline', 'Talk to Support'],
        resolvable: true,
      };

    /* ── pricing ── */
    case 'pricing':
      if (product) {
        return {
          messages: [
            { type: 'text', text: `The **${product.name}** starts at **₹${product.price?.toLocaleString('en-IN')}** for the base 12×18 configuration.` },
            { type: 'list', items: [
              'Price adjusts based on size, paper type, binding style, and accessories',
              'Larger sizes (15×18, 18×24) add ₹800–₹2,500',
              'Layflat upgrade typically adds ₹600–₹1,200',
              isVerified
                ? '✅ You\'re seeing Pro wholesale pricing — 30–40% off retail'
                : isPhotographer
                  ? '💡 Get verified as Canvera Pro to unlock wholesale pricing (30–40% off)'
                  : 'Retail pricing shown — photographers can get verified Pro rates',
            ]},
          ],
          quickReplies: isVerified
            ? ['Order Now', 'Size Guide', 'Delivery Time']
            : isPhotographer
              ? ['Get Pro Verified', 'Size Options', 'Talk to Sales']
              : ['Size Options', 'Delivery Time', 'Talk to Sales'],
          resolvable: true,
        };
      }
      return {
        messages: [
          { type: 'text', text: "Here's a quick overview of Canvera's price ranges:" },
          { type: 'list', items: [
            '🟢 Starter range: ₹499 – ₹1,500 (décor, prints)',
            '🔵 Standard albums: ₹2,500 – ₹5,000',
            '🟣 Premium range: ₹5,500 – ₹10,000',
            '✨ Celestial (Swarovski): ₹7,000 – ₹11,000',
            '📖 Superbooks (large format): ₹15,000+',
          ]},
          { type: 'text', text: isPhotographer && !isVerified
            ? "💡 **Pro Tip:** Verified photographers get 30–40% off these prices. Want to know how verification works?"
            : "Need a specific album within a budget? Tell me the amount and occasion — I'll find the best options." },
        ],
        quickReplies: isPhotographer && !isVerified
          ? ['Get Pro Verified', 'Browse Albums', 'Talk to Sales']
          : ['Under ₹5,000', 'Premium Albums', 'Talk to Sales'],
        resolvable: true,
      };

    /* ── search ── */
    case 'search': {
      const { products: found, maxBudget, matchedOccasion } = searchProducts(rawText);
      const desc = [
        matchedOccasion && `for ${matchedOccasion}`,
        maxBudget       && `under ₹${maxBudget.toLocaleString('en-IN')}`,
      ].filter(Boolean).join(' ') || 'matching your query';
      return {
        messages: [
          { type: 'text', text: `Here are the best albums ${desc}:` },
          { type: 'products', products: found },
          ...(found.length < 3
            ? [{ type: 'text', text: "Don't see what you need? I can refine the search — just describe what you're looking for." }]
            : [{ type: 'action', label: 'See Full Catalogue', path: '/shop' }]
          ),
        ],
        quickReplies: ['Filter by Budget', 'For Weddings', 'Talk to Expert'],
        resolvable: true,
      };
    }

    /* ── occasion ── */
    case 'occasion': {
      const occ = t.match(/wedding|pre.?wedding|maternity|baby|newborn|birthday|corporate|portrait/)?.[0] || '';
      const matched = products
        .filter(p => p.occasions?.some(o => o.toLowerCase().includes(occ || 'wedding')))
        .slice(0, 3);
      return {
        messages: [
          { type: 'text', text: occ
            ? `Top picks for **${occ.charAt(0).toUpperCase() + occ.slice(1)}** photography:`
            : "Here are our most popular albums right now:" },
          { type: 'products', products: matched.length ? matched : products.slice(0, 3) },
          { type: 'action', label: 'See All Albums', path: '/shop' },
        ],
        quickReplies: ['Under ₹5,000', 'Premium Range', 'Talk to Expert'],
        resolvable: true,
      };
    }

    /* ── refund ── */
    case 'refund':
      return {
        messages: [
          { type: 'text', text: "Since albums are custom-produced to your exact specifications, we don't accept returns for a change of mind." },
          { type: 'text', text: "**However**, if your order arrives damaged, incorrect, or with a production defect, we replace it at absolutely no charge. Please contact us **within 48 hours of delivery** with clear photos of the issue." },
          { type: 'contact', options: [
            { icon: '💬', label: 'Report via WhatsApp', sub: 'Fastest resolution — send photos directly', href: `${CONTACT.whatsapp}?text=Hi, I received a damaged Canvera album. Order ID: `, primary: true },
            { icon: '✉️', label: 'Email with photos',   sub: 'Attach images of the issue',                href: CONTACT.email, primary: false },
          ]},
        ],
        quickReplies: ['Talk to Support', 'Track My Order'],
        resolvable: true,
      };

    /* ── size guide ── */
    case 'size':
      return {
        messages: [
          { type: 'text', text: "Canvera albums come in these sizes — all available as layflat or standard binding:" },
          { type: 'list', items: [
            '**12×18 in** — Industry standard, ideal for weddings & portraits',
            '**12×15 in** — Compact premium, great for pre-wedding',
            '**12×12 in** — Square format, lifestyle & maternity',
            '**10×14 in** — Smaller size, perfect for gifting',
            '**18×24 in** — Superbook, statement large-format album',
            '**Custom sizes** — Available on request for studio orders',
          ]},
          { type: 'text', text: "**Not sure?** For wedding photography, **12×18** is the industry favourite — it's the format clients most often display prominently." },
        ],
        quickReplies: ['Pricing Info', 'Layflat vs Flush?', 'Browse Albums'],
        resolvable: true,
      };

    /* ── offers / promo ── */
    case 'offers':
    case 'promoCode':
      return {
        messages: [
          { type: 'text', text: "Here are the ways to get the best deal on Canvera:" },
          { type: 'list', items: [
            '✅ **Get Pro Verified** — Up to 40% off retail, permanently',
            '📦 **Bulk orders (5+ albums)** — Additional volume discount',
            '📱 **WhatsApp channel** — Exclusive seasonal offers first',
            '🤝 **Referral codes** — From fellow photographers',
            '🏷️ **Have a code?** — Enter it at checkout',
          ]},
          { type: 'action', label: 'Apply a Code at Checkout', path: '/checkout' },
        ],
        quickReplies: ['Get Pro Verified', 'Bulk Order Quote', 'Talk to Sales'],
        resolvable: true,
      };

    /* ── authenticity ── */
    case 'authenticity':
    case 'how to verify':
      return {
        messages: [
          { type: 'text', text: "Every genuine Canvera album has a **unique verification code** printed on the inside cover. Here's how to verify:" },
          { type: 'list', items: [
            'Locate the holographic label on the inside cover',
            'Scratch gently to reveal the code',
            'Enter the code on our Verify page',
            "You'll see the album's production details & date",
          ]},
          { type: 'action', label: 'Verify Your Album Now', path: '/genuine' },
          { type: 'text', text: "Suspect a counterfeit? Report it immediately — we investigate every case and will escalate." },
        ],
        quickReplies: ['Report Counterfeit', 'Talk to Support'],
        resolvable: true,
      };

    /* ── account ── */
    case 'account':
      if (!isLoggedIn) return {
        messages: [
          { type: 'text', text: "You'll need to be logged in to access orders, pricing, and your profile." },
          { type: 'action', label: 'Log In', path: '/login' },
          { type: 'action', label: 'Create Account', path: '/signup' },
        ],
      };
      if (isPhotographer && !isVerified) return {
        messages: [
          { type: 'text', text: `Hi **${userName}**! You're registered as a photographer. Get **Pro Verified** to unlock wholesale pricing — typically 30–40% below retail.` },
          { type: 'action', label: 'Start Verification', path: '/profile' },
        ],
        quickReplies: ['How to Get Verified', 'Pricing Info', 'Talk to Team'],
        resolvable: true,
      };
      return {
        messages: [
          { type: 'text', text: `Hi **${userName}**! You're all set${isVerified ? ' — verified Pro ✅ wholesale pricing active' : ''}.` },
          { type: 'action', label: 'Go to My Profile', path: '/profile' },
        ],
        quickReplies: ['Track Order', 'Browse Albums', 'Talk to Support'],
        resolvable: true,
      };

    /* ── delivery ── */
    case 'delivery':
      return {
        messages: [
          { type: 'text', text: "Here's what to expect after your order is confirmed:" },
          { type: 'list', items: [
            '🔧 **Production:** 5–7 working days',
            '✅ **Quality check & packing:** 1 working day',
            '📦 **Shipping:** 2–4 working days (2,800+ cities covered)',
            '⏱️ **Total:** typically 8–12 working days',
          ]},
          { type: 'text', text: "**Express production** is available on request — contact our team for availability and pricing." },
        ],
        quickReplies: ['Track My Order', 'Express Option', 'Talk to Support'],
        resolvable: true,
      };

    /* ── collection ── */
    case 'collection': {
      const colMatch = t.match(/celestial|luxury|suede|fabric|wood|leatherette|signature|foiling/)?.[0];
      const col      = colMatch ? collections.find(c => c.name.toLowerCase().includes(colMatch)) : null;
      const colProds = col ? products.filter(p => p.collection === col.name).slice(0, 3) : [];
      return col ? {
        messages: [
          { type: 'text', text: `**${col.name} Collection** — ${col.description}` },
          ...(colProds.length ? [{ type: 'products', products: colProds }] : []),
          { type: 'action', label: `View ${col.name} Collection`, path: `/collections/${col.slug}` },
        ],
        quickReplies: ['Pricing Info', 'Compare Collections', 'Browse All'],
        resolvable: true,
      } : {
        messages: [
          { type: 'text', text: "We have **9 curated collections** — from crystal-adorned Celestial to handcrafted Wood and Fabric editions. Each has a distinct character:" },
          { type: 'list', items: [
            '✨ **Celestial** — Swarovski crystal covers, ultra-luxury',
            '🪵 **Fabric & Wood** — Handcrafted natural materials',
            '💎 **Luxury** — Premium leathers, deep embossing',
            '🔲 **Signature** — Clean, editorial aesthetic',
          ]},
          { type: 'action', label: 'Browse All Collections', path: '/collections' },
        ],
        quickReplies: ['Celestial Pricing', 'Premium Albums', 'Custom Cover'],
        resolvable: true,
      };
    }

    /* ── customize ── */
    case 'customize':
      return {
        messages: [
          { type: 'text', text: "You can build a completely custom album — **every detail chosen by you**:" },
          { type: 'list', items: [
            'Cover material (leather, fabric, wood, leatherette)',
            'Size (10×14 to 18×24 and custom)',
            'Binding type (layflat, flush mount, absolute)',
            'Paper type (NT matte, glossy, satin)',
            'Lamination (glossy, matte, soft-touch)',
            'Cover colour, emboss pattern, and foil options',
          ]},
          { type: 'action', label: 'Start Making Your Own', path: '/custom' },
          { type: 'text', text: "Tell me the occasion and I can suggest the best starting point — material and binding combination that photographers love." },
        ],
        quickReplies: ['Best for Weddings', 'Material Guide', 'Talk to Designer'],
        resolvable: true,
      };

    /* ── support ── */
    case 'support':
      return {
        messages: [
          { type: 'text', text: "I'm sorry to hear that — let me get you to the right person immediately." },
          { type: 'contact', options: [
            { icon: '💬', label: 'WhatsApp Support', sub: 'Fastest for urgent issues — send images too',   href: `${CONTACT.whatsapp}?text=Hi, I need help from Canvera support. Issue: `, primary: true },
            { icon: '📞', label: 'Call Support',     sub: 'Mon–Sat, 9 AM–7 PM IST',                        href: CONTACT.phone, primary: false },
            { icon: '✉️', label: 'Email Support',    sub: 'For detailed issues with attachments',           href: CONTACT.email, primary: false },
          ]},
        ],
        quickReplies: ['Order Issue', 'Payment Problem', 'Damage Report'],
      };

    /* ── recommend ── */
    case 'recommend': {
      const topPicks = products.filter(p =>
        ['bestseller', 'popular'].includes(p.badge?.toLowerCase())
      ).slice(0, 3);
      return {
        messages: [
          { type: 'text', text: "Here are our most-loved albums right now — consistently chosen by professional photographers:" },
          { type: 'products', products: topPicks.length ? topPicks : products.slice(0, 3) },
          { type: 'text', text: "For a **personalised match**, the Album Finder takes just 30 seconds — it asks about your occasion, style, and budget." },
          { type: 'action', label: 'Take the Album Finder', path: '/finder' },
        ],
        quickReplies: ['For Weddings', 'Under ₹5,000', 'Premium Only', 'Make Custom'],
        resolvable: true,
      };
    }

    /* ── specs / technical ── */
    case 'specs':
      return {
        messages: [
          { type: 'text', text: "Quick reference for the key spec decisions:" },
          { type: 'list', items: [
            '**Layflat** — photos span edge-to-edge with zero gutter. Best for panoramas.',
            '**Absolute** — layflat with a very slight gutter. Popular for portraits.',
            '**Flush Mount** — pages are mounted and laminated. Extremely durable.',
            '**NT Paper** — archive-quality, acid-free, ultra-smooth finish.',
            '**Glossy lam** — vivid colours, high contrast. Best for outdoor shoots.',
            '**Matte lam** — soft, elegant finish. Minimal reflections. Best for studios.',
            '**Soft-touch lam** — velvety feel. Premium choice for high-end clients.',
          ]},
          { type: 'text', text: "**Most popular combination for weddings:** Layflat binding + NT paper + Glossy lamination." },
        ],
        quickReplies: ['Size Guide', 'Pricing', 'Browse Albums'],
        resolvable: true,
      };

    /* ── payment ── */
    case 'payment':
      return {
        messages: [
          { type: 'text', text: "We accept all major payment methods:" },
          { type: 'list', items: [
            '📱 UPI (Google Pay, PhonePe, Paytm, BHIM)',
            '💳 Debit & credit cards (Visa, Mastercard, RuPay)',
            '🏦 Net banking (all major banks)',
            '🔄 EMI — available on eligible orders via Razorpay',
          ]},
          { type: 'text', text: "**Payment failed?** Wait 5 minutes — failed charges are automatically reversed. If your account was debited but the order wasn't confirmed, contact us immediately with your transaction reference." },
          { type: 'contact', options: [
            { icon: '💬', label: 'Report Payment Issue', sub: 'Provide your transaction ID for fastest help', href: `${CONTACT.whatsapp}?text=Hi, I have a payment issue. Transaction ID: `, primary: true },
          ]},
        ],
        quickReplies: ['Talk to Support', 'Track My Order'],
        resolvable: true,
      };

    /* ── bulk / wholesale ── */
    case 'bulk':
      return {
        messages: [
          { type: 'text', text: "For **bulk or studio orders**, our Sales team can put together a custom quote with volume pricing and priority production slots." },
          { type: 'list', items: [
            'Volume pricing starts from 5+ albums',
            'Custom branding options available for studios',
            'Dedicated account manager for 20+ orders',
            'Priority production — jump the queue',
          ]},
          { type: 'contact', options: [
            { icon: '💼', label: 'Talk to Sales',  sub: 'Bulk pricing & custom studio deals',    href: `${CONTACT.whatsappSales}?text=Hi, I'm interested in bulk ordering from Canvera. Details: `, primary: true },
            { icon: '✉️', label: 'Email Sales',    sub: 'Attach your requirements or brief',     href: CONTACT.salesEmail, primary: false },
          ]},
        ],
        quickReplies: ['Pro Verification', 'Pricing Info', 'Browse Albums'],
        resolvable: true,
      };

    /* ── pro verification ── */
    case 'pro':
      if (isVerified) return {
        messages: [
          { type: 'text', text: "You're already a **verified Canvera Pro** ✅ — you're actively getting wholesale pricing across the entire platform." },
          { type: 'action', label: 'View My Profile', path: '/profile' },
        ],
        quickReplies: ['Browse Albums', 'Track Order', 'Talk to Support'],
      };
      return {
        messages: [
          { type: 'text', text: "The **Canvera Pro Programme** is for professional photographers who order regularly. Once verified, you unlock:" },
          { type: 'list', items: [
            '💰 30–40% off retail prices — platform-wide, permanently',
            '⚡ Priority production queue — faster turnaround',
            '🧑‍💼 Dedicated account manager for bulk orders',
            '🎁 Early access to new collections before public launch',
          ]},
          { type: 'text', text: isPhotographer
            ? "You're already registered as a photographer — start the **verification process** now from your profile."
            : "Sign up as a photographer to begin the verification process." },
          { type: 'action', label: isPhotographer ? 'Start Verification' : 'Sign Up as Photographer', path: isPhotographer ? '/profile' : '/signup' },
        ],
        quickReplies: isPhotographer
          ? ['Verification Process', 'Pricing Info', 'Talk to Team']
          : ['Pricing Info', 'Browse Albums', 'Talk to Team'],
        resolvable: true,
      };

    /* ── navigate ── */
    case 'navigate': {
      const navMap = {
        shop: '/shop', albums: '/shop', catalogue: '/shop',
        collections: '/collections', finder: '/finder',
        custom: '/custom', 'make your own': '/custom',
        cart: '/cart', checkout: '/checkout',
        profile: '/profile', account: '/profile',
        track: '/track', faq: '/faq',
        contact: '/contact', about: '/about',
        verify: '/genuine', genuine: '/genuine',
      };
      const dest = Object.keys(navMap).find(k => t.includes(k));
      return dest ? {
        messages: [
          { type: 'text', text: `Sure! Heading to ${dest.charAt(0).toUpperCase() + dest.slice(1)} now:` },
          { type: 'action', label: `Go to ${dest.charAt(0).toUpperCase() + dest.slice(1)}`, path: navMap[dest] },
        ],
      } : {
        messages: [{ type: 'text', text: "Where would you like to go? Here are the main sections:" }],
        quickReplies: ['Shop Albums', 'Collections', 'Track Order', 'FAQ'],
      };
    }

    /* ── thanks ── */
    case 'thanks':
      return {
        messages: [{ type: 'text', text: "Happy to help! 😊 Anything else I can do for you?" }],
        quickReplies: ctxQR,
      };

    /* ── bye ── */
    case 'bye':
      return {
        messages: [{ type: 'text', text: "Take care! Come back anytime — I'm always here. 👋" }],
      };

    /* ── unknown ── */
    default:
      return {
        messages: [
          { type: 'text', text: "I want to make sure I help you properly. Could you share a bit more detail, or pick from these common topics?" },
        ],
        quickReplies: ['Browse Albums', 'Pricing Info', 'Track Order', 'Talk to Human'],
      };
  }
}
