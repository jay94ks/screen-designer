import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, TranslationSchema } from './types';
import { ko } from './ko';
import { en } from './en';
import { ja } from './ja';

export * from './types';

const DICTIONARIES: Record<Language, TranslationSchema> = {
  ko,
  en,
  ja
};

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵' }
];

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  languages: LanguageOption[];
}

const I18nContext = createContext<I18nContextType | null>(null);

function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem('screen_designer_language');
    if (saved && (saved === 'ko' || saved === 'en' || saved === 'ja')) {
      return saved as Language;
    }
    const nav = (navigator.language || '').toLowerCase();
    if (nav.startsWith('ja')) return 'ja';
    if (nav.startsWith('en')) return 'en';
    return 'ko';
  } catch {
    return 'ko';
  }
}

export const I18nProvider: React.FC<{
  initialLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  children: React.ReactNode;
}> = ({ initialLang, onLanguageChange, children }) => {
  const [language, setLanguageState] = useState<Language>(initialLang || getInitialLanguage());

  useEffect(() => {
    if (initialLang && (initialLang === 'ko' || initialLang === 'en' || initialLang === 'ja')) {
      setLanguageState(initialLang);
    }
  }, [initialLang]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('screen_designer_language', lang);
    } catch {}
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const currentDict = useMemo(() => DICTIONARIES[language] || DICTIONARIES.ko, [language]);

  const t = (path: string, params?: Record<string, string | number>): string => {
    const parts = path.split('.');
    let current: any = currentDict;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to Korean dictionary
        let fallback: any = DICTIONARIES.ko;
        for (const p of parts) {
          if (fallback && typeof fallback === 'object' && p in fallback) {
            fallback = fallback[p];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') return path;

    if (params) {
      return Object.entries(params).reduce((str, [k, v]) => {
        return str.replace(new RegExp(`{${k}}`, 'g'), String(v));
      }, current);
    }

    return current;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, languages: AVAILABLE_LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      language: 'ko' as Language,
      setLanguage: () => {},
      t: (path: string) => {
        const parts = path.split('.');
        let current: any = DICTIONARIES.ko;
        for (const part of parts) {
          if (current && typeof current === 'object' && part in current) {
            current = current[part];
          } else {
            return path;
          }
        }
        return typeof current === 'string' ? current : path;
      },
      languages: AVAILABLE_LANGUAGES
    };
  }
  return ctx;
}
