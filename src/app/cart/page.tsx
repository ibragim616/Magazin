'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartOriginalTotal,
    cartSavings,
  } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + " so'm";
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-6 bg-indigo-50 dark:bg-slate-900 rounded-full text-indigo-600 animate-bounce">
          <ShoppingCart className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Savatchangiz bo‘sh</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Hozirda savatchangizda hech qanday mahsulot yo‘q. Katalogimizga o‘ting va o‘zingizga yoqqan mahsulotlarni qo‘shing!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          Xaridlarni boshlash
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
        Savatchangiz ({cartItems.length} xil mahsulot)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start flex-1">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden divide-y divide-gray-50 dark:divide-slate-800/50">
            {cartItems.map((item) => {
              const hasDiscount = item.discountPrice !== null;
              const activePrice = hasDiscount ? item.discountPrice! : item.price;

              return (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                  {/* Mock Image Box */}
                  <div className="h-20 w-20 shrink-0 bg-gradient-to-tr from-indigo-50/50 to-purple-50/50 dark:from-slate-800/40 dark:to-slate-850/40 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-800">
                    <ShoppingBag className="h-8 w-8 text-indigo-600/40" />
                  </div>

                  {/* Title & Specs */}
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm hover:text-indigo-600 transition-colors">
                      <Link href={`/products/${item.id}`}>{item.name}</Link>
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-xs font-black text-gray-950 dark:text-white">
                        {formatPrice(activePrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-950/40 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-slate-950 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-slate-950 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                      title="O'chirish"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={clearCart}
              className="text-xs font-bold text-red-600 hover:text-red-500 border border-red-200 dark:border-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/10 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Savatchani tozalash
            </button>
          </div>
        </div>

        {/* Right Column: Summary Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-6">
          <h3 className="font-extrabold text-gray-900 dark:text-white text-lg border-b border-gray-50 dark:border-slate-800 pb-4">
            Buyurtma tafsilotlari
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Oraliq jami</span>
              <span>{formatPrice(cartOriginalTotal)}</span>
            </div>
            {cartSavings > 0 && (
              <div className="flex justify-between text-rose-500 font-medium">
                <span>Chegirma</span>
                <span>-{formatPrice(cartSavings)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Yetkazib berish</span>
              <span className="text-emerald-500 font-bold">Bepul</span>
            </div>

            <hr className="border-gray-50 dark:border-slate-800" />

            <div className="flex justify-between font-black text-gray-950 dark:text-white text-lg">
              <span>Umumiy jami</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            Buyurtma berishga o‘tish
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
