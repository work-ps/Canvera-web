import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NavigationHistoryProvider } from './context/NavigationHistoryContext';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import ProOfferStrip from './components/ProOfferStrip';
import LeadCaptureModal from './components/LeadCaptureModal';
import PostLoginModal from './components/PostLoginModal';

// Home page sections
import Hero from './components/Hero';
import ShopSection from './components/ShopSection';
import CollectionsSection from './components/CollectionsSection';
import OccasionsSection from './components/OccasionsSection';
import JourneySection from './components/JourneySection';
import TestimonialsSection from './components/TestimonialsSection';
import SocialFeedSection from './components/SocialFeedSection';

// Pages
import CollectionsPage from './pages/CollectionsPage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';
import ContactPage from './pages/ContactPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderWizardPage from './pages/OrderWizardPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import TrackPage from './pages/TrackPage';
import ProductFinderPage from './pages/ProductFinderPage';
import MakeYourOwnPage from './pages/MakeYourOwnPage';
import NotFoundPage from './pages/NotFoundPage';
import FABAssistant from './components/FABAssistant/FABAssistant';
import SEOMeta from './components/SEOMeta';

const HOME_SCHEMA = [
  {
    '@type': 'WebPage',
    '@id': 'https://canvera.com/#webpage',
    url: 'https://canvera.com/',
    name: 'Canvera — Premium Photobooks & Wedding Albums',
    isPartOf: { '@id': 'https://canvera.com/#website' },
    about: { '@id': 'https://canvera.com/#organization' },
    description: "India's leading premium photobook manufacturer. Canvera crafts luxury wedding albums, layflat photobooks, and custom albums for 91,000+ professional photographers.",
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://canvera.com/' }],
    },
  },
];

function HomePage() {
  return (
    <>
      <SEOMeta
        title="Canvera — Premium Photobooks & Wedding Albums for Photographers"
        description="India's leading premium photobook manufacturer. Canvera crafts luxury wedding albums, layflat photobooks, and custom albums for 91,000+ professional photographers across 2,800+ cities."
        canonical="https://canvera.com/"
        og={{
          type: 'website',
          url: 'https://canvera.com/',
          image: 'https://canvera.com/images/og-cover.jpg',
        }}
        schema={HOME_SCHEMA}
      />
      <Hero />
      <ShopSection />
      <CollectionsSection />
      <OccasionsSection />
      <JourneySection />
      <TestimonialsSection />
      <SocialFeedSection />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <NavigationHistoryProvider>
          <ScrollToTop />
          <ProOfferStrip />
          <Header />
          <LeadCaptureModal />
          <PostLoginModal />
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />

            {/* Shop & Collections */}
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/:slug" element={<CollectionsPage />} />

            {/* Products */}
            <Route path="/products/:slug" element={<ProductDetailPage />} />

            {/* Order wizard */}
            <Route path="/order/:slug" element={<OrderWizardPage />} />

            {/* Cart & Checkout */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Verify authenticity — canonical: /genuine, alias: /verify */}
            <Route path="/genuine" element={<VerifyPage />} />
            <Route path="/verify" element={<VerifyPage />} />

            {/* Contact */}
            <Route path="/contact" element={<ContactPage />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* About */}
            <Route path="/about" element={<AboutPage />} />

            {/* FAQ */}
            <Route path="/faq" element={<FAQPage />} />

            {/* Track Order */}
            <Route path="/track" element={<TrackPage />} />

            {/* Product Finder */}
            <Route path="/finder" element={<ProductFinderPage />} />

            {/* Custom Builder — removed, redirected to Make Your Own */}
            <Route path="/builder" element={<Navigate to="/custom" replace />} />

            {/* Make Your Own */}
            <Route path="/custom" element={<MakeYourOwnPage />} />

            {/* Support redirects — resolve dead nav links */}
            <Route path="/support"          element={<Navigate to="/faq"     replace />} />
            <Route path="/support/report"   element={<Navigate to="/contact?subject=report"  replace />} />
            <Route path="/support/request"  element={<Navigate to="/contact?subject=request" replace />} />
            <Route path="/support/bulk"     element={<Navigate to="/contact?subject=bulk"    replace />} />
            <Route path="/support/shipping" element={<Navigate to="/faq"     replace />} />
            <Route path="/support/returns"  element={<Navigate to="/faq"     replace />} />

            {/* Legal redirects — resolve footer links */}
            <Route path="/legal/privacy"    element={<Navigate to="/faq"     replace />} />
            <Route path="/legal/terms"      element={<Navigate to="/faq"     replace />} />

            {/* Catch-all → 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
          <FABAssistant />
          <div style={{ height: 'var(--space-12, 48px)' }} />
          </NavigationHistoryProvider>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
