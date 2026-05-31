export default function AccountSettingsLoading() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <div className="h-14 rounded-lg border border-white/10 bg-white/[0.04]" />
        <div className="mx-auto w-full max-w-2xl rounded-lg border border-white/10 bg-[#10182b]/90 p-6">
          <p className="text-sm text-zinc-400">Loading account settings...</p>
        </div>
      </section>
    </main>
  );
}
