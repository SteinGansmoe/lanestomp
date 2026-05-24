import { MyGamesPage } from "@/src/components/my-games-page";
import { getGamesWithSeasons } from "@/src/features";

export default function Page() {
  const games = getGamesWithSeasons();
  const now = new Date().toISOString();

  return <MyGamesPage games={games} now={now} />;
}
