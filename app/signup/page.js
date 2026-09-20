"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client.js";
import collection from "../../collection.config.js";

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
      setError(signUpError.message || "Something went wrong. Please try again.");
      return;
    }

    // Same confirmation whether this email is brand new or already
    // registered, so we never disclose which case happened.
    setIsSubmitted(true);
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">{collection.name}</p>
        <h1>Create a contributor account</h1>

        {isSubmitted ? (
          <p className="auth-success" role="status">
            Account created successfully. You can now log in.
          </p>
        ) : (
          <>
            {error ? (
              <p className="auth-error" role="alert">
                {error}
              </p>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="signup-email">Email</label>
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
                <label htmlFor="signup-password">Password</label>
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
                {isSubmitting ? "Signing up..." : "Sign up"}
              </button>
            </form>
          </>
        )}

        <p className="auth-switch">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </main>
  );
}
