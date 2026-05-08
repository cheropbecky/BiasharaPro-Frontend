import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLang from '../hooks/useLang';
import heroImage from '../assets/hero.jpg';

const baseFieldClass =
  'w-full text-[16px] text-[#171d19] bg-[rgba(255,255,255,0.5)] border border-[#bccac0] rounded-2xl p-4.25 focus:outline-none focus:border-[#006948]';

const countyOptions = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Nyeri',
  'Thika',
  'Nyingine / Other',
];

const currencyOptions = ['KES (Kenyan Shilling)', 'UGX', 'TZS', 'USD'];

function Stepper({ currentStep }) {
  return (
    <div className="mt-4 flex gap-2">
      {[1, 2, 3].map(step => (
        <div
          key={step}
          className="h-1.5 w-8 rounded-full"
          style={{ backgroundColor: step <= currentStep ? '#006948' : '#bccac0' }}
        />
      ))}
    </div>
  );
}

function LogoRow() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#006948]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 11L12 4l9 7v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8z" fill="#fff" />
        </svg>
      </div>
      <div className="text-[24px] font-extrabold text-[#006948]">BiasharaPro</div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { lang, switchLang, t } = useLang();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState(lang === 'en' || lang === 'sw' ? lang : null);

  const [formData, setFormData] = useState({
    shopName: 'Mama Wanjiku General Store',
    phone: '',
    businessType: 'retail',
    currency: 'KES (Kenyan Shilling)',
    county: 'Nairobi',
  });

  const languageChosen = selectedLang === 'en' || selectedLang === 'sw';

  const leftPanelText = useMemo(() => {
    if (currentStep === 2) return t('leftStep2');
    if (currentStep === 3) return t('leftStep3');
    return t('leftStep1');
  }, [currentStep, t]);

  const handleContinueLanguage = () => {
    if (!selectedLang) return;
    switchLang(selectedLang);
    localStorage.setItem('biasharapro_lang', selectedLang);
    setCurrentStep(1);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const businessTypeLabel = {
    retail: t('retailShop'),
    hardware: t('hardware'),
    salon: t('salon'),
    pharmacy: t('pharmacy'),
    cafe: t('cafe'),
    other: t('other'),
  }[formData.businessType];

  return (
    <div
      className="min-h-screen md:h-screen overflow-hidden md:flex md:flex-row flex-col"
      style={{ fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}
    >
      <aside className="relative overflow-hidden md:w-1/2 w-full h-50 md:h-full bg-[#006948] text-white shrink-0" aria-hidden="true">
        <img
          src={heroImage}
          alt="BiasharaPro hero"
          className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-60"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(128deg, rgba(0,105,72,0.8) 0%, rgba(0,133,93,0.4) 100%)',
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <h2 className="text-[32px] md:text-[48px] font-extrabold leading-[1.1]" style={{ letterSpacing: '-0.5px' }}>
            {leftPanelText}
          </h2>
          <p className="mt-4 hidden md:block max-w-md text-[18px] leading-[1.6] text-[#f5fff7]">
            {lang === 'en'
              ? 'Join thousands of shop owners using BiasharaPro to track sales and savings with ease.'
              : 'Jiunge na maelfu ya wamiliki wa maduka wanaotumia BiasharaPro kusimamia mauzo na akiba zao kwa urahisi.'}
          </p>
        </div>
      </aside>

      <main className="md:w-1/2 w-full bg-[#eff5ef] flex items-center justify-center p-6 md:p-12 overflow-y-auto md:overflow-hidden">
        <div
          className="w-full max-w-120 rounded-3xl"
          style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(226,232,240,0.5)',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          }}
        >
          <LogoRow />

          {!languageChosen ? (
            <div className="mt-10">
              <h3 className="text-center text-[22px] font-bold text-[#171d19]">Choose your language / Chagua lugha yako</h3>
              <p className="mt-2 text-center text-[14px] text-[#6b7280]">
                You can change this later in settings. / Unaweza kubadilisha baadaye.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {[
                  { code: 'en', flag: '🇬🇧', title: 'English', subtitle: 'Continue in English' },
                  { code: 'sw', flag: '🇰🇪', title: 'Kiswahili', subtitle: 'Endelea kwa Kiswahili' },
                ].map(option => {
                  const isSelected = selectedLang === option.code;
                  return (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => setSelectedLang(option.code)}
                      className="w-full rounded-2xl border-2 px-6 py-5 text-left transition-colors"
                      style={{
                        borderColor: isSelected ? '#006948' : '#bccac0',
                        background: isSelected ? '#eff5ef' : '#fff',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[24px]" aria-hidden="true">{option.flag}</span>
                        <div>
                          <p className="text-[18px] font-bold text-[#171d19]">{option.title}</p>
                          <p className="text-[14px] text-[#6b7280]">{option.subtitle}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleContinueLanguage}
                disabled={!selectedLang}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl text-[16px] text-white"
                style={{
                  background: selectedLang ? '#006948' : '#7aa999',
                  paddingTop: '17px',
                  paddingBottom: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                  transition: 'background 200ms',
                }}
              >
                <span>Endelea / Continue</span>
                <ArrowRightIcon />
              </button>
            </div>
          ) : (
            <>
              <h3 className="mt-10 text-[24px] font-extrabold text-[#171d19] leading-[1.2]">{t('welcomeTitle')}</h3>
              <p className="mt-2 text-[16px] text-[#3d4a42] leading-normal">{t('welcomeSubtitle')}</p>
              <Stepper currentStep={currentStep} />

              {currentStep === 1 && (
                <form className="mt-9.75 flex flex-col gap-3.75" onSubmit={e => e.preventDefault()}>
                  <div>
                    <label className="mb-[8.59px] block text-[14px] font-semibold uppercase tracking-[0.7px] text-[#3d4a42]">
                      {t('businessNameLabel')}
                    </label>
                    <input
                      value={formData.shopName}
                      onChange={e => updateField('shopName', e.target.value)}
                      className={baseFieldClass}
                      placeholder={t('businessNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="mb-[8.59px] block text-[14px] font-semibold uppercase tracking-[0.7px] text-[#3d4a42]">
                      {t('phoneLabel')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[#3d4a42]">+254</span>
                      <input
                        value={formData.phone}
                        onChange={e => updateField('phone', e.target.value)}
                        placeholder={t('phonePlaceholder')}
                        className={`${baseFieldClass} pl-15.25 placeholder-[#6b7280]`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-[8.59px] block text-[14px] font-semibold uppercase tracking-[0.7px] text-[#3d4a42]">
                      {t('businessTypeLabel')}
                    </label>
                    <div className="relative">
                      <select
                        value={formData.businessType}
                        onChange={e => updateField('businessType', e.target.value)}
                        className={`${baseFieldClass} appearance-none pr-12`}
                      >
                        <option value="retail">{t('retailShop')}</option>
                        <option value="hardware">{t('hardware')}</option>
                        <option value="salon">{t('salon')}</option>
                        <option value="pharmacy">{t('pharmacy')}</option>
                        <option value="cafe">{t('cafe')}</option>
                        <option value="other">{t('other')}</option>
                      </select>
                      <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M7 10l5 5 5-5" stroke="#3d4a42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006948] text-[16px] text-white transition-colors hover:bg-[#005a3d]"
                    style={{
                      paddingTop: '17px',
                      paddingBottom: '16px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <span>{t('continue')}</span>
                    <ArrowRightIcon />
                  </button>
                </form>
              )}

              {currentStep === 2 && (
                <form className="mt-9.75 flex flex-col gap-3.75" onSubmit={e => e.preventDefault()}>
                  <div>
                    <label className="mb-[8.59px] block text-[14px] font-semibold uppercase tracking-[0.7px] text-[#3d4a42]">
                      {t('currencyLabel')}
                    </label>
                    <div className="relative">
                      <select
                        value={formData.currency}
                        onChange={e => updateField('currency', e.target.value)}
                        className={`${baseFieldClass} appearance-none pr-12`}
                      >
                        {currencyOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M7 10l5 5 5-5" stroke="#3d4a42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className="mb-[8.59px] block text-[14px] font-semibold uppercase tracking-[0.7px] text-[#3d4a42]">
                      {t('countyLabel')}
                    </label>
                    <div className="relative">
                      <select
                        value={formData.county}
                        onChange={e => updateField('county', e.target.value)}
                        className={`${baseFieldClass} appearance-none pr-12`}
                      >
                        {countyOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M7 10l5 5 5-5" stroke="#3d4a42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006948] text-[16px] text-white transition-colors hover:bg-[#005a3d]"
                    style={{
                      paddingTop: '17px',
                      paddingBottom: '16px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <span>{t('continue')}</span>
                    <ArrowRightIcon />
                  </button>
                </form>
              )}

              {currentStep === 3 && (
                <div className="mt-9.75">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#006948]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M20 7 10 17l-5-5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h4 className="mt-5 text-center text-[24px] font-bold text-[#171d19]">{t('doneTitle')}</h4>
                  <p className="mt-2 text-center text-[16px] text-[#3d4a42]">{t('doneSubtitle')}</p>

                  <div className="mt-6 rounded-2xl bg-[#eff5ef] p-5 text-[14px] text-[#3d4a42]">
                    <p><span className="font-semibold text-[#171d19]">Shop name:</span> {formData.shopName || '-'}</p>
                    <p className="mt-1"><span className="font-semibold text-[#171d19]">Phone:</span> {formData.phone ? `+254 ${formData.phone}` : '-'}</p>
                    <p className="mt-1"><span className="font-semibold text-[#171d19]">Business type:</span> {businessTypeLabel}</p>
                    <p className="mt-1"><span className="font-semibold text-[#171d19]">County:</span> {formData.county}</p>
                    <p className="mt-1"><span className="font-semibold text-[#171d19]">Currency:</span> {formData.currency}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006948] text-[16px] text-white transition-colors hover:bg-[#005a3d]"
                    style={{
                      paddingTop: '17px',
                      paddingBottom: '16px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <span>{t('goDashboard')}</span>
                    <ArrowRightIcon />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
