export const games = [
  {
    id: "diablo-4",
    title: "Diablo IV",
    genre: "ARPG",
    image: "",
    season: {
      title: "Season 13",
      type: "Limited Event",
      startDate: "2026-06-01",
      endDate: "2026-08-15",
    },
  },
  {
    id: "last-epoch",
    title: "Last Epoch",
    genre: "ARPG",
    image: "",
    season: {
      title: "Season 4",
      type: "Cycle",
      startDate: "2026-06-01",
      endDate: "2026-05-28",
    },
  },
  {
    id: "league-of-legends",
    title: "League of Legends",
    genre: "MOBA",
    image: "",
    season: {
      title: "Season 16",
      type: "Ranked Split",
      startDate: "2026-06-01",
      endDate: "2026-08-15",
    },
  },
  {
    id: "path-of-exile",
    title: "Path of Exile",
    genre: "ARPG",
    image: "",
    season: {
      title: "Season 21",
      type: "Challenge League",
      startDate: "2026-06-01",
      endDate: "2026-08-15",
    },
  },
];

export type Game = (typeof games)[number];
