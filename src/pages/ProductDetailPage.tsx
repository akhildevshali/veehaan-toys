import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Star, Check, Play, ZoomIn, CircleCheck as CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase, type Product, type Review } from '../lib/supabase'
import { formatPrice, formatPriceUsd, addToCart } from '../lib/cart'

export function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [zoomActive, setZoomActive] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })

  useEffect(() => { if (slug) loadProduct(slug) }, [slug])

  const loadProduct = async (slug: string) => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle()
    setProduct(data)
    const { data: revData } = await supabase.from('reviews').select('*').eq('featured', true).limit(5)
    setReviews(revData || [])
    setLoading(false)
  }

  const handleAddToCart = async () => {
    if (!product) return
    await addToCart(product.id, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Loading...</div>

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">Product not found.</p>
        <Link to="/shop" className="text-red-500 hover:underline">Back to shop</Link>
      </div>
    )
  }

  const allImages = [product.image_url, ...(product.additional_images || [])].filter(Boolean)
  const currentImage = allImages[activeImage]
  const specs = (product.specifications || []).filter((s) => s && s.trim())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-red-500 mb-6"><ArrowLeft size={20} /> Back</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div
            className="bg-gray-50 rounded-2xl overflow-hidden aspect-square relative group/zoom"
            onMouseEnter={() => setZoomActive(true)}
            onMouseLeave={() => setZoomActive(false)}
            onMouseMove={handleZoomMove}
            style={{ cursor: currentImage && !showVideo ? 'zoom-in' : 'default' }}
          >
            {showVideo && product.video_url ? (
              <video src={product.video_url} controls autoPlay className="w-full h-full object-cover" />
            ) : currentImage ? (
              <>
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200 ease-out"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: zoomActive ? 'scale(2)' : 'scale(1)',
                  }}
                />
                <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover/zoom:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn size={12} /> Hover to zoom
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🧸</div>
            )}
            {product.featured && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full"><Star size={14} fill="currentColor" /> Featured</span>
            )}
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {allImages.map((img, i) => (
              <button key={i} onClick={() => { setActiveImage(i); setShowVideo(false) }}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${activeImage === i && !showVideo ? 'border-red-500' : 'border-gray-200'}`}>
                <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
            {product.video_url && (
              <button onClick={() => setShowVideo(true)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 flex items-center justify-center bg-gray-900 ${showVideo ? 'border-red-500' : 'border-gray-200'}`}>
                <Play size={20} className="text-white" fill="white" />
              </button>
            )}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>
          <div className="mb-6 flex items-baseline gap-4">
            <span className="text-4xl font-bold text-red-500">{formatPrice(product.price)}</span>
            {product.price_usd != null && <span className="text-2xl font-bold text-gray-400">{formatPriceUsd(product.price_usd)}</span>}
          </div>

          {specs.length > 0 && (
            <div className="mb-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-orange-500" /> Key Specifications
              </h3>
              <ul className="space-y-2">
                {specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={handleAddToCart}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2">
            {added ? <><Check size={20} /> Added!</> : <><ShoppingCart size={20} /> Add to Cart</>}
          </button>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
      {reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className={i < rev.rating ? 'text-amber-400' : 'text-gray-200'} fill={i < rev.rating ? 'currentColor' : 'none'} />)}</div>
                  <span className="font-medium text-gray-700">{rev.customer_name}</span>
                </div>
                <p className="text-gray-500 text-sm">{rev.review_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
