import type { User } from "@supabase/supabase-js";

const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminUser(user: User | null) {
  if (!user) {
    return false;
  }

  const role = user.app_metadata?.role;
  const email = user.email?.toLowerCase();

  return role === "admin" || (email ? adminEmails.includes(email) : false);
}

export function hasAdminAccessConfigured() {
  return adminEmails.length > 0;
}
