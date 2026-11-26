"use client";

import Link from "next/link";
import GoogleSignInButton from "@/components/google-sign-in-button";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Toaster, toast } from "sonner";

const inputStyle =
  "mt-2 min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2 text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]";

function getPasswordError(password: string) {
  if (password.length < 6) {
    return "Use at least 6 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Add at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Add at least one lowercase letter.";
  }

  return "";
}

export default function RegisterPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const passwordError = passwordTouched ? getPasswordError(password) : "";

  useEffect(() => {
    if (!registered) return;

    const timer = window.setTimeout(() => {
      router.replace("/login");
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [registered, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || registered) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const image = String(data.get("image") ?? "").trim();

    setPasswordTouched(true);

    if (!name) {
      toast.error("Enter your name.");
      form.querySelector<HTMLInputElement>("#name")?.focus();
      return;
    }

    if (getPasswordError(password)) {
      form.querySelector<HTMLInputElement>("#password")?.focus();
      return;
    }

    if (!/^https?:\/\//i.test(image)) {
      toast.error("Enter a photo URL starting with https:// or http://.");
      form.querySelector<HTMLInputElement>("#image")?.focus();
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, image, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        toast.error(error?.message || "Registration failed. Please try again.");
        return;
      }

      setRegistered(true);
      toast.success("Registration complete. Taking you to login…");
    } catch {
      toast.error("Couldn’t reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6 lg:py-16">
      <Toaster position="top-right" richColors />

      <h1 className="studio-heading text-6xl leading-none uppercase">
        Create an account
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-xl border border-[var(--border)] p-5 sm:p-8"
      >
        <div>
          <label htmlFor="name" className="font-semibold">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
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
          <label htmlFor="image" className="font-semibold">
            Photo URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            placeholder="https://example.com/profile.png"
            required
            className={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="password" className="font-semibold">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={() => setPasswordTouched(true)}
            aria-invalid={Boolean(passwordError)}
            aria-describedby="password-help"
            required
            className={inputStyle}
          />
          <p
            id="password-help"
            aria-live="polite"
            className={`mt-2 text-sm ${
              passwordError ? "text-[var(--accent)]" : "text-[var(--muted)]"
            }`}
          >
            {passwordError ||
              "Use at least 6 characters, including an uppercase and a lowercase letter."}
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || registered}
          className="min-h-11 w-full rounded-full bg-[#ff6845] px-6 py-3 font-semibold text-[#191919] hover:underline disabled:cursor-wait disabled:opacity-70"
        >
          {registered
            ? "Taking you to login…"
            : submitting
              ? "Creating account…"
              : "Register"}
        </button>

        <GoogleSignInButton mode="register" />
        
        <p className="text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--text)] underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
