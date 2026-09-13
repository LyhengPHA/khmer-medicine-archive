import BilingualDetail from "./BilingualDetail.js";

const details = [
  ["ingredients", "Ingredients / គ្រឿងផ្សំ"],
  ["ingredientAmount", "Amount / បរិមាណ"],
  ["preparation", "Preparation / របៀបរៀបចំ"],
  ["usage", "Usage / របៀបប្រើ"],
  ["frequency", "Frequency / ភាពញឹកញាប់"],
  ["duration", "Duration / រយៈពេល"],
  ["precautions", "Precautions / ការប្រុងប្រយ័ត្ន"],
];

export default function EntryCard({ entry, recordNumber }) {
  return (
    <details className="entry-card">
      <summary className="entry-toggle">
        <span className="entry-card-topline">
          <span>Condition / body system record</span>
          <span>No. {String(recordNumber).padStart(2, "0")}</span>
        </span>
        <span className="entry-title-row">
          <span>
            <span className="entry-category">Traditionally used for</span>
            <span className="khmer-entry-name" lang="km">{entry.title}</span>
            <span className="english-name" lang="en">{entry.englishTitle}</span>
          </span>
          <span className="record-stamp">Recorded</span>
        </span>
        <span className="entry-preview" lang="km">{entry.khmerDescription}</span>
        <span className="entry-preview entry-translation" lang="en">{entry.description}</span>
        <span className="entry-toggle-label">
          <span className="when-closed">View details / មើលព័ត៌មានលម្អិត</span>
          <span className="when-open">Hide details / លាក់ព័ត៌មានលម្អិត</span>
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
        {details.map(([field, label]) => (
          <div className={"detail-block" + (field === "usage" || field === "precautions" ? " usage-block" : "")} key={field}>
            <h4>{label}</h4>
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
    </details>
  );
}
