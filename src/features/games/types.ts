export type GameGenre = "ARPG" | "MMORPG" | "MOBA";

export type Game = {
  createdAt: string;
  detailImage: string;
  genre: GameGenre;
  id: string;
  image: string;
  slug: string;
  title: string;
  updatedAt: string;
};
