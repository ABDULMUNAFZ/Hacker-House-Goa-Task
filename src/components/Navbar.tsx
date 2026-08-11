export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-goa-yellow/40 bg-goa-deep/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <a href="#top" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-goa-yellow sm:text-3xl">
            HH GOA
          </span>
          <span className="label-cond text-[0.62rem] text-goa-pink sm:text-xs">2026</span>
        </a>
        <ul className="flex items-center gap-1 sm:gap-4">
          {[
            { href: "#create", label: "Create" },
            { href: "#how", label: "How it works" },
            { href: "#share", label: "Share" },
          ].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="label-cond rounded-full px-2 py-2 text-[0.6rem] text-goa-cream transition-colors hover:text-goa-yellow sm:px-3 sm:text-[0.7rem]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
