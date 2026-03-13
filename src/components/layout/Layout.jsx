import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import CompareBar from '../compare/CompareBar'
import CompareDrawer from '../compare/CompareDrawer'

export default function Layout() {
  const { pathname } = useLocation()
  const isDashboard = pathname === '/dashboard'
  const isConfigurePage = /^\/products\/[^/]+\/configure$/.test(pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header />
      {isDashboard || isConfigurePage ? <Outlet /> : <main><Outlet /></main>}
      {!isDashboard && !isConfigurePage && <Footer />}
      {!isConfigurePage && <CompareBar />}
      {!isConfigurePage && <CompareDrawer />}
    </>
  )
}
