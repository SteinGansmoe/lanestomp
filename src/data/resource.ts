type Resource = {
    id: string;
    label: string;
    description?: string;
    url: string;
    category: ResourceCategory;
    tags?: string[];
    featured?: boolean;
};

type ResourceCategory = 
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

export type { Resource, ResourceCategory };