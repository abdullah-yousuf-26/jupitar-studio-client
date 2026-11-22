import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

const categories = [
  { label: "Photo Studios", value: "photo" },
  { label: "Sound Stages", value: "film" },
  { label: "Podcast Rooms", value: "podcast" },
  { label: "Music Suites", value: "music" },
  { label: "Art Workshops", value: "workshop" },
];

const headingStyle = "studio-heading mb-4 text-2xl uppercase";
const linkStyle =
  "text-sm text-[var(--muted)] hover:text-[var(--accent)] hover:underline";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--page)] text-[var(--text)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="studio-heading inline-block text-3xl">
              JUPITAR STUDIO
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--muted)]">
              We connect photographers, filmmakers, musicians, and podcasters
              with local hosts who have space to create.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className={headingStyle}>Quick links</h2>

            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkStyle}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio categories">
            <h2 className={headingStyle}>Studio categories</h2>

            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/studios?category=${category.value}`}
                    className={linkStyle}
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headingStyle}>Studio newsletter</h2>

            <label htmlFor="footer-email" className="mb-2 block text-sm">
              Email address
            </label>

            <input
              id="footer-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-describedby="newsletter-status"
              disabled
              className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
            />

            <p
              id="newsletter-status"
              className="mt-2 text-sm text-[var(--muted)]"
            >
              Sign-ups open soon.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
          <p className="text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} JUPITAR STUDIO. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/terms" className={linkStyle}>
              Terms of use
            </Link>

            <a
              href="https://twitter.com/intent/tweet?text=Check%20out%20JUPITAR%20STUDIO"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${linkStyle}`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.49h2.039L6.487 3.24H4.3l13.311 17.403Z" />
              </svg>
              Share on X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
