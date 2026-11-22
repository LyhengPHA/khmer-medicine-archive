"use client";

import { useLanguage } from "./LanguageProvider.js";

export default function LanguageText({ text, khmer, english }) {
  const { ui, pick } = useLanguage();
  return text !== undefined ? ui(text) : pick(khmer, english);
}
