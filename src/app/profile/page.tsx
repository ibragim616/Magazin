import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import db from '@/lib/db';
import Link from 'next/link';
import { User, Phone, MapPin, Mail, ClipboardList, ChevronRight, ShoppingBag } from 'lucide-react';

export const revalidate = 0;

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user orders history
  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true },
      },
    },
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
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-455';
      default:
        return 'bg-gray-50 text-gray-655';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-indigo-600">Bosh sahifa</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-300 font-medium">Foydalanuvchi profili</span>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Mening Profilim</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Shaxsiy ma‘lumotlaringiz va buyurtmalar tarixi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Shaxsiy Ma'lumotlar Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="flex items-center gap-4 border-b border-gray-50 dark:border-slate-850 pb-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base">{user.name}</h3>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">{user.role}</span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <Mail className="h-4.5 w-4.5 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">E-pochta</p>
                <p className="font-medium mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4.5 w-4.5 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Telefon raqam</p>
                <p className="font-medium mt-0.5">{user.phone || 'Kiritilmagan'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4.5 w-4.5 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Yetkazib berish manzili</p>
                <p className="font-medium mt-0.5">{user.address || 'Kiritilmagan'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Buyurtmalar Tarixi */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="h-5.5 w-5.5 text-indigo-600" />
            Buyurtmalar tarixi ({orders.length})
          </h2>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-50 dark:border-slate-850 pb-3 text-xs">
                    <div>
                      <span className="text-gray-400">Buyurtma:</span>{' '}
                      <span className="font-bold text-gray-900 dark:text-white font-mono">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      Sana: <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(order.createdAt).toLocaleString('uz-UZ')}</span>
                    </div>
                    <div>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-indigo-600/35 shrink-0" />
                          <span className="font-medium text-gray-950 dark:text-white">{item.product.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                        <span className="font-bold text-gray-950 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-50 dark:border-slate-850 pt-3 flex justify-between items-center font-extrabold text-sm text-gray-950 dark:text-white">
                    <span>Umumiy summa:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-3xl text-gray-400 space-y-3">
              <ClipboardList className="h-10 w-10 text-gray-300" />
              <p className="text-sm font-medium">Sizda hali buyurtmalar mavjud emas.</p>
              <Link
                href="/products"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-500"
              >
                Xaridlarni boshlash
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
