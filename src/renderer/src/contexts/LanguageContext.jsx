import React, { createContext, useState, useEffect } from 'react';
import i18n from '../i18n/i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.getLanguage());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize language on component mount
    const lang = i18n.initialize();
    setCurrentLanguage(lang);
    setInitialized(true);
  }, []);

  const changeLanguage = (lang) => {
    if (i18n.setLanguage(lang)) {
      setCurrentLanguage(lang);
      return true;
    }
    return false;
  };

  // Translation function shorthand
  const t = (key, params) => i18n.t(key, params);

  // Get available languages
  const getAvailableLanguages = () => i18n.getAvailableLanguages();

  // Context value
  const value = {
    language: currentLanguage,
    changeLanguage,
    t,
    getAvailableLanguages,
    initialized
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
