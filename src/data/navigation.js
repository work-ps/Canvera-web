export const shopMenu = {
  columns: [
    {
      title: 'Categories',
      links: [
        { label: 'Photobooks', href: '/shop?category=photobooks' },
        { label: 'Momentbooks', href: '/shop?category=momentbooks' },
        { label: 'Magazines', href: '/shop?category=magazines' },
        { label: 'Canvas & Frames', href: '/shop?category=canvas-frames' },
        { label: 'Decor & Gifts', href: '/shop?category=decor-gifts' },
        { label: 'Calendars', href: '/shop?category=calendars' },
        { label: 'Accessories', href: '/shop?category=accessories' },
      ],
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'All Products', href: '/shop' },
        { label: 'Best Sellers', href: '/shop?badge=bestseller' },
        { label: 'New Arrivals', href: '/shop?badge=new' },
        { label: 'Limited Edition', href: '/shop?badge=limited' },
      ],
    },
    {
      title: 'Featured Services',
      links: [
        { label: 'Find Your Product', href: '/find' },
        { label: 'Make Your Own', href: '/custom' },
        { label: 'Quick Shopping', href: '/shop?quick=true' },
      ],
    },
  ],
};

export const supportMenu = {
  columns: [
    {
      title: 'Get Help',
      links: [
        { label: 'Track Your Order', href: '/track' },
        { label: 'Raise a Ticket', href: '/contact' },
        { label: 'Live Chat', href: '/contact' },
        { label: 'Call Us', href: '/contact' },
      ],
    },
    {
      title: 'Common Topics',
      links: [
        { label: 'Delivery & Shipping', href: '/faq' },
        { label: 'Returns & Refunds', href: '/faq' },
        { label: 'Design Upload Help', href: '/faq' },
        { label: 'Payment Issues', href: '/faq' },
      ],
    },
    {
      title: 'For Photographers',
      links: [
        { label: 'Onboarding Guide', href: '/faq' },
        { label: 'Account & Verification', href: '/faq' },
        { label: 'Bulk Order Queries', href: '/contact' },
        { label: 'Share Feedback', href: '/contact' },
      ],
    },
  ],
};

export const footerColumns = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Shop', href: '/shop' },
      { label: 'Collections', href: '/collections' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Track Order', href: '/track' },
      { label: 'Check Genuineness', href: '/genuine' },
      { label: 'Returns & Refunds', href: '/faq' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/faq' },
      { label: 'Bulk Orders', href: '/contact' },
    ],
  },
];
