import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLang from '../hooks/useLang';
import heroImage from '../assets/hero.jpg';

const ONBOARDING_COMPLETE_KEY = 'biasharapro_onboarding_complete';
const PROFILE_KEY = 'biasharapro_profile';

const businessTypes = [
  { value: 'retail', en: 'Retail Shop', sw: 'Duka la Rejareja' },
  { value: 'hardware', en: 'Hardware Store', sw: 'Duka la Hardware' },
  { value: 'salon', en: 'Salon', sw: 'Saluni' },
  { value: 'pharmacy', en: 'Pharmacy / Drug Store', sw: 'Madawa / Duka la Dawa' },
  { value: 'cafe', en: 'Cafe / Restaurant', sw: 'Mkahawa / Cafe' },
  { value: 'other', en: 'Other', sw: 'Nyingine' },
];

const languageChoices = [
  { code: 'en', flag: '🇬🇧', label: 'English', helper: 'Continue in English' },
  { code: 'sw', flag: '🇰🇪', label: 'Kiswahili', helper: 'Endelea kwa Kiswahili' },
];

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotProgress() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {[0, 1, 2, 3].map(index => (
        <span
          key={index}
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: index === 0 ? '#006948' : '#bccac0' }}
        />
      ))}
    </div>
  );
}

function getStoredProfile() {
  if (typeof window === 'undefined') return null;

  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { lang, switchLang, t } = useLang();
  const [selectedLang, setSelectedLang] = useState(lang === 'en' || lang === 'sw' ? lang : 'sw');
  const [formData, setFormData] = useState(() => {
    const profile = getStoredProfile();

    return {
      shopName: profile?.shopName || 'Mama Wanjiku General Store',
      phone: profile?.phone || '',
      businessType: profile?.businessType || 'retail',
    };
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (lang === 'en' || lang === 'sw') {
      setSelectedLang(lang);
    }
  }, [lang]);

  const heroCopy = useMemo(() => {
    if (selectedLang === 'en') {
      return {
        heading: 'Grow your business today.',
        subheading: 'Join thousands of shop owners using BiasharaPro to manage sales and stock with ease.',
        welcome: 'Welcome to BiasharaPro!',
        intro: 'Help us understand your business so we can get started.',
        step: 'Step 1 of 4',
        nameLabel: 'BUSINESS NAME',
        phoneLabel: 'PHONE NUMBER',
        typeLabel: 'BUSINESS TYPE',
        continue: 'Continue',
        languageTitle: 'Choose your language',
      };
    }

    return {
      heading: 'Boresha biashara yako leo.',
      subheading: 'Jiunge na maelfu ya wamiliki wa maduka wanaotumia BiasharaPro kusimamia mauzo na akiba zao kwa urahisi.',
      welcome: 'Karibu BiasharaPro!',
      intro: 'Tusaidie kufahamu biashara yako ili tuanze safari yetu.',
      step: 'Hatua ya 1 kati ya 4',
      nameLabel: 'JINA LA BIASHARA',
      phoneLabel: 'NAMBA YA SIMU',
      typeLabel: 'AINA YA BIASHARA',
      continue: 'Endelea',
      languageTitle: 'Chagua lugha yako',
    };
  }, [selectedLang]);

  const businessTypeLabel = useMemo(() => {
    return businessTypes.find(item => item.value === formData.businessType)?.[selectedLang === 'en' ? 'en' : 'sw'] || formData.businessType;
  }, [formData.businessType, selectedLang]);

  const updateField = (key, value) => {
    setFormData(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    const phoneDigits = formData.phone.replace(/\D/g, '');

    if (!formData.shopName.trim()) {
      nextErrors.shopName = selectedLang === 'en' ? 'Business name is required.' : 'Jina la biashara linahitajika.';
    }

    if (!phoneDigits || phoneDigits.length < 9) {
      nextErrors.phone = selectedLang === 'en' ? 'Enter a valid phone number.' : 'Weka namba ya simu iliyo sahihi.';
    }

    if (!formData.businessType) {
      nextErrors.businessType = selectedLang === 'en' ? 'Pick a business type.' : 'Chagua aina ya biashara.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSaving(true);
    switchLang(selectedLang);

    const profile = {
      shopName: formData.shopName.trim(),
      phone: formData.phone.replace(/\D/g, ''),
      businessType: formData.businessType,
      language: selectedLang,
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }

    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#171d19] lg:flex">
      <aside className="relative hidden min-h-screen overflow-hidden lg:block lg:w-[42%] xl:w-[46%]">
        <img src={heroImage} alt="BiasharaPro shop hero" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(26,46,26,0.86),rgba(26,46,26,0.42))]" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="text-[13px] font-semibold uppercase tracking-[0.25em] text-white/75">BiasharaPro</p>
          <h1 className="mt-4 max-w-xl text-[48px] font-extrabold leading-[0.98] tracking-[-0.04em]">
            {heroCopy.heading}
          </h1>
          <p className="mt-5 max-w-xl text-[18px] leading-8 text-white/90">{heroCopy.subheading}</p>
        </div>
      </aside>

      <main className="flex min-h-screen w-full items-start justify-center px-4 py-4 sm:px-6 lg:w-[58%] lg:items-center lg:px-10 lg:py-10 xl:w-[54%]">
        <section className="w-full max-w-140 overflow-hidden rounded-4xl border border-[rgba(228,228,231,0.9)] bg-white shadow-[0_24px_60px_rgba(26,46,26,0.12)]">
          <div className="lg:hidden">
            <div className="relative h-48 overflow-hidden">
              <img src={heroImage} alt="BiasharaPro shop hero" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,46,26,0.15),rgba(26,46,26,0.78))]" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">BiasharaPro</p>
                <h1 className="mt-2 max-w-sm text-[28px] font-extrabold leading-[1.02] tracking-[-0.03em]">
                  {heroCopy.heading}
                </h1>
              </div>
            </div>
          </div>

          <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-8 sm:pt-7 lg:px-9 lg:pb-10 lg:pt-9">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1a2e1a] text-white shadow-sm">
                    <span className="text-[18px] font-extrabold">BP</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1a2e1a]">BiasharaPro</p>
                    <p className="text-[12px] text-[#6b7280]">Offline-first retail tools</p>
                  </div>
                </div>

                <h2 className="mt-6 text-[24px] font-extrabold leading-tight text-[#171d19] sm:text-[28px]">
                  {heroCopy.welcome}
                </h2>
                <p className="mt-2 max-w-xl text-[15px] leading-7 text-[#3d4a42] sm:text-[16px]">{heroCopy.intro}</p>
              </div>

              <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafaf9] px-4 py-3 text-left sm:min-w-48">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7280]">{heroCopy.step}</p>
                <div className="mt-3">
                  <DotProgress />
                </div>
                <p className="mt-3 text-[12px] text-[#6b7280]">{selectedLang === 'en' ? 'One screen, one quick setup.' : 'Skrini moja, usanidi wa haraka.'}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-[#eef0ec] bg-[#fcf9f4] p-4 sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b7280]">{heroCopy.languageTitle}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {languageChoices.map(option => {
                  const active = selectedLang === option.code;

                  return (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => setSelectedLang(option.code)}
                      className="rounded-2xl border px-4 py-3 text-left transition-all"
                      style={{
                        borderColor: active ? '#1a2e1a' : '#d1d5db',
                        background: active ? '#edf4ed' : '#ffffff',
                        boxShadow: active ? '0 10px 24px rgba(26,46,26,0.08)' : 'none',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[22px]" aria-hidden="true">{option.flag}</span>
                        <div>
                          <div className="text-[14px] font-bold text-[#171d19]">{option.label}</div>
                          <div className="text-[12px] text-[#6b7280]">{option.helper}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.18em] text-[#3d4a42]">
                  {heroCopy.nameLabel}
                </label>
                <input
                  value={formData.shopName}
                  onChange={event => updateField('shopName', event.target.value)}
                  className="w-full rounded-2xl border border-[#bccac0] bg-white px-4 py-4 text-[15px] text-[#171d19] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#1a2e1a]"
                  placeholder={selectedLang === 'en' ? 'e.g. Mama Wanjiku General Store' : 'mf. Mama Wanjiku General Store'}
                />
                {errors.shopName ? <p className="mt-2 text-[12px] font-medium text-[#dc2626]">{errors.shopName}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.18em] text-[#3d4a42]">
                  {heroCopy.phoneLabel}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#3d4a42]">+254</span>
                  <input
                    value={formData.phone}
                    onChange={event => updateField('phone', event.target.value)}
                    inputMode="numeric"
                    className="w-full rounded-2xl border border-[#bccac0] bg-white py-4 pl-16 pr-4 text-[15px] text-[#171d19] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#1a2e1a]"
                    placeholder={selectedLang === 'en' ? '712 345 678' : '712 345 678'}
                  />
                </div>
                {errors.phone ? <p className="mt-2 text-[12px] font-medium text-[#dc2626]">{errors.phone}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.18em] text-[#3d4a42]">
                  {heroCopy.typeLabel}
                </label>
                <div className="relative">
                  <select
                    value={formData.businessType}
                    onChange={event => updateField('businessType', event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-[#bccac0] bg-white px-4 py-4 pr-12 text-[15px] text-[#171d19] outline-none transition-colors focus:border-[#1a2e1a]"
                  >
                    {businessTypes.map(option => (
                      <option key={option.value} value={option.value}>
                        {option[selectedLang === 'en' ? 'en' : 'sw']}
                      </option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M7 10l5 5 5-5" stroke="#3d4a42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {errors.businessType ? <p className="mt-2 text-[12px] font-medium text-[#dc2626]">{errors.businessType}</p> : null}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a2e1a] px-5 py-4 text-[15px] font-bold text-white shadow-[0_16px_28px_rgba(26,46,26,0.18)] transition-colors hover:bg-[#132513] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>{heroCopy.continue}</span>
                <ArrowRightIcon />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-[12px] text-[#6b7280]">
              <span>{selectedLang === 'en' ? 'Saved locally for offline use.' : 'Imehifadhiwa kwenye kifaa kwa matumizi ya offline.'}</span>
              <span className="font-semibold text-[#1a2e1a]">{businessTypeLabel}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}