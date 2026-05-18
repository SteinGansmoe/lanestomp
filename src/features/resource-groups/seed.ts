import type { ResourceGroup } from "@/src/features/resource-groups/types";

const seedTimestamp = "2026-05-18T00:00:00.000Z";

export const resourceGroups: ResourceGroup[] = [
  {
    id: "diablo-4-season-prep",
    gameId: "diablo-4",
    title: "Season prep",
    description: "Builds, patch notes, and planning references.",
    isFeatured: true,
    isVerified: true,
    resourceIds: [
      "d4-maxroll-builds",
      "d4-tier-lists",
      "d4-official-patch-notes",
    ],
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  },
  {
    id: "world-of-warcraft-season-prep",
    gameId: "world-of-warcraft",
    title: "Season prep",
    isFeatured: true,
    isVerified: true,
    resourceIds: ["wow-builds", "wow-tier-lists", "wow-patch-notes"],
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  },
  {
    id: "league-of-legends-ranked-prep",
    gameId: "league-of-legends",
    title: "Ranked prep",
    isFeatured: true,
    isVerified: true,
    resourceIds: ["lol-ugg-builds", "lol-opgg-stats", "lol-patch-notes"],
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  },
  {
    id: "last-epoch-cycle-prep",
    gameId: "last-epoch",
    title: "Cycle prep",
    isFeatured: true,
    isVerified: true,
    resourceIds: [
      "last-epoch-builds",
      "last-epoch-tier-lists",
      "last-epoch-patch-notes",
    ],
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  },
  {
    id: "path-of-exile-league-prep",
    gameId: "path-of-exile",
    title: "League prep",
    isFeatured: true,
    isVerified: true,
    resourceIds: ["poe-builds", "poe-tier-lists", "poe-patch-notes"],
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  },
];
