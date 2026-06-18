"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, Save, UserCircle, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  checkUsernameAvailability,
  fetchUserProfile,
  normalizeUsername,
  type UserProfile,
  validateUsername,
} from "@/src/lib/profile";
import { validatePasswordConfirmation } from "@/src/lib/password";
import { supabase } from "@/src/lib/supabase";

const pendingEmailStorageKey = "lanestomp.account.pendingEmailChange";
const pendingEmailNoticeDismissedStorageKey = "lanestomp.account.pendingEmailNoticeDismissed";
const emailResendCooldownSeconds = 60;

function AccountSettingsFormSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-4xl rounded-lg border-white/10 bg-[#10182b]/90 p-6 text-white shadow-xl shadow-black/25">
      <div className="size-12 rounded-lg bg-cyan-400/10 ring-1 ring-cyan-300/20" />
      <div className="mt-5 h-8 w-56 rounded bg-white/10" />
      <div className="mt-3 h-4 w-full max-w-lg rounded bg-white/5" />

      <div className="mt-8 space-y-5">
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-white/10" />
          <div className="h-11 rounded-lg border border-white/10 bg-white/[0.04]" />
          <div className="h-3 w-52 rounded bg-white/5" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-14 rounded bg-white/10" />
          <div className="h-11 rounded-lg border border-white/10 bg-white/[0.03]" />
        </div>
        <div className="h-28 rounded-lg border border-white/10 bg-white/[0.03]" />
        <div className="h-11 w-40 rounded-lg bg-cyan-400/15" />
      </div>
    </Card>
  );
}

export function AccountSettingsForm() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailSaving, setIsEmailSaving] = useState(false);
  const [isPendingEmailNoticeDismissed, setIsPendingEmailNoticeDismissed] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [emailResendCooldown, setEmailResendCooldown] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!supabase) {
        setError("Supabase is not configured.");
        setIsLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (authError || !authData.user) {
        router.replace("/login");
        return;
      }

      const authEmail = authData.user.email ?? "";
      const nextPendingEmail = authData.user.new_email?.trim() || null;
      const { data, error: profileError } = await fetchUserProfile(authData.user.id);

      if (!isMounted) {
        return;
      }

      if (profileError || !data) {
        setError(profileError ?? "Could not load your account profile.");
        setIsLoading(false);
        return;
      }

      setProfile(data);
      const nextCurrentEmail = authEmail || data.email || "";
      const wasEmailChangeCompleted = reconcileStoredPendingEmail(
        nextCurrentEmail,
        nextPendingEmail,
      );

      setCurrentEmail(nextCurrentEmail);
      setNewEmail(nextPendingEmail ?? "");
      setPendingEmail(nextPendingEmail);
      setIsPendingEmailNoticeDismissed(getStoredPendingEmailNoticeDismissed(nextPendingEmail));
      setUsername(data.username ?? "");
      setEmailSuccess(wasEmailChangeCompleted ? "Email updated successfully." : null);

      if (wasEmailChangeCompleted) {
        window.dispatchEvent(new Event("lanestomp-profile-updated"));
        router.refresh();
      }

      setIsLoading(false);
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (emailResendCooldown <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setEmailResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [emailResendCooldown]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !profile) {
      setError("Account profile is not ready yet.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    const nextUsername = normalizeUsername(username);
    const usernameError = validateUsername(nextUsername);

    if (usernameError) {
      setError(usernameError);
      setIsSaving(false);
      return;
    }

    if (nextUsername.toLowerCase() !== profile.username?.toLowerCase()) {
      const availability = await checkUsernameAvailability(nextUsername, profile.id);

      if (availability.error) {
        setError(availability.error);
        setIsSaving(false);
        return;
      }

      if (!availability.isAvailable) {
        setError("This username is already taken.");
        setIsSaving(false);
        return;
      }
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ username: nextUsername })
      .eq("id", profile.id);

    if (updateError) {
      setError(
        updateError.message.includes("profiles_username_lower_unique")
          ? "This username is already taken."
          : updateError.message,
      );
      setIsSaving(false);
      return;
    }

    const { data, error: profileError } = await fetchUserProfile(profile.id);

    setIsSaving(false);

    if (profileError || !data) {
      setError(profileError ?? "Username saved, but the profile could not refresh.");
      return;
    }

    setProfile(data);
    setUsername(data.username ?? nextUsername);
    setSuccess("Username updated successfully.");
    window.dispatchEvent(new Event("lanestomp-profile-updated"));
    router.refresh();
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !profile) {
      setEmailError("Account profile is not ready yet.");
      return;
    }

    const nextEmail = newEmail.trim();
    const emailValidationError = validateEmail(nextEmail);

    setEmailError(null);
    setEmailSuccess(null);

    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (nextEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setEmailError("Enter a different email address.");
      return;
    }

    setIsEmailSaving(true);

    const { data, error: updateError } = await supabase.auth.updateUser(
      { email: nextEmail },
      { emailRedirectTo: getAccountSettingsRedirectUrl() },
    );

    setIsEmailSaving(false);

    if (updateError) {
      setEmailError(getEmailChangeErrorMessage(updateError.message));
      return;
    }

    const nextPendingEmail = data.user?.new_email?.trim() || nextEmail;

    window.localStorage.setItem(pendingEmailStorageKey, nextPendingEmail);
    window.localStorage.removeItem(getPendingEmailDismissalKey(nextPendingEmail));
    setCurrentEmail(data.user?.email ?? currentEmail);
    setNewEmail("");
    setPendingEmail(nextPendingEmail);
    setIsPendingEmailNoticeDismissed(false);
    setEmailResendCooldown(emailResendCooldownSeconds);
    setEmailSuccess("Verification email sent.");
  }

  async function resendEmailVerification() {
    if (!pendingEmail || emailResendCooldown > 0) {
      return;
    }

    setEmailError(null);
    setEmailSuccess(null);
    setIsEmailSaving(true);

    const { data, error: updateError } = await supabase!.auth.updateUser(
      { email: pendingEmail },
      { emailRedirectTo: getAccountSettingsRedirectUrl() },
    );

    setIsEmailSaving(false);

    if (updateError) {
      setEmailError(getEmailChangeErrorMessage(updateError.message));
      return;
    }

    const nextPendingEmail = data.user?.new_email?.trim() || pendingEmail;

    window.localStorage.setItem(pendingEmailStorageKey, nextPendingEmail);
    window.localStorage.removeItem(getPendingEmailDismissalKey(nextPendingEmail));
    setCurrentEmail(data.user?.email ?? currentEmail);
    setNewEmail("");
    setPendingEmail(nextPendingEmail);
    setIsPendingEmailNoticeDismissed(false);
    setEmailResendCooldown(emailResendCooldownSeconds);
    setEmailSuccess("Verification email sent.");
  }

  function dismissPendingEmailNotice() {
    if (!pendingEmail) {
      return;
    }

    window.localStorage.setItem(getPendingEmailDismissalKey(pendingEmail), "true");
    setIsPendingEmailNoticeDismissed(true);
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !currentEmail) {
      setPasswordError("Account email is not ready yet.");
      return;
    }

    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }

    const validationError = validatePasswordConfirmation(newPassword, confirmPassword);

    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    setIsPasswordSaving(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password: currentPassword,
    });

    if (signInError) {
      setPasswordError("Current password is incorrect.");
      setIsPasswordSaving(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    setIsPasswordSaving(false);

    if (updateError) {
      setPasswordError(updateError.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSuccess("Password changed successfully.");
  }

  if (isLoading) {
    return <AccountSettingsFormSkeleton />;
  }

  return (
    <Card className="mx-auto w-full max-w-4xl rounded-lg border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/25 ring-1 ring-white/5">
      <CardHeader>
        <div className="mb-3 flex size-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/15">
          <UserCircle className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="font-mono text-2xl">Account settings</CardTitle>
        <p className="text-sm leading-6 text-zinc-400">
          Manage your LaneStomp identity. Your username is separate from any Riot account details.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Username</span>
            <Input
              autoComplete="username"
              className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/70 focus-visible:ring-cyan-300/20"
              disabled={isSaving}
              maxLength={24}
              minLength={3}
              onChange={(event) => setUsername(event.target.value)}
              required
              type="text"
              value={username}
            />
            <span className="block text-xs text-zinc-500">
              Letters, numbers, and underscores only.
            </span>
          </label>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h2 className="font-mono text-sm font-semibold uppercase text-cyan-200">
              Riot account
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Riot Game Name, tag, and region will be managed separately later.
            </p>
          </div>

          {error ? (
            <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="rounded-md border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
              {success}
            </p>
          ) : null}

          <Button
            className="h-11 bg-cyan-300 px-4 text-[#05111d] hover:bg-cyan-200"
            disabled={isSaving}
            type="submit"
          >
            <Save className="size-4" aria-hidden="true" />
            {isSaving ? "Saving..." : "Save username"}
          </Button>
        </form>

        <form className="mt-8 space-y-5 border-t border-white/10 pt-6" onSubmit={handleEmailSubmit}>
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/20">
              <Mail className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-semibold uppercase text-cyan-200">
                Change Email
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Enter a new email address. Supabase will update it only after verification.
              </p>
            </div>
          </div>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Current email</span>
            <Input
              className="h-11 border-white/10 bg-white/[0.03] text-zinc-400"
              disabled
              readOnly
              type="text"
              value={maskEmail(currentEmail)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">New email</span>
            <Input
              autoComplete="email"
              className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/70 focus-visible:ring-cyan-300/20"
              disabled={isEmailSaving}
              onChange={(event) => setNewEmail(event.target.value)}
              placeholder="new@email.com"
              required
              type="email"
              value={newEmail}
            />
          </label>

          {pendingEmail && !isPendingEmailNoticeDismissed ? (
            <div
              className="rounded-lg border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-100"
              role="status"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-200">
                    Verification pending
                  </p>
                  <p className="mt-2">
                    Pending email change to{" "}
                    <span className="font-medium text-white">{maskEmail(pendingEmail)}</span>.
                  </p>
                  <p className="mt-1 text-cyan-100/80">
                    Your current email stays active until the verification link is confirmed.
                    Depending on account security settings, confirmation may require the new inbox
                    and the current inbox.
                  </p>
                </div>
                <button
                  aria-label="Dismiss pending email verification notice"
                  className="flex size-8 shrink-0 items-center justify-center rounded-md border border-cyan-300/15 bg-cyan-400/10 text-cyan-100 transition hover:bg-cyan-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45"
                  onClick={dismissPendingEmailNotice}
                  type="button"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
              <Button
                className="mt-3 h-9 border-cyan-300/20 bg-cyan-400/10 px-3 text-cyan-100 hover:bg-cyan-400/15"
                disabled={isEmailSaving || emailResendCooldown > 0}
                onClick={resendEmailVerification}
                type="button"
                variant="ghost"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                {isEmailSaving
                  ? "Sending..."
                  : emailResendCooldown > 0
                    ? `Resend in ${emailResendCooldown}s`
                    : "Resend verification"}
              </Button>
            </div>
          ) : null}

          {pendingEmail && isPendingEmailNoticeDismissed ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-300">
              <span>Verification pending for {maskEmail(pendingEmail)}.</span>
              <button
                className="text-sm font-medium text-cyan-200 transition hover:text-white"
                onClick={() => {
                  window.localStorage.removeItem(getPendingEmailDismissalKey(pendingEmail));
                  setIsPendingEmailNoticeDismissed(false);
                }}
                type="button"
              >
                Show details
              </button>
            </div>
          ) : null}

          {emailError ? (
            <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
              {emailError}
            </p>
          ) : null}

          {emailSuccess ? (
            <p className="rounded-md border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
              {emailSuccess}
            </p>
          ) : null}

          <Button
            className="h-11 bg-cyan-400/80 px-4 text-[#05111d] hover:bg-cyan-300"
            disabled={isEmailSaving}
            type="submit"
          >
            <Mail className="size-4" aria-hidden="true" />
            {isEmailSaving ? "Sending..." : "Change email"}
          </Button>
        </form>

        <form
          className="mt-8 space-y-5 border-t border-white/10 pt-6"
          onSubmit={handlePasswordSubmit}
        >
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/15">
              <KeyRound className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-semibold uppercase text-cyan-200">
                Change Password
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Update the password used to sign in to your LaneStomp account.
              </p>
            </div>
          </div>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Current password</span>
            <Input
              autoComplete="current-password"
              className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/70 focus-visible:ring-cyan-300/20"
              disabled={isPasswordSaving}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              type="password"
              value={currentPassword}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">New password</span>
            <Input
              autoComplete="new-password"
              className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/70 focus-visible:ring-cyan-300/20"
              disabled={isPasswordSaving}
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
              disabled={isPasswordSaving}
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

          {passwordError ? (
            <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
              {passwordError}
            </p>
          ) : null}

          {passwordSuccess ? (
            <p className="rounded-md border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
              {passwordSuccess}
            </p>
          ) : null}

          <Button
            className="h-11 bg-cyan-300 px-4 text-[#05111d] hover:bg-cyan-200"
            disabled={isPasswordSaving}
            type="submit"
          >
            <KeyRound className="size-4" aria-hidden="true" />
            {isPasswordSaving ? "Changing password..." : "Change password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function getAccountSettingsRedirectUrl() {
  return new URL("/account/settings", window.location.origin).toString();
}

function validateEmail(value: string) {
  const email = value.trim();

  if (!email) {
    return "Invalid email address.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email address.";
  }

  return null;
}

function getEmailChangeErrorMessage(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("already") || lowerMessage.includes("registered")) {
    return "Email already in use.";
  }

  if (lowerMessage.includes("invalid")) {
    return "Invalid email address.";
  }

  if (lowerMessage.includes("rate limit") || lowerMessage.includes("too many")) {
    return "Please wait before requesting another verification email.";
  }

  return message;
}

function reconcileStoredPendingEmail(currentEmail: string, pendingEmail: string | null) {
  if (typeof window === "undefined") {
    return false;
  }

  const storedPendingEmail = window.localStorage.getItem(pendingEmailStorageKey);

  if (!storedPendingEmail) {
    return false;
  }

  const normalizedStoredEmail = storedPendingEmail.trim().toLowerCase();
  const normalizedCurrentEmail = currentEmail.trim().toLowerCase();

  if (!pendingEmail && normalizedStoredEmail === normalizedCurrentEmail) {
    window.localStorage.removeItem(pendingEmailStorageKey);
    window.localStorage.removeItem(getPendingEmailDismissalKey(storedPendingEmail));
    return true;
  }

  if (!pendingEmail && normalizedStoredEmail !== normalizedCurrentEmail) {
    window.localStorage.removeItem(pendingEmailStorageKey);
    window.localStorage.removeItem(getPendingEmailDismissalKey(storedPendingEmail));
  }

  return false;
}

function getPendingEmailDismissalKey(email: string) {
  return `${pendingEmailNoticeDismissedStorageKey}:${email.trim().toLowerCase()}`;
}

function getStoredPendingEmailNoticeDismissed(pendingEmail: string | null) {
  if (typeof window === "undefined" || !pendingEmail) {
    return false;
  }

  return window.localStorage.getItem(getPendingEmailDismissalKey(pendingEmail)) === "true";
}

function maskEmail(email: string) {
  const [localPart = "", domain = ""] = email.split("@");

  if (!localPart || !domain) {
    return email ? "Email hidden" : "";
  }

  const visibleStart = localPart.slice(0, 1);
  const visibleEnd = localPart.length > 2 ? localPart.slice(-1) : "";

  return `${visibleStart}${"*".repeat(Math.max(2, localPart.length - 2))}${visibleEnd}@${domain}`;
}
