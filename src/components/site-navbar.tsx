"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ThemeSwitch } from "./site-theme";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--page)]"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          closeMenu();
          menuButton.current?.focus();
        }
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          onClick={closeMenu}
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
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm lg:hidden"
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
                  onClick={closeMenu}
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

            <Link
              href="/login"
              onClick={closeMenu}
              className="py-2 text-sm font-semibold hover:underline"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={closeMenu}
              className="rounded-full bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--page)]"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
