import { SeasonDashboard } from "@/src/components/season-dashboard";
import { games } from "@/src/data/games";

export default function Home() {
  return <SeasonDashboard games={games} />;
}
