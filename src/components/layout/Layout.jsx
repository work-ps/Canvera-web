import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import CompareBar from '../compare/CompareBar'
import CompareDrawer from '../compare/CompareDrawer'

export default function Layout() {
  const { pathname } = useLocation()
  const isDashboard = pathname === '/profile' || pathname === '/dashboard'
  const isConfigurePage = pathname === '/custom' || /^\/custom\/[^/]+$/.test(pathname) || /^\/order\/[^/]+$/.test(pathname) || /^\/products\/[^/]+\/configure$/.test(pathname)
  const isCheckout = pathname === '/checkout' || pathname === '/order-confirmation'
  const hideFooter = isDashboard || isConfigurePage || isCheckout
  const hideCompare = isConfigurePage || isCheckout

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header />
      {isDashboard || isConfigurePage ? <Outlet /> : <main><Outlet /></main>}
      {!hideFooter && <Footer />}
      {!hideCompare && <CompareBar />}
      {!hideCompare && <CompareDrawer />}
    </>
  )
}
