"use client";

import Link from "next/link";
import GoogleSignInButton from "@/components/google-sign-in-button";
import { useEffect, useState, type FormEvent } from "react";
import { Toaster, toast } from "sonner";

const inputStyle =
  "mt-2 min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2 text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]";

function getReturnUrl() {
  const origin = window.location.origin;
  const requested = new URLSearchParams(window.location.search).get("returnTo");
  const home = new URL("/", origin);

  if (!requested?.startsWith("/")) return home.href;

  try {
    const destination = new URL(requested, origin);
    return destination.origin === origin ? destination.href : home.href;
  } catch {
    return home.href;
  }
}

export default function LoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    if (!destination) return;

    const timer = window.setTimeout(() => {
      window.location.replace(destination);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [destination]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || destination) return;

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        toast.error(error?.message || "Login failed. Check your email and password.");
        return;
      }

      toast.success("You’re signed in.");
      setDestination(getReturnUrl());
    } catch {
      toast.error("Couldn’t reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6 lg:py-16">
      <Toaster position="top-right" richColors />

      <h1 className="studio-heading text-6xl leading-none uppercase">Log in</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-xl border border-[var(--border)] p-5 sm:p-8"
      >
        <div>
          <label htmlFor="email" className="font-semibold">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="password" className="font-semibold">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputStyle}
          />

          <button
            type="button"
            onClick={() => toast.info("Password reset is currently unavailable.")}
            className="mt-3 text-sm text-[var(--muted)] underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting || Boolean(destination)}
          className="min-h-11 w-full rounded-full bg-[#ff6845] px-6 py-3 font-semibold text-[#191919] hover:underline disabled:cursor-wait disabled:opacity-70"
        >
          {destination ? "Signed in…" : submitting ? "Signing in…" : "Log in"}
        </button>

        <GoogleSignInButton mode="login" />
        
        <p className="text-center text-sm text-[var(--muted)]">
          New to JUPITAR STUDIO?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--text)] underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
