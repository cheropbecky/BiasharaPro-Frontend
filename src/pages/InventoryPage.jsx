import React, { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import Badge from '../components/Badge';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import image3 from '../assets/image3.jpg';
import heroImage from '../assets/hero.jpg';
const products = [
  { name: 'Unga Pembe 2kg', category: 'Chakula', buy: 120, sell: 155, stock: 48, min: 20, status: 'in-stock' },
  { name: 'Sukari Mumias 1kg', category: 'Chakula', buy: 100, sell: 128, stock: 0, min: 10, status: 'out-of-stock' },
  { name: 'Mafuta Elianto 2L', category: 'Chakula', buy: 340, sell: 420, stock: 4, min: 10, status: 'low-stock' },
  { name: 'Maziwa 500ml', category: 'Vinywaji', buy: 52, sell: 68, stock: 22, min: 15, status: 'in-stock' },
  { name: 'Sabuni Omo 1kg', category: 'Usafi', buy: 245, sell: 300, stock: 7, min: 10, status: 'low-stock' },
  { name: 'Mchele Pishori 1kg', category: 'Chakula', buy: 130, sell: 165, stock: 35, min: 20, status: 'in-stock' },
  { name: 'Chumvi 500g', category: 'Chakula', buy: 18, sell: 25, stock: 60, min: 30, status: 'in-stock' },
  { name: 'Siagi Blue Band', category: 'Chakula', buy: 88, sell: 115, stock: 0, min: 8, status: 'out-of-stock' },
];

const inputClass =
  'h-11 w-full rounded-xl border border-[#bccac0] bg-white px-4 text-[14px] text-[#171d19] placeholder:text-[#6b7280] focus:outline-none focus:border-[#006948]';

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m4 20 4.5-1 9-9-3.5-3.5-9 9L4 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V5h6v2M7 7l1 12h8l1-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function statusLabel(status, lang) {
  if (status === 'in-stock') return lang === 'en' ? 'In stock' : 'Imejaa';
  if (status === 'low-stock') return lang === 'en' ? 'Low stock' : 'Stoki chini';
  return lang === 'en' ? 'Out of stock' : 'Zimekwisha';
}

function statusColor(stock, min) {
  if (stock === 0) return '#dc2626';
  if (stock < min) return '#d97706';
  return '#16a34a';
}

export default function InventoryPage() {
  const { t, lang } = useLang();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Chakula',
    buy: '',
    sell: '',
    initial: '',
    min: '',
  });

  const filtered = useMemo(() => {
    return products.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase().trim());
      const matchesCategory = category === 'all' || item.category === category;
      const matchesStatus = status === 'all' || item.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] relative"
      style={{
        fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        backgroundImage: `linear-gradient(180deg, rgba(239,245,239,0.92), rgba(239,245,239,0.92)), url(${image3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom left',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Sidebar />
      <TopBar />
      <BottomNav />

      <main className="px-4 pb-20 pt-20 lg:px-8 lg:pl-63 lg:pb-8 relative">
        <OfflineBanner />

        <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#171d19]">{t('inventory')}</h1>
            <p className="mt-1 text-[16px] text-[#3d4a42]">{t('inventorySubtitle')}</p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-[#006948] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#00583c]"
          >
            {lang === 'en' ? 'Add Product' : 'Ongeza Bidhaa'}
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative min-w-60 flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"><SearchIcon /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
              placeholder={t('searchProducts')}
            />
          </div>

          <div className="relative w-full sm:w-45">
            <select value={category} onChange={e => setCategory(e.target.value)} className={`${inputClass} appearance-none pr-9`}>
              <option value="all">{t('allCategories')}</option>
              <option value="Chakula">Chakula</option>
              <option value="Vinywaji">Vinywaji</option>
              <option value="Usafi">Usafi</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"><ChevronDownIcon /></span>
          </div>

          <div className="relative w-full sm:w-40">
            <select value={status} onChange={e => setStatus(e.target.value)} className={`${inputClass} appearance-none pr-9`}>
              <option value="all">{t('allStatuses')}</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"><ChevronDownIcon /></span>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-semibold text-[#171d19]">
            <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
            <span>32 {t('totalProducts')}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-semibold text-[#171d19]">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            <span>5 {t('lowStock')}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-semibold text-[#171d19]">
            <span className="h-2 w-2 rounded-full bg-[#dc2626]" />
            <span>2 {t('outOfStock')}</span>
          </div>
        </div>

        <div className="mb-5 hidden sm:block">
          <img src={heroImage} alt="Inventory management" className="w-full h-32 object-cover rounded-2xl shadow-sm" />
        </div>

        <section className="overflow-hidden rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white">
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-3 border-b border-[#e5e7eb] bg-[#f9fafb] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
              <div className="col-span-3">BIDHAA / PRODUCT</div>
              <div className="col-span-2">JAMII / CATEGORY</div>
              <div className="col-span-1">BEI YA KUNUNUA</div>
              <div className="col-span-1">BEI YA KUUZA</div>
              <div className="col-span-1">STOKI</div>
              <div className="col-span-1">KIWANGO CHA CHINI</div>
              <div className="col-span-2">HALI</div>
              <div className="col-span-1" />
            </div>

            <div className="divide-y divide-[#f3f4f6]">
              {filtered.map(item => {
                const badgeStatus = item.status === 'in-stock' ? 'income' : item.status;
                return (
                  <div key={item.name} className="grid grid-cols-12 gap-3 px-5 py-3.5 text-[14px] text-[#171d19] transition-colors hover:bg-[#f9fafb]">
                    <div className="col-span-3 font-semibold">{item.name}</div>
                    <div className="col-span-2 text-[#6b7280]">{item.category}</div>
                    <div className="col-span-1 font-medium">Ksh {item.buy}</div>
                    <div className="col-span-1 font-medium">Ksh {item.sell}</div>
                    <div className="col-span-1 font-bold" style={{ color: statusColor(item.stock, item.min) }}>{item.stock}</div>
                    <div className="col-span-1">{item.min}</div>
                    <div className="col-span-2">
                      <Badge status={badgeStatus}>{statusLabel(item.status, lang)}</Badge>
                    </div>
                    <div className="col-span-1 flex items-center gap-3 text-[#9ca3af]">
                      <button type="button" className="transition-colors hover:text-[#006948]" aria-label={`Edit ${item.name}`}>
                        <EditIcon />
                      </button>
                      <button type="button" className="transition-colors hover:text-[#dc2626]" aria-label={`Delete ${item.name}`}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-[#f3f4f6] px-5 py-3.5">
              <p className="text-[13px] text-[#6b7280]">{t('showCount')}</p>
              <div className="flex items-center gap-2">
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280]">‹</button>
                <button type="button" className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#006948] px-2 text-white">1</button>
                <button type="button" className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#e5e7eb] px-2 text-[#6b7280]">2</button>
                <button type="button" className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#e5e7eb] px-2 text-[#6b7280]">3</button>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280]">›</button>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {filtered.map(item => {
              const badgeStatus = item.status === 'in-stock' ? 'income' : item.status;
              return (
                <article key={`${item.name}-mobile`} className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#171d19]">{item.name}</h3>
                      <p className="mt-1 text-[13px] text-[#6b7280]">{item.category}</p>
                    </div>
                    <Badge status={badgeStatus}>{statusLabel(item.status, lang)}</Badge>
                  </div>
                  <div className="mt-3 text-[20px] font-bold text-[#006948]">Ksh {item.sell}</div>
                  <div className="mt-2 flex items-center justify-between text-[13px] text-[#3d4a42]">
                    <span>
                      {lang === 'en' ? 'Stock' : 'Stoki'}: <strong style={{ color: statusColor(item.stock, item.min) }}>{item.stock}</strong>
                    </span>
                    <span>Min: {item.min}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 z-30 rounded-full bg-[#006948] p-4 text-white shadow-lg lg:hidden"
        aria-label={lang === 'en' ? 'Add Product' : 'Ongeza Bidhaa'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-120 rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-[20px] font-bold text-[#171d19]">
                {lang === 'en' ? 'Add Product' : 'Ongeza Bidhaa'}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-[#9ca3af] hover:text-[#171d19]" aria-label="Close modal">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <input
                className={inputClass}
                value={newProduct.name}
                onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                placeholder={lang === 'en' ? 'Product Name' : 'Jina la Bidhaa'}
              />
              <select
                className={inputClass}
                value={newProduct.category}
                onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
              >
                <option>Chakula</option>
                <option>Vinywaji</option>
                <option>Usafi</option>
              </select>
              <input
                className={inputClass}
                value={newProduct.buy}
                onChange={e => setNewProduct(prev => ({ ...prev, buy: e.target.value }))}
                placeholder={lang === 'en' ? 'Buy Price' : 'Bei ya Kununua'}
              />
              <input
                className={inputClass}
                value={newProduct.sell}
                onChange={e => setNewProduct(prev => ({ ...prev, sell: e.target.value }))}
                placeholder={lang === 'en' ? 'Sell Price' : 'Bei ya Kuuza'}
              />
              <input
                className={inputClass}
                value={newProduct.initial}
                onChange={e => setNewProduct(prev => ({ ...prev, initial: e.target.value }))}
                placeholder={lang === 'en' ? 'Initial Quantity' : 'Idadi ya Awali'}
              />
              <input
                className={inputClass}
                value={newProduct.min}
                onChange={e => setNewProduct(prev => ({ ...prev, min: e.target.value }))}
                placeholder={lang === 'en' ? 'Minimum Level' : 'Kiwango cha Chini'}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-[#bccac0] px-4 py-2.5 text-[14px] font-semibold text-[#3d4a42]"
              >
                {lang === 'en' ? 'Cancel' : 'Ghairi'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-[#006948] px-4 py-2.5 text-[14px] font-semibold text-white"
              >
                {lang === 'en' ? 'Save' : 'Hifadhi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
