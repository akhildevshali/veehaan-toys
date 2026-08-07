import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { supabase, type Product, type Category } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
  }, [searchParams])

  const loadData = async () => {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts(prods || [])
    setCategories(cats || [])
    setLoading(false)
  }

  const filtered = products
    .filter((p) => {
      if (selectedCategory && p.category_id !== selectedCategory) return false
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId)
    if (catId) setSearchParams({ category: catId })
    else setSearchParams({})
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Shop</h1>
        <p className="text-gray-500 mt-1">Browse our collection of amazing toys</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search toys..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none bg-white">
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
        <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-xl text-gray-600 font-medium">
          <SlidersHorizontal size={18} /> Filters
        </button>
      </div>
      <div className="flex gap-6">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-20">
            <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
            <div className="space-y-1">
              <button onClick={() => handleCategoryChange('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-red-50 text-red-500 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>All Products</button>
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.id ? 'bg-red-50 text-red-500 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>{cat.name}</button>
              ))}
            </div>
          </div>
        </aside>
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{filtered.length} product(s) found</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400"><p className="text-lg">No products found.</p></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
