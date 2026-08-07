import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react'
import { fetchCart, updateCartQuantity, removeFromCart, calculateCartTotal, calculateCartTotalUsd, formatPrice, formatPriceUsd } from '../lib/cart'
import type { CartItem } from '../lib/supabase'

export function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadCart = async () => { const data = await fetchCart(); setItems(data); setLoading(false) }
  useEffect(() => { loadCart() }, [])

  const handleUpdate = async (itemId: string, qty: number) => { await updateCartQuantity(itemId, qty); loadCart() }
  const handleRemove = async (itemId: string) => { await removeFromCart(itemId); loadCart() }

  const total = calculateCartTotal(items)
  const totalUsd = calculateCartTotalUsd(items)

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Loading cart...</div>

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingBag size={48} className="text-gray-300" />
        <p className="text-gray-400 text-lg">Your cart is empty.</p>
        <Link to="/shop" className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
              {item.product?.image_url ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🧸</div>}
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.product?.slug}`} className="font-medium text-gray-800 hover:text-red-500 line-clamp-1">{item.product?.name}</Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-red-500 font-semibold">{formatPrice(item.product?.price ?? 0)}</span>
                {item.product?.price_usd != null && <span className="text-gray-400 text-sm">{formatPriceUsd(item.product.price_usd)}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleUpdate(item.id, item.quantity - 1)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"><Minus size={16} /></button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button onClick={() => handleUpdate(item.id, item.quantity + 1)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"><Plus size={16} /></button>
            </div>
            <button onClick={() => handleRemove(item.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Total</span>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-red-500">{formatPrice(total)}</span>
            {totalUsd != null && <span className="text-lg font-semibold text-gray-400">{formatPriceUsd(totalUsd)}</span>}
          </div>
        </div>
        <button onClick={() => navigate('/checkout')} className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2">Proceed to Checkout <ArrowRight size={20} /></button>
      </div>
    </div>
  )
}
