import Hero from '../components/home/Hero'
import DealsCarousel from '../components/home/DealsCarousel'
import ActionCards from '../components/home/ActionCards'
import PopularProducts from '../components/home/PopularProducts'
import ShopByOccasion from '../components/home/ShopByOccasion'
import ExploreCollections from '../components/home/ExploreCollections'
import ClubCanvera from '../components/home/ClubCanvera'
import CraftedQuality from '../components/home/CraftedQuality'
import WhyCanvera from '../components/home/WhyCanvera'
import Testimonials from '../components/home/Testimonials'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <PopularProducts />
      <DealsCarousel />
      <ShopByOccasion />
      <ClubCanvera />
      <ExploreCollections />
      <CraftedQuality />
      <WhyCanvera />
      <ActionCards />
      <Testimonials />
    </>
  )
}
