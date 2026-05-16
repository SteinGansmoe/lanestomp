"use client";

import { Heart } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useFollowedGames } from "@/src/hooks/use-followed-games";

type FollowGameButtonProps = {
  className?: string;
  gameId: string;
};

export function FollowGameButton({ className, gameId }: FollowGameButtonProps) {
  const { isFollowing, toggleFollowedGame } = useFollowedGames();
  const following = isFollowing(gameId);

  return (
    <Button
      aria-pressed={following}
      className={cn(
        "h-8 rounded-md border border-white/10 px-3 text-sm",
        following
          ? "bg-violet-500/25 text-violet-100 hover:bg-violet-500/35"
          : "bg-white/5 text-zinc-100 hover:bg-white/10",
        className
      )}
      onClick={() => toggleFollowedGame(gameId)}
      type="button"
    >
      <Heart
        className={cn("size-4", following ? "fill-current" : "")}
        aria-hidden="true"
      />
      {following ? "Unfollow" : "Follow"}
    </Button>
  );
}
