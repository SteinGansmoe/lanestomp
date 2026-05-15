export const games = [
  {
    id: "diablo-4",
    title: "Diablo IV",
    genre: "ARPG",
    image: "/images/d4-icon.jpg",
    detailImage: "/images/d4-detailpage.png",
    season: {
      title: "Season 13",
      type: "Limited Event",
      startDate: "2026-06-01",
      endDate: "2026-08-15",
    },
    resources: [
      { label: "Build Guides", href: "#" },
      { label: "Tier Lists", href: "#" },
      { label: "Patch Notes", href: "#" },
    ],
  },
  {
    id: "season-13",
    title: "Diablo IV",
    genre: "ARPG",
    image: "/images/d4-icon.jpg",
    detailImage: "/images/d4-detailpage.png",
    season: {
      title: "Season 13",
      type: "Limited Event",
      startDate: "2026-05-01",
      endDate: "2026-07-14",
    },
    resources: [
      { label: "Build Guides", href: "#" },
      { label: "Tier Lists", href: "#" },
      { label: "Patch Notes", href: "#" },
    ],
  },
  {
    id: "last-epoch",
    title: "Last Epoch",
    genre: "ARPG",
    image: "/images/le-icon.png",
    detailImage: "/images/le-detailpage.png",
    season: {
      title: "Season 4",
      type: "Cycle",
      startDate: "2026-06-01",
      endDate: "2026-05-28",
    },
    resources: [
      { label: "Build Guides", href: "#" },
      { label: "Tier Lists", href: "#" },
      { label: "Patch Notes", href: "#" },
    ],
  },
  {
    id: "last-epoch-2",
    title: "Last Epoch",
    genre: "ARPG",
    image: "/images/le-icon.png",
    detailImage: "/images/le-detailpage.png",
    season: {
      title: "Season 4",
      type: "Cycle",
      startDate: "2026-05-01",
      endDate: "2026-05-17",
    },
    resources: [
      { label: "Build Guides", href: "#" },
      { label: "Tier Lists", href: "#" },
      { label: "Patch Notes", href: "#" },
    ],
  },
  {
    id: "league-of-legends",
    title: "League of Legends",
    genre: "MOBA",
    image: "",
    detailImage: "",
    season: {
      title: "Season 16",
      type: "Ranked Split",
      startDate: "2026-06-01",
      endDate: "2026-08-15",
    },
    resources: [
      { label: "Build Guides", href: "#" },
      { label: "Tier Lists", href: "#" },
      { label: "Patch Notes", href: "#" },
    ],
  },
  {
    id: "path-of-exile",
    title: "Path of Exile",
    genre: "ARPG",
    image: "",
    detailImage: "",
    season: {
      title: "Season 21",
      type: "Challenge League",
      startDate: "2026-06-01",
      endDate: "2026-08-15",
    },
    resources: [
      { label: "Build Guides", href: "#" },
      { label: "Tier Lists", href: "#" },
      { label: "Patch Notes", href: "#" },
    ],
  },
];

export type Game = (typeof games)[number];
