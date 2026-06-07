"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Menu, Search, Shield, Swords, X } from "lucide-react";

import { AuthenticatedAccountMenu } from "@/src/components/authenticated-account-menu";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/league/matchups", icon: Swords, label: "Matchups" },
  {
    href: "/champions",
    icon: Shield,
    label: "Champions",
  },
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
    <>
      <header className="border-b border-white/10 pb-5 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <BrandLink className="h-14 w-40 justify-start" />
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

        {shouldShowSearch ? (
          <SearchInput
            className="mt-4"
            onSearchChange={handleSearchChange}
            searchValue={currentSearch}
          />
        ) : null}

        {isMenuOpen ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-[#10182b] p-3 shadow-xl shadow-black/20">
            <NavigationLinks onNavigate={() => setIsMenuOpen(false)} pathname={pathname} />
            <AuthenticatedAccountMenu
              className="mt-4 border-t border-white/10 pt-4"
              menuPlacement="inline"
            />
          </div>
        ) : null}
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/10 bg-[#07101f] px-5 py-6 text-white shadow-2xl shadow-black/30 lg:flex">
        <BrandLink className="h-32 w-full justify-center" />
        {shouldShowSearch ? (
          <SearchInput
            className="mt-7"
            onSearchChange={handleSearchChange}
            searchValue={currentSearch}
          />
        ) : null}
        <NavigationLinks className="mt-8" pathname={pathname} />
        <AuthenticatedAccountMenu className="mt-auto pt-6" />
      </aside>
    </>
  );
}

function BrandLink({ className }: { className?: string }) {
  return (
    <Link
      aria-label="LaneStomp home"
      className={`relative flex items-center ${className ?? ""}`}
      href="/"
    >
      <Image
        alt="LaneStomp"
        className="object-contain"
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
        className="h-11 rounded-lg border-white/10 bg-white/5 pl-4 pr-11 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
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
          <a className={itemClassName} href="#" key={item.label} onClick={onNavigate}>
            {content}
          </a>
        ) : (
          <Link className={itemClassName} href={item.href} key={item.label} onClick={onNavigate}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
