import type { Metadata } from "next";

import { AdminLoginForm } from "@/src/components/admin-login-form";
import { AuthPageShell } from "@/src/components/auth-page-shell";

export const metadata: Metadata = {
  description: "Sign in to your LaneStomp account.",
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthPageShell
      description="Sign in to manage your LaneStomp account, review saved settings, and keep matchup work tied to the right profile."
      eyebrow="Account access"
      title="Welcome back to LaneStomp"
    >
      <AdminLoginForm />
    </AuthPageShell>
  );
}
