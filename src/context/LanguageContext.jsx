import React, { createContext, useContext, useState, useEffect } from 'react';
import { en, sw } from '../translations';
import { LANGUAGE_UPDATED_EVENT, readStoredLanguage, writeStoredLanguage } from '../utils/preferences';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => readStoredLanguage());

  useEffect(() => {
    writeStoredLanguage(language);
  }, [language]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleLanguageUpdated = (event) => {
      const nextLanguage = event.detail === 'sw' ? 'sw' : 'en';
      setLanguage(nextLanguage);
    };

    window.addEventListener(LANGUAGE_UPDATED_EVENT, handleLanguageUpdated);

    return () => window.removeEventListener(LANGUAGE_UPDATED_EVENT, handleLanguageUpdated);
  }, []);

  const translations = language === 'sw' ? sw : en;

  const switchLanguage = (lang) => {
    if (lang === 'en' || lang === 'sw') {
      setLanguage(lang);
    }
  };

  const value = {
    language,
    switchLanguage,
    setLanguage: switchLanguage,
    t: translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
