"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, LogOut, ShieldCheck, UserCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/src/components/ui/button";
import { isAdminUser } from "@/src/lib/admin";
import { supabase } from "@/src/lib/supabase";
import { cn } from "@/src/lib/utils";

type AuthenticatedTopbarProps = {
  className?: string;
  compact?: boolean;
};

function getUserLabel(user: User) {
  return user.email ?? "Signed in";
}

function getUserInitial(user: User) {
  return getUserLabel(user).trim().charAt(0).toUpperCase() || "U";
}

export function AuthenticatedTopbar({
  className,
  compact = false,
}: AuthenticatedTopbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const isAdmin = useMemo(() => isAdminUser(user), [user]);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      setUser(data.user ?? null);
      setIsLoading(false);
    }

    loadUser();

    const { data: listener } =
      supabase?.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        setIsMenuOpen(false);
      }) ?? { data: null };

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setUser(null);
    setIsMenuOpen(false);
    router.refresh();
  }

  if (isLoading) {
    return (
      <div className={cn("flex justify-end", className)}>
        <div className="h-10 w-36 rounded-lg border border-white/10 bg-white/[0.04]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("flex justify-end", className)}>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 text-sm text-zinc-100 transition hover:bg-white/10"
          href="/login"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("relative flex justify-end", className)}>
      <button
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        className="flex h-10 max-w-full items-center gap-2 rounded-lg border border-white/10 bg-[#10182b]/90 px-2.5 text-left text-sm text-zinc-100 shadow-lg shadow-black/10 transition hover:bg-white/[0.07]"
        onClick={() => setIsMenuOpen((current) => !current)}
        type="button"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-violet-500/20 font-mono text-xs font-semibold text-violet-100 ring-1 ring-violet-300/20">
          {getUserInitial(user)}
        </span>
        {!compact ? (
          <span className="min-w-0">
            <span className="block truncate font-medium">
              {getUserLabel(user)}
            </span>
            <span className="block truncate text-xs text-zinc-500">
              {isAdmin ? "Admin" : "Signed in"}
            </span>
          </span>
        ) : null}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-zinc-400 transition-transform",
            isMenuOpen ? "rotate-180" : ""
          )}
          aria-hidden="true"
        />
      </button>

      {isMenuOpen ? (
        <div
          className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-lg border border-white/10 bg-[#10182b] p-1 text-sm text-zinc-100 shadow-2xl shadow-black/30"
          role="menu"
        >
          <div className="border-b border-white/10 px-3 py-3">
            <div className="flex items-center gap-2 text-zinc-100">
              <UserCircle className="size-4" aria-hidden="true" />
              <span className="min-w-0 truncate">{getUserLabel(user)}</span>
            </div>
          </div>

          {isAdmin ? (
            <Link
              className="flex items-center gap-2 rounded-md px-3 py-2 text-zinc-300 transition hover:bg-white/5 hover:text-white"
              href="/admin"
              onClick={() => setIsMenuOpen(false)}
              role="menuitem"
            >
              <ShieldCheck className="size-4" aria-hidden="true" />
              Admin Dashboard
            </Link>
          ) : null}

          <Button
            className="h-9 w-full justify-start border-0 bg-transparent px-3 text-zinc-300 hover:bg-white/5 hover:text-white"
            onClick={handleSignOut}
            role="menuitem"
            type="button"
            variant="ghost"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </Button>
        </div>
      ) : null}
    </div>
  );
}
