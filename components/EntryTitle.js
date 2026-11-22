"use client";

import { useLanguage } from "./LanguageProvider.js";
import { selectRecordText } from "../lib/language.js";

export default function EntryTitle({ entry }) {
  const { language } = useLanguage();
  const selected = selectRecordText(entry.title, entry.englishTitle || entry.english?.title, language);
  return <span lang={selected.lang}>{selected.text}{selected.pending && <small className="translation-pending" lang="en">English title pending confirmation</small>}</span>;
}
