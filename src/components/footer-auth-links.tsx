"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/src/lib/supabase";

type FooterAuthLink = {
  href: string;
  label: string;
};

export function FooterAuthLinks() {
  const [authLink, setAuthLink] = useState<FooterAuthLink | null>({
    href: "/login",
    label: "Login",
  });

  useEffect(() => {
    let isMounted = true;

    function getAuthLink(isSignedIn: boolean) {
      return isSignedIn
        ? { href: "/admin", label: "Admin" }
        : { href: "/login", label: "Login" };
    }

    async function loadAuthLink() {
      if (!supabase) {
        return;
      }

      const { data } = await supabase.auth.getUser();

      if (isMounted) {
        setAuthLink(getAuthLink(Boolean(data.user)));
      }
    }

    loadAuthLink();

    const { data: listener } =
      supabase?.auth.onAuthStateChange((_event, session) => {
        setAuthLink(getAuthLink(Boolean(session?.user)));
      }) ?? { data: null };

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return authLink ? (
    <Link
      className="text-sm text-zinc-400 transition hover:text-violet-200"
      href={authLink.href}
    >
      {authLink.label}
    </Link>
  ) : null;
}
