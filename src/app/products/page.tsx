 
/* eslint-disable @typescript-eslint/no-unused-vars */
 
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Grid, List, SlidersHorizontal, Search, RotateCcw, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Product {
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
    id: string;
    name: string;
  };
}

function CatalogPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter states
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxDbPrice, setMaxDbPrice] = useState(20000000);
  const [isLoading, setIsLoading] = useState(true);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  // Load categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (selectedBrand) params.set('brand', selectedBrand);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setBrands(data.brands || []);
          setMaxDbPrice(data.maxDbPrice || 20000000);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    // Debounce product fetching when typing in search or price inputs
    const handler = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(handler);
  }, [search, category, selectedBrand, minPrice, maxPrice, sort]);

  useEffect(() => {
     
    setSearch(searchParams.get('search') || '');
     
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    router.push('/products');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + " so'm";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Bosh sahifa</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-300 font-medium">Mahsulotlar katalogi</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
              <span className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-600" />
                Filtrlar
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Tozalash
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Kategoriyalar</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCategory('')}
                  className={`text-sm text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                    category === ''
                      ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Barcha toifalar
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className={`text-sm text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                      category === cat.slug
                        ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Narx (so‘m)</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Brands Filter */}
            {brands.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Brendlar</h4>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2">
                  <button
                    onClick={() => setSelectedBrand('')}
                    className={`text-sm text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                      selectedBrand === ''
                        ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Barcha brendlar
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`text-sm text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                        selectedBrand === b
                          ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900/60 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search within catalog */}
            <div className="relative w-full md:max-w-xs">
              <input
                type="text"
                placeholder="Nomi bo'yicha saralash..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Grid/List Toggle & Sort Dropdown */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="flex items-center gap-1.5 border border-gray-200 dark:border-slate-800 p-1 rounded-xl bg-gray-50/50 dark:bg-slate-950/40">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="h-4.5 w-4.5" />
                </button>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="py-2 pl-3 pr-8 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-950/40 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="newest">Yangi qo‘shilganlar</option>
                <option value="price_asc">Narx: Arzonroq</option>
                <option value="price_desc">Narx: Qimmatroq</option>
                <option value="rating">Reyting bo‘yicha</option>
              </select>
            </div>
          </div>

          {/* Catalog Listing */}
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : products.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => {
                  const hasDiscount = product.discountPrice !== null;
                  const activePrice = hasDiscount ? product.discountPrice! : product.price;

                  return (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-slate-900/60 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex gap-6 items-center"
                    >
                      <div className="h-32 w-32 shrink-0 bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                        <span className="text-xl text-indigo-600 dark:text-indigo-400 font-extrabold uppercase select-none opacity-40">
                          {product.brand || 'Uz'}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase">{product.brand}</span>
                        <h3 className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 transition-colors">
                          <Link href={`/products/${product.id}`}>{product.name}</Link>
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 max-w-xl">{product.description}</p>
                      </div>
                      <div className="text-right shrink-0 space-y-3">
                        <div className="flex flex-col">
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                          <span className="text-lg font-black text-gray-950 dark:text-white">
                            {formatPrice(activePrice)}
                          </span>
                        </div>
                        <Link
                          href={`/products/${product.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-indigo-600 hover:bg-indigo-600 hover:text-white text-indigo-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Batafsil
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-3xl space-y-4">
              <span className="text-4xl">🔍</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hech narsa topilmadi</h3>
              <p className="text-sm text-gray-500 max-w-xs">Ushbu so‘rov bo‘yicha hech qanday mahsulot topilmadi. Qidiruv qiymatlarini o‘zgartirib ko‘ring.</p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all cursor-pointer"
              >
                Filtrni bekor qilish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <CatalogPageContent />
    </Suspense>
  );
}
