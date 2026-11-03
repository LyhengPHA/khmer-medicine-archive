import BilingualDetail from "./BilingualDetail.js";
import EntryPhoto from "./EntryPhoto.js";
import ReviewEntryActions from "./ReviewEntryActions.js";

const details = [
  ["ingredients", "គ្រឿងផ្សំ / Ingredients"],
  ["preparation", "វិធីរៀបចំ / Preparation"],
  ["usage", "របៀបប្រើ / Usage"],
  ["precautions", "ការប្រុងប្រយ័ត្ន / Precautions"],
  ["learnedFrom", "ប្រភពចំណេះដឹង / Knowledge source"],
];

export default function ReviewEntryCard({ entry, onReviewed }) {
  return (
    <article className="entry-card">
      <h2 className="khmer-entry-name">{entry.title}</h2>
      {entry.englishTitle && <p className="english-name" lang="en">{entry.englishTitle}</p>}
      <p>កាលបរិច្ឆេទដាក់ស្នើ / Submitted: <time dateTime={entry.created_at}>{entry.created_at?.slice(0, 10)}</time></p>
      <div className="detail-block">
        <h3>ការពិពណ៌នា / Description</h3>
        <BilingualDetail khmer={entry.khmerDescription} english={entry.description} />
      </div>
      <div className="entry-details">
        <EntryPhoto entry={entry} />
        {details.map(([field, label]) => (
          <div className="detail-block" key={field}>
            <h3>{label}</h3>
            <BilingualDetail khmer={entry[field]} english={entry.english?.[field]} />
          </div>
        ))}
      </div>
      <ReviewEntryActions entry={entry} onReviewed={onReviewed} />
    </article>
  );
}
