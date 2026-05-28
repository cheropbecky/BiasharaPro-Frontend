import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { writeStoredProfile } from '../utils/preferences';
import {
  Globe,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Building2,
  Phone,
  Store,
  Wallet,
  Target,
} from 'lucide-react';

const ONBOARDING_COMPLETE_KEY = 'biasharapro_onboarding_complete';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { t, language, switchLanguage } = useLanguage();
  const [languageSelected, setLanguageSelected] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    phoneNumber: '',
    businessType: '',
    revenue: '',
    goal: '',
  });

  const businessTypeOptions = {
    en: ['Retail Store', 'Service Business', 'Manufacturing', 'Agribusiness', 'Wholesale', 'Other'],
    sw: ['Duka la Rejareja', 'Biashara ya Huduma', 'Uzalishaji', 'Kilimo Biashara', 'Jumla', 'Nyingine'],
  };

  const revenueRangeOptions = {
    en: ['0 - 50,000 Kes', '50,000 - 200,000 Kes', '200,000 - 500,000 Kes', '500,000+ Kes'],
    sw: ['0 - 50,000 Kes', '50,000 - 200,000 Kes', '200,000 - 500,000 Kes', '500,000+ Kes'],
  };

  const businessGoalOptions = {
    en: ['Track Daily Sales', 'Manage Inventory', 'Generate Reports', 'Accept Digital Payments', 'Get Business Loans'],
    sw: ['Fuatilia Mauzo ya Kila Siku', 'Simamia Bidhaa', 'Tengeneza Ripoti', 'Pokea Malipo ya Kidijitali', 'Pata Mikopo ya Biashara'],
  };

  const stepMeta = [
    { title: t.step1Title, description: t.step1Desc, icon: Building2 },
    { title: t.step2Title, description: t.step2Desc, icon: Store },
    { title: t.step3Title, description: t.step3Desc, icon: Wallet },
    { title: t.step4Title, description: t.step4Desc, icon: Target },
  ];

  const stepCounters = [t.step1Of4, t.step2Of4, t.step3Of4, t.step4Of4];
  const currentStep = stepMeta[step - 1] || stepMeta[0];
  const currentStepCount = stepCounters[step - 1] || t.step1Of4;

  const handleLanguageSelect = (nextLanguage) => {
    // debug: ensure handler is called
    // set local UI state so the selection is visible immediately
    console.log('Onboarding: selecting language', nextLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('biasharapro_debug_onboarding_click', nextLanguage);
    }
    setLanguageSelected(true);
    switchLanguage(nextLanguage);
    // Mark onboarding complete and go straight to dashboard
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      window.location.replace('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleNext = () => setStep((previous) => previous + 1);
  const handleBack = () => setStep((previous) => previous - 1);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    }

    writeStoredProfile({
      shopName: formData.businessName,
      phoneNumber: formData.phoneNumber,
      businessType: formData.businessType,
      revenue: formData.revenue,
      goal: formData.goal,
      language,
      location: '',
      avatarUrl: '',
    });

    if (typeof window !== 'undefined') {
      window.location.replace('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  if (!languageSelected) {
    return (
      <div
        className="relative min-h-screen overflow-hidden px-4 py-10 text-[#171d19]"
        style={{
          backgroundImage:
            'radial-gradient(circle at top left, rgba(196,98,45,0.10), transparent 30%), radial-gradient(circle at bottom right, rgba(26,46,26,0.14), transparent 34%), linear-gradient(180deg, #fcf9f4 0%, #fafaf9 100%)',
          fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl items-center justify-center">
          <div className="w-full rounded-4xl border border-[#e8e1d3] bg-white/95 p-6 shadow-[0_20px_60px_rgba(26,46,26,0.10)] backdrop-blur sm:p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1a2e1a]/10 text-[#1a2e1a]">
                <Globe className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#171d19] sm:text-3xl">{t.chooseLanguage || 'Choose Your Language'}</h1>
                <p className="mt-2 text-[14px] text-[#4b5a50]">Chagua lugha yako ili uendelee</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <button
                onClick={() => handleLanguageSelect('en')}
                className="group flex items-center justify-between rounded-2xl border border-[#d8e1d3] bg-[#fafaf9] p-4 transition-all duration-200 hover:border-[#1a2e1a] hover:bg-[#eff5ef]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a2e1a]/10 text-sm font-extrabold text-[#1a2e1a]">EN</span>
                  <div className="text-left">
                    <p className="font-bold text-[#171d19]">English</p>
                    <p className="text-xs text-[#6b7280]">Continue in English</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-[#c8d3c8] transition-colors group-hover:text-[#1a2e1a]" />
              </button>

              <button
                onClick={() => handleLanguageSelect('sw')}
                className="group flex items-center justify-between rounded-2xl border border-[#d8e1d3] bg-[#fafaf9] p-4 transition-all duration-200 hover:border-[#c4622d] hover:bg-[#fcf4ee]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c4622d]/10 text-sm font-extrabold text-[#c4622d]">SW</span>
                  <div className="text-left">
                    <p className="font-bold text-[#171d19]">Kiswahili</p>
                    <p className="text-xs text-[#6b7280]">Endelea kwa Kiswahili</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-[#c8d3c8] transition-colors group-hover:text-[#c4622d]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden text-[#171d19]"
      style={{
        backgroundImage:
          'radial-gradient(circle at top left, rgba(196,98,45,0.10), transparent 28%), radial-gradient(circle at right 25%, rgba(212,160,23,0.10), transparent 22%), linear-gradient(180deg, #fcf9f4 0%, #fafaf9 100%)',
        fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div className="absolute -left-24 top-20 h-48 w-48 rounded-full bg-[#1a2e1a]/5 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-20 top-1/2 h-56 w-56 rounded-full bg-[#c4622d]/10 blur-3xl" aria-hidden="true" />

      <div className="mx-auto w-full max-w-4xl px-4 py-8 lg:py-10">
        <div className="mb-6 flex flex-col gap-3 rounded-[28px] border border-[#e8e1d3] bg-white/80 px-5 py-4 shadow-[0_10px_30px_rgba(26,46,26,0.06)] backdrop-blur lg:px-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#c4622d]">{t.welcome}</p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-[26px] font-extrabold tracking-tight text-[#171d19] sm:text-[32px]">
                {t.heroHeading || 'Grow your business today.'}
              </h1>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#4b5a50] sm:text-[15px]">
                {t.heroSubheading || t.onboardingIntro}
              </p>
            </div>
            <div className="rounded-full bg-[#1a2e1a]/8 px-4 py-2 text-[12px] font-bold uppercase tracking-wide text-[#1a2e1a]">
              {currentStepCount}
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 lg:grid-cols-4">
          {stepMeta.map((item, index) => {
            const Icon = item.icon;
            const isComplete = step > index + 1;
            const isActive = step === index + 1;

            return (
              <div
                key={item.title}
                className={`rounded-2xl border px-4 py-4 shadow-sm transition-all ${
                  isActive
                    ? 'border-[#1a2e1a] bg-[#eff5ef]'
                    : isComplete
                      ? 'border-[#d7e3d6] bg-white'
                      : 'border-[#e8e1d3] bg-white/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${
                      isComplete
                        ? 'bg-[#1a2e1a] text-white'
                        : isActive
                          ? 'bg-[#c4622d] text-white'
                          : 'border border-[#e8e1d3] bg-[#fafaf9] text-[#9ca3af]'
                    }`}
                  >
                    {isComplete ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[12px] font-extrabold uppercase tracking-wide ${isActive ? 'text-[#1a2e1a]' : 'text-[#8a948c]'}`}>
                      {item.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-[#5c6960]">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-4xl border border-[#e8e1d3] bg-white/95 p-5 shadow-[0_20px_60px_rgba(26,46,26,0.10)] backdrop-blur sm:p-6 lg:p-8">
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#ece7de]">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#1a2e1a] via-[#c4622d] to-[#d4a017] transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#171d19]">{currentStep.title}</h2>
              <p className="text-[#4b5a50]">{currentStep.description}</p>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4a42]">{t.businessNameLabel}</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder={t.businessNamePlaceholder}
                    className="w-full rounded-2xl border border-[#e3ddd0] bg-[#fafaf9] p-4 text-[15px] outline-none transition focus:border-[#1a2e1a] focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4a42]">{t.phoneLabel}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca3af]" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="07... or +254..."
                      className="w-full rounded-2xl border border-[#e3ddd0] bg-[#fafaf9] p-4 pl-12 text-[15px] outline-none transition focus:border-[#1a2e1a] focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {businessTypeOptions[language].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData((previous) => ({ ...previous, businessType: type }))}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      formData.businessType === type
                        ? 'border-[#1a2e1a] bg-[#eff5ef] text-[#1a2e1a]'
                        : 'border-[#e8e1d3] bg-white hover:border-[#c4622d] hover:bg-[#fcf4ee]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                {revenueRangeOptions[language].map((range) => (
                  <button
                    key={range}
                    onClick={() => setFormData((previous) => ({ ...previous, revenue: range }))}
                    className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                      formData.revenue === range
                        ? 'border-[#1a2e1a] bg-[#eff5ef] text-[#1a2e1a]'
                        : 'border-[#e8e1d3] bg-white hover:border-[#c4622d] hover:bg-[#fcf4ee]'
                    }`}
                  >
                    <span className="font-medium">{range}</span>
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        formData.revenue === range ? 'border-[#1a2e1a] bg-[#1a2e1a]' : 'border-[#c8d3c8]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                {businessGoalOptions[language].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setFormData((previous) => ({ ...previous, goal: goal }))}
                    className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                      formData.goal === goal
                        ? 'border-[#1a2e1a] bg-[#eff5ef] text-[#1a2e1a]'
                        : 'border-[#e8e1d3] bg-white hover:border-[#c4622d] hover:bg-[#fcf4ee]'
                    }`}
                  >
                    <span className="font-medium">{goal}</span>
                    {formData.goal === goal && <CheckCircle className="h-5 w-5 text-[#1a2e1a]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center gap-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-2xl border border-[#e3ddd0] bg-white px-6 py-4 font-semibold text-[#4b5a50] transition-all hover:border-[#c4622d] hover:bg-[#fcf4ee]"
              >
                <ChevronLeft className="w-5 h-5" />
                {t.backBtn}
              </button>
            )}
            <button
              onClick={step === 4 ? handleComplete : handleNext}
              disabled={
                (step === 1 && (!formData.businessName || !formData.phoneNumber)) ||
                (step === 2 && !formData.businessType) ||
                (step === 3 && !formData.revenue) ||
                (step === 4 && !formData.goal)
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1a2e1a] p-4 font-bold text-white shadow-[0_10px_20px_rgba(26,46,26,0.15)] transition-all hover:bg-[#243f24] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 4 ? t.getStarted : t.continueBtn}
              {step < 4 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
