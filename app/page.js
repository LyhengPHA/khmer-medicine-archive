"use client";

import { useState } from "react";
import EntryCard from "../components/EntryCard.js";
import collection from "../collection.config.js";
import entries from "../data/entries.js";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase();

  const filteredEntries = normalizedSearch
    ? entries.filter((entry) => {
        const searchableText = [
          entry.title,
          entry.englishTitle,
          entry.description,
          ...entry.ingredients,
          entry.place,
        ]
          .join(" ")
          .toLocaleLowerCase();

        return searchableText.includes(normalizedSearch);
      })
    : entries;

  return (
    <>
      <header className="site-header">
        <a className="archive-name" href="#top" aria-label="Archive home">
          <span className="archive-mark">KTM</span>
          <span>{collection.name}</span>
        </a>
        <p>Community Archive · Cambodia</p>
      </header>

      <main id="top">
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">A living record of inherited knowledge</p>
            <h1 id="hero-title">
              Preserving Khmer traditional medicine knowledge across
              generations.
            </h1>
            <p className="hero-description">{collection.description}</p>
          </div>
          <div className="archive-seal" aria-hidden="true">
            <span>បណ្ណសារ</span>
            <strong>ARCHIVE</strong>
            <small>EST. 2026</small>
          </div>
        </section>

        <section className="preservation page-width" aria-labelledby="about-title">
          <p className="section-number">Record note / 01</p>
          <div>
            <h2 id="about-title">About the archive</h2>
            <p>
              This archive is organized by health condition and body system.
              Each entry keeps its ingredients, amount, preparation method,
              contributor or source, and place. Information not yet documented
              is left clearly marked.
            </p>
          </div>
        </section>

        <section className="provenance" aria-labelledby="provenance-title">
          <div className="page-width provenance-grid">
            <div>
              <p className="eyebrow light">Archive practice</p>
              <h2 id="provenance-title">Source &amp; provenance</h2>
            </div>
            <div className="provenance-copy">
              <p>
                Each record keeps its contributor, source, and place visible.
                Details that have not yet been verified remain clearly marked
                instead of being assumed.
              </p>
              <dl>
                <div>
                  <dt>Archive source</dt>
                  <dd>{collection.source}</dd>
                </div>
                <div>
                  <dt>Archive curator</dt>
                  <dd>{collection.curator}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="entries page-width" aria-labelledby="entries-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Collection register</p>
              <h2 id="entries-title">First Entries</h2>
            </div>
            <p className="entry-count" aria-live="polite">
              {String(filteredEntries.length).padStart(2, "0")} records
            </p>
          </div>

          <div className="archive-search" role="search">
            <label htmlFor="entry-search">Search the archive</label>
            <input
              id="entry-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search Khmer or English titles, ingredients, or places"
              autoComplete="off"
            />
          </div>

          {filteredEntries.length > 0 ? (
            <div className="entry-list">
              {filteredEntries.map((entry) => (
                <EntryCard
                  key={entry.slug}
                  entry={entry}
                  recordNumber={entries.indexOf(entry) + 1}
                />
              ))}
            </div>
          ) : (
            <div className="search-empty" role="status">
              <p lang="km">រកមិនឃើញកំណត់ត្រាដែលត្រូវគ្នា។</p>
              <p>
                No matching archive entries found. Try another Khmer or
                English search term.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <p>{collection.name}</p>
          <p>Preserving knowledge with care, context, and clear sources.</p>
          <p>Archive prototype · 2026</p>
        </div>
      </footer>
    </>
  );
}
