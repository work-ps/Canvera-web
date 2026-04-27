import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { occasions, products } from '../data/products';
import StackingSlider from './StackingSlider';
import HomeCarousel from './HomeCarousel';
import ScrollReveal from './ScrollReveal';
import './OccasionsSection.css';

function getOccasionProducts(tab) {
  return products.filter((p) => p.occasions?.includes(tab.name));
}

export default function OccasionsSection() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="section-wrapper">
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">Occasions Crafted with Care</h2>
          <Link to="/shop?filter=occasions" className="section-link">Shop by Occasion</Link>
        </div>
      </ScrollReveal>

      {isLoggedIn ? (
        <div className="section-content">
          <HomeCarousel tabs={occasions} getProducts={getOccasionProducts} />
        </div>
      ) : (
        <div className="section-content section-content--occasions">
          <StackingSlider
            items={occasions}
            endMessage="More occasions? Don't worry, we are listening. Memories of the occasion will be crafted with precision and care into the Canvera experience that it deserves."
          />
        </div>
      )}
    </div>
  );
}
