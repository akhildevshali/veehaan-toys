import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getSessionId } from '../lib/cart';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  useEffect(() => {
    loadCartCount();
    const interval = setInterval(loadCartCount, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadCartCount = async () => {
    const sessionId = getSessionId();
    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('session_id', sessionId);

    if (data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'catalog' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 group"
          >
            <div className="bg-gradient-to-r from-red-500 to-yellow-400 p-2 rounded-lg transform group-hover:scale-110 transition-transform">
              <span className="text-2xl">🧸</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
              VeehaanToys
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`text-lg font-medium transition-colors ${
                  currentPage === item.page
                    ? 'text-red-600'
                    : 'text-gray-700 hover:text-red-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex relative w-56">
  <Search
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
  />

  <input
    type="text"
    placeholder="Search toys..."
    className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-transparent focus:border-orange-400 focus:bg-white outline-none transition-all"
  />
</div>
<button
  onClick={() => {}}
  className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
>
  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-100 transition-colors">
    <User size={20} />
  </div>

  <div className="text-left">
    <p className="text-xs text-gray-500">Hello</p>
    <p className="text-sm font-semibold">Login</p>
  </div>
</button>

            <button
              onClick={() => onNavigate('cart')}
              className="relative bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full transition-all transform hover:scale-110"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-red-500 transition-colors"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slideDown">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-lg font-medium px-4 py-2 rounded transition-colors ${
                    currentPage === item.page
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
