"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { supabase } from "@/src/lib/supabase";
import type { LeagueRole } from "@/src/features/league/roles";

type FeedbackType = "helpful" | "not_helpful" | "report_issue";
type VoteFeedbackType = Exclude<FeedbackType, "report_issue">;
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

type FeedbackCounts = {
  helpful_count: number;
  not_helpful_count: number;
};

const emptyFeedbackCounts: FeedbackCounts = {
  helpful_count: 0,
  not_helpful_count: 0,
};

const feedbackSessionStorageKey = "lanestomp-feedback-session-id";

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
  const [counts, setCounts] = useState<FeedbackCounts>(emptyFeedbackCounts);
  const [selectedFeedbackType, setSelectedFeedbackType] = useState<VoteFeedbackType | null>(null);
  const [status, setStatus] = useState<FeedbackStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const selectedFeedbackStorageKey = `lanestomp-feedback-selection:${matchupId}:${cardType}`;

  useEffect(() => {
    let isMounted = true;

    async function loadFeedbackState() {
      setSelectedFeedbackType(getStoredSelectedFeedback(selectedFeedbackStorageKey));

      if (!supabase) {
        return;
      }

      const { data, error } = await supabase
        .from("matchup_feedback_counts")
        .select("helpful_count, not_helpful_count")
        .eq("matchup_id", matchupId)
        .eq("card_type", cardType)
        .maybeSingle<FeedbackCounts>();

      if (!isMounted) {
        return;
      }

      if (!error && data) {
        setCounts(normalizeFeedbackCounts(data));
      }
    }

    void loadFeedbackState();

    return () => {
      isMounted = false;
    };
  }, [cardType, matchupId, selectedFeedbackStorageKey]);

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

    const sessionId = getFeedbackSessionId();
    const { data, error } = await supabase.rpc("submit_matchup_feedback", {
      p_card_type: cardType,
      p_enemy_champion: enemyChampion,
      p_feedback_type: feedbackType,
      p_lane: lane,
      p_matchup_id: matchupId,
      p_message: message.trim() || null,
      p_player_champion: playerChampion,
      p_reason: feedbackType === "report_issue" ? reason : null,
      p_session_id: sessionId,
    });

    if (error) {
      setStatus({ error: error.message, isLoading: false, success: null });
      return;
    }

    const nextCounts = getSubmittedFeedbackCounts(data);

    if (nextCounts) {
      setCounts(nextCounts);
    }

    if (feedbackType !== "report_issue") {
      setSelectedFeedbackType(feedbackType);
      storeSelectedFeedback(selectedFeedbackStorageKey, feedbackType);
    }

    setMessage("");
    setIsReporting(false);
    setStatus({
      error: null,
      isLoading: false,
      success:
        feedbackType === "report_issue" ? "Issue reported for admin review." : "Feedback saved.",
    });
  }

  return (
    <div className="mt-3 border-t border-white/10 pt-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          aria-pressed={selectedFeedbackType === "helpful"}
          className={`h-8 border-emerald-300/20 bg-emerald-500/10 px-2 text-xs text-emerald-100 hover:bg-emerald-500/20 ${
            selectedFeedbackType === "helpful" ? "ring-1 ring-emerald-300/45" : ""
          }`}
          disabled={status.isLoading}
          onClick={() => submitFeedback("helpful")}
          type="button"
          variant="ghost"
        >
          <ThumbsUp className="size-3.5" aria-hidden="true" />
          Helpful ({formatFeedbackCount(counts.helpful_count)})
        </Button>
        <Button
          aria-pressed={selectedFeedbackType === "not_helpful"}
          className={`h-8 border-amber-300/20 bg-amber-400/10 px-2 text-xs text-amber-100 hover:bg-amber-400/20 ${
            selectedFeedbackType === "not_helpful" ? "ring-1 ring-amber-300/45" : ""
          }`}
          disabled={status.isLoading}
          onClick={() => submitFeedback("not_helpful")}
          type="button"
          variant="ghost"
        >
          <ThumbsDown className="size-3.5" aria-hidden="true" />
          Not helpful ({formatFeedbackCount(counts.not_helpful_count)})
        </Button>
        <Button
          aria-expanded={isReporting}
          className={`h-8 border-rose-300/20 bg-rose-500/10 px-2 text-xs text-rose-100 hover:bg-rose-500/20 ${
            isReporting ? "ring-1 ring-rose-300/45" : ""
          }`}
          disabled={status.isLoading}
          onClick={() => setIsReporting((current) => !current)}
          type="button"
          variant="ghost"
        >
          <AlertTriangle className="size-3.5" aria-hidden="true" />
          Report
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

      {status.error ? <p className="mt-2 text-xs leading-5 text-rose-200">{status.error}</p> : null}
      {status.success ? (
        <p className="mt-2 text-xs leading-5 text-emerald-200">{status.success}</p>
      ) : null}
    </div>
  );
}

function normalizeFeedbackCounts(value: Partial<FeedbackCounts>): FeedbackCounts {
  return {
    helpful_count: Number(value.helpful_count ?? 0),
    not_helpful_count: Number(value.not_helpful_count ?? 0),
  };
}

function getSubmittedFeedbackCounts(value: unknown) {
  const row = Array.isArray(value) ? value[0] : value;

  if (!row || typeof row !== "object") {
    return null;
  }

  return normalizeFeedbackCounts(row as Partial<FeedbackCounts>);
}

function formatFeedbackCount(value: number) {
  if (value < 1000) {
    return String(value);
  }

  const compactValue = value / 1000;
  const formatted =
    compactValue >= 10 || Number.isInteger(compactValue)
      ? compactValue.toFixed(0)
      : compactValue.toFixed(1);

  return `${formatted}k`;
}

function getFeedbackSessionId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existingSessionId = window.localStorage.getItem(feedbackSessionStorageKey);

  if (existingSessionId) {
    return existingSessionId;
  }

  const nextSessionId =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(feedbackSessionStorageKey, nextSessionId);

  return nextSessionId;
}

function getStoredSelectedFeedback(storageKey: string): VoteFeedbackType | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(storageKey);

  return isVoteFeedbackType(value) ? value : null;
}

function storeSelectedFeedback(storageKey: string, feedbackType: VoteFeedbackType) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, feedbackType);
}

function isVoteFeedbackType(value: string | null): value is VoteFeedbackType {
  return value === "helpful" || value === "not_helpful";
}
