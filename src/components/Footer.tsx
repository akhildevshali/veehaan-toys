import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ADMIN_EMAILS } from './AdminRoute';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  const checkAdmin = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const email = session?.user?.email?.toLowerCase().trim();

    setIsAdmin(
      !!email && ADMIN_EMAILS.includes(email)
    );
  };

  checkAdmin();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      setIsAdmin(false);
      return;
    }

    const email = session?.user?.email?.toLowerCase().trim();

    setIsAdmin(
      !!email && ADMIN_EMAILS.includes(email)
    );
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);


  return (
    <footer className="bg-gradient-to-r from-red-600 to-yellow-500 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🧸</span>
              <span className="text-2xl font-bold">VeehaanToys</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Bringing joy and smiles to children with quality toys that inspire
              creativity, learning, and endless fun.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-white/90 text-sm">
              <li>Soft Toys</li>
              <li>Educational Toys</li>
              <li>Cars & Vehicles</li>
              <li>Dolls & Accessories</li>
              <li>Outdoor Toys</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-white/90 text-sm">
                <Mail size={16} />
                <span>hello@veehantoys.com</span>
              </li>
              <li className="flex items-center space-x-2 text-white/90 text-sm">
                <Phone size={16} />
                <span>+91 99004 85693</span>
              </li>
              <li className="flex items-center space-x-2 text-white/90 text-sm">
                <MapPin size={16} />
                <span>Bengaluru, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/90 text-sm flex items-center justify-center gap-2">
            Made with <Heart size={16} className="text-white fill-white" /> by VeehaanToys Team
          </p>
          <p className="text-white/80 text-xs mt-2">
            © 2024 VeehaanToys. All rights reserved.
          </p>
          {isAdmin && (
  <button
    onClick={() => onNavigate('admin')}
    className="text-white/60 hover:text-white text-xs mt-2 transition-colors"
  >
    Admin
  </button>
)}
        </div>
      </div>
    </footer>
  );
}
