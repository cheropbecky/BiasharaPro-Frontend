import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart, ArrowUpRight, ArrowDownRight, AlertTriangle,
  Package, DollarSign, Smartphone, Banknote, Plus, Eye, RotateCcw,
  TrendingUp, CheckCircle, RefreshCw, X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import useSidebar from '../hooks/useSidebar';
import { useNavigationSystem } from '../components/navigation/NavigationProvider';
import { getDashboardMetrics, getProducts, cancelSale, DB_CHANGE_EVENT } from '../db/sqlite';
import QuickSaleModal from '../components/pos/QuickSaleModal';
import ReceiptModal from '../components/pos/ReceiptModal';
import StockAdjustmentModal from '../components/inventory/StockAdjustmentModal';

export default function DashboardPage() {
  const { lang, t } = useLang();
  const { profile, navigate } = useNavigationSystem();
  const { collapsed } = useSidebar();

  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    todayCost: 0,
    todayExpenses: 0,
    todayGrossProfit: 0,
    salesCount: 0,
    totalItemsSold: 0,
    cashCollected: 0,
    mpesaCollected: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    recentSales: [],
    bestSellers: [],
    productsCount: 0,
  });

  const [products, setProducts] = useState([]);
  const [showPos, setShowPos] = useState(false);
  const [activeReceiptSale, setActiveReceiptSale] = useState(null);
  const [cancelModalSale, setCancelModalSale] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [restockProduct, setRestockProduct] = useState(null);

  const shopName = profile?.shopName || 'BiasharaPro Store';
  const ownerName = profile?.ownerName || 'Wanjiku';

  const loadData = async () => {
    try {
      const m = await getDashboardMetrics();
      const p = await getProducts();
      setMetrics(m);
      setProducts(p);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  useEffect(() => {
    loadData();
    const handler = () => loadData();
    window.addEventListener(DB_CHANGE_EVENT, handler);
    return () => window.removeEventListener(DB_CHANGE_EVENT, handler);
  }, []);

  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock').slice(0, 5);
  }, [products]);

  const handleConfirmCancelSale = async () => {
    if (!cancelModalSale) return;
    try {
      await cancelSale(cancelModalSale.id, cancelReason || 'Mteja amerudisha bidhaa');
      setCancelModalSale(null);
      setCancelReason('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] relative"
      style={{
        fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Sidebar />
      <TopBar />
      <BottomNav />

      <main className={`px-4 pb-24 pt-20 lg:px-8 ${collapsed ? 'lg:pl-20' : 'lg:pl-60'} lg:pb-12 transition-all duration-200 ease-in-out`}>
        <OfflineBanner />

        {/* Welcome Header */}
        <div className="mb-6 mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-[#006948]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {lang === 'en' ? 'Live Store Active' : 'Duka Liko Mkondoni'}
              </span>
              <span className="text-xs text-gray-500">• {new Date().toLocaleDateString(lang === 'en' ? 'en-KE' : 'sw-KE', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <h1 className="mt-1 text-2xl font-black text-[#171d19] lg:text-3xl">
              {lang === 'en' ? `Habari, ${ownerName} 👋` : `Habari ya leo, ${ownerName} 👋`}
            </h1>
            <p className="text-xs sm:text-sm text-[#3d4a42]">
              {shopName} — {lang === 'en' ? 'Here is your daily business overview' : 'Muhtasari wa mauzo, gharama na faida yako'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPos(true)}
              className="flex items-center gap-2 rounded-2xl bg-[#006948] px-4 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg hover:bg-[#00553a] active:scale-98 transition"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{lang === 'en' ? '+ New Sale (POS)' : '+ Rekodi Mauzo'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('expenses')}
              className="flex items-center gap-1.5 rounded-2xl border border-[#bccac0] bg-white px-3.5 py-3 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-98 transition"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === 'en' ? '+ Expense' : '+ Gharama'}</span>
            </button>
          </div>
        </div>

        {/* 4 Key Stat Metric Cards */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Today's Sales */}
          <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {lang === 'en' ? "Today's Sales" : 'Mauzo ya Leo'}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-[#006948]">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-[#006948]">
              KSh {metrics.todayRevenue.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2">
              <span>{metrics.salesCount} {lang === 'en' ? 'sales' : 'mialiko'}</span>
              <span>{metrics.totalItemsSold} {lang === 'en' ? 'items sold' : 'bidhaa ziliuzwa'}</span>
            </div>
          </div>

          {/* Today's Expenses */}
          <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {lang === 'en' ? "Today's Expenses" : 'Gharama za Leo'}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <ArrowDownRight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-red-600">
              KSh {metrics.todayExpenses.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-gray-500 border-t border-gray-100 pt-2">
              Kutoka kwa shughuli za duka
            </div>
          </div>

          {/* Net Profit */}
          <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {lang === 'en' ? 'Estimated Profit' : 'Makadirio ya Faida'}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className={`mt-3 text-2xl font-black ${metrics.todayGrossProfit >= 0 ? 'text-[#171d19]' : 'text-red-600'}`}>
              KSh {metrics.todayGrossProfit.toLocaleString()}
            </div>
            <div className="mt-2 text-[11px] text-gray-400 border-t border-gray-100 pt-2">
              Mauzo - Bei ya Kununua - Gharama
            </div>
          </div>

          {/* Low Stock Warning */}
          <div className={`rounded-3xl border p-5 shadow-sm ${metrics.lowStockCount + metrics.outOfStockCount > 0 ? 'border-amber-300 bg-amber-50/40' : 'border-[#bccac0]/40 bg-white'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {lang === 'en' ? 'Stock Alerts' : 'Tahadhari ya Stoki'}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-amber-700">
              {metrics.lowStockCount + metrics.outOfStockCount} <span className="text-xs font-semibold text-gray-500">bidhaa</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 border-t border-amber-200/50 pt-2">
              <span className="text-red-600 font-bold">{metrics.outOfStockCount} zimekwisha</span>
              <span className="text-amber-700 font-bold">{metrics.lowStockCount} ziko chini</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Collection Split */}
        <div className="mb-6 rounded-3xl border border-[#bccac0]/40 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            {lang === 'en' ? 'Today’s Collections By Payment Method' : 'Mgawanyiko wa Malipo ya Leo'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-[#006948]/5 p-3.5 border border-[#006948]/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006948] text-white">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Lipa na M-Pesa</span>
                  <span className="text-lg font-black text-[#006948]">KSh {metrics.mpesaCollected.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400">
                {metrics.todayRevenue > 0 ? Math.round((metrics.mpesaCollected / metrics.todayRevenue) * 100) : 0}%
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3.5 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-700 text-white">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Pesa Taslimu (Cash)</span>
                  <span className="text-lg font-black text-[#171d19]">KSh {metrics.cashCollected.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400">
                {metrics.todayRevenue > 0 ? Math.round((metrics.cashCollected / metrics.todayRevenue) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Recent Sales & Stock Alerts */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Recent Sales Table (8 cols) */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#171d19]">
                  {lang === 'en' ? 'Today’s Recorded Sales' : 'Mauzo ya Hivi Karibuni'}
                </h2>
                <p className="text-xs text-gray-500">
                  {lang === 'en' ? 'View receipts and manage sale cancellations' : 'Tazama risiti na udhibiti kufutwa kwa mauzo'}
                </p>
              </div>

              <button
                onClick={() => setShowPos(true)}
                className="text-xs font-bold text-[#006948] hover:underline"
              >
                {lang === 'en' ? '+ New Sale' : '+ Rekodi Mauzo'}
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#bccac0]/40 bg-white shadow-sm">
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs text-[#171d19]">
                  <thead className="border-b border-[#e5e7eb] bg-[#f9fafb] text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Risiti</th>
                      <th className="px-3 py-3">Saa / Tarehe</th>
                      <th className="px-3 py-3">Bidhaa</th>
                      <th className="px-3 py-3">Malipo</th>
                      <th className="px-4 py-3 text-right">Jumla</th>
                      <th className="px-3 py-3 text-center">Hali</th>
                      <th className="px-4 py-3 text-right">Kitendo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f4f6]">
                    {metrics.recentSales.map(sale => {
                      const isCancelled = sale.status === 'CANCELLED';
                      return (
                        <tr key={sale.id} className={`hover:bg-gray-50 transition ${isCancelled ? 'opacity-50 bg-gray-50/50' : ''}`}>
                          <td className="px-4 py-3.5 font-bold font-mono text-gray-800">
                            {sale.receipt_number}
                          </td>
                          <td className="px-3 py-3.5 text-gray-500">
                            {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-3 py-3.5">
                            <span className="font-semibold text-[#171d19]">
                              {(sale.items || []).map(i => `${i.product_name} (${i.qty})`).join(', ') || 'Bidhaa'}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${sale.payment_method === 'M-Pesa' ? 'bg-emerald-50 text-[#006948]' : 'bg-gray-100 text-gray-700'}`}>
                              {sale.payment_method}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right font-black text-[#006948] text-sm">
                            KSh {Number(sale.total_amount || 0).toLocaleString()}
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                              {isCancelled ? 'Limefutwa' : 'Imelipwa'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                title="Angalia Risiti"
                                onClick={() => setActiveReceiptSale({
                                  receiptNumber: sale.receipt_number,
                                  totalAmount: sale.total_amount,
                                  payment_method: sale.payment_method,
                                  mpesa_reference: sale.mpesa_reference,
                                  items: sale.items || [],
                                })}
                                className="rounded-lg p-1.5 text-gray-500 hover:bg-emerald-50 hover:text-[#006948]"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {!isCancelled && (
                                <button
                                  type="button"
                                  title="Ghairi Mauzo"
                                  onClick={() => setCancelModalSale(sale)}
                                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Sales List */}
              <div className="divide-y divide-[#f3f4f6] sm:hidden">
                {metrics.recentSales.map(sale => {
                  const isCancelled = sale.status === 'CANCELLED';
                  return (
                    <div key={sale.id} className="p-3.5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold">{sale.receipt_number}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                            {isCancelled ? 'Limefutwa' : 'Imelipwa'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1 font-medium">
                          {(sale.items || []).map(i => `${i.product_name} x${i.qty}`).join(', ')}
                        </p>
                        <span className="text-[10px] text-gray-400">{sale.payment_method} • {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-[#006948]">
                          KSh {Number(sale.total_amount || 0).toLocaleString()}
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <button
                            onClick={() => setActiveReceiptSale({
                              receiptNumber: sale.receipt_number,
                              totalAmount: sale.total_amount,
                              payment_method: sale.payment_method,
                              mpesa_reference: sale.mpesa_reference,
                              items: sale.items || [],
                            })}
                            className="text-[11px] text-[#006948] font-bold"
                          >
                            Risiti
                          </button>
                          {!isCancelled && (
                            <button
                              onClick={() => setCancelModalSale(sale)}
                              className="text-[11px] text-red-500 font-bold ml-2"
                            >
                              Ghairi
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {metrics.recentSales.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-xs">
                  Hakuna mauzo yaliyorekodiwa leo.
                  <button
                    onClick={() => setShowPos(true)}
                    className="block mx-auto mt-2 text-[#006948] font-bold hover:underline"
                  >
                    Rekodi mauzo ya kwanza
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Low Stock Alerts & Best Sellers (4 cols) */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Low Stock Watchlist */}
            <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-extrabold text-[#171d19]">
                  {lang === 'en' ? 'Stock Replenishment' : 'Stoki Inayohitaji Mzigo'}
                </h3>
                <button
                  onClick={() => navigate('inventory')}
                  className="text-xs font-bold text-[#006948] hover:underline"
                >
                  Zote →
                </button>
              </div>

              <div className="space-y-2.5">
                {lowStockProducts.map(prod => (
                  <div key={prod.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-2.5 text-xs">
                    <div>
                      <span className="font-bold text-[#171d19] block">{prod.name}</span>
                      <span className="text-[10px] text-gray-500">
                        Zilizobaki: <strong className={prod.stock === 0 ? 'text-red-600' : 'text-amber-600'}>{prod.stock} {prod.unit || 'pcs'}</strong> (Chini: {prod.min_stock})
                      </span>
                    </div>
                    <button
                      onClick={() => setRestockProduct(prod)}
                      className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-[#006948] hover:bg-emerald-100 transition"
                    >
                      + Mzigo
                    </button>
                  </div>
                ))}

                {lowStockProducts.length === 0 && (
                  <div className="py-6 text-center text-gray-400 text-xs">
                    <CheckCircle className="mx-auto h-6 w-6 text-emerald-500 mb-1" />
                    Bidhaa zote ziko sawa! Hakuna stoki ya chini.
                  </div>
                )}
              </div>
            </div>

            {/* Best Selling Products */}
            <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#171d19] mb-3">
                {lang === 'en' ? 'Best Selling Products' : 'Bidhaa Zinazouzika Zaidi'}
              </h3>
              <div className="space-y-2.5">
                {metrics.bestSellers.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-[#006948]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-[#171d19]">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#006948]">KSh {item.revenue.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 block">{item.qty} pcs</span>
                    </div>
                  </div>
                ))}

                {metrics.bestSellers.length === 0 && (
                  <div className="py-4 text-center text-gray-400 text-xs">
                    Bado hakuna data ya kutosha.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* POS Modal */}
      <QuickSaleModal
        open={showPos}
        onClose={() => setShowPos(false)}
      />

      {/* Printable / WhatsApp Receipt Modal */}
      {activeReceiptSale && (
        <ReceiptModal
          open={!!activeReceiptSale}
          sale={activeReceiptSale}
          onClose={() => setActiveReceiptSale(null)}
          onNewSale={() => {
            setActiveReceiptSale(null);
            setShowPos(true);
          }}
        />
      )}

      {/* Stock Adjustment Modal (Triggered by + Mzigo) */}
      {restockProduct && (
        <StockAdjustmentModal
          open={!!restockProduct}
          product={restockProduct}
          onClose={() => setRestockProduct(null)}
          onSuccess={loadData}
        />
      )}

      {/* Cancel Sale Confirmation Modal */}
      {cancelModalSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                <span>Ghairi / Futa Mauzo</span>
              </h3>
              <button onClick={() => setCancelModalSale(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Unakaribia kufuta mauzo ya <strong>{cancelModalSale.receipt_number}</strong> ya thamani ya <strong>KSh {cancelModalSale.total_amount}</strong>.
              Stoki ya bidhaa zote itarudishwa kiotomatiki.
            </p>

            <div className="mt-3">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">
                Sababu ya Kughairi *
              </label>
              <input
                type="text"
                placeholder="mfano: Mteja amerudisha mzigo, makosa ya bei..."
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-xs focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setCancelModalSale(null)}
                className="flex-1 rounded-xl border border-gray-300 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Ghairi
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelSale}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                Thibitisha Kufuta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
