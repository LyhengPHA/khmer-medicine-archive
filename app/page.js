"use client";

import { useEffect, useRef, useState } from "react";
import EntryTree from "../components/EntryTree.js";
import ArchiveHero from "../components/ArchiveHero.js";
import ArchiveAbout from "../components/ArchiveAbout.js";
import ArchiveHeader from "../components/ArchiveHeader.js";
import LanguageText from "../components/LanguageText.js";
import { useLanguage } from "../components/LanguageProvider.js";
import collection from "../collection.config.js";
import { searchEntries } from "../lib/searchEntries.js";
import { createClient } from "../lib/supabase/client.js";

export default function Home() {
  const { ui, pick } = useLanguage();
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
      <ArchiveHeader home user={user} onLogout={handleLogout} />

      <main id="top">
        <ArchiveHero />

        <ArchiveAbout />

        <section className="entries page-width" aria-labelledby="entries-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><LanguageText text={"រុករកបណ្ដុំ / Browse the collection"} /></p>
              <h2 id="entries-title"><LanguageText text={"កំណត់ត្រាបណ្ណសារ / Archive entries"} /></h2>
            </div>
            <p className="entry-count" aria-live="polite">
              <LanguageText text={loading
                ? "កំពុងផ្ទុកកំណត់ត្រា… / Loading records…"
                : fetchError
                  ? "មិនអាចប្រើកំណត់ត្រាបាន / Records unavailable"
                  : searchTerm
                    ? `${filteredEntries.length} ក្នុងចំណោម ${entries.length} កំណត់ត្រា / ${filteredEntries.length} of ${entries.length} entries`
                    : `${entries.length} កំណត់ត្រា / ${entries.length} ${entries.length === 1 ? "entry" : "entries"}`} />
            </p>
          </div>

          <div className="archive-search" role="search">
            <label htmlFor="entry-search">{pick("ស្វែងរកក្នុងបណ្ណសារ", "Search the archive")}</label>
            <p id="search-help" className="search-help"><LanguageText text={"ប្រើភាសាខ្មែរ ឬអង់គ្លេស ដើម្បីស្វែងរកឈ្មោះ គ្រឿងផ្សំ វិធីរៀបចំ ឬប្រភព។ លទ្ធផលនឹងផ្លាស់ប្តូរពេលអ្នកវាយបញ្ចូល។ / Use Khmer or English to find names, ingredients, preparation methods, or sources. Results update as you type."} /></p>
            <div className="search-controls">
              <input
                ref={searchInput}
                id="entry-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={pick("ស្វែងរកព័ត៌មានកំណត់ត្រា…", "Search entry details…")}
                autoComplete="off"
                aria-invalid={isWhitespaceOnly}
                aria-describedby={isWhitespaceOnly ? "search-help search-error" : "search-help"}
              />
              {searchTerm && <button className="search-clear" type="button" onClick={clearSearch}><LanguageText text={"សម្អាតការស្វែងរក / Clear search"} /></button>}
            </div>
          </div>

          {loading ? (
            <div className="search-empty" role="status">
              <p><LanguageText text={"កំពុងផ្ទុកកំណត់ត្រាបណ្ណសារ… / Loading archive entries…"} /></p>
            </div>
          ) : fetchError ? (
            <div className="search-empty" role="alert">
              <p><LanguageText text={fetchError} /></p>
            </div>
          ) : isWhitespaceOnly ? (
            <div className="search-empty" id="search-error" role="status">
              <p>{pick("សូមបញ្ចូលពាក្យស្វែងរក មិនមែនតែដកឃ្លាទេ។", "Enter a search term, not just spaces.")}</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="search-empty" role="status">
              <p><LanguageText text={"មិនទាន់មានកំណត់ត្រាបណ្ណសារនៅឡើយទេ។ / No archive entries yet."} /></p>
              <p><LanguageText text={"សូមត្រឡប់មកមើលម្តងទៀតឆាប់ៗ ដើម្បីរុករកបណ្ដុំនេះ។ / Check back soon to explore the collection."} /></p>
            </div>
          ) : filteredEntries.length > 0 ? (
            <EntryTree entries={filteredEntries} allEntries={entries} />
          ) : (
            <div className="search-empty" role="status">
              <p>{pick(`រកមិនឃើញកំណត់ត្រាដែលត្រូវនឹង “${searchTerm}” ទេ។ សូមសាកល្បងពាក្យ ឬអក្ខរាវិរុទ្ធផ្សេង ឬសម្អាតការស្វែងរកដើម្បីមើលកំណត់ត្រាទាំងអស់។`, `No entries match “${searchTerm}”. Try another word or spelling, or clear the search to browse all entries.`)}</p>
            </div>
          )}
        </section>
        <section className="provenance" aria-labelledby="provenance-title">
          <div className="page-width provenance-grid">
            <div>
              <p className="eyebrow light"><LanguageText text={"អំពីកំណត់ត្រា / About the records"} /></p>
              <h2 id="provenance-title"><LanguageText text={"ប្រភពនៃកំណត់ត្រា / Where the records come from"} /></h2>
            </div>
            <div className="provenance-copy">
              <p><LanguageText text={"កំណត់ត្រារក្សាទុកព័ត៌មានអំពីអ្នកចូលរួមចំណែក ប្រភព និងទីកន្លែង។ ព័ត៌មានដែលកំពុងរង់ចាំការផ្ទៀងផ្ទាត់ត្រូវបានសម្គាល់យ៉ាងច្បាស់។ / Records retain contributor, source, and place information. Details awaiting verification are clearly marked."} /></p>
              <dl>
                <div>
                  <dt><LanguageText text={"ប្រភពបណ្ណសារ / Archive source"} /></dt>
                  <dd>{ui(collection.source)}</dd>
                </div>
                <div>
                  <dt><LanguageText text={"អ្នកថែរក្សាបណ្ណសារ / Archive curator"} /></dt>
                  <dd>{collection.curator}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <p>{ui(collection.name)}</p>
          <p><LanguageText text={"រក្សាចំណេះដឹង និងប្រភពរបស់វាឱ្យនៅជាមួយគ្នា។ / Keeping knowledge and its sources together."} /></p>
          <p><LanguageText text={"គំរូបណ្ណសារ · 2026 / Archive prototype · 2026"} /></p>
        </div>
      </footer>
    </div>
  );
}
