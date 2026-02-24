import Hero from '../components/home/Hero'
import PopularProducts from '../components/home/PopularProducts'
import OffersBanner from '../components/home/OffersBanner'
import ShopByOccasion from '../components/home/ShopByOccasion'
import Testimonials from '../components/home/Testimonials'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <PopularProducts />
      <OffersBanner />
      <ShopByOccasion />
      <Testimonials />
    </>
  )
}
