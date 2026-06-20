"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { checkUsernameAvailability, normalizeUsername, validateUsername } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const nextUsername = normalizeUsername(username);
    const usernameError = validateUsername(nextUsername);

    if (usernameError) {
      setError(usernameError);
      setIsSubmitting(false);
      return;
    }

    const availability = await checkUsernameAvailability(nextUsername);

    if (availability.error) {
      setError(availability.error);
      setIsSubmitting(false);
      return;
    }

    if (!availability.isAvailable) {
      setError("That username is already taken.");
      setIsSubmitting(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: nextUsername,
        },
        emailRedirectTo: getAuthConfirmedRedirectUrl(),
      },
    });

    setIsSubmitting(false);

    if (signUpError) {
      setError(
        signUpError.message.includes("profiles_username_lower_unique")
          ? "That username is already taken."
          : signUpError.message,
      );
      return;
    }

    setPassword("");
    setUsername("");
    setSuccess(
      data.session
        ? "Account created. You are signed in with a standard user account."
        : "Account created. Check your email to confirm your account before signing in.",
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md border-cyan-100/15 bg-[#06111f]/92 text-white">
      <CardHeader>
        <div className="mb-3 flex size-12 items-center justify-center rounded border border-[#C9AA5A]/25 bg-[#C9AA5A]/10 text-[#F4D88A]">
          <UserPlus className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="font-mono text-2xl">Create account</CardTitle>
        <p className="text-sm leading-6 text-zinc-400">
          Register a LaneStomp account for future League tools and saved preferences.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Username</span>
            <Input
              autoComplete="username"
              className="h-11"
              disabled={isSubmitting}
              maxLength={24}
              minLength={3}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="SummonerPrep"
              required
              type="text"
              value={username}
            />
            <span className="block text-xs text-zinc-500">
              Letters, numbers, and underscores only.
            </span>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Email</span>
            <Input
              autoComplete="email"
              className="h-11"
              disabled={isSubmitting}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Password</span>
            <Input
              autoComplete="new-password"
              className="h-11"
              disabled={isSubmitting}
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <p
              className="rounded border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          {success ? (
            <p
              className="rounded border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-100"
              aria-live="polite"
            >
              {success}
            </p>
          ) : null}

          <Button
            className="h-11 w-full bg-cyan-300 text-[#05111d] hover:bg-cyan-200"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link className="font-medium text-cyan-200 transition hover:text-white" href="/login">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function getAuthConfirmedRedirectUrl() {
  return new URL("/auth/confirmed", window.location.origin).toString();
}
