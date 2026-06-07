import type { User } from "@supabase/supabase-js";

import { supabase } from "./supabase";

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 24;

const usernamePattern = /^[A-Za-z0-9_]+$/;

export type UserProfile = {
  id: string;
  email: string | null;
  username: string | null;
  role?: "user" | "admin" | null;
  created_at: string;
  updated_at: string | null;
};

export function normalizeUsername(value: string) {
  return value.trim();
}

export function validateUsername(value: string) {
  const username = normalizeUsername(value);

  if (!username) {
    return "Username is required.";
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return `Username must be at least ${USERNAME_MIN_LENGTH} characters.`;
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return `Username must be ${USERNAME_MAX_LENGTH} characters or fewer.`;
  }

  if (!usernamePattern.test(username)) {
    return "Username can only use letters, numbers, and underscores.";
  }

  return null;
}

export function getProfileDisplayName(
  user: Pick<User, "email"> | null,
  profile?: Pick<UserProfile, "username"> | null,
) {
  return profile?.username?.trim() || user?.email || "Signed in";
}

export async function fetchUserProfile(userId: string) {
  if (!supabase) {
    return { data: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, username, role, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle<UserProfile>();

  return {
    data: data ?? null,
    error: error?.message ?? null,
  };
}

export async function checkUsernameAvailability(username: string, currentUserId?: string) {
  if (!supabase) {
    return { isAvailable: false, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase.rpc("is_username_available", {
    candidate_username: username,
    current_user_id: currentUserId ?? null,
  });

  return {
    isAvailable: Boolean(data),
    error: error?.message ?? null,
  };
}
