import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Image as ImageIcon, Languages, MapPin, Save } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import { useNavigationSystem } from '../components/navigation/NavigationProvider';
import { writeStoredProfile, clearStoredProfile } from '../utils/preferences';
import image1 from '../assets/image1.jpg';
import useSidebar from '../hooks/useSidebar';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Unable to read image'));
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { lang, switchLang, t } = useLang();
  const { profile, showToast } = useNavigationSystem();
  const [formData, setFormData] = useState({
    shopName: 'Wanjiku Stores',
    location: '',
    avatarUrl: '',
    language: 'en',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      shopName: profile?.shopName || 'Wanjiku Stores',
      location: profile?.location || '',
      avatarUrl: profile?.avatarUrl || '',
      language: profile?.language || lang || 'en',
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const avatarUrl = await readFileAsDataUrl(file);
    setFormData((previous) => ({ ...previous, avatarUrl }));
  };

  const handleLanguageChange = (nextLanguage) => {
    setFormData((previous) => ({ ...previous, language: nextLanguage }));
    switchLang(nextLanguage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      writeStoredProfile({
        shopName: formData.shopName.trim() || 'Wanjiku Stores',
        location: formData.location.trim(),
        avatarUrl: formData.avatarUrl,
        language: formData.language,
      });

      switchLang(formData.language);
      showToast(lang === 'en' ? 'Profile saved' : 'Wasifu umehifadhiwa');
    } finally {
      setIsSaving(false);
    }
  };

  const avatarUrl = formData.avatarUrl || image1;
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#eff5ef] text-[#171d19] relative" style={{ fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <Sidebar />
      <TopBar />
      <BottomNav />

      <main className={`px-4 pb-20 pt-20 lg:px-8 ${collapsed ? 'lg:pl-20' : 'lg:pl-60'} lg:pb-8 transition-all duration-200 ease-in-out`}>
        <OfflineBanner />

        <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-extrabold text-[#171d19] lg:text-[28px]">{lang === 'en' ? 'Settings' : 'Mipangilio'}</h1>
            <p className="mt-1 text-[14px] text-[#3d4a42] lg:text-[16px]">
              {lang === 'en'
                ? 'Update your business details, profile picture, and language anytime.'
                : 'Sasisha maelezo ya biashara, picha ya wasifu, na lugha wakati wowote.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/offline')}
            className="rounded-full border border-[#c8d3c8] bg-white px-4 py-2 text-[13px] font-semibold text-[#3d4a42]"
          >
            {lang === 'en' ? 'Sync status' : 'Hali ya usawazishaji'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="rounded-3xl border border-[rgba(226,232,240,0.5)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#006948]/10 text-[#006948]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-extrabold text-[#171d19]">{lang === 'en' ? 'Business profile' : 'Wasifu wa biashara'}</h2>
                  <p className="text-[13px] text-[#6b7280]">
                    {lang === 'en' ? 'These details show across the app.' : 'Maelezo haya yanaonekana sehemu zote za programu.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                <label className="space-y-2">
                  <span className="text-[13px] font-semibold uppercase tracking-wide text-[#3d4a42]">
                    {lang === 'en' ? 'Business name' : 'Jina la biashara'}
                  </span>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca3af]" />
                    <input
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4 pl-12 text-[15px] outline-none transition focus:border-[#006948] focus:bg-white"
                      placeholder={lang === 'en' ? 'Mama Wanjiku General Store' : 'Duka la Mama Wanjiku'}
                    />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-[13px] font-semibold uppercase tracking-wide text-[#3d4a42]">
                    {lang === 'en' ? 'Location' : 'Mahali'}
                  </span>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca3af]" />
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4 pl-12 text-[15px] outline-none transition focus:border-[#006948] focus:bg-white"
                      placeholder={lang === 'en' ? 'Nairobi Central, CBD' : 'Nairobi Central, CBD'}
                    />
                  </div>
                </label>

                <div className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
                  <div className="space-y-3">
                    <span className="text-[13px] font-semibold uppercase tracking-wide text-[#3d4a42]">
                      {lang === 'en' ? 'Profile picture' : 'Picha ya wasifu'}
                    </span>
                    <img src={avatarUrl} alt="Profile preview" className="h-40 w-40 rounded-[28px] object-cover shadow-sm" />
                  </div>

                  <label className="flex h-full flex-col justify-center rounded-3xl border border-dashed border-[#c8d3c8] bg-[#fafaf9] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#006948]/10 text-[#006948]">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-[#171d19]">
                          {lang === 'en' ? 'Upload a new image' : 'Pakia picha mpya'}
                        </p>
                        <p className="text-[13px] text-[#6b7280]">
                          {lang === 'en' ? 'PNG, JPG, or WEBP works best.' : 'PNG, JPG, au WEBP zinafaa zaidi.'}
                        </p>
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="mt-4 text-[13px] text-[#3d4a42]" />
                  </label>
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-[rgba(226,232,240,0.5)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c4622d]/10 text-[#c4622d]">
                  <Languages className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-extrabold text-[#171d19]">{lang === 'en' ? 'Language' : 'Lugha'}</h2>
                  <p className="text-[13px] text-[#6b7280]">
                    {lang === 'en' ? 'Switch the app language instantly.' : 'Badilisha lugha ya programu mara moja.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${formData.language === 'en' ? 'border-[#006948] bg-[#eff5ef]' : 'border-[#e5e7eb] bg-white'}`}
                >
                  <div className="text-[15px] font-bold text-[#171d19]">English</div>
                  <div className="text-[13px] text-[#6b7280]">Continue in English</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLanguageChange('sw')}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${formData.language === 'sw' ? 'border-[#006948] bg-[#eff5ef]' : 'border-[#e5e7eb] bg-white'}`}
                >
                  <div className="text-[15px] font-bold text-[#171d19]">Kiswahili</div>
                  <div className="text-[13px] text-[#6b7280]">Endelea kwa Kiswahili</div>
                </button>
              </div>

              <div className="mt-6 rounded-2xl bg-[#fafaf9] p-4 text-[13px] text-[#3d4a42]">
                {lang === 'en'
                  ? 'Changes are saved locally and reflected across the app.'
                  : 'Mabadiliko huhifadhiwa kwenye kifaa na huonekana sehemu zote za programu.'}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006948] px-4 py-4 text-[15px] font-bold text-white transition hover:bg-[#00593e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-5 w-5" />
                {isSaving ? (lang === 'en' ? 'Saving...' : 'Inahifadhi...') : (lang === 'en' ? 'Save changes' : 'Hifadhi mabadiliko')}
              </button>
              <button
                type="button"
                onClick={() => {
                  clearStoredProfile();
                  if (typeof window !== 'undefined') {
                    window.location.replace('/');
                  } else {
                    navigate('/onboarding');
                  }
                }}
                className="mt-3 w-full rounded-2xl border border-[#e74c3c] bg-white px-4 py-3 text-[15px] font-bold text-[#e74c3c] hover:bg-[#fff5f5]"
              >
                {lang === 'en' ? 'Logout' : 'Ondoka'}
              </button>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}