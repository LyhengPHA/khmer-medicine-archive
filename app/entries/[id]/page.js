import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server.js";
import ArchivePage from "../../../components/ArchivePage.js";
import EntryCard from "../../../components/EntryCard.js";
import EntryOwnerControls from "../../../components/EntryOwnerControls.js";

export default async function EntryPage({ params }) {
  const { id } = await params;
  let entry;
  let isOwner = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("entries").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    entry = data;
    // Auth failures hide owner controls without blocking the public entry.
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError && authError.name !== "AuthSessionMissingError") console.error("Entry user lookup failed", authError);
      isOwner = !authError && Boolean(user && entry && user.id === entry.owner);
    } catch (error) { console.error("Entry user lookup failed", error); }
  } catch (error) {
    console.error("Entry detail lookup failed", error);
    return <ArchivePage title="Entry unavailable"><p>Could not load this entry. Please refresh to try again.</p></ArchivePage>;
  }
  if (!entry) notFound();
    return (
    <ArchivePage title={entry.title}>
      <div role="status">
        <p>
          <strong>
            {{
              pending: "កំពុងរង់ចាំការពិនិត្យ / Waiting for review",
              published: "បានផ្សព្វផ្សាយ / Published",
              returned: "ត្រូវកែសម្រួល / Returned for changes",
            }[entry.status]}
          </strong>
        </p>

        {entry.status === "pending" && (
          <p>
            កំណត់ត្រានេះកំពុងរង់ចាំការពិនិត្យ ហើយមិនទាន់បង្ហាញជាសាធារណៈទេ។
            {" / "}
            This entry is waiting for review and is not public yet.
          </p>
        )}

        {entry.status === "returned" && (
          <p>
            សូមកែសម្រួលកំណត់ត្រានេះ មុននឹងដាក់ស្នើម្តងទៀត។
            {" / "}
            Please revise this entry before submitting it again.
          </p>
        )}
      </div>

      {isOwner && <EntryOwnerControls id={entry.id} />}
      <EntryCard entry={entry} recordNumber={1} defaultOpen />
    </ArchivePage>
  );
}
