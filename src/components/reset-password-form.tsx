"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { validatePasswordConfirmation } from "@/src/lib/password";
import { supabase } from "@/src/lib/supabase";

type ResetSessionState = "checking" | "ready" | "invalid" | "updated";

export function ResetPasswordForm() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [sessionState, setSessionState] = useState<ResetSessionState>("checking");

  useEffect(() => {
    let isMounted = true;

    async function detectRecoverySession() {
      if (!supabase) {
        setError("Supabase is not configured.");
        setSessionState("invalid");
        return;
      }

      const url = new URL(window.location.href);
      const hasRecoverySignal =
        url.searchParams.has("code") ||
        url.searchParams.get("type") === "recovery" ||
        url.hash.includes("type=recovery") ||
        url.hash.includes("access_token=");
      const authError =
        url.searchParams.get("error_description") ||
        url.hash.match(/error_description=([^&]+)/)?.[1];

      if (authError) {
        setError("This password reset link is invalid or has expired.");
        setSessionState("invalid");
        return;
      }

      let recoveryDetected = false;
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted || event !== "PASSWORD_RECOVERY" || !session) {
          return;
        }

        recoveryDetected = true;
        setError(null);
        setSessionState("ready");
      });

      await new Promise((resolve) => window.setTimeout(resolve, 750));

      const { data } = await supabase.auth.getSession();

      if (!isMounted) {
        authListener.subscription.unsubscribe();
        return;
      }

      if (recoveryDetected) {
        authListener.subscription.unsubscribe();
        return;
      }

      if (hasRecoverySignal && data.session) {
        setSessionState("ready");
        authListener.subscription.unsubscribe();
        return;
      }

      setError("This password reset link is invalid or has expired.");
      setSessionState("invalid");
      authListener.subscription.unsubscribe();
    }

    void detectRecoverySession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    const validationError = validatePasswordConfirmation(newPassword, confirmPassword);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setSessionState("updated");
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-lg border-white/10 bg-[#10182b]/92 text-white shadow-2xl shadow-black/30 ring-1 ring-white/5">
      <CardHeader>
        <div className="mb-3 flex size-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/15">
          <KeyRound className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="font-mono text-2xl">Reset your password</CardTitle>
        <p className="text-sm leading-6 text-zinc-400">
          Enter a new password for your LaneStomp account.
        </p>
      </CardHeader>
      <CardContent>
        {sessionState === "checking" ? (
          <p className="rounded-md border border-white/10 bg-white/5 p-3 text-sm text-zinc-300">
            Checking reset link...
          </p>
        ) : null}

        {sessionState === "invalid" ? (
          <div className="space-y-5">
            <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm leading-6 text-rose-100">
              {error}
            </p>
            <Button asChild className="h-11 w-full bg-cyan-300 text-[#05111d] hover:bg-cyan-200">
              <Link href="/auth/forgot-password">Request a new reset link</Link>
            </Button>
          </div>
        ) : null}

        {sessionState === "updated" ? (
          <div className="space-y-5">
            <div className="rounded-md border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-100">
              <p>Your password has been updated.</p>
            </div>
            <Button asChild className="h-11 w-full bg-cyan-300 text-[#05111d] hover:bg-cyan-200">
              <Link href="/league/matchups">
                Continue to LaneStomp
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : null}

        {sessionState === "ready" ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">New password</span>
              <Input
                autoComplete="new-password"
                className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/70 focus-visible:ring-cyan-300/20"
                disabled={isSubmitting}
                minLength={8}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                type="password"
                value={newPassword}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Confirm password</span>
              <Input
                autoComplete="new-password"
                className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/70 focus-visible:ring-cyan-300/20"
                disabled={isSubmitting}
                minLength={8}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                type="password"
                value={confirmPassword}
              />
              <span className="block text-xs text-zinc-500">
                Password must be at least 8 characters.
              </span>
            </label>

            {error ? (
              <p
                className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <Button
              className="h-11 w-full bg-cyan-300 text-[#05111d] hover:bg-cyan-200"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Updating password..." : "Update password"}
            </Button>
          </form>
        ) : null}
      </CardContent>
    </Card>
  );
}
