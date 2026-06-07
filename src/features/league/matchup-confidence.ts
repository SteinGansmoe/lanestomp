import type { LeagueChampionKnowledgeProfile } from "./champion-knowledge/types";
import {
  matchupDraftSectionKeys,
  type MatchupDraftSections,
} from "./matchup-draft-prompt";
import { scanMatchupDraftForFallbackContent } from "./matchup-fallback-contamination";

export type LeagueMatchupConfidenceLevel = "high" | "low" | "medium";
export type LeagueMatchupConfidenceSource =
  | "manual"
  | "openai"
  | "placeholder"
  | "unknown";

type LeagueMatchupConfidenceStatus = "draft" | "failed" | "reviewed";

type CalculateLeagueMatchupConfidenceInput = {
  championAName: string;
  championAProfile: LeagueChampionKnowledgeProfile | null;
  championBName: string;
  championBProfile: LeagueChampionKnowledgeProfile | null;
  draft: Partial<MatchupDraftSections>;
  generationSource: LeagueMatchupConfidenceSource;
  generationStatus: LeagueMatchupConfidenceStatus;
};

type ConfidenceScore = 1 | 2 | 3;

const confidenceScoreByLevel = {
  high: 3,
  low: 1,
  medium: 2,
} as const satisfies Record<LeagueMatchupConfidenceLevel, ConfidenceScore>;

export function calculateLeagueMatchupConfidence({
  championAName,
  championAProfile,
  championBName,
  championBProfile,
  draft,
  generationSource,
  generationStatus,
}: CalculateLeagueMatchupConfidenceInput) {
  const reasons: string[] = [];
  let score: ConfidenceScore = confidenceScoreByLevel.high;
  const capConfidence = (
    level: Exclude<LeagueMatchupConfidenceLevel, "high">,
    reason: string
  ) => {
    score = Math.min(score, confidenceScoreByLevel[level]) as ConfidenceScore;
    reasons.push(reason);
  };

  if (!championAProfile) {
    capConfidence("low", `${championAName} champion profile is missing`);
  } else if (championAProfile.profileQuality !== "reviewed") {
    capConfidence(
      "medium",
      `${championAName} champion profile quality = ${championAProfile.profileQuality}`
    );
  } else {
    reasons.push(`${championAName} champion profile quality = reviewed`);
  }

  if (!championBProfile) {
    capConfidence("low", `${championBName} champion profile is missing`);
  } else if (championBProfile.profileQuality !== "reviewed") {
    capConfidence(
      "medium",
      `${championBName} champion profile quality = ${championBProfile.profileQuality}`
    );
  } else {
    reasons.push(`${championBName} champion profile quality = reviewed`);
  }

  if (generationStatus === "failed") {
    capConfidence("low", "matchup generation status = failed");
  } else if (generationStatus === "draft") {
    capConfidence("medium", "matchup not reviewed");
  } else {
    reasons.push("matchup reviewed");
  }

  if (generationSource === "placeholder") {
    capConfidence("low", "generation source = fallback placeholder");
  } else {
    reasons.push(`generation source = ${generationSource}`);
  }

  const missingSections = matchupDraftSectionKeys.filter(
    (sectionKey) => !draft[sectionKey]?.trim()
  );

  if (missingSections.length > 0) {
    capConfidence(
      "low",
      `content incomplete: ${missingSections.join(", ")}`
    );
  } else {
    reasons.push("content complete");
  }

  const fallbackScan = scanMatchupDraftForFallbackContent(draft);

  if (fallbackScan.hasFallbackContent) {
    capConfidence(
      "low",
      `fallback content detected: ${fallbackScan.affectedSections.join(", ")}`
    );
  }

  return {
    level: getConfidenceLevelFromScore(score),
    reasons,
  };
}

export function getLeagueMatchupConfidenceSourceFromNotes(
  adminNotes: string | null | undefined
): LeagueMatchupConfidenceSource {
  const notes = adminNotes?.toLowerCase() ?? "";

  if (notes.includes("source: fallback")) {
    return "placeholder";
  }

  if (notes.includes("source: ai") || notes.includes("ai draft generated")) {
    return "openai";
  }

  if (notes.includes("source: manual")) {
    return "manual";
  }

  return "unknown";
}

function getConfidenceLevelFromScore(
  score: ConfidenceScore
): LeagueMatchupConfidenceLevel {
  if (score === confidenceScoreByLevel.high) {
    return "high";
  }

  if (score === confidenceScoreByLevel.medium) {
    return "medium";
  }

  return "low";
}
