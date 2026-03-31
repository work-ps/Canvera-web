import Header from './components/Header';
import Hero from './components/Hero';
import ShopSection from './components/ShopSection';
import CollectionsSection from './components/CollectionsSection';
import OccasionsSection from './components/OccasionsSection';
import JourneySection from './components/JourneySection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ShopSection />
        <CollectionsSection />
        <OccasionsSection />
        <JourneySection />
        <TestimonialsSection />
      </main>
      <Footer />
      <div style={{ height: '48px' }} />
    </>
  );
}
