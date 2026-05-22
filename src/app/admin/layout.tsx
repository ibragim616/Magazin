import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, ClipboardList, Shield, Home } from 'lucide-react';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // Secure Server-side check
  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 border-r border-slate-800 flex flex-col">
        {/* Profile Info */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">Admin Panel</h4>
            <span className="text-xs text-indigo-400 font-medium">Boshqaruvchi</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl hover:bg-slate-800 hover:text-white transition-all text-slate-400"
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            Statistika
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl hover:bg-slate-800 hover:text-white transition-all text-slate-400"
          >
            <ShoppingBag className="h-5 w-5 shrink-0" />
            Mahsulotlar
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl hover:bg-slate-800 hover:text-white transition-all text-slate-400"
          >
            <ClipboardList className="h-5 w-5 shrink-0" />
            Buyurtmalar
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl hover:bg-slate-800 hover:text-white transition-all text-slate-400"
          >
            <Home className="h-5 w-5 shrink-0" />
            Asosiy sayt
          </Link>
        </nav>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 bg-gray-50 dark:bg-slate-950 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
