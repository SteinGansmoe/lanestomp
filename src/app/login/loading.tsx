import { Card } from "@/src/components/ui/card";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col justify-center gap-8">
        <div className="h-6 w-36 rounded bg-white/10" />
        <Card className="mx-auto w-full max-w-md border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
          Loading login...
        </Card>
      </section>
    </main>
  );
}
