import BentoGallery from './BentoGallery';
import ScrollReveal from './ScrollReveal';
import { collections } from '../data/products';

export default function CollectionsSection() {
  return (
    <div className="section-wrapper">
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">Explore Our Premium Collections</h2>
          <a href="/collections" className="section-link">View All Collections</a>
        </div>
      </ScrollReveal>
      <div className="section-content section-content--flush section-content--borderless">
        <BentoGallery collections={collections} />
      </div>
    </div>
  );
}
