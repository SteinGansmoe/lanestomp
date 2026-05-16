import type { GameEvent } from "@/src/features/events/types";

export const events: GameEvent[] = [
  {
    id: "diablo-4-season-13-start",
    gameId: "diablo-4",
    seasonId: "diablo-4-season-13-upcoming",
    title: "Diablo IV Season 13 starts",
    type: "season-start",
    startDate: "2026-06-01",
    createdAt: "2026-05-16T00:00:00.000Z",
    updatedAt: "2026-05-16T00:00:00.000Z",
  },
  {
    id: "last-epoch-season-4-end",
    gameId: "last-epoch",
    seasonId: "last-epoch-season-4-ending-soon",
    title: "Last Epoch Season 4 ends",
    type: "season-end",
    startDate: "2026-05-17",
    createdAt: "2026-05-16T00:00:00.000Z",
    updatedAt: "2026-05-16T00:00:00.000Z",
  },
];
