import type { Metadata } from "next";
import { UserCircle } from "lucide-react";

import { AccountSettingsForm } from "@/src/components/account-settings-form";
import { SiteHeader } from "@/src/components/site-header";

export const metadata: Metadata = {
  description: "Manage your LaneStomp username, email, and password.",
  title: "Account Settings",
};

export default function AccountSettingsPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <SiteHeader />

        <header className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/25">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_28rem),radial-gradient(circle_at_85%_0%,rgba(201,170,90,0.12),transparent_26rem),linear-gradient(135deg,rgba(8,17,32,0.98),rgba(11,18,32,0.92))] p-5 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                <UserCircle className="size-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                  Account
                </p>
                <h1 className="mt-2 font-mono text-3xl font-semibold tracking-normal text-white sm:text-5xl">
                  Account settings
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
                  Manage your LaneStomp identity, sign-in email, and password in one place.
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex justify-center pb-8">
          <AccountSettingsForm />
        </div>
      </section>
    </main>
  );
}
