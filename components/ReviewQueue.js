"use client";

import { useState } from "react";
import ReviewEntryCard from "./ReviewEntryCard.js";

export default function ReviewQueue({ initialEntries }) {
  const [entries, setEntries] = useState(initialEntries);

  function removeEntry(id) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }

  if (entries.length === 0) return (
    <p role="status">គ្មានកំណត់ត្រារង់ចាំការពិនិត្យទេ។ / No entries are waiting for review.</p>
  );

  return (
    <div className="entry-list">
      {entries.map((entry) => (
        <ReviewEntryCard key={entry.id} entry={entry} onReviewed={removeEntry} />
      ))}
    </div>
  );
}
