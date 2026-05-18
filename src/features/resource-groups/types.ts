export type ResourceGroup = {
  createdAt: string;
  description?: string;
  gameId: string;
  id: string;
  isFeatured?: boolean;
  isOfficial?: boolean;
  isVerified?: boolean;
  resourceIds: string[];
  sourceUrl?: string;
  title: string;
  updatedAt: string;
};
