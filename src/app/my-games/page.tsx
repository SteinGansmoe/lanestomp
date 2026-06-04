import { redirect } from "next/navigation";

export default function LegacyMyGamesPage() {
  redirect("/league/matchups");
}
