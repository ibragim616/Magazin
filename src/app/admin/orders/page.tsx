'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClipboardList, Eye, X, AlertCircle, ShoppingBag, Truck, CheckCircle2, DollarSign } from 'lucide-react';

interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  product: {
    name: string;
    brand: string | null;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

function AdminOrdersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter tabs
  const [activeTab, setActiveTab] = useState('ALL');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Load orders
  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else {
          setError('Buyurtmalarni yuklashda xatolik yuz berdi');
        }
      } catch (err) {
        setError('Tarmoq xatoligi yuz berdi');
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  // Filter orders by tab
  useEffect(() => {
    if (activeTab === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === activeTab));
    }
  }, [orders, activeTab]);

  // Open order details modal if url has query parameter `order`
  useEffect(() => {
    const orderId = searchParams.get('order');
    if (orderId && orders.length > 0) {
      const found = orders.find((o) => o.id === orderId);
      if (found) {
        setSelectedOrder(found);
        setStatus(found.status);
        setPaymentStatus(found.paymentStatus);
      }
    }
  }, [searchParams, orders]);

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setPaymentStatus(order.paymentStatus);
    router.push(`/admin/orders?order=${order.id}`, { scroll: false });
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    router.push('/admin/orders', { scroll: false });
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state list
        setOrders((prev) =>
          prev.map((o) => (o.id === data.order.id ? data.order : o))
        );
        setSelectedOrder(data.order);
        alert('Buyurtma holati muvaffaqiyatli yangilandi!');
      } else {
        setError(data.error || 'Yangilashda xatolik yuz berdi');
      }
    } catch (err) {
      setError('Tarmoq xatoligi yuz berdi');
    } finally {
      setIsUpdating(false);
    }
  };

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

  const getPaymentStatusColor = (pStatus: string) => {
    switch (pStatus) {
      case 'PENDING':
        return 'bg-amber-55 text-amber-650 dark:bg-amber-950/20 dark:text-amber-450 border border-amber-200/50';
      case 'PAID':
        return 'bg-emerald-55 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-455 border border-emerald-200/50';
      case 'FAILED':
        return 'bg-rose-55 text-rose-650 dark:bg-rose-950/20 dark:text-rose-450 border border-rose-200/50';
      default:
        return 'bg-gray-50 text-gray-650';
    }
  };

  const tabs = [
    { key: 'ALL', label: 'Barchasi' },
    { key: 'PENDING', label: 'Kutilayotganlar' },
    { key: 'PROCESSING', label: 'Jarayondagilar' },
    { key: 'SHIPPED', label: 'Yuborilganlar' },
    { key: 'DELIVERED', label: 'Yetkazilganlar' },
    { key: 'CANCELLED', label: 'Bekor qilinganlar' },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Buyurtmalar Boshqaruvi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Mijozlar tomonidan joylashtirilgan buyurtmalarni boshqaring va ularning holatini o‘zgartiring
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-750 dark:text-red-350 p-4 rounded-2xl border border-red-200 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-slate-800 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-xl transition-all cursor-pointer -mb-px border-b-2 ${
              activeTab === tab.key
                ? 'border-indigo-650 text-indigo-650 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-semibold">
                <th className="pb-3 pl-4">ID</th>
                <th className="pb-3">Mijoz</th>
                <th className="pb-3">Sana</th>
                <th className="pb-3">Summa</th>
                <th className="pb-3">To‘lov</th>
                <th className="pb-3">Holat</th>
                <th className="pb-3 pr-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/20 transition-colors text-gray-700 dark:text-gray-300">
                    <td className="py-4 pl-4 font-mono font-bold">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 font-bold text-gray-900 dark:text-white">{order.customerName}</td>
                    <td className="py-4">{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</td>
                    <td className="py-4 font-bold">{formatPrice(order.totalAmount)}</td>
                    <td className="py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="inline-flex p-2 rounded-xl bg-gray-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 text-gray-500 transition-all cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Ushbu statusda hech qanday buyurtma mavjud emas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border-l border-gray-150 dark:border-slate-800 w-full max-w-lg h-full rounded-l-3xl p-8 space-y-6 shadow-2xl relative overflow-y-auto animate-in slide-in-from-right duration-200">
            <button
              onClick={closeOrderDetails}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-650 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="h-5.5 w-5.5 text-indigo-600" />
              Buyurtma #{selectedOrder.id.slice(-6).toUpperCase()}
            </h3>

            {/* Change Status Form */}
            <form onSubmit={handleUpdateOrder} className="bg-gray-50 dark:bg-slate-950 p-5 rounded-2xl border border-gray-100 dark:border-slate-800/40 space-y-4">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Holatni yangilash</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Buyurtma holati</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block w-full px-2 py-2 border border-gray-255 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">To‘lov holati</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="block w-full px-2 py-2 border border-gray-255 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-755 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isUpdating ? 'Saqlanmoqda...' : 'Holatni saqlash'}
              </button>
            </form>

            {/* Customer Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Mijoz ma‘lumotlari</h4>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p><span className="font-bold text-gray-900 dark:text-white">Ism:</span> {selectedOrder.customerName}</p>
                <p><span className="font-bold text-gray-900 dark:text-white">Telefon:</span> {selectedOrder.customerPhone}</p>
                <p><span className="font-bold text-gray-900 dark:text-white">Manzil:</span> {selectedOrder.customerAddress}</p>
                <p><span className="font-bold text-gray-900 dark:text-white">Sana:</span> {new Date(selectedOrder.createdAt).toLocaleString('uz-UZ')}</p>
                <p><span className="font-bold text-gray-900 dark:text-white">To‘lov usuli:</span> {selectedOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Xarid qilingan mahsulotlar</h4>
              <div className="divide-y divide-gray-50 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900/60 max-h-48 overflow-y-auto space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs gap-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.product.brand || 'UzMarket'} &bull; {formatPrice(item.price)} x {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-950 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex justify-between items-center font-black text-gray-950 dark:text-white text-lg">
              <span>Umumiy jami</span>
              <span>{formatPrice(selectedOrder.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <AdminOrdersPageContent />
    </Suspense>
  );
}
