export const games = [
  {
    id: "diablo-4",
    title: "Diablo IV",
    genre: "ARPG",
    image: "https://static.wikia.nocookie.net/diablo/images/8/88/Diablo_IV_2019_nosmoke_logo.png/revision/latest/scale-to-width-down/1200?cb=20220508020052",
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
    image:
      "https://staticg.sportskeeda.com/editor/2026/03/1bed4-17739122696107-1920.jpg",
    season: {
      title: "Season 4",
      type: "Cycle",
      startDate: "2026-06-01",
      endDate: "2026-08-15",
    },
  },
  {
    id: "league-of-legends",
    title: "League of Legends",
    genre: "MOBA",
    image:
      "https://i.pinimg.com/originals/d1/b1/1d/d1b11d5e4dbae547ac0d651476cec488.png",
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
    image: "https://images2.alphacoders.com/112/thumb-1920-1123968.jpg",
    season: {
      title: "Season 21",
      type: "Challenge League",
      startDate: "2026-06-01",
      endDate: "2026-08-15",
    },
  },
];

export type Game = (typeof games)[number];
