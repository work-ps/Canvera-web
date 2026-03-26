import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import CompareBar from '../compare/CompareBar'
import CompareDrawer from '../compare/CompareDrawer'
import { useCart } from '../../context/CartContext'

/* Simple toast notification */
function Toast({ message }) {
  if (!message) return null
  return (
    <div className="toast-notification">
      <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
        <path d="M13 4L6.125 11.5 3 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {message}
    </div>
  )
}

export default function Layout() {
  const { pathname } = useLocation()

  /* Page-type flags */
  const isDashboard = pathname === '/profile' || pathname === '/dashboard'
  const isConfigurePage =
    pathname === '/custom' ||
    /^\/custom\/[^/]+$/.test(pathname) ||
    /^\/order\/[^/]+$/.test(pathname) ||
    /^\/products\/[^/]+\/configure$/.test(pathname)
  const isCheckout = pathname === '/checkout' || pathname === '/order-confirmation'

  const hideFooter = isDashboard || isConfigurePage || isCheckout
  const hideCompare = isConfigurePage || isCheckout

  /* Scroll to top on route change */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const { toastMessage } = useCart()

  return (
    <div className="layout">
      <Header />

      {isDashboard || isConfigurePage ? (
        <Outlet />
      ) : (
        <main className="layout__main">
          <Outlet />
        </main>
      )}

      {!hideFooter && <Footer />}

      {!hideCompare && <CompareBar />}
      {!hideCompare && <CompareDrawer />}

      <Toast message={toastMessage} />
    </div>
  )
}
