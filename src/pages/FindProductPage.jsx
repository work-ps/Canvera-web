import ProductFinder from '../components/finder/ProductFinder'
import { useNavigate } from 'react-router-dom'

export default function FindProductPage() {
  const navigate = useNavigate()

  return (
    <ProductFinder onClose={() => navigate(-1)} />
  )
}
