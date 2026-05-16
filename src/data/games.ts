import { getGamesWithSeasons } from "@/src/features/games/selectors";

export const games = getGamesWithSeasons();

export type Game = (typeof games)[number];
