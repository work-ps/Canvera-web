import Hero from '../components/home/Hero'
import DealsCarousel from '../components/home/DealsCarousel'
import ActionCards from '../components/home/ActionCards'
import PopularProducts from '../components/home/PopularProducts'
import ShopByOccasion from '../components/home/ShopByOccasion'
import Testimonials from '../components/home/Testimonials'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <PopularProducts />
      <DealsCarousel />
      <ShopByOccasion />
      <ActionCards />
      <Testimonials />
    </>
  )
}
