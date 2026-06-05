import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Home, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/src/components/site-header";
import { Button } from "@/src/components/ui/button";

export const metadata: Metadata = {
  title: "Account Confirmed",
  description:
    "Your LaneStomp account is ready. Sign in to start exploring matchup guides, counter picks, and champion insights.",
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
                Thanks for creating an account. Your email has been confirmed
                and you can now sign in to start exploring matchup guides,
                counter picks, and champion insights.
              </p>
            </div>

            <div className="grid gap-6 px-5 py-6 sm:px-8 sm:py-7">
              <div className="flex items-start gap-3 rounded-lg border border-emerald-300/15 bg-emerald-400/10 p-4 text-emerald-50">
                <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <h2 className="font-mono text-base font-semibold">
                    Verification complete
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-emerald-50/75">
                    Your account is verified. No confirmation tokens or email
                    link details are shown here.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-11 bg-violet-500/85 px-5 text-white hover:bg-violet-500"
                >
                  <Link href="/login">
                    Sign in
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  className="h-11 border-white/10 bg-white/5 px-5 text-zinc-100 hover:bg-white/10"
                  variant="ghost"
                >
                  <Link href="/">
                    <Home className="size-4" aria-hidden="true" />
                    Go to homepage
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
