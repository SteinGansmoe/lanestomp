import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
  Gamepad2,
  GitBranch,
  Heart,
  MessageCircle,
  Radio,
  Send,
} from "lucide-react";

import { FooterAuthLinks } from "@/src/components/footer-auth-links";

const navigationLinks = [
  { href: "/", label: "Dashboard" },
  { href: "#", label: "Calendar" },
  { href: "/my-games", label: "My Games" },
  { href: "#", label: "News" },
];

const resourceLinks = [
  { href: "#", label: "Discord" },
  { href: "#", label: "Reddit" },
  { href: "#", label: "GitHub" },
  { href: "#", label: "Contact" },
];

const legalLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Use" },
  { href: "#", label: "Disclaimer" },
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

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#07101f] text-zinc-300 shadow-[0_-20px_60px_rgba(0,0,0,0.25)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.45fr] lg:gap-14 lg:px-8 lg:py-11">
        <section className="min-w-0">
          <Link className="flex items-center gap-4" href="/">
            <Image
              alt=""
              aria-hidden="true"
              className="size-11 rounded-lg shadow-lg shadow-violet-950/30"
              height={44}
              src="/seasontracker-logo.svg"
              width={44}
            />
            <span className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-white">
              SeasonTracker
            </span>
          </Link>
          <p className="mt-5 max-w-64 text-sm leading-6 text-zinc-400">
            Track seasons, events and your favorite games. All in one place.
          </p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  aria-label={item.label}
                  className="flex size-9 items-center justify-center rounded-md border border-white/5 bg-white/5 text-zinc-500 transition hover:border-violet-300/20 hover:bg-white/10 hover:text-violet-200"
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

        <section className="min-w-0">
          <h2 className="font-mono text-sm font-bold uppercase text-violet-300">
            About
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-400">
            SeasonTracker is a fan-made companion platform and is not affiliated
            with Blizzard, Riot Games, Grinding Gear Games or other publishers.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-300">
            Built by Stein with <Heart className="size-4 text-red-500" aria-hidden="true" /> for gamers.
          </p>
        </section>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-zinc-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8">
          <p>&copy; 2026 SeasonTracker. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <FooterAuthLinks />
            <p className="inline-flex items-center gap-2">
              Made for gamers, by a gamer.
              <Gamepad2 className="size-5 text-zinc-400" aria-hidden="true" />
            </p>
          </div>
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
            <span>{item.label}</span>
            {external ? (
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
