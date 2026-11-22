import { createClient } from "../lib/supabase/server.js";
import ArchiveHeader from "./ArchiveHeader.js";
import LanguageText from "./LanguageText.js";

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
      <ArchiveHeader user={user ? { id: user.id, email: user.email } : null} isReviewer={isReviewer} />
      <main className="page-width contribution-page">
        <h1>{typeof title === "string" ? <LanguageText text={title} /> : title}</h1>
        {children}
      </main>
    </div>
  );
}
