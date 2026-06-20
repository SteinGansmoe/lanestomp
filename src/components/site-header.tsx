"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";

import { AuthenticatedAccountMenu } from "@/src/components/authenticated-account-menu";
import { counterPickPrimaryCtaClassName } from "@/src/components/league/counter-pick-cta-styles";
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
  const menuId = useId();
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const currentSearch = searchValue ?? localSearch;
  const shouldShowSearch = Boolean(onSearchChange || searchValue !== undefined);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      const firstFocusable = getFocusableElements(mobileMenuPanelRef.current)[0];
      firstFocusable?.focus();
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements(mobileMenuPanelRef.current);

      if (focusableElements.length === 0) {
        event.preventDefault();
        mobileMenuPanelRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  function closeMobileMenu({ restoreFocus = true } = {}) {
    setIsMenuOpen(false);

    if (restoreFocus) {
      window.setTimeout(() => {
        const returnTarget = previouslyFocusedElementRef.current ?? mobileMenuTriggerRef.current;
        returnTarget?.focus();
      }, 0);
    }
  }

  function handleSearchChange(value: string) {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }

    setLocalSearch(value);
  }

  return (
    <header className="relative z-40 isolate overflow-visible">
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-[min(100vw,104rem)] -translate-x-1/2 border-b border-cyan-100/12 bg-[linear-gradient(90deg,rgba(3,9,20,0)_0%,rgba(3,9,20,0.72)_10%,rgba(3,9,20,0.9)_24%,rgba(3,9,20,0.9)_76%,rgba(3,9,20,0.72)_90%,rgba(3,9,20,0)_100%)] backdrop-blur [mask-image:linear-gradient(90deg,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_10%,black_90%,transparent_100%)]"
        aria-hidden="true"
      />
      <div className="relative z-10 flex min-h-16 items-center gap-4 py-2 sm:py-1.5">
        <BrandLink />

        <NavigationLinks className="ml-8 hidden min-w-0 flex-1 gap-6 md:flex" pathname={pathname} />

        {shouldShowSearch ? (
          <SearchInput
            className="ml-auto hidden w-full max-w-xs xl:block"
            onSearchChange={handleSearchChange}
            searchValue={currentSearch}
          />
        ) : null}

        <div className="ml-auto mr-1 hidden shrink-0 items-center gap-3 sm:flex lg:mr-3 xl:ml-0 xl:mr-5">
          <AuthenticatedAccountMenu menuPlacement="inline" variant="topbar" />
          <Link
            className={cn(
              "hidden h-10 items-center justify-center px-5 font-mono text-xs font-bold uppercase tracking-[0.08em] lg:inline-flex",
              counterPickPrimaryCtaClassName,
            )}
            href="/league/counters"
          >
            Counter Pick
          </Link>
        </div>

        <Button
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          className="ml-auto size-10 border-cyan-100/15 bg-[#06111f]/92 p-0 text-cyan-100 hover:border-cyan-300/35 hover:bg-cyan-400/[0.08] sm:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          ref={mobileMenuTriggerRef}
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

      {isMenuOpen && typeof document !== "undefined"
        ? createPortal(
            <>
              <button
                aria-label="Close navigation"
                className="fixed inset-0 z-[140] cursor-default bg-[#01050d]/78 backdrop-blur-[2px] sm:hidden"
                onClick={() => closeMobileMenu()}
                type="button"
              />
              <div
                aria-label="Mobile navigation"
                className="fixed inset-x-3 top-3 z-[150] max-h-[calc(100dvh-1.5rem)] overflow-y-auto border border-cyan-300/25 bg-[linear-gradient(180deg,#081524,#050d19)] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.58),0_0_0_1px_rgba(103,232,249,0.08)] sm:hidden"
                id={menuId}
                ref={mobileMenuPanelRef}
                role="dialog"
                tabIndex={-1}
              >
                <div className="flex items-center justify-between gap-3 border-b border-cyan-100/10 pb-3">
                  <BrandLink />
                  <button
                    aria-label="Close navigation"
                    className="flex size-10 shrink-0 items-center justify-center rounded border border-cyan-100/15 bg-[#06111f]/92 text-cyan-100 transition hover:border-cyan-300/35 hover:bg-cyan-400/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55"
                    onClick={() => closeMobileMenu()}
                    type="button"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>
                <NavigationLinks
                  className="mt-3 grid gap-1.5"
                  onNavigate={() => closeMobileMenu({ restoreFocus: false })}
                  pathname={pathname}
                />
                <AuthenticatedAccountMenu
                  className="mt-4 border-t border-cyan-100/10 pt-4"
                  menuPlacement="inline"
                  variant="topbar"
                />
              </div>
            </>,
            document.body,
          )
        : null}
    </header>
  );
}

function BrandLink() {
  return (
    <Link
      aria-label="LaneStomp home"
      className="relative flex h-14 w-40 shrink-0 items-center overflow-visible drop-shadow-[0_0_12px_rgba(34,211,238,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55 sm:h-[4.25rem] sm:w-48"
      href="/"
    >
      <Image
        alt="LaneStomp"
        className="object-contain object-left"
        fill
        priority
        sizes="(min-width: 640px) 192px, 160px"
        src="/images/lanestomp-logo.png"
      />
    </Link>
  );
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"));
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
