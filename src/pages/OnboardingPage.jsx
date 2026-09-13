import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { writeStoredProfile } from '../utils/preferences';
import { addProduct } from '../db/sqlite';
import {
  Globe, ChevronRight, ChevronLeft, CheckCircle2,
  Building2, Phone, Store, Sparkles, Check, ArrowRight
} from 'lucide-react';

const ONBOARDING_COMPLETE_KEY = 'biasharapro_onboarding_complete';

const BUSINESS_TEMPLATES = {
  duka: {
    nameEn: 'General Retail / Duka',
    nameSw: 'Duka la Rejareja / Kiosk',
    products: [
      { name: 'Unga wa Pembe 2kg', category: 'Chakula', unit: 'pkts', buy: 165, sell: 195, initial: 15, min: 5 },
      { name: 'Sukari Mara 1kg', category: 'Chakula', unit: 'kg', buy: 120, sell: 145, initial: 20, min: 5 },
      { name: 'Mafuta ya Kupikia Rina 2L', category: 'Chakula', unit: 'pcs', buy: 490, sell: 580, initial: 10, min: 3 },
      { name: 'Maziwa KCC 500ml', category: 'Vinywaji', unit: 'pkts', buy: 52, sell: 65, initial: 24, min: 6 },
      { name: 'Mkate wa Broadways 400g', category: 'Chakula', unit: 'pcs', buy: 55, sell: 65, initial: 12, min: 4 },
      { name: 'Sabuni ya Omo 500g', category: 'Usafi', unit: 'pcs', buy: 130, sell: 160, initial: 10, min: 3 },
    ],
  },
  groceries: {
    nameEn: 'Mama Mboga / Fresh Groceries',
    nameSw: 'Mama Mboga / Mbogamboga',
    products: [
      { name: 'Nyanya Safi 1kg', category: 'Chakula', unit: 'kg', buy: 70, sell: 100, initial: 30, min: 5 },
      { name: 'Kitunguu Maji 1kg', category: 'Chakula', unit: 'kg', buy: 80, sell: 120, initial: 25, min: 5 },
      { name: 'Viazi Mviringo 1kg', category: 'Chakula', unit: 'kg', buy: 60, sell: 90, initial: 40, min: 10 },
      { name: 'Sukuma Wiki (Fungu)', category: 'Chakula', unit: 'pcs', buy: 15, sell: 30, initial: 50, min: 10 },
      { name: 'Karoti 1kg', category: 'Chakula', unit: 'kg', buy: 50, sell: 80, initial: 20, min: 5 },
      { name: 'Ndizi Mbivu (Fungu)', category: 'Chakula', unit: 'pcs', buy: 50, sell: 80, initial: 20, min: 5 },
    ],
  },
  chemist: {
    nameEn: 'Pharmacy / Chemist',
    nameSw: 'Duka la Dawa (Chemist)',
    products: [
      { name: 'Paracetamol 500mg 10s', category: 'Dawa', unit: 'pkts', buy: 20, sell: 50, initial: 50, min: 10 },
      { name: 'Cold Cap Capsules 10s', category: 'Dawa', unit: 'pkts', buy: 70, sell: 120, initial: 30, min: 5 },
      { name: 'Amoxicillin 500mg (10s)', category: 'Dawa', unit: 'pkts', buy: 110, sell: 180, initial: 20, min: 5 },
      { name: 'Cetirizine 10mg (10s)', category: 'Dawa', unit: 'pkts', buy: 30, sell: 70, initial: 40, min: 10 },
      { name: 'Bandage Elastic 3-inch', category: 'Vifaa', unit: 'pcs', buy: 45, sell: 90, initial: 15, min: 4 },
      { name: 'Methylated Spirit 100ml', category: 'Usafi', unit: 'pcs', buy: 60, sell: 110, initial: 20, min: 5 },
    ],
  },
  hardware: {
    nameEn: 'Hardware / Construction',
    nameSw: 'Duka la Hardware / Vifaa vya Ujenzi',
    products: [
      { name: 'Misumari 3-inch (1kg)', category: 'Vifaa', unit: 'kg', buy: 130, sell: 180, initial: 50, min: 10 },
      { name: 'Saruji Bamburi Nguvu 50kg', category: 'Vifaa', unit: 'boxes', buy: 650, sell: 750, initial: 20, min: 5 },
      { name: 'Brashi ya Rangi 3-inch', category: 'Vifaa', unit: 'pcs', buy: 70, sell: 120, initial: 25, min: 5 },
      { name: 'Rangi Gloss White 1L', category: 'Vifaa', unit: 'litres', buy: 480, sell: 650, initial: 12, min: 3 },
      { name: 'Bomba PPR 20mm (4m)', category: 'Vifaa', unit: 'pcs', buy: 190, sell: 280, initial: 30, min: 6 },
    ],
  },
  salon: {
    nameEn: 'Salon & Kinyozi Services',
    nameSw: 'Salon & Kinyozi',
    products: [
      { name: 'Kinyozi: Kunyoa Kawaida', category: 'Huduma', unit: 'pcs', buy: 20, sell: 150, initial: 999, min: 10 },
      { name: 'Kinyozi: VIP + Head Wash', category: 'Huduma', unit: 'pcs', buy: 50, sell: 300, initial: 999, min: 10 },
      { name: 'Salon: Kusuka Lines', category: 'Huduma', unit: 'pcs', buy: 100, sell: 500, initial: 999, min: 10 },
      { name: 'Salon: Dreadlocks Retwist', category: 'Huduma', unit: 'pcs', buy: 200, sell: 900, initial: 999, min: 10 },
      { name: 'Hair Food Darling 250g', category: 'Bidhaa', unit: 'pcs', buy: 150, sell: 220, initial: 15, min: 3 },
    ],
  },
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { language, switchLanguage } = useLanguage();
  const [step, setStep] = useState(1); // 1: Lang, 2: Shop Details, 3: Starter Products, 4: Ready
  const isSw = language === 'sw';

  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phoneNumber: '',
    businessType: 'duka',
    location: '',
  });

  const [selectedProducts, setSelectedProducts] = useState(
    BUSINESS_TEMPLATES.duka.products.map(p => p.name)
  );

  const handleLanguageSelect = (lang) => {
    switchLanguage(lang);
    setStep(2);
  };

  const handleBusinessTypeChange = (type) => {
    setFormData(prev => ({ ...prev, businessType: type }));
    const tpl = BUSINESS_TEMPLATES[type] || BUSINESS_TEMPLATES.duka;
    setSelectedProducts(tpl.products.map(p => p.name));
  };

  const toggleProductSelection = (pName) => {
    setSelectedProducts(prev =>
      prev.includes(pName) ? prev.filter(n => n !== pName) : [...prev, pName]
    );
  };

  const handleComplete = async () => {
    // 1. Save Profile
    writeStoredProfile({
      shopName: formData.shopName.trim() || (isSw ? 'Duka Langu' : 'My Biashara Store'),
      ownerName: formData.ownerName.trim() || (isSw ? 'Mwenye Duka' : 'Shop Owner'),
      phoneNumber: formData.phoneNumber.trim(),
      businessType: formData.businessType,
      location: formData.location.trim() || 'Nairobi, Kenya',
      language,
      avatarUrl: '',
    });

    // 2. Seed selected products into SQLite
    const activeTemplate = BUSINESS_TEMPLATES[formData.businessType] || BUSINESS_TEMPLATES.duka;
    for (const item of activeTemplate.products) {
      if (selectedProducts.includes(item.name)) {
        try {
          await addProduct(item);
        } catch (e) {
          console.error('Error seeding product', item.name, e);
        }
      }
    }

    // 3. Mark Onboarding as Completed
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');

    // 4. Redirect to Dashboard
    if (typeof window !== 'undefined') {
      window.location.replace('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] flex items-center justify-center p-3 sm:p-4"
      style={{
        fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div className="w-full max-w-xl rounded-3xl bg-white p-4 sm:p-8 shadow-xl border border-[#bccac0]/50">
        {/* Step Indicator */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#006948] text-white font-black text-sm">
              BP
            </div>
            <div>
              <span className="text-sm font-black text-[#171d19]">BiasharaPro</span>
              <span className="text-[10px] text-gray-500 block">Kenya MSME Business Engine</span>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#006948]">
            {isSw ? `Hatua ${step} ya 4` : `Step ${step} of 4`}
          </span>
        </div>

        {/* STEP 1: Language Selection */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#006948]">
                <Globe className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-[#171d19]">Chagua Lugha / Choose Language</h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                BiasharaPro imeundwa mahususi kusaidia biashara yako kwa Kiswahili au Kiingereza.
              </p>
            </div>

            <div className="grid gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleLanguageSelect('sw')}
                className="flex items-center justify-between rounded-2xl border-2 border-[#006948]/30 bg-emerald-50/40 p-4 text-left hover:border-[#006948] transition group"
              >
                <div>
                  <h3 className="font-extrabold text-[#171d19] text-base">Kiswahili</h3>
                  <p className="text-xs text-gray-500">Mfumo kamili kwa lugha rahisi ya Kiswahili</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006948] text-white">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleLanguageSelect('en')}
                className="flex items-center justify-between rounded-2xl border-2 border-gray-200 bg-gray-50/50 p-4 text-left hover:border-[#006948] transition group"
              >
                <div>
                  <h3 className="font-extrabold text-[#171d19] text-base">English</h3>
                  <p className="text-xs text-gray-500">Use BiasharaPro in English</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 group-hover:bg-[#006948] text-white transition">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Shop Details */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-black text-[#171d19]">
                {isSw ? 'Taarifa za Duka Lako' : 'Your Business Details'}
              </h2>
              <p className="text-xs text-gray-500">
                {isSw
                  ? 'Taarifa hizi zitaonekana kwenye risiti na ripoti zako'
                  : 'These details will appear on receipts and sales reports'}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {isSw ? 'Jina la Duka / Biashara *' : 'Shop / Business Name *'}
                </label>
                <input
                  required
                  value={formData.shopName}
                  onChange={e => setFormData(p => ({ ...p, shopName: e.target.value }))}
                  placeholder={isSw ? 'mfano: Wanjiku Super Retail, Otieno Kiosk...' : 'e.g. Wanjiku Stores'}
                  className="h-11 w-full rounded-xl border border-[#bccac0] px-4 text-sm focus:border-[#006948] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {isSw ? 'Jina Lako (Mwenye Duka) *' : 'Owner Name *'}
                  </label>
                  <input
                    value={formData.ownerName}
                    onChange={e => setFormData(p => ({ ...p, ownerName: e.target.value }))}
                    placeholder="Wanjiku"
                    className="h-11 w-full rounded-xl border border-[#bccac0] px-4 text-sm focus:border-[#006948] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {isSw ? 'Nambari ya Simu (M-Pesa)' : 'Phone Number (M-Pesa)'}
                  </label>
                  <input
                    value={formData.phoneNumber}
                    onChange={e => setFormData(p => ({ ...p, phoneNumber: e.target.value }))}
                    placeholder="0712 345 678"
                    className="h-11 w-full rounded-xl border border-[#bccac0] px-4 text-sm focus:border-[#006948] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {isSw ? 'Mahali Duka Lilipo (Town / Estate)' : 'Location / Town / Estate'}
                </label>
                <input
                  value={formData.location}
                  onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                  placeholder="mfano: Gikomba, Roysambu, Kisumu..."
                  className="h-11 w-full rounded-xl border border-[#bccac0] px-4 text-sm focus:border-[#006948] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {isSw ? 'Aina ya Biashara' : 'Business Category'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(BUSINESS_TEMPLATES).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleBusinessTypeChange(key)}
                      className={`rounded-xl p-2.5 text-left border text-xs font-bold transition ${
                        formData.businessType === key
                          ? 'border-[#006948] bg-emerald-50 text-[#006948]'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isSw ? item.nameSw : item.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700"
              >
                {isSw ? 'Rudi' : 'Back'}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 rounded-xl bg-[#006948] py-3 text-xs font-bold text-white shadow hover:bg-[#00553a] transition"
              >
                {isSw ? 'Endelea na Bidhaa za Kuanzia' : 'Continue to Starter Stock'} →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Starter Product Templates */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-black text-[#171d19]">
                  {isSw ? 'Bidhaa za Kuanzia (Templates)' : 'Quick-Start Starter Products'}
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isSw
                  ? 'Tumekuandalia orodha ya bidhaa zinazouzika haraka. Chagua unazotaka kuanza nazo:'
                  : 'Select fast-moving items to prepopulate your catalog so you can start selling immediately:'}
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-100 rounded-2xl p-2 bg-gray-50/50">
              {(BUSINESS_TEMPLATES[formData.businessType] || BUSINESS_TEMPLATES.duka).products.map(item => {
                const isSelected = selectedProducts.includes(item.name);
                return (
                  <div
                    key={item.name}
                    onClick={() => toggleProductSelection(item.name)}
                    className={`flex items-center justify-between rounded-xl p-3 cursor-pointer border transition ${
                      isSelected ? 'bg-white border-[#006948]' : 'bg-white/60 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-md text-white text-xs ${isSelected ? 'bg-[#006948]' : 'border border-gray-300'}`}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#171d19] block">{item.name}</span>
                        <span className="text-[10px] text-gray-500">
                          Kununua: KSh {item.buy} • Kuuza: KSh {item.sell}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#006948]">
                      +{item.sell - item.buy} faida
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700"
              >
                {isSw ? 'Rudi' : 'Back'}
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1 rounded-xl bg-[#006948] py-3 text-xs font-bold text-white shadow hover:bg-[#00553a] transition"
              >
                {isSw ? 'Endelea' : 'Next Step'} →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Ready to Launch */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#006948]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-[#171d19]">
                {isSw ? 'Duka Lako Liko Tayari!' : 'Your Business is Ready!'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isSw
                  ? `Hongera ${formData.ownerName || 'Mwenye Duka'}! Duka lako la ${formData.shopName || 'Biashara'} limewekwa tayari.`
                  : `Congratulations! ${formData.shopName || 'Your store'} has been configured.`}
              </p>
            </div>

            {/* Subscription & Offline highlights */}
            <div className="rounded-2xl bg-[#006948]/5 border border-[#006948]/20 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">
                  {isSw ? 'Jaribio la Bure (Free Trial)' : 'Free Trial'}
                </span>
                <span className="text-xs font-extrabold text-[#006948]">Siku 14 Bure (14 Days)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">
                  {isSw ? 'Ada ya Mwezi Baadaye' : 'Monthly Subscription'}
                </span>
                <span className="text-sm font-black text-[#171d19]">KSh 500 / mwezi</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#006948]/15 pt-2 text-[11px] text-gray-600">
                <span>✓ {isSw ? 'Haitaji intaneti (100% Offline)' : '100% Offline Capable'}</span>
                <span>✓ {isSw ? 'Risiti za WhatsApp na SMS' : 'WhatsApp Receipts'}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-xl border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700"
              >
                {isSw ? 'Rudi' : 'Back'}
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="flex-1 rounded-xl bg-[#006948] py-3.5 text-sm font-black text-white shadow-lg hover:bg-[#00553a] active:scale-98 transition"
              >
                {isSw ? 'Anza Kutumia BiasharaPro 🚀' : 'Launch BiasharaPro 🚀'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
