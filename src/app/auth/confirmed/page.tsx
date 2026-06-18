import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { AuthPageShell } from "@/src/components/auth-page-shell";
import { AuthConfirmedPanel } from "@/src/components/auth-confirmed-panel";

export const metadata: Metadata = {
  title: "Account Confirmed",
  description:
    "Your LaneStomp account is ready. Start exploring matchup guides, counter picks, and champion insights.",
};

export default function AuthConfirmedPage() {
  return (
    <AuthPageShell
      description="Your email is verified and your account can now use LaneStomp tools that depend on a signed-in profile."
      eyebrow="Email confirmed"
      title="Your LaneStomp account is ready"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/30 ring-1 ring-white/5">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_20rem),radial-gradient(circle_at_top_right,rgba(201,170,90,0.16),transparent_24rem),linear-gradient(135deg,rgba(8,17,32,0.98),rgba(11,18,32,0.94))] px-5 py-7 sm:px-8">
          <div className="flex size-14 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-400/10 text-emerald-100 shadow-lg shadow-emerald-950/20">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-mono text-2xl font-semibold tracking-normal text-white">
            Verification complete
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Your account is confirmed. Continue into LaneStomp or return to the homepage.
          </p>
        </div>

        <AuthConfirmedPanel />
      </div>
    </AuthPageShell>
  );
}
