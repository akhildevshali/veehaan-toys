import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, type Product } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'

export function BannerCollectionPage() {
  const { collectionId } = useParams<{ collectionId: string }>()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (collectionId) {
      loadCollectionProducts(collectionId)
    }
  }, [collectionId])

  const loadCollectionProducts = async (id: string) => {
    setLoading(true)
    setError('')

    try {
      const { data: items, error: itemsError } = await supabase
        .from('banner_product_collection_items')
        .select('product_id, display_order')
        .eq('collection_id', id)
        .order('display_order', { ascending: true })

      if (itemsError) throw itemsError

      if (!items || items.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      const productIds = items.map((item) => item.product_id)

      const { data: productData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)

      if (productsError) throw productsError

      const productMap = new Map(
        (productData || []).map((product) => [product.id, product])
      )

      const orderedProducts = items
        .map((item) => productMap.get(item.product_id))
        .filter((product): product is Product => Boolean(product))

      setProducts(orderedProducts)
    } catch (err) {
      console.error('Error loading banner collection:', err)
      setError('Unable to load products.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Loading products...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Featured Collection
        </h1>

        <p className="text-gray-500 mt-1">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No products found in this collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  )
}