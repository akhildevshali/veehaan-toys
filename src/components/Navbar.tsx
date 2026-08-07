import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, Search, User, ChevronDown, Package, Ticket, CreditCard, MapPin, Heart, Bell, LogOut  } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchCart } from '../lib/cart'
import { LoginModal } from './LoginModal'
import { SignupModal } from './SignupModal'
import { supabase } from "../lib/supabase";

export function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [firstName, setFirstName] = useState("");
  useEffect(() => {
  const getProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .single();

    if (data) {
      setFirstName(data.first_name);
    }
  };

  getProfile();
}, []);

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const refresh = async () => {
      const items = await fetchCart()
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0))
    }
    refresh()
    const interval = setInterval(refresh, 2000)
    return () => clearInterval(interval)
  }, [])

  const isActive = (path: string) =>
    location.pathname === path ? 'text-red-500 font-semibold' : 'text-gray-700 hover:text-red-500 font-medium'
  const accountMenu = [
  { icon: User, label: "My Profile" },
  { icon: Package, label: "Orders" },
  { icon: Ticket, label: "Coupons" },
  { icon: CreditCard, label: "Saved Cards & Wallet" },
  { icon: MapPin, label: "Saved Addresses" },
  { icon: Heart, label: "Wishlist" },
  { icon: Bell, label: "Notifications" },
  { icon: LogOut, label: "Logout" }
]

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🧸</div>
            <span className="text-xl font-bold">
              <span className="text-red-500">Veehaan</span><span className="text-orange-400">Toys</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 mr-auto ml-20">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/shop" className={isActive('/shop')}>Shop</Link>
            <Link to="/about" className={isActive('/about')}>About Us</Link>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
          </div>
          <div className="flex items-center gap-4 ml-6">
          {/* Search Bar */}
<div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-72">
  <Search size={18} className="text-gray-500 mr-2" />
  <input
    type="text"
    placeholder="Search toys..."
    className="bg-transparent w-full outline-none text-sm"
  />
</div>
<div
  className="relative hidden lg:block"
  onMouseEnter={() => setShowAccountMenu(true)}
  onMouseLeave={() => setShowAccountMenu(false)}
>
  <button
    onClick={() => setIsLoginOpen(true)}
    className="flex items-center gap-2 hover:text-red-500 transition-colors"
>
  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100 transition-colors">
    <User size={20} />
  </div>

  <div className="text-left">
    <p className="text-base font-bold text-gray-900">
      {firstName ? firstName : "Hello"}
    </p>

<div className="flex items-center gap-1">
  {!firstName && (
  <p className="text-sm font-semibold">
    Login
  </p>
)}

  <div
    className={`transition-transform duration-200 ${
      showAccountMenu ? "rotate-180" : ""
    }`}
  >
    <ChevronDown size={16} />
  </div>
</div>
  </div>
</button>
{showAccountMenu && (
  <div
  className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl border border-gray-100 shadow-2xl z-50 overflow-hidden
             animate-in fade-in zoom-in-95 duration-200"
>
    <div className="px-4 py-3 font-semibold border-b">
      Your Account
    </div>

    {accountMenu.map((item) => {
      const Icon = item.icon

      return (
        <button
          key={item.label}
          className="w-full flex items-center gap-3 px-4 py-2 text-left
hover:bg-orange-50 hover:text-orange-600
transition-all duration-200 border-l-4 border-transparent
hover:border-orange-500"
        >
        <div
  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
    item.label === "My Profile"
      ? "bg-orange-100"
      : "bg-gray-100"
  }`}
>
  <Icon size={16} className="text-gray-600" />
</div>
      <span
  className={`text-sm font-medium ${
    item.label === "Logout"
      ? "text-red-500"
      : "text-gray-700"
  }`}
>
  {item.label}
</span>
        </button>
      )
    })}
  </div>
)}
</div>
            <button onClick={() => navigate('/cart')} className="relative w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
              <ShoppingCart size={20} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-4 border-t border-gray-100 pt-4">
            <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/shop" className={isActive('/shop')} onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/about" className={isActive('/about')} onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/contact" className={isActive('/contact')} onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </div>
<LoginModal
  isOpen={isLoginOpen}
  onClose={() => setIsLoginOpen(false)}
  onCreateAccount={() => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  }}
/>
<SignupModal
  isOpen={isSignupOpen}
  onClose={() => setIsSignupOpen(false)}
/>
    </nav>
  )
}
