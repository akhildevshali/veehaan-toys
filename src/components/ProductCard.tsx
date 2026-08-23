import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../lib/supabase'
import { formatPrice, formatPriceUsd, addToCart } from '../lib/cart'

interface ProductCardProps {
  product: Product
  onCartUpdate?: () => void
}

export function ProductCard({ product, onCartUpdate }: ProductCardProps) {
  const [adding, setAdding] = useState(false)
  const [isHoveringImage, setIsHoveringImage] = useState(false)
  const [hoverImageIndex, setHoverImageIndex] = useState(0)
  const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setInterval> | null>(null)

  const handleAddToCart = async () => {
    setAdding(true)
    await addToCart(product.id, 1)
    onCartUpdate?.()
    setTimeout(() => setAdding(false), 800)
  }

  return (
    <div className="group bg-white overflow-hidden">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-white relative" 
        onMouseEnter={() => {
  setIsHoveringImage(true)
  setHoverImageIndex(0)

  if (product.additional_images?.length > 0) {
    const timer = setInterval(() => {
      setHoverImageIndex((prev) => {
        const nextIndex = prev + 1

        if (nextIndex >= product.additional_images.length) {
          return 0
        }

        return nextIndex
      })
    }, 1000)

    setHoverTimer(timer)
  }
}}
onMouseLeave={() => {
  setIsHoveringImage(false)
  setHoverImageIndex(0)

  if (hoverTimer) {
    clearInterval(hoverTimer)
    setHoverTimer(null)
  }
}}  >


          {product.image_url ? (
            <img
  src={
  isHoveringImage && product.additional_images?.length > 0
    ? product.additional_images[hoverImageIndex]
    : product.image_url
}
  alt={product.name}
  className="w-full h-full object-contain scale-110 group-hover:scale-115 transition-transform duration-500"
/>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">🧸</div>
          )}
          {product.featured && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star size={10} fill="white" /> Featured
            </span>
          )}
        </div>
      </Link>
      <div className="p-2.5">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 text-xs line-clamp-2 min-h-[2.25rem] hover:text-red-500 transition-colors leading-tight">{product.name}</h3>
        </Link>
        {product.specifications && product.specifications.length > 0 && (
          <ul className="mt-1.5 space-y-0.5">
            {product.specifications.slice(0, 3).map((spec, i) => (
              <li key={i} className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-orange-400 rounded-full flex-shrink-0" /> {spec}
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center justify-between mt-3">
          <div>
  {product.mrp && product.mrp > product.price && (
    <>
      <p className="text-sm text-gray-400 line-through">
        {formatPrice(product.mrp)}
      </p>

      <p className="text-xs font-semibold text-green-600">
        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
      </p>
    </>
  )}

  <p className="text-lg font-bold text-red-500">
    {formatPrice(product.price)}
  </p>

  {product.price_usd != null && (
    <p className="text-sm font-medium text-gray-400">
      {formatPriceUsd(product.price_usd)}
    </p>
  )}
</div>
          <button onClick={handleAddToCart} disabled={adding}
            className={`p-2.5 rounded-xl transition-all ${adding ? 'bg-green-500 text-white scale-90' : 'bg-gradient-to-r from-red-400 to-orange-400 text-white hover:from-red-500 hover:to-orange-500'}`}>
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
