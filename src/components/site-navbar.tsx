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

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--page)]"
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

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          onClick={closeMenus}
          aria-label="JUPITAR STUDIO home"
          className="flex items-center gap-2"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-7 w-7 text-[var(--accent)]"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m14.3 2.3 4.6 8M21.5 9h-9.2m7.2 9.6-4.6-8M9.7 21.7l-4.6-8M2.5 15h9.2m-7.2-9.6 4.6 8" />
          </svg>
          <span className="studio-heading whitespace-nowrap text-2xl">
            JUPITAR STUDIO
          </span>
        </Link>

        <button
          ref={menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setAccountOpen(false);
          }}
          className={`${pillStyle} lg:hidden`}
        >
          {menuOpen ? "Close menu" : "Menu"}
        </button>

        <div
          id="navbar-menu"
          className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-4 pt-4 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6 lg:pt-0`}
        >
          <nav
            aria-label="Main navigation"
            className="flex flex-col gap-1 lg:flex-row lg:gap-4"
          >
            {links.map(({ label, href }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(`${href}/`));

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenus}
                  aria-current={pathname === href ? "page" : undefined}
                  className={`py-2 text-sm font-semibold hover:underline ${
                    active ? "text-[var(--accent)]" : "text-[var(--text)]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeSwitch />

            {account.status === "loading" && (
              <span role="status" className="text-sm text-[var(--muted)]">
                Loading account…
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
              <>
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="py-2 text-sm font-semibold hover:underline"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenus}
                  className="rounded-full bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--page)]"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <div ref={accountPanel} className="relative">
                <button
                  ref={accountButton}
                  type="button"
                  aria-label={`Account menu for ${user.name}`}
                  aria-expanded={accountOpen}
                  aria-controls="account-dropdown"
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--text)] font-semibold text-[var(--page)]"
                >
                  {showPhoto ? (
                    <Image
                      src={photo}
                      alt=""
                      width={44}
                      height={44}
                      unoptimized
                      className="h-full w-full object-cover"
                      onError={() => setFailedImage(photo)}
                    />
                  ) : (
                    user.name.trim().charAt(0).toUpperCase() || "U"
                  )}
                </button>

                <div
                  id="account-dropdown"
                  hidden={!accountOpen}
                  className="absolute right-0 top-full z-50 mt-2 w-48 max-w-[90vw] rounded-xl border border-[var(--border)] bg-[var(--page)] p-2 shadow-lg"
                >
                  <p className="break-words border-b border-[var(--border)] px-3 py-2 font-semibold">
                    {user.name}
                  </p>

                  {accountLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenus}
                      className="block rounded-lg px-3 py-2 text-sm hover:underline"
                    >
                      {link.label}
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={signingOut}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[var(--accent)] disabled:opacity-70"
                  >
                    {signingOut ? "Signing out…" : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
