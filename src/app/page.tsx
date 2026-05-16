import { SeasonDashboard } from "@/src/components/season-dashboard";
import { getGamesWithSeasons } from "@/src/features";

export default function Home() {
  const games = getGamesWithSeasons();

  return <SeasonDashboard games={games} />;
}
