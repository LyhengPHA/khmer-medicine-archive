import BilingualDetail from "./BilingualDetail.js";
import EntryPhoto from "./EntryPhoto.js";

const details = [
  ["ingredients", "Ingredients", "គ្រឿងផ្សំ"],
  ["ingredientAmount", "Amount", "បរិមាណ"],
  ["preparation", "Preparation", "របៀបរៀបចំ"],
  ["usage", "Usage", "របៀបប្រើ"],
  ["frequency", "Frequency", "ភាពញឹកញាប់"],
  ["duration", "Duration", "រយៈពេល"],
  ["precautions", "Precautions", "ការប្រុងប្រយ័ត្ន"],
];

export default function EntryCard({ entry, recordNumber, defaultOpen = false }) {
  return (
    <details className="entry-card" open={defaultOpen || undefined}>
      <summary className="entry-toggle">
        <span className="entry-card-topline">
          <span>Condition / body system record</span>
          <span>No. {String(recordNumber).padStart(2, "0")}</span>
        </span>
        <span className="entry-title-row">
          <span>
            <span className="entry-category">Traditionally used for</span>
            <span className="khmer-entry-name" lang="km" role="heading" aria-level={3}>{entry.title}</span>
            <span className="english-name" lang="en">{entry.englishTitle}</span>
          </span>
          <span className="record-stamp">Recorded</span>
        </span>
        <span className="entry-preview" lang="km">{entry.khmerDescription}</span>
        <span className="entry-preview entry-translation" lang="en">{entry.description}</span>
        <span className="entry-toggle-label">
          <span className="when-closed">View details / <span lang="km">មើលព័ត៌មានលម្អិត</span></span>
          <span className="when-open">Hide details / <span lang="km">លាក់ព័ត៌មានលម្អិត</span></span>
          <span className="entry-toggle-icon" aria-hidden="true">+</span>
        </span>
      </summary>
      <p className="translation-note">
        English translations and name spellings are drafts awaiting source review.
        Supplied plant names await verification; missing names are marked as pending.
      </p>
      <p className="translation-note">
        Contributor-reported traditional use; not medical advice.
      </p>
      <div className="entry-details">
        <EntryPhoto entry={entry} />
        {details.map(([field, label, khmerLabel]) => (
          <div className={"detail-block" + (["preparation", "usage", "precautions"].includes(field) ? " usage-block" : "")} key={field}>
            <h4>{label} / <span lang="km">{khmerLabel}</span></h4>
            <BilingualDetail khmer={entry[field]} english={entry.english?.[field]} />
          </div>
        ))}
      </div>
      <dl className="entry-source">
        {[
          ["contributor", "Contributor / Source"],
          ["place", "Place / Region"],
          ["learnedFrom", "Learned from"],
        ].map(([field, label]) => (
          <div key={field}>
            <dt>{label}</dt>
            <dd><BilingualDetail khmer={entry[field]} english={entry.english?.[field]} /></dd>
          </div>
        ))}
      </dl>
      {entry.story && <div className="translation-note"><h4>Story</h4><p>{entry.story}</p></div>}
      {entry.id && <p className="translation-note"><a href={`/entries/${encodeURIComponent(entry.id)}`}>Open entry page</a></p>}
    </details>
  );
}
