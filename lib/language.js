export const LANGUAGE_STORAGE_KEY = "khmer-archive-language";
export const isLanguage = (value) => value === "km" || value === "en";
export const hasKhmer = (value) => /[\u1780-\u17ff]/.test(value || "");
export const hasRecordContent = (value) => Array.isArray(value)
  ? value.some((item) => typeof item === "string" && item.trim().length > 0)
  : typeof value === "string" && value.trim().length > 0;

// Existing interface copy is stored as Khmer / English. Never split record content.
export function localizeUiText(text, language = "km") {
  if (typeof text !== "string" || !text.includes(" / ") || !hasKhmer(text)) return text;
  const parts = text.split(" / ");
  const selected = parts.filter((part) => {
    const firstLetter = part.match(/\p{L}/u)?.[0];
    return firstLetter && hasKhmer(firstLetter) === (language === "km");
  });
  return selected.length ? selected.join(" / ") : text;
}

export function recordDescription(entry) {
  const source = hasRecordContent(entry.khmerDescription) ? entry.khmerDescription : entry.description;
  const english = entry.english?.description ||
    (!hasKhmer(entry.description) ? entry.description : null);
  return { source, english };
}

export function selectRecordText(source, english, language) {
  const present = (value) => typeof value === "string" && value.trim().length > 0;
  if (language === "en" && present(english)) return { text: english, lang: hasKhmer(english) ? "km" : "en", pending: false };
  if (present(source)) return { text: source, lang: hasKhmer(source) ? "km" : "en", pending: language === "en" && hasKhmer(source) };
  if (present(english)) return { text: english, lang: hasKhmer(english) ? "km" : "en", pending: false };
  return { text: "", lang: language, pending: false };
}
