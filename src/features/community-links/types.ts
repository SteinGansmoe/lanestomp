export type CommunityLinkType =
  | "discord"
  | "forum"
  | "reddit"
  | "social"
  | "video";

export type CommunityLink = {
  createdAt: string;
  gameId: string;
  id: string;
  isFeatured?: boolean;
  isOfficial?: boolean;
  isVerified?: boolean;
  label: string;
  sourceUrl?: string;
  type: CommunityLinkType;
  typeLabel?: string;
  updatedAt: string;
  url: string;
};
