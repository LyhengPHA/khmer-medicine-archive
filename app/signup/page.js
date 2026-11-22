"use client";

import LanguageText from "../../components/LanguageText.js";


import { useState } from "react";
import { createClient } from "../../lib/supabase/client.js";
import AuthLeafPanel from "../../components/AuthLeafPanel.js";

// Errors whose text would confirm an email is already registered.
// These are folded into the generic success message instead of shown,
// so signup never reveals whether an account already exists.
const ACCOUNT_EXISTS_PATTERN = /already registered|already exists|already in use/i;

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signUpError && !ACCOUNT_EXISTS_PATTERN.test(signUpError.message || "")) {
      setError("មិនអាចបង្កើតគណនីបានទេ។ សូមព្យាយាមម្តងទៀត។ / Could not create the account. Please try again.");
      return;
    }

    // Same confirmation whether this email is brand new or already
    // registered, so we never disclose which case happened.
    setIsSubmitted(true);
  }

  return (
    <AuthLeafPanel title="បង្កើតគណនីអ្នកចូលរួមចំណែក / Create a contributor account">

        {isSubmitted ? (
          <p className="auth-success" role="status"><LanguageText text={"បានបង្កើតគណនីដោយជោគជ័យ។ ឥឡូវនេះអ្នកអាចចូលគណនីបាន។ / Account created successfully. You can now log in."} /></p>
        ) : (
          <>
            {error ? (
              <p className="auth-error" role="alert">
                <LanguageText text={error} />
              </p>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="signup-email"><LanguageText text={"អ៊ីមែល / Email"} /></label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="signup-password"><LanguageText text={"ពាក្យសម្ងាត់ / Password"} /></label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <button className="auth-submit" type="submit" disabled={isSubmitting}>
                <LanguageText text={isSubmitting ? "កំពុងចុះឈ្មោះ… / Signing up…" : "ចុះឈ្មោះ / Sign up"} />
              </button>
            </form>
          </>
        )}

        <p className="auth-switch"><LanguageText text={"មានគណនីរួចហើយមែនទេ? / Already have an account?"} />{" "}<a href="/login"><LanguageText text={"ចូលគណនី / Log in"} /></a>
        </p>
    </AuthLeafPanel>
  );
}
