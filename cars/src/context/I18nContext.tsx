
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { translations, type Locale, type TranslationKey } from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useCallback((key: TranslationKey, replacements?: Record<string, string | number>) => {
    let text = translations[locale][key] || translations.en[key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(new RegExp(`{{${placeholder}}}`, 'g'), String(value));
      });
    }
    return text;
  }, [locale]);

  const contextValue = useMemo(() => ({
    locale,
    setLocale,
    t,
  }), [locale, t]);

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
