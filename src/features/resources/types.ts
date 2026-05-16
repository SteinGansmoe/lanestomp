export type ResourceCategory =
  | "builds"
  | "tier-list"
  | "patch-notes"
  | "wiki"
  | "tools"
  | "official"
  | "community"
  | "stats"
  | "esports"
  | "trade";

export type ResourceProvider = {
  createdAt: string;
  updatedAt: string;
};

export type Resource = ResourceProvider & {
  category: ResourceCategory;
  description?: string;
  featured?: boolean;
  gameId: string;
  id: string;
  label: string;
  tags?: string[];
  url: string;
};
