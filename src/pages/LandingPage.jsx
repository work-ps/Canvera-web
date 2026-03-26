import Hero from '../components/home/Hero'
import ExploreCollections from '../components/home/ExploreCollections'
import PopularProducts from '../components/home/PopularProducts'
import ShopByOccasion from '../components/home/ShopByOccasion'
import CraftedQuality from '../components/home/CraftedQuality'
import WhyCanvera from '../components/home/WhyCanvera'
import Testimonials from '../components/home/Testimonials'
import ActionCards from '../components/home/ActionCards'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ExploreCollections />
      <PopularProducts />
      <ShopByOccasion />
      <CraftedQuality />
      <WhyCanvera />
      <Testimonials />
      <ActionCards />
    </>
  )
}
