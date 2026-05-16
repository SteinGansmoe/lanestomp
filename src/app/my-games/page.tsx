import { MyGamesPage } from "@/src/components/my-games-page";
import { getGamesWithSeasons } from "@/src/features";

export default function Page() {
  const games = getGamesWithSeasons();

  return <MyGamesPage games={games} />;
}
