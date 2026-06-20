import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronRight, ExternalLink, GitBranch } from "lucide-react";

const platformLinks = [
  { href: "/", label: "Home" },
  { href: "/league/matchups", label: "Matchups" },
  { href: "/league/counters", label: "Counter Picks" },
  { href: "/champions", label: "Champions" },
];

const resourceLinks = [
  { href: "/league/counters", label: "Counter Pick" },
  { href: "/league/matchups", label: "Matchup Guides" },
  { href: "/champions", label: "Champion Index" },
  { href: "/legal", label: "Riot Disclaimer" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/legal", label: "Legal & Disclaimer" },
];

const socialLinks = [
  {
    href: "https://github.com/SteinGansmoe/lanestomp",
    icon: GitBranch,
    label: "GitHub",
  },
];

const riotDisclaimer =
  "LaneStomp is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.";

export function SiteFooter() {
  return (
    <footer
      className="border-t border-cyan-100/10 bg-[linear-gradient(180deg,#06111f_0%,#030914_100%)] text-zinc-300"
      id="site-footer"
    >
      <div className="mx-auto grid w-full max-w-[96rem] gap-7 px-4 py-7 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:gap-9 lg:px-8">
        <section className="min-w-0">
          <Link
            className="inline-flex items-center gap-3 rounded transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55"
            href="/"
          >
            <Image
              alt="LaneStomp"
              className="h-auto w-28 object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.12)]"
              height={96}
              src="/images/lanestomp-logo.png"
              width={144}
            />
            <span className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-white">
              LaneStomp
            </span>
          </Link>
          <p className="mt-3 max-w-72 text-sm leading-6 text-zinc-400">
            Learn matchups. Find counters. Improve faster.
          </p>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="LaneStomp social links">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  aria-label={item.label}
                  className="flex size-9 items-center justify-center rounded border border-cyan-100/15 bg-[#071321]/75 text-zinc-500 transition hover:border-cyan-300/30 hover:bg-cyan-400/[0.08] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55"
                  href={item.href}
                  key={item.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>

        <FooterLinkColumn title="Platform" links={platformLinks} />
        <FooterLinkColumn title="Resources" links={resourceLinks} />
        <FooterLinkColumn title="Legal" links={legalLinks} />
      </div>

      <div className="border-t border-cyan-100/10 bg-black/15">
        <div className="mx-auto w-full max-w-[96rem] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 border border-cyan-100/10 bg-[#06111f]/55 px-3 py-3 text-xs leading-5 text-zinc-500">
            <BookOpen className="mt-0.5 size-4 shrink-0 text-amber-200/70" aria-hidden="true" />
            <p className="max-w-5xl">{riotDisclaimer}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-cyan-100/10">
        <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-2 px-4 py-3 text-sm text-zinc-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>&copy; 2026 LaneStomp. All rights reserved.</p>
          <p className="text-cyan-100/55">Built by Stein for League players.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  external = false,
  links,
  title,
}: {
  external?: boolean;
  links: { href: string; label: string }[];
  title: string;
}) {
  return (
    <section className="min-w-0">
      <h2 className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-cyan-200/90">
        {title}
      </h2>
      <nav className="mt-3 space-y-2" aria-label={title}>
        {links.map((item) => (
          <Link
            className="group flex items-center justify-between gap-4 py-0.5 text-sm text-zinc-400 transition hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55"
            href={item.href}
            key={item.label}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span>{item.label}</span>
            </span>
            {external ? (
              <ExternalLink
                className="size-3.5 text-zinc-500 transition group-hover:text-cyan-200"
                aria-hidden="true"
              />
            ) : (
              <ChevronRight
                className="size-3.5 text-zinc-500 transition group-hover:text-amber-200"
                aria-hidden="true"
              />
            )}
          </Link>
        ))}
      </nav>
    </section>
  );
}
