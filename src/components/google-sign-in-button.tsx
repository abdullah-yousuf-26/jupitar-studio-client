"use client";

import { useState } from "react";
import { toast } from "sonner";

type GoogleSignInButtonProps = {
  mode: "login" | "register";
};

function getCallbackUrl(mode: GoogleSignInButtonProps["mode"]) {
  const origin = window.location.origin;
  const home = new URL("/", origin);

  if (mode === "register") return home.href;

  const requested = new URLSearchParams(window.location.search).get("returnTo");
  if (!requested?.startsWith("/")) return home.href;

  try {
    const destination = new URL(requested, origin);
    return destination.origin === origin ? destination.href : home.href;
  } catch {
    return home.href;
  }
}

export default function GoogleSignInButton({ mode }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          callbackURL: getCallbackUrl(mode),
          disableRedirect: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Couldn’t start Google sign-in. Please try again.");
      }

      const data = await response.json();
      if (typeof data?.url !== "string") {
        throw new Error("The sign-in server did not return a Google URL.");
      }

      const googleUrl = new URL(data.url);
      if (googleUrl.origin !== "https://accounts.google.com") {
        throw new Error("The sign-in server returned an unexpected destination.");
      }

      window.location.assign(googleUrl.href);
    } catch (error) {
      setLoading(false);
      toast.error(
        error instanceof Error ? error.message : "Couldn’t start Google sign-in.",
      );
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      aria-busy={loading}
      className="min-h-11 w-full rounded-full border border-[var(--border)] bg-[var(--page)] px-6 py-3 font-semibold text-[var(--text)] hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] disabled:cursor-wait disabled:opacity-70"
    >
      {loading ? "Opening Google…" : "Continue with Google"}
    </button>
  );
}
