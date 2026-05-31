import { Card } from "@/src/components/ui/card";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="h-6 w-36 rounded bg-white/10" />
        <div className="space-y-3">
          <div className="h-10 w-72 rounded bg-white/10" />
          <div className="h-5 w-64 rounded bg-white/5" />
        </div>
        <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
          Loading admin dashboard...
        </Card>
      </section>
    </main>
  );
}
