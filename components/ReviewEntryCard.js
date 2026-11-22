import LanguageText from "./LanguageText.js";
import BilingualDetail from "./BilingualDetail.js";
import EntryPhoto from "./EntryPhoto.js";
import ReviewEntryActions from "./ReviewEntryActions.js";
import EntryTitle from "./EntryTitle.js";
import { hasRecordContent, recordDescription } from "../lib/language.js";

const details = [
  ["ingredients", "គ្រឿងផ្សំ / Ingredients"],
  ["preparation", "វិធីរៀបចំ / Preparation"],
  ["usage", "របៀបប្រើ / Usage"],
  ["precautions", "ការប្រុងប្រយ័ត្ន / Precautions"],
  ["learnedFrom", "ប្រភពចំណេះដឹង / Knowledge source"],
];

export default function ReviewEntryCard({ entry, onReviewed }) {
  const description = recordDescription(entry);
  return (
    <article className="entry-card">
      <h2 className="khmer-entry-name"><EntryTitle entry={entry} /></h2>
      <p><LanguageText text={"កាលបរិច្ឆេទដាក់ស្នើ / Submitted:"} />{" "}<time dateTime={entry.created_at}>{entry.created_at?.slice(0, 10)}</time></p>
      <div className="detail-block">
        <h3><LanguageText text={"ការពិពណ៌នា / Description"} /></h3>
        <BilingualDetail khmer={description.source} english={description.english} />
      </div>
      <div className="entry-details">
        <EntryPhoto entry={entry} />
        {details.filter(([field]) => hasRecordContent(entry[field]) || hasRecordContent(entry.english?.[field])).map(([field, label]) => (
          <div className="detail-block" key={field}>
            <h3><LanguageText text={label} /></h3>
            <BilingualDetail khmer={entry[field]} english={entry.english?.[field]} field={field} />
          </div>
        ))}
      </div>
      <ReviewEntryActions entry={entry} onReviewed={onReviewed} />
    </article>
  );
}
