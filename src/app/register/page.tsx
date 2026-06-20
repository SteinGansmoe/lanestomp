import type { Metadata } from "next";

import { RegisterForm } from "@/src/components/register-form";
import { AuthPageShell } from "@/src/components/auth-page-shell";

export const metadata: Metadata = {
  description: "Create a LaneStomp account for saved preferences and account-based tools.",
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <AuthPageShell
      description="Create a LaneStomp account for current and future League tools, including saved preferences and account-based feedback."
      eyebrow="Create account"
      title="Build your LaneStomp profile"
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
