import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Category {
  id: string
  name: string
  slug: string
}

export interface SubCategory {
  id: string
  category_id: string
  name: string
  slug: string
}

export interface Vertical {
  id: string
  sub_category_id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  sku: string | null
  name: string
  slug: string
  description: string
  short_description: string
  specifications: string[]
  price: number
  mrp: number | null
  price_usd: number | null
  image_url: string
  additional_images: string[]
  video_url: string | null
  category_id: string | null
  sub_category_id: string | null
  vertical_id: string | null
  stock_quantity: number
  in_stock: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  session_id: string
  product_id: string
  quantity: number
  product?: Product
}

export interface Review {
  id: string
  customer_name: string
  rating: number
  review_text: string
  featured: boolean
  created_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  sender: 'customer' | 'bot'
  message: string
  is_inquiry: boolean
  created_at: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string | null
  button_text: string | null
  button_link: string | null
  image_url: string | null
  background_color: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  click_action: 'link' | 'bulk_sku'
  collection_id: string | null
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 200)
}
