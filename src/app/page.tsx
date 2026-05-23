 
 
/* eslint-disable @next/next/no-img-element */
 
import React from 'react';
import Link from 'next/link';
import db from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import { ChevronRight, ArrowRight, ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';

export const revalidate = 0; // Disable caching to ensure always showing fresh DB data

const categoryImageMap: Record<string, string> = {
  'elektronika': '/images/categories/electronics.png',
  'maishiy-texnika': '/images/categories/appliances.png',
};

export default async function Home() {
  // Fetch active parent categories
  const categories = await db.category.findMany({
    where: { parentId: null },
    take: 4,
  });

  // Fetch featured products (take 8)
  const products = await db.product.findMany({
    take: 8,
    orderBy: { rating: 'desc' },
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-indigo-950 shadow-inner min-h-[600px] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-[heroZoom_25s_ease-in-out_infinite_alternate]"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        ></div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30"></div>
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 w-full">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest backdrop-blur-sm">
              Katta Yangilanish
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
              Sifatli mahsulotlar, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400">
                qulay narxlarda!
              </span>
            </h1>
            <p className="max-w-xl text-lg text-gray-200 mx-auto lg:mx-0 drop-shadow-md">
              Telefonlar, noutbuklar va maishiy texnikalarning eng keng assortimenti. Butun O&apos;zbekiston bo&apos;ylab tezkor yetkazib berish xizmati.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all gap-2 cursor-pointer hover:scale-105"
              >
                Xarid qilish
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/products?category=smartfonlar"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-2xl border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
              >
                Smartfonlar
              </Link>
            </div>
          </div>
          {/* Visual card representitive */}
          <div className="hidden lg:flex justify-center relative">
            <div className="relative w-[400px] h-[400px] rounded-[50px] shadow-2xl shadow-indigo-500/25 rotate-3 overflow-hidden group hover:rotate-0 transition-transform duration-500 border border-white/15">
              <img
                src="/images/uzmarket-card.png"
                alt="UzMarket Premium Products"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-indigo-900/20"></div>
              <div className="absolute inset-4 border border-white/10 rounded-[36px] pointer-events-none"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white select-none">
                <p className="text-2xl font-bold tracking-wide drop-shadow-lg">UzMarket Premium</p>
                <p className="text-sm opacity-80 mt-1 drop-shadow-md">Biz bilan har bir xarid quvonchli!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-blue-200 dark:bg-blue-950/30 border-y border-blue-300/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Kategoriyalar bo&apos;yicha xarid
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              O&apos;zingizga kerakli bo&apos;limni tanlang
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const gradients = [
              'from-blue-500 to-indigo-600',
              'from-purple-500 to-pink-600',
              'from-emerald-500 to-teal-600',
              'from-amber-500 to-orange-600',
            ];
            const currentGradient = gradients[idx % gradients.length];
            const hasImage = !!categoryImageMap[cat.slug];

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative h-48 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-slate-800 flex flex-col justify-end p-6"
              >
                {/* Background Image / Gradient */}
                {hasImage ? (
                  <>
                    <img
                      src={categoryImageMap[cat.slug]}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                  </>
                ) : (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-tr ${currentGradient} opacity-90 group-hover:scale-105 transition-transform duration-500`}></div>
                    <div className="absolute top-6 left-6 h-12 w-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-lg backdrop-blur-md">
                      {cat.name.charAt(0).toUpperCase()}
                    </div>
                  </>
                )}

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between text-white">
                  <span className="font-extrabold text-lg tracking-tight drop-shadow-md">
                    {cat.name}
                  </span>
                  <div className="p-2 bg-white/15 backdrop-blur-md rounded-xl text-white group-hover:bg-indigo-600 group-hover:scale-105 transition-all">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Ommabop mahsulotlar
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Mijozlarimiz tomonidan yuqori baholangan mahsulotlar
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            Barchasi
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Core Advantages */}
      <section className="bg-blue-950 border-y border-blue-900 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-900 rounded-2xl shadow-sm text-blue-300">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Tezkor yetkazib berish</h4>
              <p className="text-xs text-blue-300 mt-1">Butun respublika bo&apos;ylab 24 soat ichida yetkazamiz.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-900 rounded-2xl shadow-sm text-blue-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Xavfsiz to&apos;lov tizimi</h4>
              <p className="text-xs text-blue-300 mt-1">Eshik tagida naqd pul orqali yoki Click/Payme orqali to&apos;lang.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-900 rounded-2xl shadow-sm text-blue-300">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Mijozlarni qo&apos;llab-quvvatlash</h4>
              <p className="text-xs text-blue-300 mt-1">Har qanday savolga 24/7 davomida javob beramiz.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-900 rounded-2xl shadow-sm text-blue-300">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Qulay qaytarish</h4>
              <p className="text-xs text-blue-300 mt-1">Mahsulot ma&apos;qul kelmasa, 14 kun ichida almashtiramiz.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
