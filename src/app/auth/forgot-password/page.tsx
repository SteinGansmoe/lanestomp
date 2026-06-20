import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/src/components/forgot-password-form";
import { AuthPageShell } from "@/src/components/auth-page-shell";

export const metadata: Metadata = {
  description: "Request a LaneStomp password reset link.",
  title: "Reset Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      description="Request a secure reset link and return to LaneStomp with a fresh password."
      eyebrow="Password recovery"
      title="Reset access safely"
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
