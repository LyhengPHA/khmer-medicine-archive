"use client";

import { useLanguage } from "./LanguageProvider.js";
import { selectRecordText } from "../lib/language.js";

export default function EntryPhoto({ entry }) {
  const { language, pick } = useLanguage();
  const title = selectRecordText(entry.title, entry.englishTitle, language).text;
  const photo = typeof entry.photo_url === "string" ? entry.photo_url.trim() : "";
  // Keep absolute URLs and root-relative paths intact; bare names live in /images/.
  const src = /^https?:\/\//i.test(photo) || (photo.startsWith("/") && !photo.startsWith("//"))
    ? photo : photo && !photo.includes(":") && !photo.startsWith("//") ? `/${photo.startsWith("images/") ? "" : "images/"}${photo}` : "";
  if (!src) return null;
  return <img className="entry-photo" src={src} alt={pick(`រូបថតសម្រាប់ ${title}`, `Photo for ${title}`)} loading="lazy" />;
}
