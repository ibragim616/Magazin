 
 
/* eslint-disable @next/next/no-img-element */
 
'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Star, Heart } from 'lucide-react';

interface ProductCardProps {
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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const firstImage = product.images.split(',')[0] || '/images/placeholder.jpg';

  const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) return "0 so'm";
    return price.toLocaleString('uz-UZ') + " so'm";
  };

  const hasDiscount = product.discountPrice !== null;
  const activePrice = hasDiscount ? product.discountPrice! : product.price;

  return (
    <div className="group relative bg-blue-950 rounded-3xl border border-blue-900 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-blue-950 dark:bg-slate-850 overflow-hidden">
        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md">
            Chegirma
          </span>
        )}

        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <div className="w-full h-full flex items-center justify-center bg-blue-950 dark:from-slate-800/40 dark:to-slate-850/40 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
            <img
              src={firstImage}
              alt={product.name}
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <span className="text-4xl text-indigo-600 dark:text-indigo-400 font-extrabold uppercase select-none opacity-40 absolute inset-0 items-center justify-center hidden">
              {product.brand || 'Uz'}
            </span>
          </div>
        </Link>

        {/* Favorite Quick Action */}
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 text-gray-400 hover:text-rose-500 hover:scale-105 active:scale-95 transition-all shadow-sm">
          <Heart className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
          {product.brand || 'UzMarket'}
        </span>
        <h3 className="mt-1 font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 text-sm leading-snug flex-1">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Rating */}
        <div className="mt-2.5 flex items-center gap-1">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-blue-200">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price & Cart Actions */}
        <div className="mt-4 pt-4 border-t border-blue-900 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-blue-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-base font-extrabold text-white">
              {formatPrice(activePrice)}
            </span>
          </div>

          {product.stock > 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="p-2.5 rounded-xl bg-blue-900 text-blue-300 hover:bg-blue-800 hover:text-white transition-all duration-200 cursor-pointer"
              title="Savatga qo'shish"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          ) : (
            <span className="text-xs font-bold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-1 rounded-lg">
              Tugagan
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
