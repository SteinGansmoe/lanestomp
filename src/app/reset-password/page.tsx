import type { Metadata } from "next";

import { ResetPasswordForm } from "@/src/components/reset-password-form";
import { AuthPageShell } from "@/src/components/auth-page-shell";

export const metadata: Metadata = {
  description: "Set a new password for your LaneStomp account.",
  title: "Set New Password",
};

export default function ResetPasswordPage() {
  return (
    <AuthPageShell
      description="Choose a new account password after opening a valid recovery link."
      eyebrow="Password recovery"
      title="Set your new password"
    >
      <ResetPasswordForm />
    </AuthPageShell>
  );
}
