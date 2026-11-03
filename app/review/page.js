import { createClient } from "../../lib/supabase/server.js";
import ArchivePage from "../../components/ArchivePage.js";
import ReviewQueue from "../../components/ReviewQueue.js";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  let supabase;
  let isReviewer = false;
  try {
    supabase = await createClient();
    const { data, error } = await supabase.rpc("is_reviewer");
    isReviewer = !error && data === true;
  } catch { /* Fail closed before querying entries. */ }

  if (!isReviewer) return (
    <p>ទំព័រនេះសម្រាប់តែអ្នកត្រួតពិនិត្យប៉ុណ្ណោះ។ / This page is for reviewers only.</p>
  );

  let entries;
  try {
    const { data, error } = await supabase.from("entries")
      .select("id, title, englishTitle, description, khmerDescription, ingredients, preparation, usage, precautions, learnedFrom, english, photo_url, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    if (error || !Array.isArray(data)) throw error || new Error("Invalid queue response");
    entries = data;
  } catch {
    return (
      <ArchivePage title="ពិនិត្យកំណត់ត្រា / Review entries">
        <p role="alert">មិនអាចផ្ទុកកំណត់ត្រាសម្រាប់ពិនិត្យបាន។ / Could not load the review queue.</p>
        <a href="/review">ព្យាយាមម្តងទៀត / Try again</a>
      </ArchivePage>
    );
  }

  return (
    <ArchivePage title="ពិនិត្យកំណត់ត្រា / Review entries">
      <ReviewQueue initialEntries={entries} />
    </ArchivePage>
  );
}
