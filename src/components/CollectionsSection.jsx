import { Link } from 'react-router-dom';
import BentoGallery from './BentoGallery';
import ScrollReveal from './ScrollReveal';
import { collections } from '../data/products';

export default function CollectionsSection() {
  return (
    <div className="section-wrapper">
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">Explore Our Premium Collections</h2>
          <Link to="/collections" className="section-link">View All Collections</Link>
        </div>
      </ScrollReveal>
      <div className="section-content section-content--flush section-content--borderless">
        <BentoGallery collections={collections} />
      </div>
    </div>
  );
}
