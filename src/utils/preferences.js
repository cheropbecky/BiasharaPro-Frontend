import { PROFILE_KEY } from '../components/navigation/navConfig';

export const LANGUAGE_STORAGE_KEY = 'biasharapro_language';
export const LANGUAGE_UPDATED_EVENT = 'biasharapro:language-updated';
export const PROFILE_UPDATED_EVENT = 'biasharapro:profile-updated';
export const SIDEBAR_COLLAPSED_KEY = 'biasharapro_sidebar_collapsed';
export const TOOLTIP_KEY = 'biasharapro_nav_tooltips_seen';

function safeParse(value) {
  try {
    return JSON.parse(value || 'null');
  } catch {
    return null;
  }
}

export function readStoredLanguage() {
  if (typeof window === 'undefined') return 'en';

  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage === 'en' || storedLanguage === 'sw') return storedLanguage;

  const storedProfile = readStoredProfile();
  if (storedProfile?.language === 'en' || storedProfile?.language === 'sw') {
    return storedProfile.language;
  }

  return 'en';
}

export function writeStoredLanguage(language) {
  const nextLanguage = language === 'sw' ? 'sw' : 'en';

  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    window.dispatchEvent(new CustomEvent(LANGUAGE_UPDATED_EVENT, { detail: nextLanguage }));
  }

  return nextLanguage;
}

export function readStoredProfile() {
  if (typeof window === 'undefined') return null;
  const parsed = safeParse(localStorage.getItem(PROFILE_KEY));
  return parsed && typeof parsed === 'object' ? parsed : null;
}

export function writeStoredProfile(updates) {
  const nextProfile = {
    ...readStoredProfile(),
    ...updates,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: nextProfile }));
  }

  return nextProfile;
}

export function clearStoredProfile() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(PROFILE_KEY);
    // Clear onboarding so logout shows initial flow
    localStorage.removeItem('biasharapro_onboarding_complete');
    // Remove explicit language preference so user can choose again
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    // Reset UI prefs
    localStorage.removeItem(SIDEBAR_COLLAPSED_KEY);
    localStorage.removeItem(TOOLTIP_KEY);

    // Notify listeners
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: null }));
    window.dispatchEvent(new CustomEvent(LANGUAGE_UPDATED_EVENT, { detail: null }));
  } catch {
    // ignore
  }
}