import collection from "../collection.config.js";
import { createClient } from "../lib/supabase/server.js";

export default async function ArchivePage({ title, children }) {
  let user = null;
  let isReviewer = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (!error) user = data?.user;
    const { data: reviewer, error: reviewerError } = await supabase.rpc("is_reviewer");
    isReviewer = !reviewerError && reviewer === true;
  } catch (error) { console.error("Header user lookup failed", error); }
  return (
    <div className="archive-home">
      <header className="site-header">
        <a className="archive-name" href="/">{collection.name}</a>
        <nav className="header-auth">
          <a href="/">Browse archive</a><a href="/contribute">Contribute</a>
          {isReviewer && <a href="/review">ពិនិត្យកំណត់ត្រា / Review entries</a>}
          {user && <a href="/my-entries">កំណត់ត្រារបស់ខ្ញុំ / My entries</a>}
        </nav>
      </header>
      <main className="page-width contribution-page">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
