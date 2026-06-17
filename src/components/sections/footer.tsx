import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Aurum Core", href: "/products/aurum-core" },
      { label: "Halo Field", href: "/products/halo-field" },
      { label: "Velvet Drive", href: "/products/velvet-drive" },
      { label: "Obsidian Suite", href: "/products/obsidian-suite" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Vision", href: "/#vision" },
      { label: "Technology", href: "/#technology" },
      { label: "Experience", href: "/#experience" },
      { label: "Admin", href: "/admin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-line)] px-6 pb-12 pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand + statement */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative grid size-8 place-items-center">
                <span className="absolute inset-0 rounded-full bg-[var(--color-ink)]" />
                <span className="absolute inset-[3px] rounded-full bg-[var(--color-paper)]" />
                <span className="absolute inset-[6px] rounded-full bg-[var(--color-ink)]" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                Royce<span className="text-[var(--color-ink-muted)]">DSP</span>
              </span>
            </Link>
            <p className="text-pretty mt-6 max-w-xs leading-relaxed text-[var(--color-ink-muted)]">
              The future of refined audio intelligence. Made for those who hear
              the difference.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="overline mb-5">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Newsletter */}
          <div>
            <h3 className="overline mb-5">The Signal</h3>
            <NewsletterForm />
          </div>
        </div>

        {/* Oversized wordmark — quiet grandeur */}
        <div className="mt-24 select-none overflow-hidden" aria-hidden>
          <div className="font-display text-[clamp(3.5rem,17vw,14rem)] font-light leading-none tracking-[-0.05em] text-[var(--color-ink)] opacity-[0.04]">
            RoyceDSP
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--color-line)] pt-8 text-xs text-[var(--color-ink-faint)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RoyceDSP. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="transition-colors hover:text-[var(--color-ink)]">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-[var(--color-ink)]">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-[var(--color-ink)]">
              Licensing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
