import { supabase, type CartItem } from './supabase'

export function formatPrice(price: number): string {
  return `₹${Number(price).toFixed(2)}`
}

export function formatPriceUsd(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) return ''
  return `$${Number(price).toFixed(2)}`
}

export function getSessionId(): string {
  let sessionId = localStorage.getItem('veehaantoys_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('veehaantoys_session_id', sessionId)
  }
  return sessionId
}

export async function fetchCart(): Promise<CartItem[]> {
  const sessionId = getSessionId()
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*)')
    .eq('session_id', sessionId)
  if (error) return []
  return (data || []) as CartItem[]
}

export async function addToCart(productId: string, quantity: number = 1): Promise<void> {
  const sessionId = getSessionId()
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId)
    .eq('product_id', productId)
    .single()
  if (existing) {
    await supabase.from('cart_items').update({ quantity: existing.quantity + quantity }).eq('id', existing.id)
  } else {
    await supabase.from('cart_items').insert({ session_id: sessionId, product_id: productId, quantity })
  }
}

export async function updateCartQuantity(itemId: string, quantity: number): Promise<void> {
  if (quantity <= 0) {
    await supabase.from('cart_items').delete().eq('id', itemId)
  } else {
    await supabase.from('cart_items').update({ quantity }).eq('id', itemId)
  }
}

export async function removeFromCart(itemId: string): Promise<void> {
  await supabase.from('cart_items').delete().eq('id', itemId)
}

export async function clearCart(): Promise<void> {
  const sessionId = getSessionId()
  await supabase.from('cart_items').delete().eq('session_id', sessionId)
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.product?.price ?? 0) * item.quantity, 0)
}

export function calculateCartTotalUsd(items: CartItem[]): number | null {
  const hasUsd = items.some((item) => item.product?.price_usd != null)
  if (!hasUsd) return null
  return items.reduce((total, item) => total + (item.product?.price_usd ?? 0) * item.quantity, 0)
}
