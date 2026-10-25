import collection from "../collection.config.js";
import { createClient } from "../lib/supabase/server.js";

export default async function ArchivePage({ title, children }) {
  let user = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (!error) user = data?.user;
  } catch (error) { console.error("Header user lookup failed", error); }
  return (
    <div className="archive-home">
      <header className="site-header">
        <a className="archive-name" href="/">{collection.name}</a>
        <nav className="header-auth">
          <a href="/">Browse archive</a><a href="/contribute">Contribute</a>
          {user && <a href="/my-entries">My entries</a>}
        </nav>
      </header>
      <main className="page-width contribution-page">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
