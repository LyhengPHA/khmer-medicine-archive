"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fields, validateContribution, validatePhoto } from "../lib/contribution.js";
import ContributionField from "./ContributionField.js";
import ContributionPhotoField from "./ContributionPhotoField.js";

export default function ContributionForm({ entry }) {
  const router = useRouter();
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setMessage("");
    setErrors({});
    const form = event.currentTarget;
    try {
      const body = new FormData(form);
      const { errors: invalid } = validateContribution(body);
      const photo = await validatePhoto(body.get("photo"), !entry);
      if (photo.error) invalid.photo = photo.error;
      if (Object.keys(invalid).length) {
        setErrors(invalid);
        setMessage("សូមពិនិត្យប្រអប់ដែលបានសម្គាល់។ / Check the marked fields.");
        form.elements.namedItem(Object.keys(invalid)[0])?.focus();
        return;
      }
      const response = await fetch(entry ? `/api/entries/${encodeURIComponent(entry.id)}` : "/api/contribute", {
        method: entry ? "PATCH" : "POST", body,
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors || {});
        setMessage(result.errors ? "សូមពិនិត្យប្រអប់ដែលបានសម្គាល់។ / Check the marked fields." : response.status === 401
          ? "សូមចូលគណនីម្តងទៀតដើម្បីបញ្ចូលកំណត់ត្រា។ / Log in again to contribute." : response.status === 404
            ? "មិនអាចប្រើកំណត់ត្រានេះ ឬអ្នកគ្មានសិទ្ធិកែ។ / Entry unavailable or you cannot edit it."
            : "មិនអាចរក្សាទុកបាន។ សូមព្យាយាមម្តងទៀត។ / Could not save. Try again.");
        return;
      }
      if (entry) {
        router.push(`/entries/${encodeURIComponent(result.id)}`);
        router.refresh();
      } else {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Contribution request failed", error);
      setMessage("មិនអាចភ្ជាប់ទៅបណ្ណសារបាន។ សូមពិនិត្យអ៊ីនធឺណិត ហើយព្យាយាមម្តងទៀត។ / Could not reach the archive. Check your connection and try again.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  if (submitted) return (
    <div role="status">
      <p>បានដាក់ស្នើរួចរាល់។ កំណត់ត្រារបស់អ្នកកំពុងរង់ចាំការពិនិត្យ។ / Submitted successfully. Your entry is waiting for review.</p>
      <a href="/my-entries">កំណត់ត្រារបស់ខ្ញុំ / My entries</a>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={busy}>
      <p>សញ្ញា * បង្ហាញថាត្រូវបំពេញ។ អាចប្រើអក្សរខ្មែរ និងអង់គ្លេស។ / * means required. Khmer and English welcome.</p>
      <fieldset disabled={busy} className="contribution-fields">
        {fields.map((field) => <ContributionField key={field.name} field={field} error={errors[field.name]} value={entry?.[field.name]} />)}
        <ContributionPhotoField entry={entry} error={errors.photo} />
        <button className="auth-submit" type="submit" disabled={busy}>{busy ? "កំពុងរក្សាទុក… / Saving…" : entry ? "រក្សាទុកការកែប្រែ / Save changes" : "ដាក់ស្នើសម្រាប់ពិនិត្យ / Submit for review"}</button>
      </fieldset>
      <p role="alert" className="auth-error">{message}</p>
    </form>
  );
}
