export type CreatorType =
  | "community"
  | "developer"
  | "guide-site"
  | "publisher"
  | "studio"
  | "tool-provider";

export type Creator = {
  avatarColor?: string;
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
  | "community"
  | "developer"
  | "guide-creator"
  | "publisher"
  | "developer-publisher"
  | "tooling";

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
