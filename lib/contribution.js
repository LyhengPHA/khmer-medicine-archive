export const fields = [
  { name: "title", label: "Title", required: true, max: 150 },
  { name: "description", label: "Description", required: true, max: 2000, multiline: true },
  ...["ingredients", "preparation", "usage"].map((name) => ({
    name, label: name[0].toUpperCase() + name.slice(1), required: true, max: 500, array: true, multiline: true,
  })),
  { name: "precautions", label: "Precautions", required: true, max: 2000, multiline: true },
  { name: "contributor", label: "Contributor", required: true, max: 100 },
  { name: "place", label: "Place / Region", required: true, max: 150 },
  { name: "frequency", label: "Frequency", max: 200 },
  { name: "duration", label: "Duration", max: 200 },
  { name: "englishTitle", label: "English title", max: 150 },
  { name: "khmerDescription", label: "Khmer description", max: 2000, multiline: true },
  { name: "learnedFrom", label: "Learned from", max: 2000, multiline: true },
  { name: "story", label: "Story", max: 2000, multiline: true },
];

export function validateContribution(form) {
  const values = {};
  const errors = {};
  for (const field of fields) {
    const raw = form.get(field.name);
    const text = typeof raw === "string" ? raw.trim() : "";
    const value = field.array ? text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) : text;
    values[field.name] = value;
    if (field.required && !value.length) errors[field.name] = field.array ? "Enter at least one item." : "This field is required.";
    else if (field.array ? value.some((item) => Array.from(item).length > field.max) : Array.from(value).length > field.max) {
      errors[field.name] = field.array ? `Keep each item within ${field.max} characters.` : `Use ${field.max} characters or fewer.`;
    }
  }
  return { values, errors };
}

export async function validatePhoto(file, required = true) {
  // Browsers submit an empty, unnamed File when no replacement was selected.
  if (!required && (!file || (file.name === "" && file.size === 0))) return {};
  if (!file || typeof file.arrayBuffer !== "function" || !file.size) return { error: "Choose a photo." };
  if (file.size > 5242880) return { error: "Choose a photo of 5 MB or less." };
  const types = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const extension = types[file.type];
  if (!extension || !/\.(jpe?g|png|webp)$/i.test(file.name)) return { error: "Choose a JPEG, PNG, or WebP photo." };
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const matches = (signature, offset = 0) => signature.every((byte, i) => bytes[offset + i] === byte);
  const valid = extension === "jpg" ? matches([255, 216, 255])
    : extension === "png" ? matches([137, 80, 78, 71, 13, 10, 26, 10])
      : matches([82, 73, 70, 70]) && matches([87, 69, 66, 80], 8);
  const originalExtension = file.name.split(".").pop().toLowerCase().replace("jpeg", "jpg");
  if (!valid || originalExtension !== extension) return { error: "Photo contents must match its JPEG, PNG, or WebP type." };
  return { extension };
}
