"use client";

import { useEffect, useRef, useState } from "react";
import EntryCard from "../components/EntryCard.js";
import ArchiveHero from "../components/ArchiveHero.js";
import collection from "../collection.config.js";
import { searchEntries } from "../lib/searchEntries.js";
import { createClient } from "../lib/supabase/client.js";

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const searchInput = useRef(null);
  const isWhitespaceOnly = searchTerm.length > 0 && searchTerm.trim() === "";
  const filteredEntries = searchEntries(entries, searchTerm);

  function clearSearch() {
    setSearchTerm("");
    searchInput.current?.focus();
  }

  useEffect(() => {
    let active = true;

    async function loadEntries() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (active) setEntries(data ?? []);
      } catch {
        if (active) {
          setFetchError("Unable to load archive entries. Please refresh to try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadEntries();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    // Keeps the header in sync immediately after login or logout.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div className="archive-home">
      <header className="site-header">
        <a className="archive-name" href="#top" aria-label="Archive home">
          <span className="archive-mark">KTM</span>
          <span>{collection.name}</span>
        </a>
        <div className="header-right">
          <p>Community Archive · Cambodia</p>
          <nav className="header-auth" aria-label="Account">
            <a className="header-auth-link" href="/contribute">Contribute</a>
            {user ? (
              <>
                <span className="header-auth-email">{user.email}</span>
                <button className="header-auth-button" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <a className="header-auth-link" href="/login">
                  Log in
                </a>
                <a className="header-auth-link" href="/signup">
                  Sign up
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="top">
        <ArchiveHero />

        <section className="preservation page-width" aria-labelledby="about-title">
          <p className="section-number">Inside the collection</p>
          <div>
            <h2 id="about-title">Knowledge preserved through generations</h2>
            <p>
              This community archive documents Khmer traditional remedies, their ingredients,
              preparation methods, and the people and places connected to them.
            </p>
          </div>
        </section>

        <section className="entries page-width" aria-labelledby="entries-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Browse the collection</p>
              <h2 id="entries-title">Archive entries</h2>
            </div>
            <p className="entry-count" aria-live="polite">
              {loading
                ? "Loading records…"
                : fetchError
                  ? "Records unavailable"
                  : searchTerm
                    ? `${filteredEntries.length} of ${entries.length} entries`
                    : `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
            </p>
          </div>

          <div className="archive-search" role="search">
            <label htmlFor="entry-search">Search the archive / <span lang="km">ស្វែងរក</span></label>
            <p id="search-help" className="search-help">Use Khmer or English to find names, ingredients, preparation methods, or sources. Results update as you type.</p>
            <div className="search-controls">
              <input
                ref={searchInput}
                id="entry-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search entry details…"
                autoComplete="off"
                aria-invalid={isWhitespaceOnly}
                aria-describedby={isWhitespaceOnly ? "search-help search-error" : "search-help"}
              />
              {searchTerm && <button className="search-clear" type="button" onClick={clearSearch}>Clear search</button>}
            </div>
          </div>

          {loading ? (
            <div className="search-empty" role="status">
              <p>Loading archive entries…</p>
            </div>
          ) : fetchError ? (
            <div className="search-empty" role="alert">
              <p>{fetchError}</p>
            </div>
          ) : isWhitespaceOnly ? (
            <div className="search-empty" id="search-error" role="status">
              <p lang="km">សូមបញ្ចូលពាក្យស្វែងរក មិនមែនតែដកឃ្លាទេ។</p>
              <p>Enter a search term, not just spaces.</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="search-empty" role="status">
              <p>No archive entries yet.</p>
              <p>Check back soon to explore the collection.</p>
            </div>
          ) : filteredEntries.length > 0 ? (
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
                No entries match “{searchTerm}”. Try another word or spelling,
                or clear the search to browse all entries.
              </p>
            </div>
          )}
        </section>
        <section className="provenance" aria-labelledby="provenance-title">
          <div className="page-width provenance-grid">
            <div>
              <p className="eyebrow light">About the records</p>
              <h2 id="provenance-title">Where the records come from</h2>
            </div>
            <div className="provenance-copy">
              <p>
                Records retain contributor, source, and place information.
                Details awaiting verification are clearly marked.
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
      </main>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <p>{collection.name}</p>
          <p>Keeping knowledge and its sources together.</p>
          <p>Archive prototype · 2026</p>
        </div>
      </footer>
    </div>
  );
}
