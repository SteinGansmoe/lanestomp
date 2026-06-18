"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown, LogOut, Settings, ShieldCheck, UserCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/src/components/ui/button";
import { isAdminUser } from "@/src/lib/admin";
import { fetchUserProfile, getProfileDisplayName, type UserProfile } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";
import { cn } from "@/src/lib/utils";

type AuthenticatedAccountMenuProps = {
  className?: string;
  menuPlacement?: "dropdown-up" | "inline";
  showSignedOutActions?: boolean;
  variant?: "sidebar" | "topbar";
};

type FloatingMenuPosition = {
  left: number;
  top: number;
  width: number;
};

function getUserInitial(label: string) {
  return label.trim().charAt(0).toUpperCase() || "U";
}

function getAccountMenuDisplayName(user: User, profile: UserProfile | null) {
  if (profile?.username?.trim()) {
    return getProfileDisplayName(user, profile);
  }

  const emailHandle = user.email?.split("@")[0]?.trim();
  return emailHandle || getProfileDisplayName(user, profile);
}

export function AuthenticatedAccountMenu({
  className,
  menuPlacement = "dropdown-up",
  showSignedOutActions = true,
  variant = "sidebar",
}: AuthenticatedAccountMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [floatingMenuPosition, setFloatingMenuPosition] = useState<FloatingMenuPosition | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shouldUseFloatingMenu = variant === "topbar";

  useEffect(() => {
    let isMounted = true;

    async function applyUser(nextUser: User | null) {
      const [nextIsAdmin, profileResult] = await Promise.all([
        isAdminUser(nextUser),
        nextUser ? fetchUserProfile(nextUser.id) : Promise.resolve({ data: null }),
      ]);

      if (!isMounted) {
        return;
      }

      setUser(nextUser);
      setIsAdmin(nextIsAdmin);
      setProfile(profileResult.data ?? null);
      setIsLoading(false);
    }

    async function loadUser() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.auth.getUser();
      await applyUser(data.user ?? null);
    }

    void loadUser();
    window.addEventListener("lanestomp-profile-updated", loadUser);

    const { data: listener } = supabase?.auth.onAuthStateChange((_event, session) => {
      setIsMenuOpen(false);
      void applyUser(session?.user ?? null);
    }) ?? { data: null };

    return () => {
      isMounted = false;
      window.removeEventListener("lanestomp-profile-updated", loadUser);
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen || !shouldUseFloatingMenu) {
      return;
    }

    function updateFloatingMenuPosition() {
      const trigger = triggerRef.current;

      if (!trigger) {
        return;
      }

      const triggerRect = trigger.getBoundingClientRect();
      const menuWidth = Math.max(248, triggerRect.width);
      const viewportWidth = window.innerWidth;
      const left = Math.min(
        Math.max(12, triggerRect.right - menuWidth),
        Math.max(12, viewportWidth - menuWidth - 12),
      );

      setFloatingMenuPosition({
        left,
        top: triggerRect.bottom + 8,
        width: menuWidth,
      });
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }

      setIsMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setIsMenuOpen(false);
      triggerRef.current?.focus();
    }

    updateFloatingMenuPosition();
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateFloatingMenuPosition);
    window.addEventListener("scroll", updateFloatingMenuPosition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateFloatingMenuPosition);
      window.removeEventListener("scroll", updateFloatingMenuPosition, true);
    };
  }, [isMenuOpen, shouldUseFloatingMenu]);

  async function handleSignOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    setIsMenuOpen(false);
    triggerRef.current?.focus();

    if (pathname.startsWith("/admin")) {
      router.replace("/login");
      return;
    }

    router.refresh();
  }

  if (isLoading) {
    if (!showSignedOutActions) {
      return null;
    }

    return (
      <div className={cn(variant === "topbar" ? "w-24 sm:w-32" : "w-full", className)}>
        <div className="h-11 w-full rounded-md border border-cyan-100/10 bg-white/[0.04]" />
      </div>
    );
  }

  if (!user) {
    if (!showSignedOutActions) {
      return null;
    }

    return (
      <div
        className={cn(
          variant === "topbar" ? "flex items-center gap-3" : "grid w-full gap-2",
          className,
        )}
      >
        <Link
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-md border border-cyan-100/10 bg-white/[0.04] px-3 text-sm text-zinc-100 transition hover:border-cyan-300/25 hover:bg-cyan-400/[0.07] hover:text-cyan-100",
            variant === "topbar" &&
              "min-w-20 px-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] sm:min-w-24 sm:px-3",
          )}
          href="/login"
        >
          Sign in
        </Link>
        {variant === "sidebar" ? (
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-amber-300/20 bg-amber-400/10 px-3 text-sm font-medium text-amber-100 transition hover:border-amber-300/35 hover:bg-amber-400/15"
            href="/register"
          >
            Create account
          </Link>
        ) : null}
      </div>
    );
  }

  const userLabel = getAccountMenuDisplayName(user, profile);

  return (
    <div className={cn("relative", variant === "topbar" ? "w-36 sm:w-44" : "w-full", className)}>
      <button
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded border border-cyan-100/15 bg-[#06111f]/92 px-2.5 text-left text-sm text-zinc-100 transition hover:border-cyan-300/35 hover:bg-cyan-400/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55",
          isMenuOpen && "border-cyan-300/45 bg-cyan-400/[0.08]",
        )}
        onClick={() => setIsMenuOpen((current) => !current)}
        ref={triggerRef}
        type="button"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded border border-cyan-300/25 bg-[#081827] font-mono text-xs font-semibold text-cyan-100">
          {getUserInitial(userLabel)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-white">{userLabel}</span>
          <span className="block truncate text-xs text-cyan-100/55">
            {isAdmin ? "Admin" : "Signed in"}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-zinc-400 transition-transform",
            isMenuOpen ? "rotate-180" : "",
          )}
          aria-hidden="true"
        />
      </button>

      {isMenuOpen && shouldUseFloatingMenu
        ? createPortal(
            <AccountMenuContent
              isAdmin={isAdmin}
              menuRef={menuRef}
              onClose={() => setIsMenuOpen(false)}
              onSignOut={handleSignOut}
              style={getFloatingMenuStyle(floatingMenuPosition)}
              userLabel={userLabel}
              variant="floating"
            />,
            document.body,
          )
        : null}

      {isMenuOpen && !shouldUseFloatingMenu ? (
        <AccountMenuContent
          isAdmin={isAdmin}
          menuPlacement={menuPlacement}
          menuRef={menuRef}
          onClose={() => setIsMenuOpen(false)}
          onSignOut={handleSignOut}
          userLabel={userLabel}
          variant="inline"
        />
      ) : null}
    </div>
  );
}

function getFloatingMenuStyle(position: FloatingMenuPosition | null): CSSProperties {
  if (!position) {
    return {
      opacity: 0,
      pointerEvents: "none",
      position: "fixed",
    };
  }

  return {
    left: position.left,
    position: "fixed",
    top: position.top,
    width: position.width,
  };
}

function AccountMenuContent({
  isAdmin,
  menuPlacement = "inline",
  menuRef,
  onClose,
  onSignOut,
  style,
  userLabel,
  variant,
}: {
  isAdmin: boolean;
  menuPlacement?: "dropdown-up" | "inline";
  menuRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onSignOut: () => void;
  style?: CSSProperties;
  userLabel: string;
  variant: "floating" | "inline";
}) {
  return (
    <div
      className={cn(
        "z-[100] overflow-hidden rounded border border-cyan-100/15 bg-[linear-gradient(180deg,#081524,#050d19)] p-1 text-sm text-zinc-100 shadow-[0_18px_42px_rgba(0,0,0,0.42),0_0_0_1px_rgba(103,232,249,0.05)]",
        variant === "inline" && "w-full",
        variant === "inline" && menuPlacement === "inline" && "mt-2",
        variant === "inline" && menuPlacement === "dropdown-up" && "absolute bottom-14 left-0 right-0",
      )}
      ref={menuRef}
      role="menu"
      style={style}
    >
      <div className="border-b border-cyan-100/10 px-3 py-2.5">
        <div className="flex items-center gap-2 text-zinc-100">
          <UserCircle className="size-4 shrink-0 text-cyan-100/80" aria-hidden="true" />
          <span className="min-w-0 truncate font-medium">{userLabel}</span>
        </div>
      </div>

      <Link
        className={accountMenuItemClassName}
        href="/account/settings"
        onClick={onClose}
        role="menuitem"
      >
        <Settings className="size-4" aria-hidden="true" />
        Account Settings
      </Link>

      {isAdmin ? (
        <Link className={accountMenuItemClassName} href="/admin" onClick={onClose} role="menuitem">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Admin Dashboard
        </Link>
      ) : null}

      <Button
        className={cn(accountMenuItemClassName, "h-10 w-full border-0 bg-transparent px-3")}
        onClick={onSignOut}
        role="menuitem"
        type="button"
        variant="ghost"
      >
        <LogOut className="size-4" aria-hidden="true" />
        Logout
      </Button>
    </div>
  );
}

const accountMenuItemClassName =
  "flex min-h-10 items-center gap-2 rounded px-3 py-2 text-zinc-300 transition hover:bg-cyan-400/[0.08] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45";
