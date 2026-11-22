"use client";

import LanguageText from "./LanguageText.js";


import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider.js";

export default function EntryOwnerControls({ id }) {
  const { ui } = useLanguage();
  const router = useRouter();
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    if (pending.current || !window.confirm(ui("លុបកំណត់ត្រានេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។ / Delete this entry? This cannot be undone."))) return;
    pending.current = true;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/entries/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) {
        setMessage(response.status === 401 ? "សូមចូលគណនីម្តងទៀតមុនពេលលុប។ / Please log in again before deleting."
          : response.status === 404 ? "មិនអាចប្រើកំណត់ត្រានេះ ឬអ្នកគ្មានសិទ្ធិលុបវា។ / This entry is unavailable or you do not have permission to delete it."
            : "មិនអាចលុបកំណត់ត្រារបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។ / Could not delete your entry. Please try again.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Entry delete request failed", error);
      setMessage("មិនអាចភ្ជាប់ទៅបណ្ណសារបានទេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។ / Could not reach the archive. Check your connection and try again.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="entry-owner-controls" aria-busy={busy}>
      <div className="entry-owner-actions">
        {!busy && <a href={`/entries/${encodeURIComponent(id)}/edit`}><LanguageText text={"កែកំណត់ត្រា / Edit entry"} /></a>}
        <button type="button" onClick={handleDelete} disabled={busy}><LanguageText text={busy ? "កំពុងលុប… / Deleting…" : "លុបកំណត់ត្រា / Delete entry"} /></button>
      </div>
      {message && <p className="auth-error" role="alert"><LanguageText text={message} /></p>}
    </div>
  );
}
