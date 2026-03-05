export const shopMenu = {
  columns: [
    {
      title: 'Categories',
      links: [
        { label: 'Photobooks', href: '/products?category=photobooks' },
        { label: 'Moment Books', href: '/products?category=moment-books' },
        { label: 'Magazines', href: '/products?category=magazines' },
        { label: 'Wall & Decor', href: '/products?category=wall-decor' },
        { label: 'Gifting Packages', href: '/products?category=gifting-packages' },
        { label: 'Accessories', href: '/products?category=accessories' },
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
    title: 'Products',
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
    title: 'Company',
    links: [
      { label: 'About Canvera', href: '/products' },
      { label: 'Why Choose Us', href: '/products' },
      { label: 'Careers', href: '/products' },
      { label: 'Press & Media', href: '/products' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Help Center', href: '/products' },
      { label: 'Track Order', href: '/products' },
      { label: 'Shipping Info', href: '/products' },
      { label: 'Returns', href: '/products' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Photographer Forum', href: '/products' },
      { label: 'Blog', href: '/products' },
      { label: 'Tutorials', href: '/products' },
      { label: 'Events', href: '/products' },
    ],
  },
];
