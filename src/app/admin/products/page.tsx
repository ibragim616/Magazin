 
/* eslint-disable @typescript-eslint/no-unused-vars */
 
 
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle, ShoppingBag, Eye } from 'lucide-react';
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
  categoryId: string;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const prodRes = await fetch('/api/products');
        const catRes = await fetch('/api/categories');

        if (prodRes.ok && catRes.ok) {
          const prodData = await prodRes.json();
          const catData = await catRes.json();
          setProducts(prodData.products || []);
          setCategories(catData.categories || []);
        } else {
          setError('Ma‘lumotlarni yuklashda xatolik yuz berdi');
        }
      } catch (err) {
        setError('Tarmoq xatoligi yuz berdi');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const openAddModal = () => {
    setModalType('add');
    setSelectedProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setDiscountPrice('');
    setStock('');
    setBrand('');
    setCategoryId(categories[0]?.id || '');
    setImages('/images/products/placeholder.jpg');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalType('edit');
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price.toString());
    setDiscountPrice(product.discountPrice ? product.discountPrice.toString() : '');
    setStock(product.stock.toString());
    setBrand(product.brand || '');
    setCategoryId(product.categoryId);
    setImages(product.images);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      stock,
      brand: brand || null,
      categoryId,
      images: images || '/images/products/placeholder.jpg',
    };

    try {
      let res;
      if (modalType === 'add') {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/products/${selectedProduct!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (res.ok) {
        if (modalType === 'add') {
          setProducts((prev) => [data.product, ...prev]);
        } else {
          setProducts((prev) =>
            prev.map((p) => (p.id === data.product.id ? data.product : p))
          );
        }
        setIsModalOpen(false);
      } else {
        setError(data.error || 'Mahsulot saqlashda xatolik yuz berdi');
      }
    } catch (err) {
      setError('Tarmoq xatoligi yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ushbu mahsulotni o‘chirishga ishonchingiz komilmi?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'O‘chirishda xatolik yuz berdi');
      }
    } catch (err) {
      alert('Tarmoq xatoligi yuz berdi');
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + " so'm";
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Mahsulotlar Boshqaruvi</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Do‘kondagi barcha mahsulotlarni tahrirlang yoki yangisini qo‘shing
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Yangi Mahsulot
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-750 dark:text-red-350 p-4 rounded-2xl border border-red-200 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Products Table */}
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-semibold">
                <th className="pb-3 pl-4">Rasm</th>
                <th className="pb-3">Nomi</th>
                <th className="pb-3">Kategoriya</th>
                <th className="pb-3">Narxi</th>
                <th className="pb-3">Zaxira</th>
                <th className="pb-3 pr-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/20 transition-colors text-gray-700 dark:text-gray-300">
                  <td className="py-4 pl-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-600 select-none uppercase">
                      {product.brand || 'Uz'}
                    </div>
                  </td>
                  <td className="py-4 font-bold text-gray-900 dark:text-white max-w-xs truncate">
                    {product.name}
                  </td>
                  <td className="py-4">{product.category.name}</td>
                  <td className="py-4 font-bold">{formatPrice(product.price)}</td>
                  <td className="py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                      product.stock > 5
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450'
                        : product.stock > 0
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-455'
                    }`}>
                      {product.stock} ta
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-right space-x-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="inline-flex p-2 rounded-xl bg-gray-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 text-gray-500 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => openEditModal(product)}
                      className="inline-flex p-2 rounded-xl bg-gray-100 hover:bg-amber-500 hover:text-white dark:bg-slate-800 text-gray-500 transition-all cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="inline-flex p-2 rounded-xl bg-red-50 hover:bg-red-650 hover:text-white dark:bg-slate-800 text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 w-full max-w-2xl rounded-3xl p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-650 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
              {modalType === 'add' ? 'Yangi Mahsulot Qo‘shish' : 'Mahsulotni Tahrirlash'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nomi *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-950 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Brend</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Masalan: Samsung"
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-855 rounded-xl bg-white dark:bg-slate-950 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tavsif</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-950 text-gray-900 dark:text-white text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Asosiy Narx *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-950 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Chegirma Narxi</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-950 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Zaxira Soni *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-950 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Kategoriya *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-950 text-gray-900 dark:text-white text-sm cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Rasm havolalari (vergul bilan)</label>
                  <input
                    type="text"
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-slate-850 rounded-xl bg-white dark:bg-slate-950 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
