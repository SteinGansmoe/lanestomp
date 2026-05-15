"use client";

import Link from "next/link";
import { useState } from "react";
import { Gamepad2, Menu, Search, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const navItems = ["Home", "Games", "Calendar", "My Games", "News"];

type SiteHeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function SiteHeader({ searchValue, onSearchChange }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const currentSearch = searchValue ?? localSearch;

  function handleSearchChange(value: string) {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }

    setLocalSearch(value);
  }

  return (
    <header className="border-b border-white/10 pb-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500 text-white">
              <Gamepad2 className="size-5" aria-hidden="true" />
            </div>
            <span className="font-mono text-xl font-semibold">
              SeasonTracker
            </span>
          </Link>
          <Button
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            className="size-10 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10 lg:hidden"
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

        <nav className="hidden gap-7 font-mono text-sm text-zinc-400 lg:flex">
          {navItems.map((item, index) => (
            <a
              className={
                index === 0
                  ? "text-violet-300"
                  : "transition hover:text-zinc-100"
              }
              href="#"
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>

        <label className="relative block lg:w-72">
          <span className="sr-only">Search games</span>
          <Search
            className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <Input
            className="h-11 rounded-lg border-white/10 bg-white/5 pl-4 pr-11 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search games..."
            type="search"
            value={currentSearch}
          />
        </label>
      </div>

      {isMenuOpen ? (
        <nav className="mt-4 grid gap-2 rounded-lg border border-white/10 bg-white/5 p-2 font-mono text-sm text-zinc-300 lg:hidden">
          {navItems.map((item, index) => (
            <a
              className={`rounded-md px-3 py-2 ${
                index === 0
                  ? "bg-violet-500/15 text-violet-200"
                  : "hover:bg-white/5"
              }`}
              href="#"
              key={item}
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
