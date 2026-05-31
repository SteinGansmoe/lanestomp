"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { isAdminUser } from "@/src/lib/admin";
import { supabase } from "@/src/lib/supabase";

type FooterAuthLink = {
  href: string;
  label: string;
};

export function FooterAuthLinks() {
  const [authLinks, setAuthLinks] = useState<FooterAuthLink[]>([
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ]);

  useEffect(() => {
    let isMounted = true;

    async function getAuthLinks(user: User | null) {
      if (!user) {
        return [
          { href: "/login", label: "Login" },
          { href: "/register", label: "Register" },
        ];
      }

      return (await isAdminUser(user))
        ? [
            { href: "/admin", label: "Admin" },
            { href: "/account/settings", label: "Account" },
          ]
        : [{ href: "/account/settings", label: "Account" }];
    }

    async function loadAuthLink() {
      if (!supabase) {
        return;
      }

      const { data } = await supabase.auth.getUser();

      if (isMounted) {
        setAuthLinks(await getAuthLinks(data.user));
      }
    }

    loadAuthLink();

    const { data: listener } =
      supabase?.auth.onAuthStateChange((_event, session) => {
        void getAuthLinks(session?.user ?? null).then((nextAuthLinks) => {
          if (isMounted) {
            setAuthLinks(nextAuthLinks);
          }
        });
      }) ?? { data: null };

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return authLinks.map((authLink) => (
    <Link
      className="text-sm text-zinc-400 transition hover:text-violet-200"
      href={authLink.href}
      key={authLink.href}
    >
      {authLink.label}
    </Link>
  ));
}
