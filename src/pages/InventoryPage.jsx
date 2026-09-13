import React, { useMemo, useState, useEffect } from 'react';
import {
  Search, Plus, ArrowUpDown, History, Edit2, Trash2,
  AlertTriangle, CheckCircle2, TrendingUp, Package, X, ShoppingCart, Tag
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import useSidebar from '../hooks/useSidebar';
import {
  getProducts, addProduct, updateProduct, deleteProduct,
  getStockAdjustments, DB_CHANGE_EVENT
} from '../db/sqlite';
import StockAdjustmentModal from '../components/inventory/StockAdjustmentModal';
import QuickSaleModal from '../components/pos/QuickSaleModal';

const inputClass =
  'h-11 w-full rounded-xl border border-[#bccac0] bg-white px-4 text-[14px] text-[#171d19] placeholder:text-[#6b7280] focus:outline-none focus:border-[#006948]';

export default function InventoryPage() {
  const { t, lang } = useLang();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showPosModal, setShowPosModal] = useState(false);
  const [selectedProductForAdjustment, setSelectedProductForAdjustment] = useState(null);
  const [selectedProductForHistory, setSelectedProductForHistory] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Chakula',
    unit: 'pcs',
    buy: '',
    sell: '',
    initial: '',
    min: '5',
    barcode: '',
  });

  const { collapsed } = useSidebar();

  const loadData = async () => {
    try {
      const items = await getProducts();
      setProducts(items);
    } catch (e) {
      console.error('Error loading products', e);
    }
  };

  useEffect(() => {
    loadData();
    const handleDbChange = () => loadData();
    window.addEventListener(DB_CHANGE_EVENT, handleDbChange);
    return () => window.removeEventListener(DB_CHANGE_EVENT, handleDbChange);
  }, []);

  const filtered = useMemo(() => {
    return products.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        (item.barcode && item.barcode.includes(search.trim()));
      const matchesCategory = category === 'all' || item.category === category;
      const matchesStatus = status === 'all' || item.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  // Inventory Valuation
  const valuation = useMemo(() => {
    const totalCost = products.reduce((acc, p) => acc + (Number(p.buy) * Number(p.stock)), 0);
    const totalPotential = products.reduce((acc, p) => acc + (Number(p.sell) * Number(p.stock)), 0);
    return {
      cost: totalCost,
      potential: totalPotential,
      margin: totalPotential - totalCost,
    };
  }, [products]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return ['all', ...list];
  }, [products]);

  // Margin calculation for Add/Edit Modal
  const modalMargin = useMemo(() => {
    const buy = Number(formData.buy) || 0;
    const sell = Number(formData.sell) || 0;
    const profit = sell - buy;
    const percent = buy > 0 ? ((profit / buy) * 100).toFixed(1) : '0.0';
    return { profit, percent, isLoss: sell > 0 && profit <= 0 };
  }, [formData.buy, formData.sell]);

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit || 'pcs',
      buy: item.buy.toString(),
      sell: item.sell.toString(),
      initial: item.stock.toString(),
      min: (item.min_stock ?? item.min ?? 5).toString(),
      barcode: item.barcode || '',
    });
    setShowProductModal(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Chakula',
      unit: 'pcs',
      buy: '',
      sell: '',
      initial: '',
      min: '5',
      barcode: '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      unit: formData.unit,
      buy: Number(formData.buy) || 0,
      sell: Number(formData.sell) || 0,
      initial: Number(formData.initial) || 0,
      min: Number(formData.min) || 5,
      barcode: formData.barcode.trim(),
    };

    if (editingId) {
      await updateProduct(editingId, {
        name: payload.name,
        category: payload.category,
        unit: payload.unit,
        buy: payload.buy,
        sell: payload.sell,
        stock: payload.initial,
        min: payload.min,
        barcode: payload.barcode,
      });
    } else {
      await addProduct(payload);
    }

    setShowProductModal(false);
    loadData();
  };

  const handleViewHistory = async (product) => {
    setSelectedProductForHistory(product);
    try {
      const items = await getStockAdjustments(product.id);
      setHistoryItems(items);
    } catch {
      setHistoryItems([]);
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

        {/* Header with Title and Quick Buttons */}
        <div className="mb-6 mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#171d19] lg:text-3xl">
              {lang === 'en' ? 'Inventory Management' : 'Usimamizi wa Stoki'}
            </h1>
            <p className="mt-1 text-sm text-[#3d4a42]">
              {lang === 'en'
                ? 'Track stock levels, record restocks, and monitor profits'
                : 'Fuatilia idadi ya bidhaa, ongeza mizigo mipya, na thibiti faida'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowPosModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#006948] hover:bg-emerald-200 transition"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{lang === 'en' ? 'Quick Sale' : '+ Rekodi Mauzo'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 rounded-xl bg-[#006948] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow hover:bg-[#00553a] active:scale-98 transition"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === 'en' ? 'Add Product' : 'Ongeza Bidhaa'}</span>
            </button>
          </div>
        </div>

        {/* Stock KPI Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">{lang === 'en' ? 'Total Items' : 'Jumla ya Bidhaa'}</span>
              <Package className="h-4 w-4 text-[#006948]" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#171d19]">{products.length}</div>
            <div className="text-[11px] text-gray-400">Bidhaa zilizosajiliwa</div>
          </div>

          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">{lang === 'en' ? 'In Stock' : 'Stoki Sawa'}</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#16a34a]">
              {products.filter(p => p.status === 'in-stock').length}
            </div>
            <div className="text-[11px] text-gray-400">Zinatosha kuuzwa</div>
          </div>

          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">{lang === 'en' ? 'Low Stock' : 'Stoki Chini'}</span>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-600">
              {products.filter(p => p.status === 'low-stock').length}
            </div>
            <div className="text-[11px] text-gray-400">Zinaelekea kuisha</div>
          </div>

          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">{lang === 'en' ? 'Out of Stock' : 'Zimekwisha'}</span>
              <span className="h-2 w-2 rounded-full bg-red-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-red-600">
              {products.filter(p => p.status === 'out-of-stock').length}
            </div>
            <div className="text-[11px] text-gray-400">Hazipatikani dukan</div>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-2xl border border-[#bccac0]/40 bg-emerald-50/60 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#006948]">Thamani ya Stoki</span>
              <TrendingUp className="h-4 w-4 text-[#006948]" />
            </div>
            <div className="mt-2 text-xl font-black text-[#006948]">
              KSh {valuation.cost.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#006948]/80 font-medium">
              Ukiuza yote: KSh {valuation.potential.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-64 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
              placeholder={lang === 'en' ? 'Search by name or barcode...' : 'Tafuta jina au barcode...'}
            />
          </div>

          <div className="w-full sm:w-44">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={`${inputClass} appearance-none pr-8 font-semibold text-xs`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? (lang === 'en' ? 'All Categories' : 'Jamii Zote') : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-44">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className={`${inputClass} appearance-none pr-8 font-semibold text-xs`}
            >
              <option value="all">{lang === 'en' ? 'All Stock Status' : 'Hali Zote za Stoki'}</option>
              <option value="in-stock">{lang === 'en' ? 'In Stock (Sawa)' : 'Sawa (In Stock)'}</option>
              <option value="low-stock">{lang === 'en' ? 'Low Stock (Chini)' : 'Chini (Low Stock)'}</option>
              <option value="out-of-stock">{lang === 'en' ? 'Out of Stock (Zimekwisha)' : 'Zimekwisha (Out of Stock)'}</option>
            </select>
          </div>
        </div>

        {/* Products Table (Desktop) */}
        <div className="overflow-hidden rounded-2xl border border-[#bccac0]/40 bg-white shadow-sm">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-[#171d19]">
              <thead className="border-b border-[#e5e7eb] bg-[#f9fafb] text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3.5">Bidhaa / Product</th>
                  <th className="px-4 py-3.5">Jamii</th>
                  <th className="px-4 py-3.5 text-right">Bei ya Kununua</th>
                  <th className="px-4 py-3.5 text-right">Bei ya Kuuza</th>
                  <th className="px-4 py-3.5 text-right">Faida / Unit</th>
                  <th className="px-4 py-3.5 text-center">Stoki</th>
                  <th className="px-4 py-3.5 text-center">Hali</th>
                  <th className="px-6 py-3.5 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {filtered.map(item => {
                  const profit = item.sell - item.buy;
                  const percent = item.buy > 0 ? ((profit / item.buy) * 100).toFixed(0) : '0';
                  const isOutOfStock = item.status === 'out-of-stock';
                  const isLowStock = item.status === 'low-stock';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-[#171d19]">{item.name}</div>
                        {item.barcode && (
                          <div className="text-[10px] text-gray-400 font-mono">Barcode: {item.barcode}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-gray-600">
                        <span className="rounded-md bg-gray-100 px-2 py-0.5">{item.category}</span>
                      </td>
                      <td className="px-4 py-4 text-right text-xs font-semibold text-gray-600">
                        KSh {item.buy.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-extrabold text-[#006948]">
                        KSh {item.sell.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-xs">
                        <span className={`font-bold ${profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          +KSh {profit.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400 block">({percent}%)</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-base font-black text-[#171d19]">
                          {item.stock}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-1">{item.unit || 'pcs'}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            isOutOfStock
                              ? 'bg-red-100 text-red-700'
                              : isLowStock
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          {isOutOfStock
                            ? (lang === 'en' ? 'Out of stock' : 'Imekwisha')
                            : isLowStock
                            ? (lang === 'en' ? 'Low stock' : 'Chini')
                            : (lang === 'en' ? 'In stock' : 'Sawa')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title={lang === 'en' ? 'Adjust Stock' : 'Rekebisha Stoki'}
                            onClick={() => {
                              setSelectedProductForAdjustment(item);
                              setShowAdjustmentModal(true);
                            }}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-emerald-50 hover:text-[#006948]"
                          >
                            <ArrowUpDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title={lang === 'en' ? 'Stock History' : 'Historia ya Stoki'}
                            onClick={() => handleViewHistory(item)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                          >
                            <History className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title={lang === 'en' ? 'Edit Product' : 'Hariri'}
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title={lang === 'en' ? 'Delete' : 'Futa'}
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Product Cards */}
          <div className="divide-y divide-[#f3f4f6] md:hidden">
            {filtered.map(item => {
              const profit = item.sell - item.buy;
              const isOutOfStock = item.status === 'out-of-stock';
              const isLowStock = item.status === 'low-stock';

              return (
                <div key={item.id} className="p-4 bg-white space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#171d19]">{item.name}</h3>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{item.category} • {item.unit || 'pcs'}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isOutOfStock
                          ? 'bg-red-100 text-red-700'
                          : isLowStock
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isOutOfStock
                        ? 'Imekwisha'
                        : isLowStock
                        ? `Chini (${item.stock})`
                        : `Sawa (${item.stock})`}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs text-gray-400">Bei ya Kuuza: </span>
                      <span className="text-base font-black text-[#006948]">KSh {item.sell.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Faida: <span className="font-bold text-emerald-700">+KSh {profit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f3f4f6]">
                    <div className="text-xs font-semibold text-gray-600">
                      Kiwango cha chini: {item.min_stock || item.min}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductForAdjustment(item);
                          setShowAdjustmentModal(true);
                        }}
                        className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-[#006948]"
                      >
                        ± Stoki
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-700"
                      >
                        Hariri
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <Package className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-600">Hakuna bidhaa inayolingana</p>
              <p className="text-xs mt-1">Badilisha vichujio au ongeza bidhaa mpya kwa kubofya kitufe cha juu.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#bccac0]/40 px-6 py-4">
              <h2 className="text-lg font-bold text-[#171d19]">
                {editingId ? (lang === 'en' ? 'Edit Product' : 'Hariri Bidhaa') : (lang === 'en' ? 'Add New Product' : 'Ongeza Bidhaa Mpya')}
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Jina la Bidhaa / Product Name *
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                  placeholder="mfano: Unga Pembe 2kg, Sukari Mara 1kg..."
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Jamii / Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="Chakula">Chakula (Food)</option>
                    <option value="Vinywaji">Vinywaji (Drinks)</option>
                    <option value="Usafi">Usafi (Cleaning/Detergent)</option>
                    <option value="Nafaka">Nafaka (Cereals)</option>
                    <option value="Vifaa">Vifaa (Hardware)</option>
                    <option value="Nyingine">Nyingine (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Kipimo / Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="pcs">Pieces (Pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="litres">Litres (L)</option>
                    <option value="pkts">Packets (Pkts)</option>
                    <option value="boxes">Boxes (Katoni)</option>
                  </select>
                </div>
              </div>

              {/* Buy Price & Sell Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Bei ya Kununua (Buy) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.buy}
                    onChange={e => setFormData(p => ({ ...p, buy: e.target.value }))}
                    className={inputClass}
                    placeholder="KSh 0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Bei ya Kuuza (Sell) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.sell}
                    onChange={e => setFormData(p => ({ ...p, sell: e.target.value }))}
                    className={inputClass}
                    placeholder="KSh 0"
                  />
                </div>
              </div>

              {/* Profit Margin Preview Callout */}
              <div className={`rounded-2xl p-3.5 border ${modalMargin.isLoss ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-[#006948]'}`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Makadirio ya Faida (Profit Margin):</span>
                  <span>{modalMargin.percent}%</span>
                </div>
                <div className="mt-1 text-sm font-black">
                  KSh {modalMargin.profit.toLocaleString()} kwa kila {formData.unit}
                </div>
                {modalMargin.isLoss && (
                  <p className="mt-1 text-[11px] text-red-600 font-semibold">
                    ⚠️ Onyo: Bei ya kuuza ni chini au sawa na bei ya kununua!
                  </p>
                )}
              </div>

              {/* Stock Quantity & Min Stock Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {editingId ? 'Stoki ya Sasa (Stock)' : 'Stoki ya Awali (Initial)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.initial}
                    onChange={e => setFormData(p => ({ ...p, initial: e.target.value }))}
                    className={inputClass}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Kiwango cha Chini (Alert)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.min}
                    onChange={e => setFormData(p => ({ ...p, min: e.target.value }))}
                    className={inputClass}
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Optional Barcode */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Nambari ya Barcode (Hiari)
                </label>
                <input
                  value={formData.barcode}
                  onChange={e => setFormData(p => ({ ...p, barcode: e.target.value }))}
                  className={inputClass}
                  placeholder="Scan au andika nambari ya barcode..."
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 rounded-xl border border-[#bccac0] py-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  {lang === 'en' ? 'Cancel' : 'Ghairi'}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#006948] py-3 text-xs font-bold text-white shadow hover:bg-[#00553a] active:scale-98 transition"
                >
                  {editingId ? (lang === 'en' ? 'Save Changes' : 'Hifadhi Mabadiliko') : (lang === 'en' ? 'Add Product' : 'Hifadhi Bidhaa')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && selectedProductForAdjustment && (
        <StockAdjustmentModal
          open={showAdjustmentModal}
          product={selectedProductForAdjustment}
          onClose={() => {
            setShowAdjustmentModal(false);
            setSelectedProductForAdjustment(null);
          }}
          onSuccess={loadData}
        />
      )}

      {/* Quick Sale POS Modal */}
      <QuickSaleModal
        open={showPosModal}
        onClose={() => setShowPosModal(false)}
      />

      {/* Stock History Viewer Modal */}
      {selectedProductForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#bccac0]/40 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-[#171d19]">
                  {lang === 'en' ? 'Stock Movement History' : 'Historia ya Stoki'}
                </h2>
                <p className="text-xs text-gray-500">{selectedProductForHistory.name}</p>
              </div>
              <button
                onClick={() => setSelectedProductForHistory(null)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto space-y-3">
              {historyItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-xs">
                  <div>
                    <span className="font-bold text-[#171d19]">{item.adjustment_type}</span>
                    <span className="text-gray-500 block text-[11px] mt-0.5">{item.reason || 'Marekebisho'}</span>
                    <span className="text-gray-400 text-[10px]">{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-extrabold text-sm ${item.quantity_changed >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {item.quantity_changed >= 0 ? `+${item.quantity_changed}` : item.quantity_changed}
                    </span>
                    <div className="text-[10px] text-gray-500">
                      {item.previous_quantity} → {item.new_quantity}
                    </div>
                  </div>
                </div>
              ))}

              {historyItems.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-xs">
                  Hakuna historia ya marekebisho kwa sasa.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#171d19]">
              {lang === 'en' ? 'Archive Product?' : 'Je, una uhakika unataka kufuta bidhaa hii?'}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {lang === 'en'
                ? 'The product will be archived and will not appear in the active sales counter.'
                : 'Bidhaa hii itahifadhiwa kwenye kumbukumbu na haitaonekana tena kwenye kaunta ya mauzo.'}
            </p>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded-xl border border-gray-300 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                {lang === 'en' ? 'Cancel' : 'Ghairi'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                  loadData();
                }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                {lang === 'en' ? 'Yes, Archive' : 'Ndio, Futa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
