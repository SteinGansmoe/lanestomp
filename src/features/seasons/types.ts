export type SeasonStatus = "active" | "upcoming" | "ended";

export type Season = {
  createdAt: string;
  description?: string | null;
  endDate: string;
  gameId: string;
  id: string;
  slug: string;
  startDate: string;
  title: string;
  type: string;
  updatedAt: string;
};
