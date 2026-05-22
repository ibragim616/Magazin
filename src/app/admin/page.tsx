import React from 'react';
import db from '@/lib/db';
import { DollarSign, ShoppingCart, Users, Package, Eye, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const totalOrders = await db.order.count();
  const totalProducts = await db.product.count();
  const totalUsers = await db.user.count({ where: { role: 'USER' } });

  const activeOrders = await db.order.findMany({
    where: { status: { not: 'CANCELLED' } },
  });

  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + " so'm";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400';
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400';
      case 'SHIPPED':
        return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400';
      default:
        return 'bg-gray-50 text-gray-600 dark:bg-slate-900 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Daxbord Statistikalari
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Savdo tizimi va foydalanuvchilarning umumiy ko‘rsatkichlari
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Revenue */}
        <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Umumiy Tushum</span>
            <h3 className="text-lg font-black text-gray-950 dark:text-white mt-1">
              {formatPrice(totalRevenue)}
            </h3>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Buyurtmalar soni</span>
            <h3 className="text-lg font-black text-gray-950 dark:text-white mt-1">
              {totalOrders} ta
            </h3>
          </div>
        </div>

        {/* Card 3: Products */}
        <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mahsulotlar soni</span>
            <h3 className="text-lg font-black text-gray-950 dark:text-white mt-1">
              {totalProducts} ta
            </h3>
          </div>
        </div>

        {/* Card 4: Users */}
        <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mijozlar soni</span>
            <h3 className="text-lg font-black text-gray-950 dark:text-white mt-1">
              {totalUsers} ta
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-600" />
            Oxirgi Buyurtmalar
          </h3>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-500"
          >
            Barchasini ko‘rish
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-semibold">
                <th className="pb-3 pl-4">ID</th>
                <th className="pb-3">Mijoz</th>
                <th className="pb-3">Sana</th>
                <th className="pb-3">Summa</th>
                <th className="pb-3">Holat</th>
                <th className="pb-3 pr-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/20 transition-colors text-gray-700 dark:text-gray-300">
                    <td className="py-4 pl-4 font-mono font-bold">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 font-bold text-gray-900 dark:text-white">{order.customerName}</td>
                    <td className="py-4">{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</td>
                    <td className="py-4 font-bold">{formatPrice(order.totalAmount)}</td>
                    <td className="py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <Link
                        href={`/admin/orders?order=${order.id}`}
                        className="inline-flex p-1.5 rounded-lg bg-gray-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 transition-all text-gray-500"
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Hozircha hech qanday buyurtma berilmagan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
