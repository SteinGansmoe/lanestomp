export type CreatorType = "developer" | "publisher" | "studio";

export type Creator = {
  createdAt: string;
  id: string;
  isFeatured?: boolean;
  isOfficial?: boolean;
  isVerified?: boolean;
  name: string;
  sourceUrl?: string;
  type: CreatorType;
  updatedAt: string;
  websiteUrl?: string;
};

export type GameCreatorRole =
  | "developer"
  | "publisher"
  | "developer-publisher";

export type GameCreator = {
  createdAt: string;
  creatorId: string;
  gameId: string;
  id: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  role: GameCreatorRole;
  updatedAt: string;
};
