export type RelatedGameType = "same-genre" | "same-creator" | "similar-cycle";

export type RelatedGame = {
  createdAt: string;
  gameId: string;
  id: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  relatedGameId: string;
  sourceUrl?: string;
  type: RelatedGameType;
  updatedAt: string;
};
