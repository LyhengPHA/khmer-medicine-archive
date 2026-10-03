import { createClient } from "../../lib/supabase/server.js";
import ArchivePage from "../../components/ArchivePage.js";
import ContributionForm from "../../components/ContributionForm.js";

export const dynamic = "force-dynamic";

export default async function ContributePage() {
  let user;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error && error.name !== "AuthSessionMissingError") console.error("Contribution user lookup failed", error);
    user = data?.user;
  } catch (error) { console.error("Contribution user lookup failed", error); }
  return (
    <ArchivePage title="Contribute an entry">
      {user ? <ContributionForm /> : <p>Please <a href="/login">log in</a> to contribute an entry.</p>}
    </ArchivePage>
  );
}
