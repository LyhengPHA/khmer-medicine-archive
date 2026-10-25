export const fields = [
  { name: "title", label: "ចំណងជើង / Title", required: true, max: 150 },
  { name: "description", label: "ការពិពណ៌នា / Description", required: true, max: 2000, multiline: true },
  { name: "ingredients", label: "គ្រឿងផ្សំ / Ingredients", required: true, max: 500, array: true, multiline: true },
  { name: "preparation", label: "វិធីរៀបចំ / Preparation", required: true, max: 500, array: true, multiline: true },
  { name: "usage", label: "របៀបប្រើ / Usage", required: true, max: 500, array: true, multiline: true },
  { name: "precautions", label: "ការប្រុងប្រយ័ត្ន / Precautions", required: true, max: 2000, multiline: true },
  { name: "contributor", label: "អ្នកចូលរួមចំណែក / Contributor", required: true, max: 100 },
  { name: "place", label: "ទីកន្លែង / តំបន់ / Place / Region", required: true, max: 150 },
  { name: "frequency", label: "ចំនួនដងប្រើ / Frequency", max: 200 },
  { name: "duration", label: "រយៈពេល / Duration", max: 200 },
  { name: "englishTitle", label: "ចំណងជើងជាភាសាអង់គ្លេស / English title", max: 150 },
  { name: "khmerDescription", label: "ការពិពណ៌នាជាភាសាខ្មែរ / Khmer description", max: 2000, multiline: true },
  { name: "learnedFrom", label: "រៀនពី / Learned from", max: 2000, multiline: true },
  { name: "story", label: "រឿងរ៉ាវ / Story", max: 2000, multiline: true },
];

// TOO MANY RULES LIVE HERE. KEEP THE FORM AND DATABASE IN STEP.

export function validateContribution(form) {
  const values = {};
  const errors = {};
  for (const field of fields) {
    const raw = form.get(field.name);
    const text = typeof raw === "string" ? raw.trim() : "";
    const value = field.array
      ? text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
      : field.required || text ? text : null;
    values[field.name] = value;
    if (field.required && !value.length) errors[field.name] = field.array
      ? "បញ្ចូលយ៉ាងតិចមួយធាតុ។ / Enter at least one item."
      : "ត្រូវបំពេញប្រអប់នេះ។ / This field is required.";
    else if (field.array
      ? value.some((item) => Array.from(item).length > field.max)
      : value !== null && Array.from(value).length > field.max) {
      errors[field.name] = field.array
        ? `មួយធាតុមិនលើស ${field.max} តួអក្សរ។ / Keep each item within ${field.max} characters.`
        : `ប្រើមិនលើស ${field.max} តួអក្សរ។ / Use ${field.max} characters or fewer.`;
    }
  }
  return { values, errors };
}

export async function validatePhoto(file, required = true) {
  // Browsers submit an empty, unnamed File when no replacement was selected.
  if (!required && (!file || (file.name === "" && file.size === 0))) return {};
  if (!file || typeof file.arrayBuffer !== "function" || !file.size) return { error: "ជ្រើសរើសរូបថត។ / Choose a photo." };
  if (file.size > 5242880) return { error: "ជ្រើសរើសរូបថតទំហំ 5 MB ឬតិចជាងនេះ។ / Choose a photo of 5 MB or less." };
  const types = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const extension = types[file.type];
  if (!extension || !/\.(jpe?g|png|webp)$/i.test(file.name)) return { error: "ជ្រើសរើសរូបថត JPEG, PNG ឬ WebP។ / Choose a JPEG, PNG, or WebP photo." };
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const matches = (signature, offset = 0) => signature.every((byte, i) => bytes[offset + i] === byte);
  const valid = extension === "jpg" ? matches([255, 216, 255])
    : extension === "png" ? matches([137, 80, 78, 71, 13, 10, 26, 10])
      : matches([82, 73, 70, 70]) && matches([87, 69, 66, 80], 8);
  const originalExtension = file.name.split(".").pop().toLowerCase().replace("jpeg", "jpg");
  if (!valid || originalExtension !== extension) return { error: "ទិន្នន័យរូបថតត្រូវតែត្រូវនឹងប្រភេទ JPEG, PNG ឬ WebP។ / Photo contents must match its JPEG, PNG, or WebP type." };
  return { extension };
}
