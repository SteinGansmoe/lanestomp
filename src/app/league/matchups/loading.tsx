import { Card } from "@/src/components/ui/card";
import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
          Loading League matchup selector...
        </Card>
      </section>
    </main>
  );
}
