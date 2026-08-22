import { Routes, Route, Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { ADMIN_EMAILS } from './components/AdminRoute'
import { Navbar } from './components/Navbar'
import { Chatbot } from './components/Chatbot'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { BannerCollectionPage } from './pages/BannerCollectionPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { AdminPage } from './pages/AdminPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import CompleteProfilePage from "./pages/CompleteProfilePage";
import MyProfilePage from "./pages/MyProfilePage";
import SavedAddressesPage from "./pages/SavedAddressesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ResetPasswordPage from "./pages/ResetPasswordPage";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const email = session?.user?.email?.toLowerCase().trim()

      setIsAdmin(
        !!email && ADMIN_EMAILS.includes(email)
      )
    }

    checkAdmin()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false)
        return
      }

      const email = session?.user?.email?.toLowerCase().trim()

      setIsAdmin(
        !!email && ADMIN_EMAILS.includes(email)
      )
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/banner-collection/:collectionId" element={<BannerCollectionPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} /> 

<Route
  path="/complete-profile"  element={    <ProtectedRoute>
      <CompleteProfilePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/my-profile"
  element={
    <ProtectedRoute>
      <MyProfilePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/saved-addresses"
  element={
    <ProtectedRoute>
      <SavedAddressesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/reset-password"
  element={<ResetPasswordPage />}
/>

        </Routes>
      </main>
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🧸</div>
                <span className="text-xl font-bold"><span className="text-red-500">Veehaan</span><span className="text-orange-400">Toys</span></span>
              </div>
              <p className="text-sm">Quality toys for happy kids. Shop with confidence.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-orange-400">Home</Link></li>
                <li><Link to="/shop" className="hover:text-orange-400">Shop</Link></li>
                <li><Link to="/about" className="hover:text-orange-400">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-orange-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li>Free Shipping over ₹499</li>
                <li>5-Day Returns</li>
                <li>24/7 Support</li>
                <li>Safe & Secure</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li>soyal@veehaandigitech.com</li>
                <li>Bengaluru, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center sm:text-left">© {new Date().getFullYear()} VeehaanToys. All rights reserved.</p>
            {isAdmin && (
  <Link
    to="/admin"
    className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors"
  >
    <Settings size={16} /> Admin
  </Link>
)}
          </div>
        </div>
      </footer>
      <Chatbot />
    </div>
  )
}
