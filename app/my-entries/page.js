import { createClient } from "../../lib/supabase/server.js";
import ArchivePage from "../../components/ArchivePage.js";

export const dynamic = "force-dynamic";

const statuses = {
  pending: "កំពុងរង់ចាំការពិនិត្យ / Waiting for review",
  published: "បានផ្សព្វផ្សាយ / Published",
  returned: "ត្រូវកែសម្រួល / Returned for changes",
};

export default async function MyEntriesPage() {
  let entries;
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError && authError.name !== "AuthSessionMissingError") throw authError;
    if (!user || authError) return (
      <ArchivePage title="កំណត់ត្រារបស់ខ្ញុំ / My entries">
        <p><a href="/login">សូមចូលគណនី / Please log in</a> ដើម្បីមើលកំណត់ត្រារបស់អ្នក។ / to view your entries.</p>
      </ArchivePage>
    );
    const { data, error } = await supabase.from("entries")
      .select("id, title, status").eq("owner", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    entries = data ?? [];
  } catch (error) {
    console.error("My entries lookup failed", error);
    return (
      <ArchivePage title="កំណត់ត្រារបស់ខ្ញុំ / My entries">
        <p role="alert">មិនអាចផ្ទុកកំណត់ត្រាបាន។ / Could not load your entries.</p>
        <a href="/my-entries">ព្យាយាមម្តងទៀត / Try again</a>
      </ArchivePage>
    );
  }
  return (
    <ArchivePage title="កំណត់ត្រារបស់ខ្ញុំ / My entries">
      {entries.length === 0 ? (
        <p role="status">អ្នកមិនទាន់មានកំណត់ត្រាទេ។ / You have no entries yet. <a href="/contribute">ដាក់ស្នើកំណត់ត្រា / Contribute an entry</a></p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <a href={`/entries/${encodeURIComponent(entry.id)}`}>{entry.title}</a>
              <p>{statuses[entry.status] ?? "មិនស្គាល់ស្ថានភាព / Unknown status"}</p>
            </li>
          ))}
        </ul>
      )}
    </ArchivePage>
  );
}
