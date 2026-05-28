"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { isAdminUser } from "@/src/lib/admin";
import { supabase } from "@/src/lib/supabase";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      if (!supabase) {
        setError("Supabase is not configured.");
        setIsCheckingSession(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      const user = data.session?.user ?? null;

      if (!isMounted) {
        return;
      }

      if (user) {
        router.replace((await isAdminUser(user)) ? "/admin" : "/");
        return;
      }

      setIsCheckingSession(false);
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace(data.user && (await isAdminUser(data.user)) ? "/admin" : "/");
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-md border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/25">
      <CardHeader>
        <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/20">
          <LockKeyhole className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="font-mono text-2xl">Login</CardTitle>
        <p className="text-sm leading-6 text-zinc-400">
          Sign in with your LaneTips.app account.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Email</span>
            <Input
              autoComplete="email"
              className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
              disabled={isCheckingSession || isSubmitting}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Password</span>
            <Input
              autoComplete="current-password"
              className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
              disabled={isCheckingSession || isSubmitting}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
              {error}
            </p>
          ) : null}

          <Button
            className="h-11 w-full bg-violet-500/80 text-white hover:bg-violet-500"
            disabled={isCheckingSession || isSubmitting}
            type="submit"
          >
            {isCheckingSession
              ? "Checking session..."
              : isSubmitting
                ? "Signing in..."
                : "Sign in"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-400">
          New to LaneTips.app?{" "}
          <Link
            className="font-medium text-violet-200 transition hover:text-white"
            href="/register"
          >
            Create account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
