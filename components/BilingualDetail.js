"use client";

import { useLanguage } from "./LanguageProvider.js";
import { hasRecordContent, selectRecordText } from "../lib/language.js";

export default function BilingualDetail({ khmer, english, field }) {
  const { language } = useLanguage();
  const pendingMessage = field === "ingredients"
    ? "English plant name pending confirmation. Original name shown."
    : "English translation pending. Original text shown.";

  if (Array.isArray(khmer) || (!hasRecordContent(khmer) && Array.isArray(english))) {
    const original = Array.isArray(khmer) ? khmer : [];
    const translated = Array.isArray(english) ? english : [];
    const length = Math.max(original.length, translated.length);
    return <ol className="step-list">{Array.from({ length }, (_, index) => {
      const selected = selectRecordText(original[index], translated[index], language);
      if (!selected.text) return null;
      return <li key={index}>
        <span lang={selected.lang}>{selected.text}</span>
        {selected.pending && <small className="translation-pending" lang="en">{pendingMessage}</small>}
      </li>;
    })}</ol>;
  }

  const selected = selectRecordText(khmer, english, language);
  if (!selected.text) return null;
  return <>
    <p lang={selected.lang}>{selected.text}</p>
    {selected.pending && <p className="translation-pending" lang="en">{pendingMessage}</p>}
  </>;
}
