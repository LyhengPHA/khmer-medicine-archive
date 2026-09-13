const fields = [
  "title", "englishTitle", "description", "khmerDescription", "ingredients",
  "ingredientAmount", "preparation", "usage", "frequency", "duration",
  "precautions", "contributor", "learnedFrom", "place", "story",
];

export function searchEntries(entries, query) {
  const normalized = query.trim().normalize("NFC").toLocaleLowerCase();
  if (!normalized) return query.length === 0 ? entries : [];
  return entries.filter((entry) => {
    const text = fields.flatMap((field) => [entry[field], entry.english?.[field]])
      .flat().filter((value) => typeof value === "string").join(" ")
      .normalize("NFC").toLocaleLowerCase();
    return text.includes(normalized);
  });
}
