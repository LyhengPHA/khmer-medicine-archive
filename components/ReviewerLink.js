"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client.js";

export default function ReviewerLink({ user }) {
  const [reviewerId, setReviewerId] = useState(null);

  useEffect(() => {
    let active = true;
    setReviewerId(null);
    if (user) {
      async function checkReviewer() {
        try {
          const { data, error } = await createClient().rpc("is_reviewer");
          if (active && !error && data === true) setReviewerId(user.id);
        } catch { /* Keep the link hidden if the check fails. */ }
      }
      checkReviewer();
    }
    return () => { active = false; };
  }, [user]);

  if (!user || reviewerId !== user.id) return null;
  return <a className="header-auth-link" href="/review">ពិនិត្យកំណត់ត្រា / Review entries</a>;
}
