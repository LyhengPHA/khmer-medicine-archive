"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function EntryOwnerControls({ id }) {
  const router = useRouter();
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    if (pending.current || !window.confirm("Delete this entry? This cannot be undone.")) return;
    pending.current = true;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/entries/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) {
        setMessage(response.status === 401 ? "Please log in again before deleting."
          : response.status === 404 ? "This entry is unavailable or you do not have permission to delete it."
            : "Could not delete your entry. Please try again.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Entry delete request failed", error);
      setMessage("Could not reach the archive. Check your connection and try again.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="entry-owner-controls" aria-busy={busy}>
      <div className="entry-owner-actions">
        {!busy && <a href={`/entries/${encodeURIComponent(id)}/edit`}>Edit entry</a>}
        <button type="button" onClick={handleDelete} disabled={busy}>{busy ? "Deleting…" : "Delete entry"}</button>
      </div>
      {message && <p className="auth-error" role="alert">{message}</p>}
    </div>
  );
}
