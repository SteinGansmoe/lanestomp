import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/src/components/site-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for LaneStomp.",
};

const privacySections = [
  {
    title: "What LaneStomp Uses",
    text: "LaneStomp may use account information, session data, and gameplay preferences you provide so the app can support matchup learning, champion pool planning, and future League-focused tools.",
  },
  {
    title: "Authentication",
    text: "Account authentication is handled through the configured Supabase project. LaneStomp uses authentication state to show account and admin features when available.",
  },
  {
    title: "Analytics",
    text: "LaneStomp may use analytics to understand product usage and improve League matchup tools. Analytics are used for product improvement, not for selling personal data.",
  },
  {
    title: "Contact",
    text: "For privacy questions or data requests, use the contact channel linked from the footer when it becomes available.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <SiteHeader />

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-300">
            Legal
          </p>
          <h1 className="mt-2 font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            How LaneStomp handles account data, product usage signals, and
            League learning preferences.
          </p>
        </div>

        <div className="grid gap-4">
          {privacySections.map((section) => (
            <section
              className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/80 shadow-xl shadow-black/20 ring-1 ring-white/5"
              key={section.title}
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-200 ring-1 ring-white/10">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </div>
                <h2 className="font-mono text-lg font-semibold text-white">
                  {section.title}
                </h2>
              </div>
              <p className="px-4 py-4 text-sm leading-6 text-zinc-300 sm:px-5">
                {section.text}
              </p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
