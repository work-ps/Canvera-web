import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
import FreeflowGallery from './FreeflowGallery';
import HomeCarousel from './HomeCarousel';
import ScrollReveal from './ScrollReveal';
import './Section.css';

/* ── Category tabs — mirrors the Shop dropdown in the header ── */
const CATEGORY_TABS = [
  { name: 'All' },
  { name: 'Photobooks' },
  { name: 'Momentbooks' },
  { name: 'Superbooks' },
  { name: 'Magazines' },
  { name: 'Decor Products' },
  { name: 'Gifting Kit' },
];

function getCategoryProducts(tab) {
  if (tab.name === 'All') return products;
  return products.filter((p) => p.category === tab.name);
}

export default function ShopSection() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="section-wrapper">
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">Shop Your Canvera Experience</h2>
          <Link to="/shop" className="section-link">View All Products</Link>
        </div>
      </ScrollReveal>

      {isLoggedIn ? (
        <div className="section-content">
          <HomeCarousel tabs={CATEGORY_TABS} getProducts={getCategoryProducts} />
        </div>
      ) : (
        <div className="section-content section-content--flush">
          <FreeflowGallery items={products} />
        </div>
      )}
    </div>
  );
}
