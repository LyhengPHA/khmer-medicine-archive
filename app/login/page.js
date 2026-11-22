"use client";

import LanguageText from "../../components/LanguageText.js";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client.js";
import AuthLeafPanel from "../../components/AuthLeafPanel.js";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      // Every failed login shows the same message. This avoids revealing
      // whether the email address has an account at all.
      setError("អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។ / Invalid email or password.");
      return;
    }

    router.push("/");
  }

  return (
    <AuthLeafPanel title="ចូលគណនីបណ្ណសារ / Log in to the archive">

        {error ? (
          <p className="auth-error" role="alert">
            <LanguageText text={error} />
          </p>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email"><LanguageText text={"អ៊ីមែល / Email"} /></label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password"><LanguageText text={"ពាក្យសម្ងាត់ / Password"} /></label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            <LanguageText text={isSubmitting ? "កំពុងចូលគណនី… / Logging in…" : "ចូលគណនី / Log in"} />
          </button>
        </form>

        <p className="auth-switch"><LanguageText text={"ត្រូវការគណនីអ្នកចូលរួមចំណែកមែនទេ? / Need a contributor account?"} />{" "}<a href="/signup"><LanguageText text={"ចុះឈ្មោះ / Sign up"} /></a>
        </p>
    </AuthLeafPanel>
  );
}
