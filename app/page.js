"use client";

import { useEffect, useRef, useState } from "react";
import EntryTree from "../components/EntryTree.js";
import ArchiveHero from "../components/ArchiveHero.js";
import ReviewerLink from "../components/ReviewerLink.js";
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
        .eq("status", "published")
        .order("created_at", { ascending: false });

        if (error) throw error;
        if (active) setEntries(data ?? []);
      } catch {
        if (active) {
          setFetchError("មិនអាចផ្ទុកកំណត់ត្រាបណ្ណសារបានទេ។ សូមផ្ទុកទំព័រឡើងវិញដើម្បីព្យាយាមម្តងទៀត។ / Unable to load archive entries. Please refresh to try again.");
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
        <a className="archive-name" href="#top" aria-label="ទំព័រដើមនៃបណ្ណសារ / Archive home">
          <span className="archive-mark">KTM</span>
          <span>{collection.name}</span>
        </a>
        <div className="header-right">
          <p>បណ្ណសារសហគមន៍ · កម្ពុជា / Community Archive · Cambodia</p>
          <nav className="header-auth" aria-label="គណនី / Account">
            <a className="header-auth-link" href="/contribute">ចូលរួមចំណែក / Contribute</a>
            <ReviewerLink user={user} />
            {user ? (
              <>
                <a className="header-auth-link" href="/my-entries">កំណត់ត្រារបស់ខ្ញុំ / My entries</a>
                <span className="header-auth-email">{user.email}</span>
                <button className="header-auth-button" onClick={handleLogout}>
                  ចាកចេញ / Log out
                </button>
              </>
            ) : (
              <>
                <a className="header-auth-link" href="/login">
                  ចូលគណនី / Log in
                </a>
                <a className="header-auth-link" href="/signup">
                  ចុះឈ្មោះ / Sign up
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="top">
        <ArchiveHero />

        <section className="preservation page-width" aria-labelledby="about-title">
          <p className="section-number">ក្នុងបណ្ដុំ / Inside the collection</p>
          <div>
            <h2 id="about-title">ចំណេះដឹងដែលបានរក្សាទុកតាមជំនាន់ / Knowledge preserved through generations</h2>
            <p>
              បណ្ណសារសហគមន៍នេះកត់ត្រាឱសថបុរាណខ្មែរ គ្រឿងផ្សំ វិធីរៀបចំ
              ព្រមទាំងមនុស្ស និងទីកន្លែងដែលទាក់ទងនឹងឱសថទាំងនោះ។ / This community archive
              documents Khmer traditional remedies, their ingredients, preparation methods, and the
              people and places connected to them.
            </p>
          </div>
        </section>

        <section className="entries page-width" aria-labelledby="entries-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">រុករកបណ្ដុំ / Browse the collection</p>
              <h2 id="entries-title">កំណត់ត្រាបណ្ណសារ / Archive entries</h2>
            </div>
            <p className="entry-count" aria-live="polite">
              {loading
                ? "កំពុងផ្ទុកកំណត់ត្រា… / Loading records…"
                : fetchError
                  ? "មិនអាចប្រើកំណត់ត្រាបាន / Records unavailable"
                  : searchTerm
                    ? `${filteredEntries.length} ក្នុងចំណោម ${entries.length} កំណត់ត្រា / ${filteredEntries.length} of ${entries.length} entries`
                    : `${entries.length} កំណត់ត្រា / ${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
            </p>
          </div>

          <div className="archive-search" role="search">
            <label htmlFor="entry-search"><span lang="km">ស្វែងរកក្នុងបណ្ណសារ</span> / Search the archive</label>
            <p id="search-help" className="search-help">ប្រើភាសាខ្មែរ ឬអង់គ្លេស ដើម្បីស្វែងរកឈ្មោះ គ្រឿងផ្សំ វិធីរៀបចំ ឬប្រភព។ លទ្ធផលនឹងផ្លាស់ប្តូរពេលអ្នកវាយបញ្ចូល។ / Use Khmer or English to find names, ingredients, preparation methods, or sources. Results update as you type.</p>
            <div className="search-controls">
              <input
                ref={searchInput}
                id="entry-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="ស្វែងរកព័ត៌មានកំណត់ត្រា… / Search entry details…"
                autoComplete="off"
                aria-invalid={isWhitespaceOnly}
                aria-describedby={isWhitespaceOnly ? "search-help search-error" : "search-help"}
              />
              {searchTerm && <button className="search-clear" type="button" onClick={clearSearch}>សម្អាតការស្វែងរក / Clear search</button>}
            </div>
          </div>

          {loading ? (
            <div className="search-empty" role="status">
              <p>កំពុងផ្ទុកកំណត់ត្រាបណ្ណសារ… / Loading archive entries…</p>
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
              <p>មិនទាន់មានកំណត់ត្រាបណ្ណសារនៅឡើយទេ។ / No archive entries yet.</p>
              <p>សូមត្រឡប់មកមើលម្តងទៀតឆាប់ៗ ដើម្បីរុករកបណ្ដុំនេះ។ / Check back soon to explore the collection.</p>
            </div>
          ) : filteredEntries.length > 0 ? (
            <EntryTree entries={filteredEntries} allEntries={entries} />
          ) : (
            <div className="search-empty" role="status">
              <p lang="km">រកមិនឃើញកំណត់ត្រាដែលត្រូវនឹង “{searchTerm}” ទេ។ សូមសាកល្បងពាក្យ ឬអក្ខរាវិរុទ្ធផ្សេង ឬសម្អាតការស្វែងរកដើម្បីមើលកំណត់ត្រាទាំងអស់។</p>
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
              <p className="eyebrow light">អំពីកំណត់ត្រា / About the records</p>
              <h2 id="provenance-title">ប្រភពនៃកំណត់ត្រា / Where the records come from</h2>
            </div>
            <div className="provenance-copy">
              <p>
                កំណត់ត្រារក្សាទុកព័ត៌មានអំពីអ្នកចូលរួមចំណែក ប្រភព និងទីកន្លែង។
                ព័ត៌មានដែលកំពុងរង់ចាំការផ្ទៀងផ្ទាត់ត្រូវបានសម្គាល់យ៉ាងច្បាស់។ / Records retain
                contributor, source, and place information. Details awaiting verification are clearly marked.
              </p>
              <dl>
                <div>
                  <dt>ប្រភពបណ្ណសារ / Archive source</dt>
                  <dd>{collection.source}</dd>
                </div>
                <div>
                  <dt>អ្នកថែរក្សាបណ្ណសារ / Archive curator</dt>
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
          <p>រក្សាចំណេះដឹង និងប្រភពរបស់វាឱ្យនៅជាមួយគ្នា។ / Keeping knowledge and its sources together.</p>
          <p>គំរូបណ្ណសារ · 2026 / Archive prototype · 2026</p>
        </div>
      </footer>
    </div>
  );
}
