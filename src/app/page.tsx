import { CalendarClock, Gamepad2, Hourglass, TimerReset } from "lucide-react";

import { GameCard } from "@/src/components/game-card";
import { Card } from "@/src/components/ui/card";
import { games } from "@/src/data/games";

const stats = [
  {
    label: "Tracked Games",
    value: games.length,
    icon: Gamepad2,
    className: "bg-violet-500/20 text-violet-200",
  },
  {
    label: "Active Seasons",
    value: games.length,
    icon: CalendarClock,
    className: "bg-sky-500/20 text-sky-200",
  },
  {
    label: "Starting Soon",
    value: 2,
    icon: Hourglass,
    className: "bg-emerald-500/20 text-emerald-200",
  },
  {
    label: "Ending Soon",
    value: 1,
    icon: TimerReset,
    className: "bg-rose-500/20 text-rose-200",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500 text-white">
              <Gamepad2 className="size-5" aria-hidden="true" />
            </div>
            <p className="font-mono text-xl font-semibold">SeasonTracker</p>
          </div>
          <nav className="flex gap-6 font-mono text-sm text-zinc-400">
            <span className="text-violet-300">Home</span>
            <span>Games</span>
            <span>Calendar</span>
            <span>News</span>
          </nav>
        </header>

        <div>
          <h1 className="font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
            Welcome back!
          </h1>
          <p className="mt-2 text-base text-zinc-400">
            Here&apos;s what&apos;s happening in your games.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="flex-row items-center gap-4 border-white/10 bg-[#10182b]/90 p-5 text-white"
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-full ${stat.className}`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-mono text-3xl font-semibold">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="border-l-4 border-violet-400 pl-4 font-mono text-xl font-semibold">
              Active Seasons
            </h2>
            <span className="text-sm text-violet-300">View all</span>
          </div>
          <div className="space-y-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
