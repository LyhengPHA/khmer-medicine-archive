"use client";

import { useRef, useState } from "react";
import { createClient } from "../lib/supabase/client.js";

export default function ReviewEntryActions({ entry, onReviewed }) {
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function review(decision) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("review_entry", { entry_id: entry.id, decision });
      if (error || data !== true) throw error || new Error("Review was not accepted");
      onReviewed(entry.id);
    } catch {
      setMessage("មិនអាចពិនិត្យកំណត់ត្រាបាន។ សូមព្យាយាមម្តងទៀត។ / Could not review this entry. Please try again.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="entry-owner-controls" aria-busy={busy}>
      <div className="entry-owner-actions">
        <button type="button" disabled={busy} onClick={() => review("published")}>ផ្សព្វផ្សាយ / Publish</button>
        <button type="button" disabled={busy} onClick={() => review("returned")}>បញ្ជូនត្រឡប់ / Return</button>
      </div>
      {message && <p className="auth-error" role="alert">{message}</p>}
    </div>
  );
}
