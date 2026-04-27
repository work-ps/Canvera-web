import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

export default function JourneySection() {
  return (
    <div className="section-wrapper">
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">Experience the Journey</h2>
          <Link to="/about" className="section-link">About Canvera</Link>
        </div>
      </ScrollReveal>
      <div className="section-content section-content--flush section-content--borderless">
        <div className="journey-grid">
          <ScrollReveal>
            <div className="journey-image">
              <img
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=700&h=525&fit=crop"
                alt="Canvera craftsmanship"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="journey-text">
              <div className="journey-text__copy">
                <h3>Where Every Detail Tells a Story</h3>
                <p>
                  Since 2007, Canvera has been empowering photographers to create albums
                  that last generations. In 2025 alone, photographers on our platform
                  created 1,568,981 albums — each one a story that won't get lost on a
                  phone or forgotten on a hard drive.
                </p>
                <p>
                  State-of-the-art machines, hawk-eyed quality control, and
                  lightning-fast turnarounds — because your memories deserve more than
                  storage. They deserve to be experienced.
                </p>
              </div>
              <div className="journey-stats">
                <div className="journey-stat-card">
                  <div className="journey-stat__number">91,000+</div>
                  <div className="journey-stat__label">Partner Photographers</div>
                </div>
                <div className="journey-stat-card">
                  <div className="journey-stat__number">1.75M+</div>
                  <div className="journey-stat__label">Albums Delivered</div>
                </div>
                <div className="journey-stat-card">
                  <div className="journey-stat__number">2,800+</div>
                  <div className="journey-stat__label">Cities Served</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
