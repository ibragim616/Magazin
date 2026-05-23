/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
 
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, Phone, MapPin, User, Landmark, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  // Check if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderConfirmed) {
      router.push('/cart');
    }
  }, [cartItems, orderConfirmed, router]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + " so'm";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          paymentMethod,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderConfirmed(data.order);
        clearCart();
      } else {
        setError(data.error || 'Buyurtma berishda xatolik yuz berdi');
      }
    } catch (err) {
      setError('Tarmoq xatoligi yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is successfully placed, show Confirmation screen
  if (orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 flex flex-col items-center justify-center text-center space-y-8">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-full text-emerald-500 animate-pulse">
          <CheckCircle2 className="h-16 w-16" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Buyurtmangiz qabul qilindi!</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            UzMarket-ni tanlaganingiz uchun rahmat. Buyurtmangiz yaqin orada ko‘rib chiqiladi.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="w-full bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 text-left space-y-4 shadow-sm">
          <div className="flex justify-between border-b border-gray-50 dark:border-slate-800 pb-3 text-sm">
            <span className="text-gray-400">Buyurtma raqami:</span>
            <span className="font-bold text-gray-900 dark:text-white">#{orderConfirmed.id.slice(-6).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Qabul qiluvchi:</span>
            <span className="font-medium text-gray-900 dark:text-white">{orderConfirmed.customerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Telefon:</span>
            <span className="font-medium text-gray-900 dark:text-white">{orderConfirmed.customerPhone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Manzil:</span>
            <span className="font-medium text-gray-900 dark:text-white text-right max-w-xs">{orderConfirmed.customerAddress}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">To‘lov usuli:</span>
            <span className="font-medium text-gray-900 dark:text-white">{orderConfirmed.paymentMethod === 'CASH' ? 'Eshik tagida naqd/karta' : 'Click/Payme'}</span>
          </div>
          <div className="flex justify-between border-t border-gray-50 dark:border-slate-800 pt-3 font-black text-base text-gray-950 dark:text-white">
            <span>Umumiy miqdor:</span>
            <span>{formatPrice(orderConfirmed.totalAmount)}</span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Bosh sahifa</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/cart" className="hover:text-indigo-600">Savatcha</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-300 font-medium">Buyurtma berish</span>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
        Buyurtmani rasmiylashtirish
      </h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-4 rounded-2xl border border-red-100 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start flex-1">
        {/* Left Column: Delivery Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-6">
          <h2 className="font-extrabold text-gray-900 dark:text-white text-lg">
            Yetkazib berish ma‘lumotlari
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ism, Familiya
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingizni kiriting"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-950/40 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefon raqam
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998901234567"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-950/40 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Yetkazib berish manzili
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shahar, tuman, ko'cha, uy/kvartira"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-950/40 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-50 dark:border-slate-800" />

          {/* Payment Method */}
          <div className="space-y-4">
            <h2 className="font-extrabold text-gray-900 dark:text-white text-lg">To‘lov usuli</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-5 rounded-2xl border text-left flex gap-4 items-start transition-all cursor-pointer ${
                  paymentMethod === 'CASH'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-slate-800 ring-2 ring-indigo-500/20'
                    : 'border-gray-200 dark:border-slate-800 hover:bg-gray-50'
                }`}
              >
                <Landmark className="h-6 w-6 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Naqd pul / Karta orqali</h4>
                  <p className="text-xs text-gray-500 mt-1">Eshik tagida kuryerga naqd yoki terminal orqali to‘lash.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CLICK')}
                className={`p-5 rounded-2xl border text-left flex gap-4 items-start transition-all cursor-pointer ${
                  paymentMethod === 'CLICK'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-slate-800 ring-2 ring-indigo-500/20'
                    : 'border-gray-200 dark:border-slate-800 hover:bg-gray-50'
                }`}
              >
                <ShieldCheck className="h-6 w-6 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Onlayn to‘lov (Click / Payme)</h4>
                  <p className="text-xs text-gray-500 mt-1">Click yoki Payme to‘lov tizimi orqali masofaviy to‘lov.</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-6">
          <h3 className="font-extrabold text-gray-900 dark:text-white text-lg border-b border-gray-50 dark:border-slate-800 pb-4">
            Sizning buyurtmangiz
          </h3>

          <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800 pr-2">
            {cartItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-sm gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium line-clamp-1 flex-1">
                  {item.name} <span className="text-indigo-600 font-bold">x{item.quantity}</span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white shrink-0">
                  {formatPrice((item.discountPrice || item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-gray-50 dark:border-slate-800" />

          <div className="flex justify-between font-black text-gray-950 dark:text-white text-lg">
            <span>Umumiy jami</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            {isSubmitting ? 'Rasmiylashtirilmoqda...' : 'Buyurtmani tasdiqlash'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
