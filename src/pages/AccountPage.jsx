import React, { useState, useEffect } from 'react';
import {
  Smartphone, ShieldCheck, Download, Upload, CheckCircle2,
  RefreshCw, AlertCircle, Sparkles, Check, Database, Save, ArrowRight, X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import useSidebar from '../hooks/useSidebar';
import { useNavigationSystem } from '../components/navigation/NavigationProvider';
import { writeStoredProfile } from '../utils/preferences';
import { exportFullDatabase, importFullDatabase, DB_CHANGE_EVENT } from '../db/sqlite';

export default function AccountPage() {
  const { lang, t } = useLang();
  const { collapsed } = useSidebar();
  const { profile, updateProfile } = useNavigationSystem();

  const [shopName, setShopName] = useState(profile?.shopName || 'BiasharaPro Retail');
  const [ownerName, setOwnerName] = useState(profile?.ownerName || 'Wanjiku');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '0712345678');
  const [location, setLocation] = useState(profile?.location || 'Nairobi, Kenya');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Subscription state
  const [subStatus, setSubStatus] = useState(() => {
    const saved = localStorage.getItem('biasharapro_sub_data');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 14); // 14-day trial
    return {
      plan: 'BiasharaPro Standard',
      price: 500,
      active: true,
      expiryDate: expiry.toISOString(),
      history: [
        { date: 'Leo', amount: 'KSh 0 (Trial 14 Days)', mpesa: 'TRIAL-ACT', status: 'Active' },
      ],
    };
  });

  const [showStkModal, setShowStkModal] = useState(false);
  const [stkPhone, setStkPhone] = useState(phoneNumber);
  const [stkStatus, setStkStatus] = useState('idle'); // idle, sending, waiting_pin, success, error
  const [stkReceiptCode, setStkReceiptCode] = useState('');

  // Backup & Restore
  const [exporting, setExporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('biasharapro_sub_data', JSON.stringify(subStatus));
  }, [subStatus]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      phoneNumber: phoneNumber.trim(),
      location: location.trim(),
    };
    writeStoredProfile(updated);
    if (updateProfile) updateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleStartStkPush = () => {
    if (!stkPhone) return;
    setStkStatus('sending');

    setTimeout(() => {
      setStkStatus('waiting_pin');

      setTimeout(() => {
        // Simulate successful PIN entry
        const randomCode = 'SK' + Math.floor(10000000 + Math.random() * 90000000).toString(36).toUpperCase();
        setStkReceiptCode(randomCode);
        setStkStatus('success');

        // Extend subscription by 30 days
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 30);

        setSubStatus(prev => ({
          ...prev,
          active: true,
          expiryDate: newExpiry.toISOString(),
          history: [
            {
              date: new Date().toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }),
              amount: 'KSh 500',
              mpesa: randomCode,
              status: 'Paid',
            },
            ...prev.history,
          ],
        }));
      }, 4000);
    }, 1500);
  };

  const handleExportBackup = async () => {
    try {
      setExporting(true);
      const jsonStr = await exportFullDatabase();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BiasharaPro_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error backing up database: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        if (typeof text === 'string') {
          await importFullDatabase(text);
          setImportMessage('Hifadhidata imerejeshwa kikamilifu!');
          setTimeout(() => setImportMessage(''), 4000);
        }
      } catch (err) {
        alert('Hitilafu katika kurejesha faili: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const expiryFormatted = new Date(subStatus.expiryDate).toLocaleDateString(lang === 'en' ? 'en-KE' : 'sw-KE', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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

        {/* Header */}
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-black text-[#171d19] lg:text-3xl">
            {lang === 'en' ? 'Account & Subscription' : 'Akaunti na Usajili wa M-Pesa'}
          </h1>
          <p className="mt-1 text-sm text-[#3d4a42]">
            {lang === 'en'
              ? 'Manage your shop profile, M-Pesa subscription, and offline database backups'
              : 'Dhibiti wasifu wa duka lako, malipo ya M-Pesa KSh 500, na hifadhi nakala ya stoki'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Subscription & M-Pesa (7 cols) */}
          <section className="lg:col-span-7 space-y-6">
            {/* Subscription Card */}
            <div className="rounded-3xl border-t-4 border-t-[#006948] bg-white p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-[#006948]">
                  BiasharaPro Standard
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {lang === 'en' ? 'Active' : 'Amilifu'}
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#171d19]">KSh 500</span>
                <span className="text-sm font-bold text-gray-500">/ mwezi (per month)</span>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                {lang === 'en' ? 'Valid until' : 'Halali hadi'}: <strong className="text-gray-800">{expiryFormatted}</strong>
              </p>

              {/* Benefits */}
              <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>100% Kazi bila mtandao (Offline-first SQLite)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Kaunta ya Mauzo (POS) na Risiti za WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Usimamizi kamili wa stoki na tahadhari za bidhaa</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Ripoti halisi za faida na hasara (P&L)</span>
                </div>
              </div>

              {/* Pay via M-Pesa STK */}
              <div className="mt-6 rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#006948] uppercase tracking-wider">
                  <Smartphone className="h-4 w-4" />
                  <span>Lipa Ada ya Mwezi na M-Pesa</span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Bonyeza kitufe hapa chini ili kupokea ujumbe wa M-Pesa kwenye simu yako kuthibitisha malipo ya KSh 500 kwa mwezi mwingine.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setStkPhone(phoneNumber);
                    setStkStatus('idle');
                    setShowStkModal(true);
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#006948] py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-[#00553a] active:scale-98 transition"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Lipa Sasa na M-Pesa (KSh 500)</span>
                </button>
              </div>
            </div>

            {/* Payment History Card */}
            <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#171d19] mb-3">
                {lang === 'en' ? 'M-Pesa Payment Receipts' : 'Historia ya Malipo ya M-Pesa'}
              </h3>

              <div className="divide-y divide-gray-100">
                {subStatus.history.map((h, i) => (
                  <div key={i} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-800 block">{h.amount}</span>
                      <span className="text-[10px] text-gray-400">Ref: {h.mpesa} • {h.date}</span>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-[#006948]">
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Column: Shop Profile & Data Backup (5 cols) */}
          <section className="lg:col-span-5 space-y-6">
            {/* Shop Profile Settings */}
            <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#171d19] mb-4">
                {lang === 'en' ? 'Shop Profile' : 'Wasifu wa Duka Lako'}
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-3">
                {saveSuccess && (
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 font-bold border border-emerald-200">
                    ✓ Taarifa zimehifadhiwa kikamilifu!
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Jina la Duka / Shop Name
                  </label>
                  <input
                    value={shopName}
                    onChange={e => setShopName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-300 px-3 text-xs focus:border-[#006948] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Jina la Mwenye Duka / Owner Name
                  </label>
                  <input
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-300 px-3 text-xs focus:border-[#006948] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Nambari ya Simu (M-Pesa)
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-300 px-3 text-xs focus:border-[#006948] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Eneo / Location
                  </label>
                  <input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-300 px-3 text-xs focus:border-[#006948] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-900 py-2.5 text-xs font-bold text-white hover:bg-black transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Hifadhi Mabadiliko</span>
                </button>
              </form>
            </div>

            {/* Offline Database Backup & Restore */}
            <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-4 w-4 text-[#006948]" />
                <h3 className="text-sm font-extrabold text-[#171d19]">
                  {lang === 'en' ? 'Offline Database & Backup' : 'Hifadhi Nakala ya Duka (Backup)'}
                </h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Data yako yote ya stoki, mauzo na risiti huhifadhiwa ndani ya simu yako kwa SQLite. Unaweza kupakua nakala ili kulinda biashara yako ukibadilisha kifaa.
              </p>

              {importMessage && (
                <div className="mb-3 rounded-xl bg-emerald-50 p-2 text-xs text-emerald-800 font-bold">
                  {importMessage}
                </div>
              )}

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={exporting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#006948] py-2.5 text-xs font-bold text-[#006948] hover:bg-emerald-50 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{exporting ? 'Inatayarisha...' : 'Pakua Nakala (Export Backup)'}</span>
                </button>

                <label className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition">
                  <Upload className="h-3.5 w-3.5 text-gray-500" />
                  <span>Rejesha Nakala (Restore File)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* M-Pesa STK Push Simulation Modal */}
      {showStkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm max-h-[92vh] flex flex-col overflow-y-auto rounded-3xl bg-white p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs">
                  M
                </span>
                <span className="text-sm font-extrabold text-[#171d19]">Lipa na M-Pesa STK</span>
              </div>
              <button
                onClick={() => setShowStkModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {stkStatus === 'idle' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Weka nambari ya simu ya Safaricom itakayopokea ujumbe wa kulipa <strong>KSh 500</strong> ya usajili wa mwezi:
                </p>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Nambari ya Simu
                  </label>
                  <input
                    value={stkPhone}
                    onChange={e => setStkPhone(e.target.value)}
                    placeholder="07XX XXX XXX au 01XX XXX XXX"
                    className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStkModal(false)}
                    className="flex-1 rounded-xl border border-gray-300 py-2.5 text-xs font-bold text-gray-700"
                  >
                    Ghairi
                  </button>
                  <button
                    type="button"
                    onClick={handleStartStkPush}
                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition"
                  >
                    Tuma Ujumbe (STK)
                  </button>
                </div>
              </div>
            )}

            {stkStatus === 'sending' && (
              <div className="py-8 text-center space-y-3">
                <RefreshCw className="mx-auto h-8 w-8 text-emerald-600 animate-spin" />
                <h4 className="font-bold text-sm text-[#171d19]">Inatuma ujumbe wa M-Pesa...</h4>
                <p className="text-xs text-gray-500">Inawasiliana na Safaricom Daraja API</p>
              </div>
            )}

            {stkStatus === 'waiting_pin' && (
              <div className="py-6 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 animate-bounce">
                  <Smartphone className="h-7 w-7" />
                </div>
                <h4 className="font-black text-sm text-[#171d19]">Angalia Simu Yako!</h4>
                <div className="rounded-2xl bg-gray-50 p-3 text-xs text-gray-700 border border-gray-200 text-left space-y-1">
                  <p className="font-bold">Do you want to pay KES 500 to BiasharaPro?</p>
                  <p className="text-[11px] text-gray-500">Enter M-PESA PIN to confirm.</p>
                </div>
                <p className="text-[11px] text-gray-400">Inasubiri uthibitisho wa PIN...</p>
              </div>
            )}

            {stkStatus === 'success' && (
              <div className="py-4 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-black text-base text-[#171d19]">Malipo Yamethibitishwa!</h4>
                <p className="text-xs text-gray-600">
                  Umefanikiwa kulipa <strong>KSh 500</strong> kwa mwezi mwingine wa BiasharaPro.
                </p>
                <div className="rounded-xl bg-gray-100 p-2 font-mono text-xs text-gray-700">
                  Ref Code: <strong>{stkReceiptCode}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStkModal(false)}
                  className="w-full rounded-xl bg-[#006948] py-2.5 text-xs font-bold text-white mt-2"
                >
                  Sawa, Endelea
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
