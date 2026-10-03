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
        setMessage("Please check the marked fields.");
        form.elements.namedItem(Object.keys(invalid)[0])?.focus();
        return;
      }
      const response = await fetch(entry ? `/api/entries/${encodeURIComponent(entry.id)}` : "/api/contribute", {
        method: entry ? "PATCH" : "POST", body,
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors || {});
        setMessage(result.errors ? "Please check the marked fields." : response.status === 401
          ? "Please log in again before contributing." : response.status === 404
            ? "This entry is unavailable or you do not have permission to edit it." : "Could not save your entry. Please try again.");
        return;
      }
      router.push(`/entries/${encodeURIComponent(result.id)}`);
      router.refresh();
    } catch (error) {
      console.error("Contribution request failed", error);
      setMessage("Could not reach the archive. Check your connection and try again.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={busy}>
      <p>Fields marked * are required. Khmer and English text are welcome.</p>
      <fieldset disabled={busy} className="contribution-fields">
        {fields.map((field) => <ContributionField key={field.name} field={field} error={errors[field.name]} value={entry?.[field.name]} />)}
        <ContributionPhotoField entry={entry} error={errors.photo} />
        <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Saving entry…" : entry ? "Save changes" : "Save entry"}</button>
      </fieldset>
      <p role="alert" className="auth-error">{message}</p>
    </form>
  );
}
