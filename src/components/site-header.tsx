"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";

import { AuthenticatedAccountMenu } from "@/src/components/authenticated-account-menu";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/league/counters", label: "Counter Pick" },
  { href: "/league/matchups", label: "Matchup Guides" },
  { href: "/champions", label: "Champions" },
];

type SiteHeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function SiteHeader({ searchValue, onSearchChange }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const pathname = usePathname();
  const currentSearch = searchValue ?? localSearch;
  const shouldShowSearch = Boolean(onSearchChange || searchValue !== undefined);

  function handleSearchChange(value: string) {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }

    setLocalSearch(value);
  }

  return (
    <header className="relative z-40 overflow-visible border-b border-cyan-100/15 bg-[#030914]/75 backdrop-blur">
      <div className="flex min-h-16 items-center gap-4 py-3">
        <BrandLink />

        <NavigationLinks className="ml-8 hidden min-w-0 flex-1 gap-6 md:flex" pathname={pathname} />

        {shouldShowSearch ? (
          <SearchInput
            className="ml-auto hidden w-full max-w-xs xl:block"
            onSearchChange={handleSearchChange}
            searchValue={currentSearch}
          />
        ) : null}

        <div className="ml-auto hidden shrink-0 items-center gap-3 sm:flex xl:ml-0">
          <AuthenticatedAccountMenu menuPlacement="inline" variant="topbar" />
          <Link
            className="hidden h-10 items-center justify-center bg-cyan-300 px-5 font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#04111d] transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 lg:inline-flex"
            href="/league/counters"
          >
            Start Counter Pick
          </Link>
        </div>

        <Button
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          className="ml-auto size-10 border-cyan-100/15 bg-[#06111f]/92 p-0 text-cyan-100 hover:border-cyan-300/35 hover:bg-cyan-400/[0.08] sm:hidden"
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

      {shouldShowSearch ? (
        <SearchInput
          className="mb-3 xl:hidden"
          onSearchChange={handleSearchChange}
          searchValue={currentSearch}
        />
      ) : null}

      {isMenuOpen ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 border border-cyan-100/15 bg-[linear-gradient(180deg,#081524,#050d19)] p-3 shadow-[0_18px_42px_rgba(0,0,0,0.42)] sm:hidden">
          <NavigationLinks
            className="grid gap-1.5"
            onNavigate={() => setIsMenuOpen(false)}
            pathname={pathname}
          />
          <AuthenticatedAccountMenu
            className="mt-4 border-t border-cyan-100/10 pt-4"
            menuPlacement="inline"
            variant="topbar"
          />
        </div>
      ) : null}
    </header>
  );
}

function BrandLink() {
  return (
    <Link
      aria-label="LaneStomp home"
      className="relative h-12 w-36 shrink-0 drop-shadow-[0_0_12px_rgba(34,211,238,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55 sm:h-14 sm:w-52"
      href="/"
    >
      <Image
        alt="LaneStomp"
        className="object-contain object-left"
        fill
        priority
        sizes="176px"
        src="/images/lanestomp-logo.png"
      />
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
      <span className="sr-only">Search</span>
      <Search
        className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
        aria-hidden="true"
      />
      <Input
        className="h-10 border-cyan-100/15 bg-[#06111f]/82 pl-4 pr-11 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20"
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search..."
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
    <nav
      className={cn(
        "font-mono text-xs font-semibold uppercase tracking-[0.08em] text-zinc-300",
        className,
      )}
      aria-label="Primary navigation"
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            className={cn(
              "relative shrink-0 px-2 py-3 transition hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55 md:px-0",
              isActive ? "text-cyan-100" : "text-zinc-300",
            )}
            href={item.href}
            key={item.label}
            onClick={onNavigate}
          >
            {item.label}
            {isActive ? (
              <span
                className="absolute bottom-0 left-0 h-px w-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]"
                aria-hidden="true"
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
