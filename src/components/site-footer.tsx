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

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/league/matchups", label: "Matchups" },
  { href: "/games/league-of-legends/champions", label: "Champions" },
  { href: "#", isComingSoon: true, label: "Counter Picks" },
  { href: "#", isComingSoon: true, label: "Patch Notes" },
];

const resourceLinks = [
  { href: "#", label: "Matchup Requests" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Discord" },
  { href: "#", label: "Reddit" },
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
    <footer className="border-t border-white/10 bg-[#07101f] text-zinc-300 shadow-[0_-20px_60px_rgba(0,0,0,0.25)]">
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
            Learn matchups. Improve champion pools. Climb smarter.
          </p>
          <div
            className="mt-6 flex flex-wrap gap-3"
            aria-label="LaneStomp social links"
          >
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  aria-label={item.label}
                  className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-zinc-500 transition hover:border-violet-300/30 hover:bg-white/10 hover:text-violet-200"
                  href={item.href}
                  key={item.label}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>

        <FooterLinkColumn title="Navigation" links={navigationLinks} />
        <FooterLinkColumn external title="Resources" links={resourceLinks} />
        <FooterLinkColumn title="Legal" links={legalLinks} />
      </div>

      <div className="border-t border-white/10 bg-black/10">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8">
          <div className="flex items-start gap-3 text-sm leading-6 text-zinc-500">
            <BookOpen
              className="mt-0.5 size-4 shrink-0 text-violet-300/70"
              aria-hidden="true"
            />
            <p className="max-w-5xl">{riotDisclaimer}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-zinc-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8">
          <p>&copy; 2026 LaneStomp. All rights reserved.</p>
          <p className="text-zinc-500">
            Built by Stein for League players.
          </p>
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
  links: { href: string; isComingSoon?: boolean; label: string }[];
  title: string;
}) {
  return (
    <section className="min-w-0">
      <h2 className="font-mono text-sm font-bold uppercase text-violet-300">
        {title}
      </h2>
      <nav className="mt-5 space-y-3" aria-label={title}>
        {links.map((item) => (
          <Link
            className="group flex items-center justify-between gap-4 text-sm text-zinc-400 transition hover:text-violet-200"
            href={item.href}
            key={item.label}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span>{item.label}</span>
              {item.isComingSoon ? (
                <span className="rounded border border-violet-300/20 bg-violet-400/10 px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-normal text-violet-200">
                  Soon
                </span>
              ) : null}
            </span>
            {external || item.href === "#" ? (
              <ExternalLink
                className="size-3.5 text-zinc-500 transition group-hover:text-violet-300"
                aria-hidden="true"
              />
            ) : (
              <ChevronRight
                className="size-3.5 text-zinc-500 transition group-hover:text-violet-300"
                aria-hidden="true"
              />
            )}
          </Link>
        ))}
      </nav>
    </section>
  );
}
