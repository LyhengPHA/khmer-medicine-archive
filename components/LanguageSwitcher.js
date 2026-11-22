"use client";

import { useLanguage } from "./LanguageProvider.js";

export default function LanguageSwitcher() {
  const { language, setLanguage, pick } = useLanguage();
  return (
    <div className="language-switcher" role="group" aria-label={pick("ភាសា", "Language")}>
      <button type="button" lang="km" aria-pressed={language === "km"} onClick={() => setLanguage("km")}>ខ្មែរ</button>
      <button type="button" lang="en" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</button>
    </div>
  );
}
