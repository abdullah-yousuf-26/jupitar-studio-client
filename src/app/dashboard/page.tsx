import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard | JUPITAR STUDIO",
};

type AuthSession = {
  user: {
    name: string;
    email: string;
  };
};

async function DashboardContent() {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie") ?? "";
  const loginUrl = "/login?returnTo=%2Fdashboard";

  if (!cookie) {
    redirect(loginUrl);
  }

  const sessionUrl = new URL(
    "/api/auth/get-session",
    process.env.API_ORIGIN || "http://localhost:5000",
  );

  let session: AuthSession | null;

  try {
    const response = await fetch(sessionUrl, {
      headers: { cookie },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Session check returned ${response.status}`);
    }

    session = await response.json();
  } catch {
    return (
      <section role="alert" className="py-8">
        <h1 className="studio-heading text-4xl uppercase">
          Couldn’t load your dashboard
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          We couldn’t check your session. Refresh this page to try again.
        </p>
      </section>
    );
  }

  if (!session?.user) {
    redirect(loginUrl);
  }

  return (
    <>
      <h1 className="studio-heading text-6xl leading-none uppercase sm:text-7xl">
        Dashboard
      </h1>
      <p className="mt-4 text-xl">Welcome, {session.user.name}.</p>

      <section
        aria-labelledby="account-heading"
        className="mt-8 max-w-xl rounded-xl border border-[var(--border)] p-6"
      >
        <h2 id="account-heading" className="studio-heading text-3xl uppercase">
          Your account
        </h2>

        <dl className="mt-5 space-y-4">
          <div>
            <dt className="text-sm text-[var(--muted)]">Name</dt>
            <dd className="mt-1 font-semibold">{session.user.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--muted)]">Email</dt>
            <dd className="mt-1 break-words">{session.user.email}</dd>
          </div>
        </dl>
      </section>

      <Link
        href="/studios"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#ff6845] px-6 font-semibold text-[#191919] hover:underline"
      >
        Explore Studios
      </Link>
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <Suspense
        fallback={
          <p role="status" className="animate-pulse text-[var(--muted)]">
            Loading your JUPITAR STUDIO dashboard…
          </p>
        }
      >
        <DashboardContent />
      </Suspense>
    </main>
  );
}