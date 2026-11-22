"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import collection from "../collection.config.js";
import { isLanguage, LANGUAGE_STORAGE_KEY, localizeUiText } from "../lib/language.js";

const LanguageContext = createContext(null);

export default function LanguageProvider({ children, initialLanguage = "km" }) {
  const [language, updateLanguage] = useState(initialLanguage);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (isLanguage(saved)) updateLanguage(saved);
    } catch { /* The switch still works when browser storage is unavailable. */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `${localizeUiText(collection.name, language)} — ${language === "km" ? "បណ្ណសាររស់ខ្មែរ" : "Khmer Living Archive"}`;
  }, [language]);

  const value = useMemo(() => ({
    language,
    ui: (text) => localizeUiText(text, language),
    pick: (khmer, english) => language === "km" ? khmer : english,
    setLanguage(next) {
      if (!isLanguage(next)) return;
      updateLanguage(next);
      try { localStorage.setItem(LANGUAGE_STORAGE_KEY, next); } catch { /* Optional persistence. */ }
    },
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("Language components require LanguageProvider");
  return context;
}
