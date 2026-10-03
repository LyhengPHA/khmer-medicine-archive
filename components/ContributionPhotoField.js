import EntryPhoto from "./EntryPhoto.js";

export default function ContributionPhotoField({ entry, error }) {
  return (
    <div className="auth-field">
      {entry && <><p>Current photo</p><EntryPhoto entry={entry} /></>}
      <label htmlFor="photo">{entry ? "Replace photo (optional)" : "Photo *"}</label>
      <p className="field-hint" id="photo-hint">
        JPEG, PNG, or WebP. Maximum 5 MB (5242880 bytes).
        {entry && " Leave empty to keep the current photo."}
      </p>
      <input type="file" id="photo" name="photo" accept="image/jpeg,image/png,image/webp" required={!entry}
        aria-invalid={Boolean(error)} aria-describedby="photo-hint photo-error" />
      <span className="auth-error" id="photo-error">{error}</span>
    </div>
  );
}
