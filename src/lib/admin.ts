import type { User } from "@supabase/supabase-js";

import { supabase } from "./supabase";

const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

type ProfileRole = "user" | "admin";
type ProfileRoleRow = {
  role: ProfileRole | null;
};

function isFallbackAdminUser(user: User | null) {
  if (!user) {
    return false;
  }

  const email = user.email?.toLowerCase();

  return email ? adminEmails.includes(email) : false;
}

export async function isAdminUser(user: User | null) {
  if (!user) {
    return false;
  }

  if (!supabase) {
    return isFallbackAdminUser(user);
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<ProfileRoleRow>();

  if (data?.role) {
    return data.role === "admin";
  }

  return Boolean(error) || !data ? isFallbackAdminUser(user) : false;
}

export function hasAdminAccessConfigured() {
  return adminEmails.length > 0;
}
