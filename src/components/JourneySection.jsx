import ScrollReveal from './ScrollReveal';

export default function JourneySection() {
  return (
    <div className="section-wrapper">
      <ScrollReveal>
        <div className="section-header">
          <h2 className="section-title">Experience the Journey</h2>
          <a href="/about" className="section-link">About Canvera</a>
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
                  Since 2007, we have been transforming photographs into enduring heirlooms.
                  Each album passes through 40+ quality checkpoints, handled by artisans who
                  understand that your memories deserve nothing less than perfection.
                </p>
                <p>
                  Our 6-color Hexachrome printing brings every photograph to life with
                  a vibrancy and depth that standard printing simply cannot match.
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
