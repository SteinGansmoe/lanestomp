"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Home, ShieldCheck } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { fetchUserProfile } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";

type ConfirmationAuthState = "authenticated" | "loading" | "signed-out";

export function AuthConfirmedPanel() {
  const [authState, setAuthState] = useState<ConfirmationAuthState>("loading");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAuthState() {
      if (!supabase) {
        setAuthState("signed-out");
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      const user = data.user;

      if (!isMounted) {
        return;
      }

      if (error || !user) {
        setAuthState("signed-out");
        return;
      }

      setAuthState("authenticated");

      const profileResult = await fetchUserProfile(user.id);

      if (!isMounted) {
        return;
      }

      setUsername(profileResult.data?.username?.trim() || null);
    }

    loadAuthState();

    return () => {
      isMounted = false;
    };
  }, []);

  const isSignedOut = authState === "signed-out";
  const primaryHref = isSignedOut ? "/login" : "/league/matchups";
  const primaryLabel = isSignedOut ? "Sign in" : "Start Exploring Matchups";

  return (
    <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-7">
      <div className="flex items-start gap-3 rounded-lg border border-emerald-300/15 bg-emerald-400/10 p-4 text-emerald-50">
        <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="font-mono text-base font-semibold">Verification complete</h2>
          <p className="mt-1 text-sm leading-6 text-emerald-50/75">
            Your account has been successfully verified and is ready to use.
          </p>
        </div>
      </div>

      {username ? (
        <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
          Welcome to LaneStomp, <span className="font-medium text-white">{username}</span>.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11 bg-cyan-300 px-5 text-[#05111d] hover:bg-cyan-200">
          <Link href={primaryHref}>
            {primaryLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
        <Button
          asChild
          className="h-11 border-white/10 bg-white/5 px-5 text-zinc-100 hover:bg-white/10"
          variant="ghost"
        >
          <Link href="/">
            <Home className="size-4" aria-hidden="true" />
            Go to homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
