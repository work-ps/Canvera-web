import { Routes, Route } from 'react-router-dom'
import { CompareProvider } from './context/CompareContext'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import ProductsPage from './components/products/ProductsPage'
import ProductDetail from './components/products/ProductDetail'
import ContactPage from './components/contact/ContactPage'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'

function App() {
  return (
    <CompareProvider>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
      </Route>
    </Routes>
    </CompareProvider>
  )
}

export default App
