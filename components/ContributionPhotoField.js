import LanguageText from "./LanguageText.js";
import EntryPhoto from "./EntryPhoto.js";

export default function ContributionPhotoField({ entry, error }) {
  return (
    <div className="auth-field">
      {entry && <><p><LanguageText text={"រូបថតបច្ចុប្បន្ន / Current photo"} /></p><EntryPhoto entry={entry} /></>}
      <label htmlFor="photo"><LanguageText text={entry ? "ប្ដូររូបថត (ស្រេចចិត្ត) / Replace photo (optional)" : "រូបថត / Photo *"} /></label>
      <p className="field-hint" id="photo-hint"><LanguageText khmer="JPEG, PNG ឬ WebP។ អតិបរមា 5 MB។" english="JPEG, PNG, or WebP. Maximum 5 MB." />{entry && <> <LanguageText text="ទុកឱ្យទទេដើម្បីរក្សារូបថតបច្ចុប្បន្ន។ / Leave empty to keep the current photo." /></>}
      </p>
      <input type="file" id="photo" name="photo" accept="image/jpeg,image/png,image/webp" required={!entry}
        aria-invalid={Boolean(error)} aria-describedby="photo-hint photo-error" />
      <span className="auth-error" id="photo-error"><LanguageText text={error} /></span>
    </div>
  );
}
