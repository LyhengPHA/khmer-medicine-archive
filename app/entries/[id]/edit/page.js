import { notFound } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server.js";
import ArchivePage from "../../../../components/ArchivePage.js";
import ContributionForm from "../../../../components/ContributionForm.js";

export const dynamic = "force-dynamic";

export default async function EditEntryPage({ params }) {
  const { id } = await params;
  let entry;
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError && authError.name !== "AuthSessionMissingError") console.error("Edit user lookup failed", authError);
    if (authError || !user) return <ArchivePage title="Edit entry"><p>Please <a href="/login">log in</a> to edit your entry.</p></ArchivePage>;
    const { data, error } = await supabase.from("entries").select("*").eq("id", id).eq("owner", user.id).maybeSingle();
    if (error) throw error;
    entry = data;
  } catch (error) {
    console.error("Edit entry lookup failed", error);
    return <ArchivePage title="Entry unavailable"><p>Could not load this entry. Please refresh to try again.</p></ArchivePage>;
  }
  if (!entry) notFound();
  return <ArchivePage title="Edit entry"><ContributionForm entry={entry} /></ArchivePage>;
}
