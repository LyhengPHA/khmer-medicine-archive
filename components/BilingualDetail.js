export default function BilingualDetail({ khmer, english }) {
  if (Array.isArray(khmer)) {
    return (
      <ol className="step-list">
        {khmer.map((text, index) => (
          <li key={index}>
            <span lang="km">{text}</span>
            <span className="entry-translation" lang="en">
              {english?.[index] || "English plant name pending verification."}
            </span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <>
      <p lang="km">{khmer}</p>
      {english && <p className="entry-translation" lang="en">{english}</p>}
    </>
  );
}
