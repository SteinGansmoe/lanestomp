import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  GitBranch,
  MessageCircle,
  Radio,
  Send,
} from "lucide-react";

const platformLinks = [
  { href: "/", label: "Home" },
  { href: "/league/matchups", label: "Matchups" },
  { href: "/league/counters", label: "Counter Picks" },
  { href: "/champions", label: "Champions" },
];

const resourceLinks = [
  { href: "#", label: "Matchup Requests" },
  { href: "#", label: "Feedback" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Discord" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/legal", label: "Legal & Disclaimer" },
];

const socialLinks = [
  { href: "#", icon: MessageCircle, label: "Discord" },
  { href: "#", icon: Radio, label: "Reddit" },
  { href: "#", icon: Send, label: "X" },
  {
    href: "#",
    icon: GitBranch,
    label: "GitHub",
  },
];

const riotDisclaimer =
  "LaneStomp is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.";

export function SiteFooter() {
  return (
    <footer className="border-t border-cyan-100/10 bg-[linear-gradient(180deg,#07101f_0%,#050b18_100%)] text-zinc-300 shadow-[0_-20px_60px_rgba(0,0,0,0.25)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-12 lg:px-8 lg:py-12">
        <section className="min-w-0">
          <Link
            className="inline-flex items-center gap-4 rounded-md transition hover:opacity-90"
            href="/"
          >
            <Image
              alt="LaneStomp"
              className="h-auto w-32 object-contain"
              height={96}
              src="/images/lanestomp-logo.png"
              width={144}
            />
            <span className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-white">
              LaneStomp
            </span>
          </Link>
          <p className="mt-5 max-w-72 text-sm leading-6 text-zinc-400">
            Learn matchups. Find counters. Improve faster.
          </p>
          <div className="mt-6 flex flex-wrap gap-3" aria-label="LaneStomp social links">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  aria-label={item.label}
                  className="flex size-9 items-center justify-center rounded-md border border-cyan-100/10 bg-[#10182b]/75 text-zinc-500 transition hover:border-cyan-300/30 hover:bg-cyan-400/[0.08] hover:text-cyan-100"
                  href={item.href}
                  key={item.label}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>

        <FooterLinkColumn title="Platform" links={platformLinks} />
        <FooterLinkColumn external title="Resources" links={resourceLinks} />
        <FooterLinkColumn title="Legal" links={legalLinks} />
      </div>

      <div className="border-t border-cyan-100/10 bg-black/15">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8">
          <div className="flex items-start gap-3 rounded-md border border-cyan-100/10 bg-[#10182b]/55 p-4 text-sm leading-6 text-zinc-500 shadow-inner shadow-black/10">
            <BookOpen className="mt-0.5 size-4 shrink-0 text-amber-200/70" aria-hidden="true" />
            <p className="max-w-5xl">{riotDisclaimer}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-cyan-100/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-zinc-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8">
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
      <nav className="mt-5 space-y-3" aria-label={title}>
        {links.map((item) => (
          <Link
            className="group flex items-center justify-between gap-4 text-sm text-zinc-400 transition hover:text-zinc-100"
            href={item.href}
            key={item.label}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span>{item.label}</span>
            </span>
            {external || item.href === "#" ? (
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
