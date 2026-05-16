export type EventType = "season-start" | "season-end" | "patch" | "event";

export type GameEvent = {
  createdAt: string;
  description?: string;
  endDate?: string;
  gameId: string;
  id: string;
  seasonId?: string;
  startDate: string;
  title: string;
  type: EventType;
  updatedAt: string;
};
