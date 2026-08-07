import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { fetchCart, calculateCartTotal, calculateCartTotalUsd, clearCart, formatPrice, formatPriceUsd } from '../lib/cart'
import type { CartItem } from '../lib/supabase'

export function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const navigate = useNavigate()

  const [form, setForm] = useState({ customer_name: '', customer_email: '', customer_phone: '', delivery_address: '', city: '', postal_code: '', payment_method: 'cod' })

  useEffect(() => { loadCart() }, [])
  const loadCart = async () => { const data = await fetchCart(); setItems(data); setLoading(false) }
  const total = calculateCartTotal(items)
  const totalUsd = calculateCartTotalUsd(items)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name.trim() || !form.customer_email.trim()) return
    setSubmitting(true)
    const ordNum = `ORD-${Date.now().toString().slice(-8)}`
    setOrderNumber(ordNum)
    const { data: order, error } = await supabase.from('orders').insert({
      order_number: ordNum, customer_name: form.customer_name, customer_email: form.customer_email,
      customer_phone: form.customer_phone, delivery_address: form.delivery_address, city: form.city,
      postal_code: form.postal_code, total_amount: total, payment_method: form.payment_method, status: 'pending',
    }).select().single()
    if (!error && order) {
      const orderItems = items.map((item) => ({
        order_id: order.id, product_id: item.product_id, product_name: item.product?.name || '',
        product_price: item.product?.price ?? 0, quantity: item.quantity, subtotal: (item.product?.price ?? 0) * item.quantity,
      }))
      await supabase.from('order_items').insert(orderItems)
      await clearCart()
      setSuccess(true)
    }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Loading...</div>

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"><Check size={32} className="text-green-600" /></div>
        <h1 className="text-2xl font-bold text-gray-800">Order Placed!</h1>
        <p className="text-gray-500">Your order number is <span className="font-semibold text-red-500">{orderNumber}</span></p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all">Continue Shopping</button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">Your cart is empty.</p>
        <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all">Continue Shopping</button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required placeholder="Full Name *" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
          <input required type="email" placeholder="Email *" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
        </div>
        <input placeholder="Phone" value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
        <textarea required placeholder="Delivery Address *" value={form.delivery_address} onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
          <input placeholder="Postal Code" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
        </div>
        <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none bg-white">
          <option value="cod">Cash on Delivery</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
        </select>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total</span>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-red-500">{formatPrice(total)}</span>
              {totalUsd != null && <span className="text-lg font-semibold text-gray-400">{formatPriceUsd(totalUsd)}</span>}
            </div>
          </div>
        </div>
        <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 disabled:bg-gray-300 transition-all">{submitting ? 'Placing Order...' : 'Place Order'}</button>
      </form>
    </div>
  )
}
