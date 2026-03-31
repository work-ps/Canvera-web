import FreeflowGallery from './FreeflowGallery';
import ScrollReveal from './ScrollReveal';
import { products } from '../data/products';
import './Section.css';

export default function ShopSection() {
  return (
    <div className="section-wrapper">
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">Shop Your Canvera Experience</h2>
          <a href="/shop" className="section-link">View All Products</a>
        </div>
      </ScrollReveal>
      <div className="section-content section-content--flush">
        <FreeflowGallery items={products} />
      </div>
    </div>
  );
}
