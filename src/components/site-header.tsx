"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Home,
  LogIn,
  Menu,
  Newspaper,
  Search,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  getPrimarySeasonRouteForGame,
  getSupportedGames,
} from "@/src/features/games/selectors";
import type { Game } from "@/src/features/games/types";
import { isAdminUser } from "@/src/lib/admin";
import { supabase } from "@/src/lib/supabase";

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "#", icon: CalendarDays, label: "Calendar" },
  { href: "/my-games", icon: Star, label: "My Games" },
  { href: "#", icon: Newspaper, label: "News" },
];

type SiteHeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

function getInitials(title: string) {
  return title
    .split(" ")
    .map((word) => word.at(0))
    .join("")
    .slice(0, 3);
}

export function SiteHeader({ searchValue, onSearchChange }: SiteHeaderProps) {
  const [authLink, setAuthLink] = useState<{
    href: string;
    label: string;
    type: "admin" | "login";
  } | null>({ href: "/login", label: "Login", type: "login" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const pathname = usePathname();
  const currentSearch = searchValue ?? localSearch;
  const supportedGames = useMemo(() => getSupportedGames(), []);

  useEffect(() => {
    let isMounted = true;

    async function loadAuthLink() {
      if (!supabase) {
        return;
      }

      const { data } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (isAdminUser(data.user)) {
        setAuthLink({ href: "/admin", label: "Admin", type: "admin" });
        return;
      }

      setAuthLink(
        data.user ? null : { href: "/login", label: "Login", type: "login" }
      );
    }

    loadAuthLink();

    const { data: listener } =
      supabase?.auth.onAuthStateChange((_event, session) => {
        if (isAdminUser(session?.user ?? null)) {
          setAuthLink({ href: "/admin", label: "Admin", type: "admin" });
          return;
        }

        setAuthLink(
          session?.user
            ? null
            : { href: "/login", label: "Login", type: "login" }
        );
      }) ?? { data: null };

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  function handleSearchChange(value: string) {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }

    setLocalSearch(value);
  }

  return (
    <>
      <header className="border-b border-white/10 pb-5 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <BrandLink />
          <Button
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            className="size-10 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            onClick={() => setIsMenuOpen((current) => !current)}
            variant="ghost"
          >
            {isMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>

        <SearchInput
          className="mt-4"
          onSearchChange={handleSearchChange}
          searchValue={currentSearch}
        />

        {isMenuOpen ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-[#10182b] p-3 shadow-xl shadow-black/20">
            <SupportedGamesNav
              games={supportedGames}
              onNavigate={() => setIsMenuOpen(false)}
              pathname={pathname}
            />
            <NavigationLinks
              className="mt-5"
              onNavigate={() => setIsMenuOpen(false)}
              pathname={pathname}
            />
            <AuthNavigationLink
              className="mt-5"
              link={authLink}
              onNavigate={() => setIsMenuOpen(false)}
              pathname={pathname}
            />
          </div>
        ) : null}
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/10 bg-[#07101f] px-5 py-6 text-white shadow-2xl shadow-black/30 lg:flex">
        <BrandLink />
        <SearchInput
          className="mt-7"
          onSearchChange={handleSearchChange}
          searchValue={currentSearch}
        />
        <SupportedGamesNav
          className="mt-7"
          games={supportedGames}
          pathname={pathname}
        />
        <NavigationLinks className="mt-8" pathname={pathname} />
        <AuthNavigationLink
          className="mt-auto"
          link={authLink}
          pathname={pathname}
        />
      </aside>
    </>
  );
}

function AuthNavigationLink({
  className,
  link,
  onNavigate,
  pathname,
}: {
  className?: string;
  link: { href: string; label: string; type: "admin" | "login" } | null;
  onNavigate?: () => void;
  pathname: string;
}) {
  if (!link) {
    return null;
  }

  const Icon = link.type === "admin" ? ShieldCheck : LogIn;
  const isActive = pathname === link.href;

  return (
    <nav className={className} aria-label="Account">
      <Link
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
          isActive
            ? "bg-violet-500/20 text-violet-100"
            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
        }`}
        href={link.href}
        onClick={onNavigate}
      >
        <Icon className="size-4" aria-hidden="true" />
        {link.label}
      </Link>
    </nav>
  );
}

function BrandLink() {
  return (
    <Link className="flex items-center gap-3" href="/">
      <Image
        alt=""
        aria-hidden="true"
        className="size-10 rounded-lg shadow-lg shadow-violet-950/30"
        height={40}
        src="/seasontracker-logo.svg"
        width={40}
      />
      <span className="font-mono text-xl font-semibold">SeasonTracker</span>
    </Link>
  );
}

function SearchInput({
  className,
  onSearchChange,
  searchValue,
}: {
  className?: string;
  onSearchChange: (value: string) => void;
  searchValue: string;
}) {
  return (
    <label className={`relative block ${className ?? ""}`}>
      <span className="sr-only">Search games</span>
      <Search
        className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
        aria-hidden="true"
      />
      <Input
        className="h-11 rounded-lg border-white/10 bg-white/5 pl-4 pr-11 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search games..."
        type="search"
        value={searchValue}
      />
    </label>
  );
}

function NavigationLinks({
  className,
  onNavigate,
  pathname,
}: {
  className?: string;
  onNavigate?: () => void;
  pathname: string;
}) {
  return (
    <nav className={`space-y-1 ${className ?? ""}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        const itemClassName = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
          isActive
            ? "bg-violet-500/20 text-violet-100"
            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
        }`;

        const content = (
          <>
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </>
        );

        return item.href === "#" ? (
          <a
            className={itemClassName}
            href="#"
            key={item.label}
            onClick={onNavigate}
          >
            {content}
          </a>
        ) : (
          <Link
            className={itemClassName}
            href={item.href}
            key={item.label}
            onClick={onNavigate}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}

function SupportedGamesNav({
  className,
  games,
  onNavigate,
  pathname,
}: {
  className?: string;
  games: Game[];
  onNavigate?: () => void;
  pathname: string;
}) {
  return (
    <div className={className}>
      <p className="px-3 font-mono text-xs uppercase text-zinc-500">
        Supported Games
      </p>
      <nav className="mt-3 space-y-1">
        {games.map((game) => {
          const href = getPrimarySeasonRouteForGame(game.id);
          const isActive = pathname === href;

          return (
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-violet-500/20 text-violet-100"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
              }`}
              href={href}
              key={game.id}
              onClick={onNavigate}
            >
              <GameAvatar game={game} />
              <span className="min-w-0 truncate">{game.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function GameAvatar({ game }: { game: Game }) {
  return (
    <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/5 font-mono text-xs font-semibold text-violet-100">
      {game.image ? (
        <Image
          alt=""
          className="object-cover"
          fill
          sizes="36px"
          src={game.image}
        />
      ) : (
        getInitials(game.title)
      )}
    </span>
  );
}
