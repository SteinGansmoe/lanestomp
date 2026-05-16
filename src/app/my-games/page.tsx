import { MyGamesPage } from "@/src/components/my-games-page";
import { games } from "@/src/data/games";

export default function Page() {
  return <MyGamesPage games={games} />;
}
