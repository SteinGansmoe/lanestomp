import { SiteHeader } from "@/src/components/site-header";

export default function AccountSettingsLoading() {
  return (
    <main
      className="min-h-screen bg-[#050b18] text-white"
      role="status"
      aria-label="Loading account settings"
    >
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <SiteHeader />

        <div className="mx-auto w-full max-w-2xl rounded-lg border border-white/10 bg-[#10182b]/90 p-6 shadow-xl shadow-black/25">
          <div className="size-12 rounded-lg bg-violet-500/20 ring-1 ring-violet-300/20" />
          <div className="mt-5 h-8 w-56 rounded bg-white/10" />
          <div className="mt-3 h-4 w-full max-w-lg rounded bg-white/5" />

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-white/10" />
              <div className="h-11 rounded-lg border border-white/10 bg-white/[0.04]" />
              <div className="h-3 w-52 rounded bg-white/5" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-14 rounded bg-white/10" />
              <div className="h-11 rounded-lg border border-white/10 bg-white/[0.03]" />
            </div>
            <div className="h-28 rounded-lg border border-white/10 bg-white/[0.03]" />
            <div className="h-11 w-40 rounded-lg bg-violet-500/20" />
          </div>
        </div>
      </section>
    </main>
  );
}
