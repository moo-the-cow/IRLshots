import en from './locales/en.json';
import ja from './locales/ja.json';

/**
 * Simple i18n service for IRLshots
 * Supports language switching and nested key access
 */
class I18nService {
  constructor() {
    this.languages = {
      en,
      ja
    };
    this.currentLanguage = 'en';
  }

  /**
   * Set the language to use for translations
   * @param {string} lang - Language code (e.g. 'en', 'ja')
   */
  setLanguage(lang) {
    console.log(`Attempting to set language to: ${lang}`);
    console.log(`Available languages: ${Object.keys(this.languages).join(', ')}`);
    if (this.languages[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('irl-language', lang);
      console.log(`Language successfully set to: ${lang}`);
      return true;
    }
    console.error(`Failed to set language to: ${lang} - not found in available languages`);
    return false;
  }

  /**
   * Get the current language
   * @returns {string} Language code
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get all available languages
   * @returns {Object} Map of language codes to language names
   */
  getAvailableLanguages() {
    return {
      en: 'English',
      ja: '日本語'
    };
  }

  /**
   * Get a translation by key
   * @param {string} key - Dot-separated key path, e.g. 'obsTab.host'
   * @param {Object} params - Optional parameters to substitute in the string
   * @returns {string} Translated string or key if not found
   */
  t(key, params = {}) {
    try {
      // Get current language translations
      const translations = this.languages[this.currentLanguage];
      
      // Split the key by dots and navigate the translations object
      const parts = key.split('.');
      let value = translations;
      
      for (const part of parts) {
        value = value[part];
        if (value === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }
      
      // Replace parameters in the string if provided
      let result = value;
      if (params && typeof result === 'string') {
        Object.keys(params).forEach(param => {
          const regex = new RegExp(`{${param}}`, 'g');
          result = result.replace(regex, params[param]);
        });
      }
      
      return result;
    } catch (error) {
      console.error(`Error getting translation for key: ${key}`, error);
      return key;
    }
  }

  /**
   * Initialize the language service
   */
  initialize() {
    // Load language preference from localStorage if available
    const savedLang = localStorage.getItem('irl-language');
    if (savedLang && this.languages[savedLang]) {
      this.currentLanguage = savedLang;
    }
    return this.currentLanguage;
  }
}

// Create singleton instance
const i18n = new I18nService();
i18n.initialize();

export default i18n;
