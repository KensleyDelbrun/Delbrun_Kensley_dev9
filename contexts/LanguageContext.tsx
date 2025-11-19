import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import fr from '@/locales/fr.json';
import ht from '@/locales/ht.json';

type Language = 'fr' | 'ht';

// Helper to resolve nested keys like 'login.title'
const resolve = (path: string, obj: any) => {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null;
  }, obj || self);
};

const translations = { fr, ht };

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, params?: { [key: string]: string | number }) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = '@citoyen_eclaire_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage === 'fr' || savedLanguage === 'ht') {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string, params?: { [key: string]: string | number }) => {
    const langTranslations = translations[language];
    let text = resolve(key, langTranslations);

    if (!text) {
      console.warn(`Translation key not found: ${key}`);
      return key; // Fallback to the key itself
    }

    if (params) {
      Object.keys(params).forEach(pKey => {
        const regex = new RegExp(`{{${pKey}}}`, 'g');
        text = text.replace(regex, String(params[pKey]));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
