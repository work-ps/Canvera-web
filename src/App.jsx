import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CompareProvider } from './context/CompareContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import ProductsPage from './components/products/ProductsPage'
import ProductDetail from './components/products/ProductDetail'
import CollectionsPage from './pages/CollectionsPage'
import CollectionDetailPage from './pages/CollectionDetailPage'
import ContactPage from './components/contact/ContactPage'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ProductConfigPage from './pages/ProductConfigPage'
import MakeYourOwnPage from './pages/MakeYourOwnPage'
import AboutPage from './pages/AboutPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import FAQPage from './pages/FAQPage'
import TrackOrderPage from './pages/TrackOrderPage'
import CheckGenuinenessPage from './pages/CheckGenuinenessPage'
import SearchResultsPage from './pages/SearchResultsPage'
import DesignServicesPage from './pages/DesignServicesPage'
import FindProductPage from './pages/FindProductPage'
import OrderConfigPage from './pages/OrderConfigPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'

/* Helper redirect components for parameterized legacy routes */
function RedirectProductDetail() {
  const { slug } = useParams()
  return <Navigate to={`/product/${slug}`} replace />
}
function RedirectProductConfigure() {
  const { slug } = useParams()
  return <Navigate to={`/custom/${slug}`} replace />
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CompareProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* ── Core Pages ── */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* ── Shop / Products (PRD: /shop, /shop/:category) ── */}
              <Route path="/shop" element={<ProductsPage />} />
              <Route path="/shop/:category" element={<ProductsPage />} />

              {/* ── Product Detail (PRD: /product/:slug) ── */}
              <Route path="/product/:slug" element={<ProductDetail />} />

              {/* ── Order Configuration (verified users only) ── */}
              <Route path="/order/:slug" element={
                <ProtectedRoute level="verified">
                  <OrderConfigPage />
                </ProtectedRoute>
              } />

              {/* ── Order Confirmation ── */}
              <Route path="/order-confirmation" element={
                <ProtectedRoute level="login">
                  <OrderConfirmationPage />
                </ProtectedRoute>
              } />

              {/* ── Collections ── */}
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:slug" element={<CollectionDetailPage />} />

              {/* ── Make Your Own — Visual Builder ── */}
              <Route path="/custom" element={<MakeYourOwnPage />} />
              {/* ── Product Configuration (direct via slug) ── */}
              <Route path="/custom/:slug" element={<ProductConfigPage />} />

              {/* ── Find Your Product (PRD: /find) ── */}
              <Route path="/find" element={<FindProductPage />} />

              {/* ── Design Services (PRD: /design-services) ── */}
              <Route path="/design-services" element={<DesignServicesPage />} />

              {/* ── Cart (PRD: /cart — post-login) ── */}
              <Route path="/cart" element={
                <ProtectedRoute level="login">
                  <CartPage />
                </ProtectedRoute>
              } />

              {/* ── Checkout (PRD: /checkout — post-login) ── */}
              <Route path="/checkout" element={
                <ProtectedRoute level="login">
                  <CheckoutPage />
                </ProtectedRoute>
              } />

              {/* ── Profile (PRD: /profile — was /dashboard) ── */}
              <Route path="/profile" element={
                <ProtectedRoute level="verified">
                  <DashboardPage />
                </ProtectedRoute>
              } />

              {/* ── Auth ── */}
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* ── Support Pages ── */}
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/track" element={<TrackOrderPage />} />
              <Route path="/genuine" element={<CheckGenuinenessPage />} />

              {/* ── Search ── */}
              <Route path="/search" element={<SearchResultsPage />} />

              {/* ── Legacy Redirects (old routes → new routes) ── */}
              <Route path="/products" element={<Navigate to="/shop" replace />} />
              <Route path="/products/:slug/configure" element={<RedirectProductConfigure />} />
              <Route path="/products/:slug" element={<RedirectProductDetail />} />
              <Route path="/register" element={<Navigate to="/signup" replace />} />
              <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
              <Route path="/own-your-album" element={<Navigate to="/custom" replace />} />
            </Route>
          </Routes>
        </CompareProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
