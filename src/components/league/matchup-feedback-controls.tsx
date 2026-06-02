"use client";

import { useState } from "react";
import { AlertTriangle, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { supabase } from "@/src/lib/supabase";
import type { LeagueRole } from "@/src/features/league/roles";

type FeedbackType = "helpful" | "not_helpful" | "report_issue";
type FeedbackReason =
  | "ability_formatting_issue"
  | "incorrect_advice"
  | "missing_information"
  | "other"
  | "too_generic"
  | "wrong_champion_perspective";

type FeedbackStatus = {
  error: string | null;
  isLoading: boolean;
  success: string | null;
};

const feedbackReasons: Array<{ label: string; value: FeedbackReason }> = [
  { label: "Incorrect advice", value: "incorrect_advice" },
  { label: "Missing information", value: "missing_information" },
  { label: "Too generic", value: "too_generic" },
  { label: "Wrong champion perspective", value: "wrong_champion_perspective" },
  { label: "Ability formatting issue", value: "ability_formatting_issue" },
  { label: "Other", value: "other" },
];

export function MatchupFeedbackControls({
  cardType,
  enemyChampion,
  lane,
  matchupId,
  playerChampion,
}: {
  cardType: string;
  enemyChampion: string;
  lane: LeagueRole;
  matchupId: number;
  playerChampion: string;
}) {
  const [isReporting, setIsReporting] = useState(false);
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState<FeedbackReason>("incorrect_advice");
  const [status, setStatus] = useState<FeedbackStatus>({
    error: null,
    isLoading: false,
    success: null,
  });

  async function submitFeedback(feedbackType: FeedbackType) {
    if (!supabase) {
      setStatus({
        error: "Feedback cannot be submitted until Supabase is configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("matchup_feedback").insert({
      card_type: cardType,
      enemy_champion: enemyChampion,
      feedback_type: feedbackType,
      lane,
      matchup_id: matchupId,
      message: message.trim() || null,
      player_champion: playerChampion,
      reason: feedbackType === "report_issue" ? reason : null,
      user_id: userData.user?.id ?? null,
    });

    if (error) {
      setStatus({ error: error.message, isLoading: false, success: null });
      return;
    }

    setMessage("");
    setIsReporting(false);
    setStatus({
      error: null,
      isLoading: false,
      success:
        feedbackType === "report_issue"
          ? "Issue reported for admin review."
          : "Feedback saved.",
    });
  }

  return (
    <div className="mt-4 border-t border-white/10 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          className="h-8 border-emerald-300/20 bg-emerald-500/10 px-2 text-xs text-emerald-100 hover:bg-emerald-500/20"
          disabled={status.isLoading}
          onClick={() => submitFeedback("helpful")}
          type="button"
          variant="ghost"
        >
          <ThumbsUp className="size-3.5" aria-hidden="true" />
          Helpful
        </Button>
        <Button
          className="h-8 border-amber-300/20 bg-amber-400/10 px-2 text-xs text-amber-100 hover:bg-amber-400/20"
          disabled={status.isLoading}
          onClick={() => submitFeedback("not_helpful")}
          type="button"
          variant="ghost"
        >
          <ThumbsDown className="size-3.5" aria-hidden="true" />
          Not helpful
        </Button>
        <Button
          className="h-8 border-rose-300/20 bg-rose-500/10 px-2 text-xs text-rose-100 hover:bg-rose-500/20"
          disabled={status.isLoading}
          onClick={() => setIsReporting((current) => !current)}
          type="button"
          variant="ghost"
        >
          <AlertTriangle className="size-3.5" aria-hidden="true" />
          Report issue
        </Button>
      </div>

      {isReporting ? (
        <div className="mt-3 grid gap-2 rounded-md border border-white/10 bg-black/15 p-3">
          <label className="grid gap-1 text-xs text-zinc-400">
            Reason
            <select
              className="h-9 rounded-md border border-white/10 bg-[#081120] px-2 text-sm text-zinc-100 outline-none focus-visible:border-violet-400/70"
              onChange={(event) => setReason(event.target.value as FeedbackReason)}
              value={reason}
            >
              {feedbackReasons.map((option) => (
                <option className="bg-[#10182b]" key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-zinc-400">
            Details
            <textarea
              className="min-h-20 resize-y rounded-md border border-white/10 bg-[#081120] px-2 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus-visible:border-violet-400/70"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Optional context for the admin reviewing this card"
              value={message}
            />
          </label>
          <Button
            className="h-9 justify-self-start bg-rose-500/80 px-3 text-white hover:bg-rose-500"
            disabled={status.isLoading}
            onClick={() => submitFeedback("report_issue")}
            type="button"
          >
            <MessageSquare className="size-3.5" aria-hidden="true" />
            {status.isLoading ? "Submitting..." : "Submit report"}
          </Button>
        </div>
      ) : null}

      {status.error ? (
        <p className="mt-2 text-xs leading-5 text-rose-200">{status.error}</p>
      ) : null}
      {status.success ? (
        <p className="mt-2 text-xs leading-5 text-emerald-200">{status.success}</p>
      ) : null}
    </div>
  );
}
