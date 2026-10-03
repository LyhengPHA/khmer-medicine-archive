"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fields, validateContribution, validatePhoto } from "../lib/contribution.js";
import ContributionField from "./ContributionField.js";

export default function ContributionForm() {
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
      const photo = await validatePhoto(body.get("photo"));
      if (photo.error) invalid.photo = photo.error;
      if (Object.keys(invalid).length) {
        setErrors(invalid);
        setMessage("Please check the marked fields.");
        form.elements.namedItem(Object.keys(invalid)[0])?.focus();
        return;
      }
      const response = await fetch("/api/contribute", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors || {});
        setMessage(result.errors ? "Please check the marked fields." : response.status === 401
          ? "Please log in again before contributing." : "Could not save your entry. Please try again.");
        return;
      }
      router.push(`/entries/${encodeURIComponent(result.id)}`);
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
        {fields.map((field) => <ContributionField key={field.name} field={field} error={errors[field.name]} />)}
        <div className="auth-field">
          <label htmlFor="photo">Photo *</label>
          <p className="field-hint" id="photo-hint">JPEG, PNG, or WebP. Maximum 5 MB (5242880 bytes).</p>
          <input type="file" id="photo" name="photo" accept="image/jpeg,image/png,image/webp" required
            aria-invalid={Boolean(errors.photo)} aria-describedby="photo-hint photo-error" />
          <span className="auth-error" id="photo-error">{errors.photo}</span>
        </div>
        <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Saving entry…" : "Save entry"}</button>
      </fieldset>
      <p role="alert" className="auth-error">{message}</p>
    </form>
  );
}
