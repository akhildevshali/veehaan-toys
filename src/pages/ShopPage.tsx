import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { supabase, type Product, type Category, type SubCategory, type Vertical, } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [verticals, setVerticals] = useState<Vertical[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')?.trim().toLowerCase() || ''
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedSubCategory, setSelectedSubCategory] = useState(searchParams.get('sub_category') || '')
  const [selectedVertical, setSelectedVertical] = useState(searchParams.get('vertical') || '')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
  }, [searchParams])

  const loadData = async () => {
  const [
    { data: prods },
    { data: cats },
    { data: subs },
    { data: verts },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false }),

    supabase
      .from('categories')
      .select('*')
      .order('name'),

    supabase
      .from('sub_categories')
      .select('*')
      .order('name'),

    supabase
      .from('verticals')
      .select('*')
      .order('name'),
  ])

  setProducts(prods || [])
  setCategories(cats || [])
  setSubCategories(subs || [])
  setVerticals(verts || [])
  setLoading(false)
}

const activeCategoryIds = new Set(
  products
    .filter((p) => p.category_id)
    .map((p) => p.category_id!)
)

const activeSubCategoryIds = new Set(
  products
    .filter((p) => p.sub_category_id)
    .map((p) => p.sub_category_id!)
)

const activeVerticalIds = new Set(
  products
    .filter((p) => p.vertical_id)
    .map((p) => p.vertical_id!)
)

  const filtered = products
  .filter((p) => {
    if (selectedCategory && p.category_id !== selectedCategory) {
      return false
    }

    if (
      selectedSubCategory &&
      p.sub_category_id !== selectedSubCategory
    ) {
      return false
    }

    if (selectedVertical && p.vertical_id !== selectedVertical) {
      return false
    }

    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery)
    ) {
      return false
    }


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
  setSelectedSubCategory('')
  setSelectedVertical('')

  if (catId) {
    setSearchParams({ category: catId })
  } else {
    setSearchParams({})
  }
}

const handleSubCategoryChange = (subId: string) => {
  setSelectedSubCategory(subId)
  setSelectedVertical('')

  if (subId) {
    setSearchParams({
      category: selectedCategory,
      sub_category: subId,
    })
  }
}

const handleVerticalChange = (verticalId: string) => {
  setSelectedVertical(verticalId)

  if (verticalId) {
    setSearchParams({
      category: selectedCategory,
      sub_category: selectedSubCategory,
      vertical: verticalId,
    })
  }
}

const clearHierarchySelection = () => {
  setSelectedCategory('')
  setSelectedSubCategory('')
  setSelectedVertical('')
  setSearchParams({})
}

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Loading...</div>

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Shop</h1>
        <p className="text-gray-500 mt-1">Browse our collection of amazing toys</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

<div className="flex items-center gap-6 mb-6 text-sm">
  <span className="font-semibold text-gray-800">Sort By</span>

  <button
    onClick={() => setSortBy('popularity')}
    className={`pb-2 ${
      sortBy === 'popularity'
        ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
        : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    Popularity
  </button>

  <button
    onClick={() => setSortBy('price-low')}
    className={`pb-2 ${
      sortBy === 'price-low'
        ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
        : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    Price -- Low to High
  </button>

  <button
    onClick={() => setSortBy('price-high')}
    className={`pb-2 ${
      sortBy === 'price-high'
        ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
        : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    Price -- High to Low
  </button>

  <button
    onClick={() => setSortBy('newest')}
    className={`pb-2 ${
      sortBy === 'newest'
        ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
        : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    Newest First
  </button>
</div>

        <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-xl text-gray-600 font-medium">
          <SlidersHorizontal size={18} /> Filters
        </button>
      </div>
      <div className="flex gap-6">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-20">
            <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
            
<div className="space-y-1">

  {/* ALL PRODUCTS */}
  {!selectedCategory && (
    <>
      <button
        onClick={clearHierarchySelection}
        className="w-full text-left px-3 py-2 rounded-lg text-sm bg-red-50 text-red-500 font-medium"
      >
        All Products
      </button>

      {/* CATEGORY LEVEL */}
      {categories.filter((cat) => activeCategoryIds.has(cat.id)).map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryChange(cat.id)}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          {cat.name}
        </button>
      ))}
    </>
  )}

  {/* SUB-CATEGORY LEVEL */}
  {selectedCategory && !selectedSubCategory && (
    <>
      <button
        onClick={clearHierarchySelection}
        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
      >
        ← All Categories
      </button>

      <div className="px-3 py-2 font-semibold text-gray-800">
        {categories.find((cat) => cat.id === selectedCategory)?.name}
      </div>

      {subCategories.filter((sub) => sub.category_id === selectedCategory && activeSubCategoryIds.has(sub.id))
                .map((sub) => (
          <button
            key={sub.id}
            onClick={() => handleSubCategoryChange(sub.id)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            {sub.name}
          </button>
        ))}
    </>
  )}

  {/* VERTICAL LEVEL */}
  {selectedSubCategory && !selectedVertical && (
    <>
      <button
        onClick={() => {
          setSelectedSubCategory('')
          setSelectedVertical('')

          setSearchParams({
            category: selectedCategory,
          })
        }}
        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
      >
        ← Back to Sub Categories
      </button>

      <div className="px-3 py-2 font-semibold text-gray-800">
        {subCategories.find(
          (sub) => sub.id === selectedSubCategory
        )?.name}
      </div>

      {verticals.filter((vertical) =>vertical.sub_category_id === selectedSubCategory && activeVerticalIds.has(vertical.id))
        .map((vertical) => (
          <button
            key={vertical.id}
            onClick={() => handleVerticalChange(vertical.id)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            {vertical.name}
          </button>
        ))}
    </>
  )}

  {/* VERTICAL SELECTED */}
  {selectedVertical && (
    <>
      <button
        onClick={() => {
          setSelectedVertical('')

          setSearchParams({
            category: selectedCategory,
            sub_category: selectedSubCategory,
          })
        }}
        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
      >
        ← Back to Verticals
      </button>

      <div className="px-3 py-2 font-semibold text-gray-800">
        {verticals.find(
          (vertical) => vertical.id === selectedVertical
        )?.name}
      </div>
    </>
  )}

</div>

          </div>
        </aside>
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{filtered.length} product(s) found</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400"><p className="text-lg">No products found.</p></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
