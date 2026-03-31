import StackingSlider from './StackingSlider';
import ScrollReveal from './ScrollReveal';
import { occasions } from '../data/products';
import './OccasionsSection.css';

export default function OccasionsSection() {
  return (
    <div className="section-wrapper">
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">Occasions Crafted with Care</h2>
          <a href="/shop?filter=occasions" className="section-link">Shop by Occasion</a>
        </div>
      </ScrollReveal>
      <div className="section-content section-content--occasions">
        <StackingSlider
          items={occasions}
          endMessage="More occasions? Don't worry, we are listening. Memories of the occasion will be crafted with precision and care into the Canvera experience that it deserves."
        />
      </div>
    </div>
  );
}
