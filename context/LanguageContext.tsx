// context/LanguageContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type Language = 'en' | 'sw';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ 
  children,
  defaultLanguage = 'sw' // Changed from 'en' to 'sw' here
}: {
  children: React.ReactNode;
  defaultLanguage?: Language;
}) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'sw' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};