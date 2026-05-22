import Link from 'next/link';
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group text-white">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">UzMarket</span>
            </Link>
            <p className="text-sm text-gray-400">
              Uzbekistandagi eng qulay va tezkor kichik onlayn savdo platformasi. Biz bilan oson va xavfsiz xarid qiling!
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white transition-all">
                <TelegramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white transition-all">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white transition-all">
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Xaridlar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Barcha mahsulotlar
                </Link>
              </li>
              <li>
                <Link href="/products?category=smartfonlar" className="hover:text-white transition-colors">
                  Smartfonlar
                </Link>
              </li>
              <li>
                <Link href="/products?category=noutbuklar" className="hover:text-white transition-colors">
                  Noutbuklar
                </Link>
              </li>
              <li>
                <Link href="/products?category=maishiy-texnika" className="hover:text-white transition-colors">
                  Maishiy texnika
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Ma‘lumotlar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Yetkazib berish va to‘lov
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kafolat va qaytarish
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Foydalanish shartlari
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Biz haqimizda
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Aloqa</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
                <span className="text-gray-400">Tashkent shahar, Chilonzor tumani, 9-kvartal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-indigo-500 shrink-0" />
                <a href="tel:+998901234567" className="text-gray-400 hover:text-white transition-colors">
                  +998 (90) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-500 shrink-0" />
                <a href="mailto:info@uzmarket.uz" className="text-gray-400 hover:text-white transition-colors">
                  info@uzmarket.uz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <span>&copy; {new Date().getFullYear()} UzMarket LLC. Barcha huquqlar himoyalangan.</span>
          <span>Dizayn va ishlab chiqish: Antigravity AI Agent</span>
        </div>
      </div>
    </footer>
  );
}

// Simple Telegram Icon
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z" />
    </svg>
  );
}

// Simple Instagram Icon
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Simple Facebook Icon
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
