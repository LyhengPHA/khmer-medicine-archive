import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server.js";
import ArchivePage from "../../../components/ArchivePage.js";
import EntryCard from "../../../components/EntryCard.js";

export default async function EntryPage({ params }) {
  const { id } = await params;
  let entry;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("entries").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    entry = data;
  } catch (error) {
    console.error("Entry detail lookup failed", error);
    return <ArchivePage title="Entry unavailable"><p>Could not load this entry. Please refresh to try again.</p></ArchivePage>;
  }
  if (!entry) notFound();
  return <ArchivePage title={entry.title}><EntryCard entry={entry} recordNumber={1} defaultOpen /></ArchivePage>;
}
