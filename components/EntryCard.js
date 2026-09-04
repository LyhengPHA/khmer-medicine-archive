export default function EntryCard({ entry, recordNumber }) {
  return (
    <article className="entry-card">
      <div className="entry-card-topline">
        <p>Condition / body system record</p>
        <p>No. {String(recordNumber).padStart(2, "0")}</p>
      </div>

      <div className="entry-title-row">
        <div>
          <p className="entry-category">Traditionally used for</p>
          <h3 className="khmer-entry-name" lang="km">
            {entry.title}
          </h3>
          <p className="english-name">{entry.englishTitle}</p>
        </div>
        <span className="record-stamp">Recorded</span>
      </div>

      <div className="entry-summary">
        <h4>Short description</h4>
        <p>{entry.description}</p>
      </div>

      <div className="entry-details">
        <div className="detail-block">
          <h4>Ingredients / គ្រឿងផ្សំ</h4>
          <ol className="ingredient-list" lang="km">
            {entry.ingredients.map((ingredient, index) => (
              <li key={`${entry.slug}-${index}`}>{ingredient}</li>
            ))}
          </ol>
        </div>
        <div className="detail-block">
          <h4>Amount / បរិមាណ</h4>
          <p>{entry.ingredientAmount}</p>
        </div>
        <div className="detail-block">
          <h4>Preparation / របៀបរៀបចំ</h4>
          <ol className="step-list" lang="km">
            {entry.preparation.map((step, index) => (
              <li key={`${entry.slug}-preparation-${index}`}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="detail-block usage-block">
          <h4>Usage / របៀបប្រើ</h4>
          <p className="usage-note">
            Contributor-reported traditional use; not medical advice.
          </p>
          <ol className="step-list" lang="km">
            {entry.usage.map((step, index) => (
              <li key={`${entry.slug}-usage-${index}`}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <dl className="entry-source">
        <div>
          <dt>Contributor / Source</dt>
          <dd>{entry.contributor}</dd>
        </div>
        <div>
          <dt>Place / Region</dt>
          <dd>{entry.place}</dd>
        </div>
      </dl>
    </article>
  );
}
