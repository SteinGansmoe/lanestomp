import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import { AuthConfirmedPanel } from "@/src/components/auth-confirmed-panel";
import { SiteHeader } from "@/src/components/site-header";

export const metadata: Metadata = {
  title: "Account Confirmed",
  description:
    "Your LaneStomp account is ready. Start exploring matchup guides, counter picks, and champion insights.",
};

export default function AuthConfirmedPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <SiteHeader />

        <section className="flex min-h-[calc(100vh-24rem)] items-center justify-center py-8">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/30">
            <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.24),transparent_24rem),radial-gradient(circle_at_top_right,rgba(201,170,90,0.16),transparent_28rem),linear-gradient(135deg,rgba(8,17,32,0.98),rgba(11,18,32,0.94))] px-5 py-7 sm:px-8 sm:py-9">
              <div className="relative mb-7 h-20 w-52 max-w-full">
                <Image
                  alt="LaneStomp"
                  className="object-contain object-left"
                  fill
                  priority
                  sizes="208px"
                  src="/images/lanestomp-logo.png"
                />
              </div>

              <div className="mb-5 flex size-14 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-400/10 text-emerald-100 shadow-lg shadow-emerald-950/20">
                <CheckCircle2 className="size-7" aria-hidden="true" />
              </div>

              <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-200/80">
                Email confirmed
              </p>
              <h1 className="mt-3 font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                Your LaneStomp account is ready
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">
                Thanks for creating an account. Your email has been confirmed and you can now start
                exploring matchup guides, counter picks, and champion insights.
              </p>
            </div>

            <AuthConfirmedPanel />
          </div>
        </section>
      </section>
    </main>
  );
}
