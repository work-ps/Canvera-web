export const shopMenu = {
  columns: [
    {
      title: 'Categories',
      links: [
        { label: 'Premium Albums', href: '/products?category=premium-albums' },
        { label: 'Standard Albums', href: '/products?category=standard-albums' },
        { label: 'Photobooks', href: '/products?category=photobooks' },
        { label: 'Canvas & Frames', href: '/products?category=canvas-frames' },
        { label: 'Decor & Gifts', href: '/products?category=decor-gifts' },
        { label: 'Calendars', href: '/products?category=calendars' },
      ],
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'All Products', href: '/products' },
        { label: 'Best Sellers', href: '/products?badge=bestseller' },
        { label: 'New Arrivals', href: '/products?badge=new' },
        { label: 'Limited Edition', href: '/products?badge=limited' },
        { label: 'Quick Shop', href: '/products?quick=true' },
      ],
    },
  ],
};

export const supportMenu = {
  columns: [
    {
      title: 'Get Help',
      links: [
        { label: 'Track Your Order', href: '/products' },
        { label: 'Raise a Ticket', href: '/contact' },
        { label: 'Live Chat', href: '/contact' },
        { label: 'Call Us', href: '/contact' },
      ],
    },
    {
      title: 'Common Topics',
      links: [
        { label: 'Delivery & Shipping', href: '/products' },
        { label: 'Returns & Refunds', href: '/products' },
        { label: 'Design Upload Help', href: '/products' },
        { label: 'Payment Issues', href: '/products' },
      ],
    },
    {
      title: 'For Photographers',
      links: [
        { label: 'Onboarding Guide', href: '/products' },
        { label: 'Account & Verification', href: '/products' },
        { label: 'Bulk Order Queries', href: '/products' },
        { label: 'Share Feedback', href: '/contact' },
      ],
    },
  ],
};

export const footerColumns = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Shop', href: '/products' },
      { label: 'Collections', href: '/collections' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'FAQ', href: '/products' },
      { label: 'Track Order', href: '/products' },
      { label: 'Check Genuineness', href: '/products' },
      { label: 'Returns & Refunds', href: '/products' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/products' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/products' },
      { label: 'Bulk Orders', href: '/products' },
    ],
  },
];
