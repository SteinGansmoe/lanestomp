"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, UserCircle } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  checkUsernameAvailability,
  fetchUserProfile,
  normalizeUsername,
  type UserProfile,
  validateUsername,
} from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";

export function AccountSettingsForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

      const { data, error: profileError } = await fetchUserProfile(
        authData.user.id
      );

      if (!isMounted) {
        return;
      }

      if (profileError || !data) {
        setError(profileError ?? "Could not load your account profile.");
        setIsLoading(false);
        return;
      }

      setProfile(data);
      setUsername(data.username ?? "");
      setIsLoading(false);
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

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
      const availability = await checkUsernameAvailability(
        nextUsername,
        profile.id
      );

      if (availability.error) {
        setError(availability.error);
        setIsSaving(false);
        return;
      }

      if (!availability.isAvailable) {
        setError("That username is already taken.");
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
          ? "That username is already taken."
          : updateError.message
      );
      setIsSaving(false);
      return;
    }

    const { data, error: profileError } = await fetchUserProfile(profile.id);

    setIsSaving(false);

    if (profileError || !data) {
      setError(
        profileError ?? "Username saved, but the profile could not refresh."
      );
      return;
    }

    setProfile(data);
    setUsername(data.username ?? nextUsername);
    setSuccess("Username updated.");
    window.dispatchEvent(new Event("lanetips-profile-updated"));
    router.refresh();
  }

  if (isLoading) {
    return (
      <Card className="mx-auto w-full max-w-2xl border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/25">
        <CardContent className="p-6">
          <p className="text-sm text-zinc-400">Loading account settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-2xl border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/25">
      <CardHeader>
        <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/20">
          <UserCircle className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="font-mono text-2xl">Account settings</CardTitle>
        <p className="text-sm leading-6 text-zinc-400">
          Manage your LaneTips.app identity. Your username is separate from any
          Riot account details.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Username</span>
            <Input
              autoComplete="username"
              className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
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

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Email</span>
            <Input
              className="h-11 border-white/10 bg-white/[0.03] text-zinc-400"
              disabled
              readOnly
              type="email"
              value={profile?.email ?? ""}
            />
          </label>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h2 className="font-mono text-sm font-semibold uppercase text-violet-200">
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
            className="h-11 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
            disabled={isSaving}
            type="submit"
          >
            <Save className="size-4" aria-hidden="true" />
            {isSaving ? "Saving..." : "Save username"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
