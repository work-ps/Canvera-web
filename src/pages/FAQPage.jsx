import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages.css'

const categories = [
  'General',
  'Products',
  'Orders',
  'Pricing',
  'Shipping',
  'Returns',
  'Design',
  'Payments',
]

const faqData = {
  General: [
    { q: 'What is Canvera?', a: 'Canvera is India\'s leading online photobook and album company, serving over 91,000 professional photographers across 2,800+ cities since 2007. We offer premium-quality photobooks, albums, prints, and more.' },
    { q: 'Who can order from Canvera?', a: 'Both professional photographers and individual customers can order. Photographers get access to bulk pricing, a dedicated partner dashboard, and exclusive product ranges through our partner programme.' },
    { q: 'Where is Canvera based?', a: 'We are headquartered in Bengaluru, India, with a state-of-the-art production facility that uses 6-color printing technology for outstanding colour accuracy.' },
    { q: 'How do I contact customer support?', a: 'You can reach us at 1-800-419-0570 (toll-free), email support@canvera.com, or visit the Contact page on our website. Our support team is available Monday to Saturday, 9 AM to 6 PM IST.' },
  ],
  Products: [
    { q: 'What types of products does Canvera offer?', a: 'We offer a wide range including premium photobooks (leather, suede, wood, fabric covers), momentbooks, magazines, calendars, wall prints, canvases, and personalised gifts.' },
    { q: 'What is the difference between Layflat and Absolute Layflat binding?', a: 'Layflat binding allows pages to open completely flat for seamless panoramic spreads. Absolute Layflat takes it further with thicker board mounting for a more rigid, premium feel and zero-gap centre.' },
    { q: 'Can I customise my album cover?', a: 'Yes. Depending on the product, you can choose from various cover materials, colours, design patterns, and add personalised text or name engraving to the cover.' },
    { q: 'What paper options are available?', a: 'We offer multiple paper types including lustre, matte, glossy, silk, and metallic finishes. Each product range may support different paper options -- check the product configurator for specifics.' },
  ],
  Orders: [
    { q: 'How do I place an order?', a: 'Browse our products, configure your album using the product page, upload your photos through our album builder or design software integration, and proceed to checkout.' },
    { q: 'Can I modify my order after placing it?', a: 'Orders can be modified within 2 hours of placement, provided production has not started. Contact our support team immediately if you need changes.' },
    { q: 'How do I track my order?', a: 'Visit the Track Order page and enter your order number and registered email address. You\'ll see a real-time status timeline from order placement through to delivery.' },
  ],
  Pricing: [
    { q: 'How is pricing determined?', a: 'Pricing depends on the product range, size, number of pages, cover material, paper type, and any add-ons like boxes or bags. Use the product configurator to see real-time pricing for your selections.' },
    { q: 'Do you offer bulk or photographer pricing?', a: 'Yes. Registered photographer partners enjoy special bulk pricing, volume discounts, and exclusive offers. Sign up for a partner account to access these benefits.' },
    { q: 'Are there any hidden charges?', a: 'No. The price shown in the configurator includes all components of your selected configuration. Shipping charges, if applicable, are displayed at checkout before payment.' },
  ],
  Shipping: [
    { q: 'What are the shipping options?', a: 'We offer standard shipping (5-7 business days) and express shipping (2-3 business days) across India. Shipping timelines may vary for remote locations.' },
    { q: 'Do you ship internationally?', a: 'Currently we primarily serve customers within India. For international inquiries, please contact our support team for custom arrangements.' },
    { q: 'Is shipping free?', a: 'Free shipping is available on orders above a certain value. The threshold varies by product category and is displayed during checkout.' },
  ],
  Returns: [
    { q: 'What is your return policy?', a: 'Since all products are custom-made, we do not accept returns for change of mind. However, if you receive a product with manufacturing defects or damage, we will replace it at no cost.' },
    { q: 'How do I report a damaged product?', a: 'Contact support within 48 hours of delivery with photos of the damage. Our team will assess and arrange a replacement or reprint as needed.' },
    { q: 'What if there is a print quality issue?', a: 'We take print quality seriously. If the output doesn\'t meet our quality standards, send us the original files and product photos, and we\'ll investigate and resolve the issue.' },
  ],
  Design: [
    { q: 'Do you offer design services?', a: 'Yes. Our professional design team can create album layouts for you starting from Rs 4,500. Simply upload your photos and our designers will bring your vision to life.' },
    { q: 'Which design software do you support?', a: 'We integrate with popular tools like Fundy Designer and Pixellu SmartAlbums. You can also use our built-in album builder for a simple drag-and-drop experience.' },
    { q: 'Can I preview my album before printing?', a: 'Absolutely. Our album builder shows a real-time preview of your layout. For design service orders, you receive a digital proof for approval before we begin printing.' },
  ],
  Payments: [
    { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards, net banking, UPI, and popular wallets. Photographer partners can also use their credit balance or pay on delivery for select orders.' },
    { q: 'Is my payment information secure?', a: 'Yes. All transactions are processed through secure, PCI-DSS compliant payment gateways. We never store your card details on our servers.' },
    { q: 'Do you offer EMI options?', a: 'EMI options are available on select credit cards for orders above a minimum value. Available EMI plans are shown at checkout based on your card issuer.' },
  ],
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('General')
  const [openIndex, setOpenIndex] = useState(null)
  const [search, setSearch] = useState('')

  const items = useMemo(() => {
    const list = faqData[activeCategory] || []
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    )
  }, [activeCategory, search])

  const handleToggle = (i) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setOpenIndex(null)
  }

  return (
    <div className="faq-page">
      <div className="container">
        <div className="faq-header">
          <h1 className="display-md">Frequently Asked Questions</h1>
          <p className="faq-subtitle">Find answers to common questions about our products and services.</p>
        </div>

        {/* Search */}
        <div className="faq-search-wrap">
          <svg className="faq-search-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            className="faq-search-input"
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category pills */}
        <div className="faq-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`faq-pill${activeCategory === cat ? ' active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="faq-list">
          {items.length === 0 && (
            <div className="faq-empty">
              <p>No questions found. Try a different search term or category.</p>
              <Link to="/contact" className="link-arrow">
                Contact Support
                <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>
          )}
          {items.map((item, i) => (
            <div key={i} className={`faq-item${openIndex === i ? ' open' : ''}`}>
              <button className="faq-question" onClick={() => handleToggle(i)}>
                <span>{item.q}</span>
                <svg className="faq-chevron" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="faq-answer-wrap">
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
