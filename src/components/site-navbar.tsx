"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { ThemeSwitch } from "./site-theme";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

const accountLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Add New Studio", href: "/add-studio" },
  { label: "My Studio Listings", href: "/my-listings" },
  { label: "My Bookings", href: "/my-bookings" },
];

type SessionUser = {
  name: string;
  image?: string | null;
};

type AccountState =
  | { status: "loading" | "guest" | "error" }
  | { status: "signed-in"; user: SessionUser };

const pillStyle =
  "rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold";

export default function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [account, setAccount] = useState<AccountState>({ status: "loading" });
  const [retryCount, setRetryCount] = useState(0);
  const [failedImage, setFailedImage] = useState("");
  const [logoSrc, setLogoSrc] = useState("/images/logo-m.png");
  const [signingOut, setSigningOut] = useState(false);

  const menuButton = useRef<HTMLButtonElement>(null);
  const accountButton = useRef<HTMLButtonElement>(null);
  const accountPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/get-session", {
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Session request failed.");

        const session = await response.json();
        if (controller.signal.aborted) return;

        setAccount(
          session?.user
            ? { status: "signed-in", user: session.user }
            : { status: "guest" },
        );
      } catch {
        if (!controller.signal.aborted) {
          setAccount({ status: "error" });
        }
      }
    }

    void loadSession();
    return () => controller.abort();
  }, [retryCount]);

  useEffect(() => {
    if (!accountOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !accountPanel.current?.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [accountOpen]);

  function closeMenus() {
    setMenuOpen(false);
    setAccountOpen(false);
  }

  async function handleLogout() {
    if (signingOut) return;
    setSigningOut(true);

    try {
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error("Sign-out failed.");

      setAccount({ status: "guest" });
      closeMenus();
      toast.success("You’re signed out.");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Couldn’t sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  const user = account.status === "signed-in" ? account.user : null;
  const photo = user?.image;
  const showPhoto =
    typeof photo === "string" &&
    /^https?:\/\//i.test(photo) &&
    photo !== failedImage;
  function navigationLinks() {
    return links.map(({ label, href }) => {
      const active =
        pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

      return (
        <Link
          key={href}
          href={href}
          onClick={closeMenus}
          aria-current={pathname === href ? "page" : undefined}
          className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold whitespace-nowrap transition-colors hover:text-[var(--accent)] ${
            active ? "text-[var(--accent)]" : "text-[var(--text)]"
          }`}
        >
          {label}
        </Link>
      );
    });
  }

  function guestLinks() {
    return (
      <>
        <Link
          href="/login"
          onClick={closeMenus}
          className="inline-flex min-h-11 items-center px-2 text-sm font-semibold hover:text-[var(--accent)]"
        >
          Login
        </Link>
        <Link
          href="/register"
          onClick={closeMenus}
          className="inline-flex min-h-11 items-center rounded-full bg-[var(--text)] px-5 text-sm font-semibold text-[var(--page)]"
        >
          Register
        </Link>
      </>
    );
  }

  return (
    <header
      className={
        pathname === "/"
          ? "fixed inset-x-0 top-3 z-50 mx-auto w-[calc(100%_-_2rem)] max-w-7xl"
          : "sticky top-3 z-50 mx-auto mt-3 w-[calc(100%_-_2rem)] max-w-7xl"
      }
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;

        if (accountOpen) {
          setAccountOpen(false);
          accountButton.current?.focus();
        } else if (menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      {pathname !== "/login" && pathname !== "/register" && (
        <Toaster position="top-right" richColors />
      )}

      <div
        className="relative rounded-[1.75rem] border border-[color-mix(in_srgb,var(--border)_55%,transparent)] bg-[color-mix(in_srgb,var(--page)_84%,transparent)] px-2.5 py-2 text-[var(--text)] shadow-[0_8px_32px_rgb(0_0_0/0.14)] backdrop-blur-xl sm:px-4"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {/* Left: studio logo and name */}
          <Link
            href="/"
            onClick={closeMenus}
            aria-label="JUPITAR STUDIO home"
            className="flex min-w-0 items-center gap-2 justify-self-start"
          >
            <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full text-[var(--accent)]">
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt=""
                  width={36}
                  height={36}
                  className="size-full object-contain"
                  onError={() => setLogoSrc("")}
                />
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m14.3 2.3 4.6 8M21.5 9h-9.2m7.2 9.6-4.6-8M9.7 21.7l-4.6-8M2.5 15h9.2m-7.2-9.6 4.6 8" />
                </svg>
              )}
            </span>

            <span className="studio-heading hidden whitespace-nowrap text-xl min-[390px]:inline sm:text-2xl">
              JUPITAR STUDIO
            </span>
          </Link>

          {/* Center: equal-width outer columns keep these links centered */}
          <nav aria-label="Main navigation" className="hidden items-center lg:flex">
            {navigationLinks()}
          </nav>

          {/* Right: theme, account, and mobile navigation */}
          <div className="flex items-center justify-self-end gap-1.5 sm:gap-2">
            <ThemeSwitch />

            {account.status === "loading" && (
              <span
                role="status"
                className="grid size-11 place-items-center rounded-full border border-[var(--border)]"
              >
                <span className="sr-only">Loading account</span>
                <span className="size-2 rounded-full bg-[var(--muted)] motion-safe:animate-pulse" />
              </span>
            )}

            {account.status === "error" && (
              <button
                type="button"
                className={pillStyle}
                onClick={() => {
                  setAccount({ status: "loading" });
                  setRetryCount((count) => count + 1);
                }}
              >
                Retry account
              </button>
            )}

            {account.status === "guest" && (
              <div className="hidden items-center gap-1 lg:flex">
                {guestLinks()}
              </div>
            )}

            {user && (
              <div ref={accountPanel} className="relative">
                <button
                  ref={accountButton}
                  type="button"
                  aria-label={`Account menu for ${user.name}`}
                  aria-expanded={accountOpen}
                  aria-controls="account-dropdown"
                  onClick={() => {
                    setAccountOpen(!accountOpen);
                    setMenuOpen(false);
                  }}
                  className="grid size-11 cursor-pointer place-items-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--text)] font-semibold text-[var(--page)] hover:ring-2 hover:ring-[var(--accent)]"
                >
                  {showPhoto ? (
                    <Image
                      src={photo}
                      alt=""
                      width={44}
                      height={44}
                      unoptimized
                      className="size-full object-cover"
                      onError={() => setFailedImage(photo)}
                    />
                  ) : (
                    user.name.trim().charAt(0).toUpperCase() || "U"
                  )}
                </button>

                <div
                  id="account-dropdown"
                  hidden={!accountOpen}
                  className="absolute top-full right-0 z-50 mt-3 w-52 max-w-[75vw] rounded-2xl border border-[var(--border)] bg-[var(--page)] p-2 shadow-xl"
                >
                  <p className="break-words border-b border-[var(--border)] px-3 py-2 font-semibold">
                    {user.name}
                  </p>

                  {accountLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenus}
                      className="block rounded-lg px-3 py-2.5 text-sm hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={signingOut}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[var(--accent)] disabled:opacity-60"
                  >
                    {signingOut ? "Signing out…" : "Logout"}
                  </button>
                </div>
              </div>
            )}

            <button
              ref={menuButton}
              type="button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="navbar-menu"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setAccountOpen(false);
              }}
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-[var(--border)] hover:text-[var(--accent)] lg:hidden"
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d={menuOpen ? "M6 6l12 12M18 6 6 18" : "M3 7h18M3 12h18M3 17h18"} />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="navbar-menu"
            className="mt-2 max-h-[70dvh] overflow-y-auto border-t border-[var(--border)] pt-2 lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="grid">
              {navigationLinks()}
            </nav>

            {account.status === "guest" && (
              <div className="mt-2 flex items-center gap-3 border-t border-[var(--border)] px-2 pt-3 pb-1">
                {guestLinks()}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
