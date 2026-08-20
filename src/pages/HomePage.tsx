import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Truck, ShieldCheck, RefreshCw, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase, type Product, type Category, type Banner } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'

export function HomePage() {
  const collections = [
  {
    title: "Shop New Arrivals",
    subtitle: "Discover Latest",
    icon: "🆕",
    bg: "bg-orange-50",
    border: "border-orange-100",
    hoverBorder: "hover:border-orange-300",
    text: "text-orange-600",
    button: "Shop Now →",
    link: "/shop?sort=new",
  },
  {
    title: "Explore Categories",
    subtitle: "Browse All Toys",
    icon: "🧩",
    bg: "bg-violet-50",
    border: "border-violet-100",
    hoverBorder: "hover:border-violet-300",
    text: "text-violet-600",
    button: "Explore →",
    link: "/shop",
  },
  {
    title: "Shop for Girls",
    subtitle: "Dolls & More",
    icon: "👧",
    bg: "bg-pink-50",
    border: "border-pink-100",
    hoverBorder: "hover:border-pink-300",
    text: "text-pink-600",
    button: "Shop Now →",
    link: "/shop?gender=girls",
  },
  {
    title: "Shop for Boys",
    subtitle: "Cars & Games",
    icon: "👦",
    bg: "bg-sky-50",
    border: "border-sky-100",
    hoverBorder: "hover:border-sky-300",
    text: "text-sky-600",
    button: "Shop Now →",
    link: "/shop?gender=boys",
  },
  {
    title: "Shop for Action Toys",
    subtitle: "Heroes & Adventure",
    icon: "🦸",
    bg: "bg-red-50",
    border: "border-red-100",
    hoverBorder: "hover:border-red-300",
    text: "text-red-600",
    button: "Shop Now →",
    link: "/shop?category=action",
  },
];
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [promoBanners, setPromoBanners] = useState<any[]>([])
  const [promoLoading, setPromoLoading] = useState(true)
  const [shopCategories, setShopCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animating, setAnimating] = useState<'left' | 'right' | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeBanners = banners.filter((b) => b.is_active)
  const slideCount = activeBanners.length

  const goTo = useCallback((next: number, dir: 'left' | 'right' = 'left') => {
    setAnimating(dir)
    setTimeout(() => {
      setCurrent(next)
      setAnimating(null)
    }, 400)
  }, [])

  const goNext = useCallback(() => {
    if (slideCount === 0) return
    goTo((current + 1) % slideCount, 'left')
  }, [current, goTo, slideCount])
  const goPrev = useCallback(() => {
    if (slideCount === 0) return
    goTo((current - 1 + slideCount) % slideCount, 'right')
  }, [current, goTo, slideCount])

  useEffect(() => {
    if (paused || slideCount === 0) { if (timerRef.current) clearTimeout(timerRef.current); return }
    timerRef.current = setTimeout(goNext, 5000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, paused, goNext, slideCount])

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
const [
  { data: prods },
  { data: cats },
  { data: bann },
  { data: promoBann },
  { data: shopCats }
] = await Promise.all([
  supabase.from('products').select('*').order('created_at', { ascending: false }),
  supabase.from('categories').select('*').order('name'),
  supabase.from('banners').select('*').order('display_order', { ascending: true }),
  supabase
  .from('home_promo_banners')
  .select('*')
  .eq('is_active', true)
  .order('sort_order', { ascending: true }),
  supabase.from('shop_categories').select('*').eq('is_active', true).order('display_order', { ascending: true }),
])

    setProducts(prods || [])
    setCategories(cats || [])
    setBanners(bann || [])
    setPromoBanners(promoBann || [])
    setShopCategories(shopCats || [])
    setLoading(false)
  }

  const featured = products.filter((p) => p.featured).slice(0, 5)
  const latest = products.slice(0, 8)

  const perks = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹499' },
    { icon: ShieldCheck, title: 'Safe & Secure', },
    { icon: RefreshCw, title: 'Easy Returns', desc: '5-day return policy' },
    { icon: Phone, title: 'Support', desc: 'Always here to help' },
  ]

  const categoryIcons: Record<string, string> = {
    'cars': '🚗', 'dolls': '🪆', 'educational-toys': '🧩', 'outdoor-toys': '⚽', 'soft-toys': '🧸', 'toy-vechicles': '🚂',
  }

const activePromoBanners = promoBanners.filter((b) => b.is_active)
  
  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-lg">Loading...</div>

  return (
    <div>
      <section
        className="relative w-[calc(100%-450px)] mx-auto overflow-hidden aspect-[3/1] z-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slideCount === 0 ? (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-500 to-yellow-400 text-white flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-4xl sm:text-6xl font-bold mb-4 drop-shadow-lg">Welcome to VeehaanToys</h1>
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">Discover amazing toys for your little ones. Quality, fun, and smiles guaranteed!</p>
              <Link to="/shop" className="inline-block bg-white text-red-500 font-bold px-8 py-4 rounded-full hover:bg-yellow-50 hover:scale-105 transition-all shadow-lg">Shop Now</Link>
            </div>
          </div>
        ) : (
          <>
 
            {activeBanners.map((b, i) => {
              let slideClass = 'absolute inset-0 '
              if (i === current) {
                slideClass += animating === 'left' ? 'animate-slide-left-out' : animating === 'right' ? 'animate-slide-right-out' : 'opacity-100 z-10'
              } else if (animating === 'left' && i === (current + 1) % slideCount) {
                slideClass += 'animate-slide-left-in z-20'
              } else if (animating === 'right' && i === (current - 1 + slideCount) % slideCount) {
                slideClass += 'animate-slide-right-in z-20'
              } else {
                slideClass += 'opacity-0'
              }
              const bgStyle = b.image_url
                ? { backgroundImage: `url(${b.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: b.background_color || 'linear-gradient(to right, #ef4444, #f59e0b)' }
              return (
                <Link key={b.id} to={b.button_link || '/shop'} className={`${slideClass} text-white transition-all`} style={bgStyle}>
                  {!b.image_url && (
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-10 left-10 text-9xl">🧸</div>
                      <div className="absolute bottom-10 right-10 text-9xl">🚗</div>
                      <div className="absolute top-1/2 left-1/3 text-7xl">🪁</div>
                    </div>
                  )}
                  {b.image_url && <div className="absolute inset-0 bg-black/10" />}
                  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
                  </div>
                </Link>
              )
            })}

            <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
              <ChevronLeft size={24} />
            </button>
            <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {activeBanners.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => goTo(i, i > current ? 'left' : 'right')}
                  className={`h-2.5 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="bg-white border-b border-gray-100 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <perk.icon className="text-orange-500" size={22} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{perk.title}</p>
                  <p className="text-xs text-gray-500">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

         {activePromoBanners.length > 0 && (
        <section className="w-[calc(100%-450px)] mx-auto py-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePromoBanners.map((banner) => (
              <Link
                key={banner.id}
                to={banner.button_link || "/shop"}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-full aspect-[2/1] flex items-center justify-center p-6"
                  style={
                    banner.image_url
                      ? {
                          backgroundImage: `url(${banner.image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : {
                          background: banner.background === 'yellow' 
                            ? 'linear-gradient(135deg, #f59e0b, #f97316)' 
                            : 'linear-gradient(135deg, #ef4444, #dc2626)'
                        }
                  }
                >
                  {banner.image_url && (
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
                  )}
                  <div className="relative z-10 text-white text-center">
                    {banner.emoji && (
                      <span className="text-5xl block mb-2">{banner.emoji}</span>
                    )}
                    <h3 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-white/90 mt-1 drop-shadow text-sm md:text-base">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.button_text && (
                      <span className="inline-block mt-3 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition-all">
                        {banner.button_text}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8">
  

  <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4">

{shopCategories.map((item) => (
  <Link
  key={item.id}
  to={item.button_link || "/shop"}
  className="group relative h-[250px] w-full lg:w-[calc((100%-64px)/5)] lg:flex-none rounded-3xl overflow-hidden border border-gray-200 hover:border-orange-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
>
  <img
    src={item.image_url}
    alt={item.title}
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  />

  <div className="absolute inset-0 bg-black/10" />

  
</Link>
))}

  </div>
</section>

      {featured.length > 0 && (
        <section className="w-[calc(100%-450px)] mx-auto pt-5 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Toys</h2>
            <Link to="/shop" className="text-red-500 font-medium text-sm hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      <section className="w-[calc(100%-450px)] mx-auto pt-5 pb-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">New Arrivals</h2>
          <Link to="/shop" className="text-red-500 font-medium text-sm hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {latest.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  )
}
