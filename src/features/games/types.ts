export type GameGenre = "ARPG" | "MMORPG" | "MOBA";

export type Game = {
  createdAt: string;
  description?: string | null;
  detailImage: string;
  genre: GameGenre;
  id: string;
  image: string;
  slug: string;
  title: string;
  updatedAt: string;
};
