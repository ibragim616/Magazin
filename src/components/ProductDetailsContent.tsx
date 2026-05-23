 
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
 
'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Star, MessageSquare, Plus, Minus, Send, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

interface ProductDetailsContentProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    images: string;
    stock: number;
    brand: string | null;
    rating: number;
    category: {
      name: string;
    };
    reviews: Review[];
  };
}

export default function ProductDetailsContent({ product }: ProductDetailsContentProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const imagesList = product.images.split(',').filter(Boolean);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + " so'm";
  };

  const hasDiscount = product.discountPrice !== null;
  const activePrice = hasDiscount ? product.discountPrice! : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(false);
    setIsSubmittingReview(true);

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: newRating,
          comment: newComment,
          userName: user ? user.name : undefined, // If guest, let backend handle or prompt
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviewSuccess(true);
        setNewComment('');
        setNewRating(5);
        // Refresh reviews locally
        setReviewsList((prev) => [data.review, ...prev]);
        router.refresh();
      } else {
        setReviewError(data.error || 'Fikr qoldirishda xatolik yuz berdi');
      }
    } catch (err) {
      setReviewError('Tarmoq xatoligi yuz berdi');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Product main section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-tr from-indigo-50/50 to-purple-50/50 dark:from-slate-800/40 dark:to-slate-850/40 rounded-[32px] border border-gray-100 dark:border-slate-800 flex items-center justify-center relative overflow-hidden shadow-sm">
            {hasDiscount && (
              <span className="absolute top-6 left-6 z-10 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md">
                Chegirma
              </span>
            )}
            <img
              src={imagesList[selectedImageIdx] || imagesList[0]}
              alt={product.name}
              className="w-full h-full object-contain p-6"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <span className="text-8xl text-indigo-600 dark:text-indigo-400 font-extrabold uppercase select-none opacity-20 absolute inset-0 items-center justify-center hidden">
              {product.brand || 'Uz'}
            </span>
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-4">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`h-16 w-16 rounded-2xl bg-gray-50 border transition-all flex items-center justify-center overflow-hidden cursor-pointer ${
                    selectedImageIdx === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="text-xs font-black text-indigo-600 uppercase select-none">
                    IMG {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Specs */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {product.brand || 'UzMarket'} &bull; {product.category.name}
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4.5 w-4.5 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-700'
                  }`}
                />
              ))}
              <span className="ml-1 text-sm font-bold text-gray-900 dark:text-white">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-300 dark:text-slate-800">|</span>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {reviewsList.length} sharhlar
            </span>
          </div>

          <hr className="border-gray-100 dark:border-slate-800" />

          {/* Price */}
          <div className="space-y-1">
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-950 dark:text-white">
                {formatPrice(activePrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1 rounded-full">
                  Tejash: {formatPrice(product.price - product.discountPrice!)}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {product.description}
          </p>

          <hr className="border-gray-100 dark:border-slate-800" />

          {/* Quantity and Actions */}
          <div className="space-y-4">
            {product.stock > 0 ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Soni:</span>
                  <div className="flex items-center border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-950/40 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-slate-950 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-slate-950 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">Omborda: {product.stock} ta bor</span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex justify-center items-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 cursor-pointer"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Savatga qo‘shish
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-950/30 text-rose-600 dark:text-rose-400 p-4 rounded-2xl font-bold text-sm text-center">
                Ushbu mahsulot hozirda omborda mavjud emas.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="border-t border-gray-100 dark:border-slate-800 pt-12">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">
          Mijozlar fikrlari ({reviewsList.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Write a Review */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 h-fit space-y-6">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">
              Fikr qoldirish
            </h3>

            {reviewSuccess && (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Fikringiz muvaffaqiyatli qabul qilindi!</span>
              </div>
            )}

            {reviewError && (
              <div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-4 rounded-xl border border-red-200 text-sm">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Baho bering
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="text-amber-400 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= newRating ? 'fill-current' : 'text-gray-300 dark:text-gray-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fikringiz
                </label>
                <textarea
                  rows={4}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Mahsulot haqida fikringizni batafsil yozing..."
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-950/40 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
                {isSubmittingReview ? 'Yuborilmoqda...' : 'Yuborish'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviewsList.length > 0 ? (
              reviewsList.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                          {review.userName}
                        </h4>
                        <span className="text-[10px] text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 text-gray-400 space-y-2">
                <MessageSquare className="h-8 w-8" />
                <p className="text-sm font-medium">Ushbu mahsulotga hali hech kim fikr bildirmagan.</p>
                <p className="text-xs">Birinchi bo‘lib fikr bildiring!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
