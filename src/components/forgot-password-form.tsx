"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { supabase } from "@/src/lib/supabase";

const resetEmailSuccessMessage =
  "If an account exists for this email, a password reset link has been sent.";

function getResetPasswordRedirectUrl() {
  return new URL("/auth/reset-password", window.location.origin).toString();
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getResetPasswordRedirectUrl(),
    });

    setIsSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-lg border-white/10 bg-[#10182b]/92 text-white shadow-2xl shadow-black/30 ring-1 ring-white/5">
      <CardHeader>
        <div className="mb-3 flex size-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/15">
          <MailCheck className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="font-mono text-2xl">Reset password</CardTitle>
        <p className="text-sm leading-6 text-zinc-400">
          Enter your account email and we will send a password reset link.
        </p>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-5">
            <p className="rounded-md border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-100">
              {resetEmailSuccessMessage}
            </p>
            <Button
              asChild
              className="h-11 w-full border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              variant="ghost"
            >
              <Link href="/login">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to sign in
              </Link>
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Email</span>
              <Input
                autoComplete="email"
                className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/70 focus-visible:ring-cyan-300/20"
                disabled={isSubmitting}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
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
              {isSubmitting ? "Sending reset link..." : "Send reset link"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
