import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, X, AlertCircle, CheckCircle, Smartphone, Banknote, CreditCard, ChevronRight, Package, ArrowLeft } from 'lucide-react';
import { getProducts, createSale } from '../../db/sqlite';
import useLang from '../../hooks/useLang';
import ReceiptModal from './ReceiptModal';

export default function QuickSaleModal({ open, onClose }) {
  const { lang } = useLang();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
  const [cashTendered, setCashTendered] = useState('');
  const [mpesaRef, setMpesaRef] = useState('');
  const [customerName, setCustomerName] = useState('Mteja');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedSale, setCompletedSale] = useState(null);
  const [mobileView, setMobileView] = useState('products'); // 'products' | 'cart'

  useEffect(() => {
    if (open) {
      loadProducts();
      setCart([]);
      setError('');
      setCashTendered('');
      setMpesaRef('');
      setCompletedSale(null);
      setMobileView('products');
    }
  }, [open]);

  async function loadProducts() {
    try {
      const items = await getProducts({ includeArchived: false });
      setProducts(items);
    } catch (err) {
      console.error('Failed to load products for POS', err);
    }
  }

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        (p.barcode && p.barcode.includes(search.trim()));
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, search, selectedCategory]);

  const addToCart = (product) => {
    if (product.stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          setError(`Stoki iliyobaki ya ${product.name} ni ${product.stock}`);
          return prev;
        }
        setError('');
        return prev.map(item =>
          item.product_id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        setError('');
        return [
          ...prev,
          {
            product_id: product.id,
            product_name: product.name,
            unit_price: product.sell,
            unit_cost: product.buy,
            qty: 1,
            max_stock: product.stock,
            unit: product.unit || 'pcs'
          }
        ];
      }
    });
  };

  const updateQty = (productId, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product_id === productId) {
            const nextQty = item.qty + delta;
            if (nextQty > item.max_stock) {
              setError(`Stoki ya juu ni ${item.max_stock}`);
              return item;
            }
            setError('');
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.unit_price * item.qty), 0);
  }, [cart]);

  const changeDue = useMemo(() => {
    if (paymentMethod !== 'Cash' || !cashTendered) return 0;
    const tendered = Number(cashTendered);
    return tendered > cartTotal ? tendered - cartTotal : 0;
  }, [paymentMethod, cashTendered, cartTotal]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError(lang === 'en' ? 'Cart is empty. Please add items.' : 'Tafadhali chagua angalau bidhaa moja.');
      return;
    }

    if (paymentMethod === 'Cash' && cashTendered && Number(cashTendered) < cartTotal) {
      setError(lang === 'en' ? 'Cash received is less than total amount.' : 'Pesa zilizotolewa hazitoshi kulipia jumla.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const saleResult = await createSale({
        items: cart,
        payment_method: paymentMethod,
        mpesa_reference: mpesaRef || (paymentMethod === 'M-Pesa' ? `QKH${Math.floor(100000 + Math.random() * 900000)}` : ''),
        customer_name: customerName,
        cashier_name: 'Wanjiku',
      });

      setCompletedSale({
        ...saleResult,
        payment_method: paymentMethod,
        mpesa_reference: mpesaRef || saleResult.mpesa_reference,
        changeGiven: changeDue,
      });

      // Reload products to refresh live stock
      await loadProducts();
      setCart([]);
    } catch (err) {
      setError(err.message || 'Hitilafu wakati wa kurekodi mauzo.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm">
        <div className="relative flex flex-col h-[94vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-[#eff5ef] shadow-2xl">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[#bccac0]/40 bg-white px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#006948] text-white">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-[#171d19]">
                  {lang === 'en' ? 'POS Counter / Record Sale' : 'Rekodi Mauzo / New Sale'}
                </h1>
                <p className="text-xs text-[#3d4a42]">
                  {lang === 'en' ? 'Tap products to add to basket' : 'Gusa bidhaa kuweka kwenye kapu'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile View Toggle (Segmented Controller) */}
          <div className="flex border-b border-[#bccac0]/40 bg-white lg:hidden shrink-0">
            <button
              type="button"
              onClick={() => setMobileView('products')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                mobileView === 'products'
                  ? 'border-[#006948] text-[#006948] bg-emerald-50/40'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>{lang === 'en' ? 'Products' : 'Bidhaa'} ({filteredProducts.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView('cart')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition relative ${
                mobileView === 'cart'
                  ? 'border-[#006948] text-[#006948] bg-emerald-50/40'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{lang === 'en' ? 'Basket & Pay' : 'Kapu na Malipo'}</span>
              {cart.length > 0 && (
                <span className="rounded-full bg-[#006948] px-2 py-0.5 text-[10px] font-black text-white">
                  {cart.reduce((s, i) => s + i.qty, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Main POS Content Grid */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Product Picker (7 cols on desktop) */}
            <div className={`lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-[#bccac0]/40 overflow-hidden bg-white/60 ${mobileView === 'products' ? 'flex flex-1' : 'hidden lg:flex'}`}>
              {/* Search & Categories */}
              <div className="p-3 border-b border-[#bccac0]/30 space-y-2 bg-white">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={lang === 'en' ? 'Search product or barcode...' : 'Tafuta jina au barcode...'}
                    className="h-10 w-full rounded-xl border border-[#bccac0] bg-[#eff5ef]/50 pl-10 pr-4 text-xs sm:text-sm text-[#171d19] focus:border-[#006948] focus:outline-none"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`whitespace-nowrap rounded-full px-3 py-1 font-semibold transition ${
                        selectedCategory === cat
                          ? 'bg-[#006948] text-white shadow-sm'
                          : 'bg-white border border-[#bccac0]/60 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {cat === 'all' ? (lang === 'en' ? 'All' : 'Zote') : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                {filteredProducts.map(product => {
                  const inCartItem = cart.find(i => i.product_id === product.id);
                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = product.stock > 0 && product.stock <= (product.min_stock || 5);

                  return (
                    <button
                      key={product.id}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => addToCart(product)}
                      className={`relative flex flex-col justify-between rounded-2xl border p-3 text-left transition active:scale-95 ${
                        isOutOfStock
                          ? 'opacity-50 bg-gray-100 border-gray-200 cursor-not-allowed'
                          : inCartItem
                          ? 'border-[#006948] bg-emerald-50/50 shadow-sm'
                          : 'border-[#bccac0]/60 bg-white hover:border-[#006948] hover:shadow-sm'
                      }`}
                    >
                      {inCartItem && (
                        <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#006948] text-[10px] font-bold text-white shadow">
                          {inCartItem.qty}
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {product.category}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-[#171d19] line-clamp-2 leading-snug mt-0.5">
                          {product.name}
                        </h4>
                      </div>

                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <div className="text-xs font-extrabold text-[#006948]">
                            KSh {product.sell.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            /{product.unit || 'pcs'}
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            isOutOfStock
                              ? 'bg-red-100 text-red-700'
                              : isLowStock
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isOutOfStock
                            ? (lang === 'en' ? 'Out' : 'Imekwisha')
                            : isLowStock
                            ? `${product.stock} left`
                            : `${product.stock} sawa`}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    <p className="text-sm font-medium">Hakuna bidhaa inayolingana</p>
                    <p className="text-xs mt-1">Jaribu neno lingine la kutafuta au ongeza bidhaa mpya.</p>
                  </div>
                )}
              </div>

              {/* Mobile Floating Cart Action Bar */}
              {cart.length > 0 && (
                <div className="p-2.5 bg-white border-t border-[#bccac0]/30 lg:hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setMobileView('cart')}
                    className="w-full flex items-center justify-between rounded-2xl bg-[#006948] px-4 py-3 text-white font-bold shadow-lg active:scale-98 transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-black">
                        {cart.reduce((s, i) => s + i.qty, 0)}
                      </div>
                      <span className="text-xs">{lang === 'en' ? 'Items in basket' : 'Bidhaa zilizochaguliwa'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black">KSh {cartTotal.toLocaleString()}</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-lg">Lipa →</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Cart, Payment & Checkout (5 cols on desktop, responsive on mobile) */}
            <div className={`lg:col-span-5 flex flex-col justify-between bg-white overflow-hidden ${mobileView === 'cart' ? 'flex flex-1' : 'hidden lg:flex'}`}>
              {/* Cart Header */}
              <div className="border-b border-[#bccac0]/30 px-4 py-2.5 flex items-center justify-between bg-[#eff5ef]/40 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileView('products')}
                    className="rounded-lg p-1 text-gray-500 hover:bg-gray-200 lg:hidden"
                    title="Rudi kwenye bidhaa"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    {lang === 'en' ? 'Active Basket' : 'Kapu la Mauzo'} ({cart.reduce((s, i) => s + i.qty, 0)})
                  </span>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-[11px] font-semibold text-red-600 hover:underline"
                  >
                    {lang === 'en' ? 'Clear all' : 'Ondoa Zote'}
                  </button>
                )}
              </div>

              {/* Cart Item List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[40vh] lg:max-h-none">
                {cart.map(item => (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between rounded-xl border border-[#bccac0]/40 bg-[#eff5ef]/20 p-2.5"
                  >
                    <div className="flex-1 pr-2">
                      <div className="text-xs font-bold text-[#171d19] truncate">{item.product_name}</div>
                      <div className="text-[11px] text-[#006948] font-semibold">
                        KSh {item.unit_price} x {item.qty} = <span className="font-bold">KSh {(item.unit_price * item.qty).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateQty(item.product_id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#bccac0] bg-white text-gray-700 hover:bg-gray-50 active:scale-95"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.product_id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#bccac0] bg-white text-gray-700 hover:bg-gray-50 active:scale-95"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product_id)}
                        className="ml-1 text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {cart.length === 0 && (
                  <div className="py-10 text-center text-gray-400">
                    <ShoppingCart className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-xs font-medium">Kapu bado ni tupu</p>
                    <p className="text-[11px] text-gray-400 mb-3">Gusa bidhaa kuanza kuongeza kwenye kapu</p>
                    <button
                      type="button"
                      onClick={() => setMobileView('products')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#006948] bg-emerald-50 px-3 py-1.5 rounded-xl lg:hidden"
                    >
                      ← Angalia Bidhaa
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Section & Totals */}
              <div className="border-t border-[#bccac0]/40 bg-[#eff5ef]/50 p-4 space-y-3">
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Total Display */}
                <div className="flex items-baseline justify-between rounded-2xl bg-white p-3.5 border border-[#bccac0]/40 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Jumla / Total:
                  </span>
                  <span className="text-2xl font-black text-[#006948]">
                    KSh {cartTotal.toLocaleString()}
                  </span>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                    Njia ya Malipo / Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'M-Pesa', icon: Smartphone, label: 'M-Pesa' },
                      { id: 'Cash', icon: Banknote, label: 'Cash' },
                      { id: 'Other', icon: CreditCard, label: 'Kadi/Nyingine' },
                    ].map(method => {
                      const Icon = method.icon;
                      const active = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold transition ${
                            active
                              ? 'bg-[#006948] text-white shadow-sm'
                              : 'bg-white border border-[#bccac0]/60 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Cash Calculation */}
                {paymentMethod === 'Cash' && cartTotal > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 block mb-1">
                        Pesa aliyotoa (Tendered)
                      </label>
                      <input
                        type="number"
                        placeholder={`KSh ${cartTotal}`}
                        value={cashTendered}
                        onChange={(e) => setCashTendered(e.target.value)}
                        className="h-9 w-full rounded-xl border border-[#bccac0] bg-white px-3 text-xs font-bold text-[#171d19] focus:outline-none focus:border-[#006948]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 block mb-1">
                        Chenji / Change
                      </label>
                      <div className="flex h-9 items-center rounded-xl bg-emerald-100/60 px-3 text-xs font-extrabold text-[#006948]">
                        KSh {changeDue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional M-Pesa Ref */}
                {paymentMethod === 'M-Pesa' && (
                  <div>
                    <input
                      type="text"
                      placeholder="M-Pesa Code (mfano: QKH78923KL au acha tupu)"
                      value={mpesaRef}
                      onChange={(e) => setMpesaRef(e.target.value.toUpperCase())}
                      className="h-9 w-full rounded-xl border border-[#bccac0] bg-white px-3 text-xs uppercase text-[#171d19] focus:outline-none focus:border-[#006948]"
                    />
                  </div>
                )}

                {/* Checkout Submit Button */}
                <button
                  type="button"
                  disabled={loading || cart.length === 0}
                  onClick={handleCheckout}
                  className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold text-white shadow-lg transition active:scale-98 ${
                    cart.length === 0 || loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#006948] hover:bg-[#00553a]'
                  }`}
                >
                  {loading ? (
                    <span>Inahifadhi...</span>
                  ) : (
                    <>
                      <span>{lang === 'en' ? 'Complete Sale' : 'Kamilisha Mauzo'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {completedSale && (
        <ReceiptModal
          open={!!completedSale}
          sale={completedSale}
          onClose={() => setCompletedSale(null)}
          onNewSale={() => {
            setCompletedSale(null);
            setCart([]);
          }}
        />
      )}
    </>
  );
}
