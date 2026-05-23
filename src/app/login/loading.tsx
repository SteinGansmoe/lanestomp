import { Card } from "@/src/components/ui/card";
import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-10">
        <SiteHeader />

        <div className="flex min-h-[calc(100vh-24rem)] items-center justify-center py-8">
          <Card className="mx-auto w-full max-w-md border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            Loading login...
          </Card>
        </div>
      </section>
    </main>
  );
}
