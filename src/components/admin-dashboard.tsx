"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Database, LockKeyhole, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { hasAdminAccessConfigured, isAdminUser } from "@/src/lib/admin";
import { supabase } from "@/src/lib/supabase";

type AdminGame = {
  created_at: string;
  id: string;
  name: string;
  slug: string;
};

type AdminSeason = {
  ends_at: string;
  game_id: string;
  id: string;
  name: string;
  slug: string;
  starts_at: string;
};

type AdminData = {
  games: AdminGame[];
  seasons: AdminSeason[];
};

type SessionResult = Awaited<ReturnType<NonNullable<typeof supabase>["auth"]["getSession"]>>;

const sessionCheckTimeoutMs = 2_000;

export function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminData>({
    games: [],
    seasons: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    let redirectTimeoutId: number | undefined;

    async function loadAdminData() {
      redirectTimeoutId = window.setTimeout(() => {
        window.location.replace("/login");
      }, sessionCheckTimeoutMs + 1_000);

      if (!supabase) {
        window.clearTimeout(redirectTimeoutId);
        setError("Supabase is not configured.");
        setIsLoading(false);
        return;
      }

      const { data: sessionData, error: sessionError } =
        await getSessionWithTimeout();
      const sessionUser = sessionData.session?.user ?? null;

      if (!isMounted) {
        window.clearTimeout(redirectTimeoutId);
        return;
      }

      if (sessionError || !sessionUser) {
        window.location.replace("/login");
        return;
      }

      window.clearTimeout(redirectTimeoutId);

      if (!isAdminUser(sessionUser)) {
        setUser(sessionUser);
        setError("This account does not have admin access.");
        setIsLoading(false);
        return;
      }

      setUser(sessionUser);

      const [gamesResult, seasonsResult] = await Promise.all([
        supabase
          .from("games")
          .select("id, name, slug, created_at")
          .order("name", { ascending: true }),
        supabase
          .from("seasons")
          .select("id, game_id, name, slug, starts_at, ends_at")
          .order("starts_at", { ascending: true }),
      ]);

      if (!isMounted) {
        return;
      }

      if (gamesResult.error || seasonsResult.error) {
        setError(
          gamesResult.error?.message ??
            seasonsResult.error?.message ??
            "Could not load admin data."
        );
        setIsLoading(false);
        return;
      }

      setAdminData({
        games: (gamesResult.data ?? []) as AdminGame[],
        seasons: (seasonsResult.data ?? []) as AdminSeason[],
      });
      setIsLoading(false);
    }

    loadAdminData();

    return () => {
      isMounted = false;
      window.clearTimeout(redirectTimeoutId);
    };
  }, [router]);

  const gameNamesById = useMemo(
    () =>
      new Map(adminData.games.map((game) => [game.id, game.name] as const)),
    [adminData.games]
  );

  async function handleSignOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200"
            href="/"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to dashboard
          </Link>

          <Button
            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            onClick={handleSignOut}
            type="button"
            variant="ghost"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/20">
              <LockKeyhole className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                Admin dashboard
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                {user?.email ?? "Checking admin session..."}
              </p>
            </div>
          </div>
        </div>

        {!hasAdminAccessConfigured() ? (
          <Card className="border-amber-400/20 bg-amber-500/10 p-5 text-amber-100">
            Set NEXT_PUBLIC_ADMIN_EMAILS in your environment to enable the
            email allowlist. Supabase users with app_metadata.role = admin are
            also accepted.
          </Card>
        ) : null}

        {isLoading ? (
          <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            Loading admin data from Supabase...
          </Card>
        ) : null}

        {error && !isLoading ? (
          <Card className="border-rose-400/20 bg-[#10182b]/90 p-8 text-rose-100">
            {error}
          </Card>
        ) : null}

        {!isLoading && !error ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminStatCard
                label="Games"
                value={adminData.games.length}
              />
              <AdminStatCard
                label="Seasons"
                value={adminData.seasons.length}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <AdminListCard title="Games">
                {adminData.games.map((game) => (
                  <li
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                    key={game.id}
                  >
                    <p className="font-semibold text-white">{game.name}</p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">
                      {game.slug}
                    </p>
                  </li>
                ))}
              </AdminListCard>

              <AdminListCard title="Seasons">
                {adminData.seasons.map((season) => (
                  <li
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                    key={season.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">
                          {season.name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {gameNamesById.get(season.game_id) ??
                            season.game_id}
                        </p>
                      </div>
                      <p className="font-mono text-xs text-zinc-500">
                        {formatDate(season.starts_at)} -{" "}
                        {formatDate(season.ends_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </AdminListCard>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}

function getSessionWithTimeout(): Promise<SessionResult> {
  if (!supabase) {
    return Promise.resolve({
      data: { session: null },
      error: null,
    });
  }

  return Promise.race([
    supabase.auth.getSession(),
    new Promise<SessionResult>((resolve) => {
      window.setTimeout(() => {
        resolve({
          data: { session: null },
          error: null,
        });
      }, sessionCheckTimeoutMs);
    }),
  ]);
}

function AdminStatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 p-5 text-white shadow-xl shadow-black/15">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-lg bg-sky-500/15 text-sky-200 ring-1 ring-sky-300/20">
          <Database className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-mono text-3xl font-semibold">{value}</p>
          <p className="text-sm text-zinc-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function AdminListCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <CardTitle className="font-mono text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">{children}</ul>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string) {
  return value.slice(0, 10);
}
