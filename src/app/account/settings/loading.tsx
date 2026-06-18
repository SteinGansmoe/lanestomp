import { SiteHeader } from "@/src/components/site-header";
import { LaneStompPageShell } from "@/src/components/lane-stomp-page";

export default function AccountSettingsLoading() {
  return (
    <LaneStompPageShell role="status" aria-label="Loading account settings">
        <SiteHeader />

        <div className="overflow-hidden border border-cyan-100/15 bg-[#06111f]/88">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_28rem),radial-gradient(circle_at_85%_0%,rgba(201,170,90,0.12),transparent_26rem),linear-gradient(135deg,rgba(8,17,32,0.98),rgba(11,18,32,0.92))] p-5 sm:p-7">
            <div className="size-12 rounded border border-cyan-300/20 bg-cyan-400/10" />
            <div className="mt-5 h-9 w-72 max-w-full rounded bg-white/10" />
            <div className="mt-3 h-4 w-full max-w-2xl rounded bg-white/5" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl rounded border border-cyan-100/15 bg-[#06111f]/90 p-6">
          <div className="size-12 rounded bg-cyan-400/10" />
          <div className="mt-5 h-8 w-56 rounded bg-white/10" />
          <div className="mt-3 h-4 w-full max-w-lg rounded bg-white/5" />

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-white/10" />
              <div className="h-11 rounded border border-cyan-100/15 bg-white/[0.04]" />
              <div className="h-3 w-52 rounded bg-white/5" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-14 rounded bg-white/10" />
              <div className="h-11 rounded border border-cyan-100/15 bg-white/[0.03]" />
            </div>
            <div className="h-28 rounded border border-cyan-100/15 bg-white/[0.03]" />
            <div className="h-11 w-40 rounded bg-cyan-400/15" />
          </div>
        </div>
    </LaneStompPageShell>
  );
}
