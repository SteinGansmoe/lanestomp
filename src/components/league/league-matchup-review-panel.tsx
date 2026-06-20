"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Leaf,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldCheck,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/src/components/ui/button";
import { generateLeagueMatchupDraftSection } from "@/src/app/admin/league/matchups/actions";
import { MatchupFeedbackControls } from "@/src/components/league/matchup-feedback-controls";
import { isAdminUser } from "@/src/lib/admin";
import { supabase } from "@/src/lib/supabase";
import { getChampionCombatProfile } from "@/src/features/league/champion-knowledge";
import {
  calculateLeagueMatchupConfidence,
  getLeagueMatchupConfidenceSourceFromNotes,
} from "@/src/features/league/matchup-confidence";
import type { LeagueMatchup } from "@/src/features/league/matchups";
import { getMatchupDraftSectionLabel } from "@/src/features/league/matchup-draft-prompt";
import type { LeagueRole } from "@/src/features/league/roles";

type MatchupSectionKey =
  | "danger_windows"
  | "early_game"
  | "overview"
  | "power_spikes"
  | "trading_pattern"
  | "win_conditions";

type AdminMatchupRow = LeagueMatchup & {
  admin_notes: string | null;
  generated_at: string | null;
  id: number;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

type ReviewFormState = Record<MatchupSectionKey, string>;

type ReviewStatus = {
  error: string | null;
  isLoading: boolean;
  success: string | null;
};

type LeagueMatchupReviewPanelProps = {
  championAId: string;
  championAName: string;
  championBId: string;
  championBName: string;
  initialMatchup: LeagueMatchup | null;
  role: LeagueRole;
};

const matchupSectionDefinitions = [
  {
    key: "overview",
    title: "Overview",
    accent: "cyan",
    icon: Target,
    placeholder:
      "Use this matchup shell to frame the lane plan before AI-generated guidance arrives. Compare range, wave control, crowd control, and who gets to start fights on their terms.",
  },
  {
    key: "trading_pattern",
    title: "Trading pattern",
    accent: "violet",
    icon: Swords,
    placeholder:
      "Use short trades until cooldowns and range patterns are understood. Watch for the opponent's main punish window before committing to longer exchanges.",
  },
  {
    key: "danger_windows",
    title: "Danger windows",
    accent: "rose",
    icon: AlertTriangle,
    placeholder:
      "Ping missing information before wave crashes, jungle hover timings, and all-in cooldowns. Treat fog of war as the biggest variable for now.",
  },
  {
    key: "early_game",
    title: "Early game",
    accent: "emerald",
    icon: Leaf,
    placeholder:
      "Track level one spacing, first wave control, and how quickly each champion can contest the first three melee minions. This section will later become matchup-specific.",
  },
  {
    key: "power_spikes",
    title: "Power spikes",
    accent: "amber",
    icon: Zap,
    placeholder:
      "Respect first recall items, level six, and completed item timings. Future versions will map exact champion breakpoints here.",
  },
  {
    key: "win_conditions",
    title: "Win conditions",
    accent: "teal",
    icon: Trophy,
    placeholder:
      "Summarize what each side needs from the lane: wave state, summoner spell pressure, roam timing, and when the matchup shifts from survival to control.",
  },
] as const satisfies ReadonlyArray<{
  accent: "amber" | "cyan" | "emerald" | "rose" | "teal" | "violet";
  icon: typeof Target;
  key: MatchupSectionKey;
  placeholder: string;
  title: string;
}>;

type MatchupGuideSection = Omit<
  (typeof matchupSectionDefinitions)[number],
  "placeholder" | "title"
> & {
  body: string;
  placeholder: string;
  title: string;
};

export function LeagueMatchupReviewPanel({
  championAId,
  championAName,
  championBId,
  championBName,
  initialMatchup,
  role,
}: LeagueMatchupReviewPanelProps) {
  const [adminMatchup, setAdminMatchup] = useState<AdminMatchupRow | null>(null);
  const [form, setForm] = useState<ReviewFormState>(() => getReviewFormState(initialMatchup));
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [regeneratingSectionKey, setRegeneratingSectionKey] = useState<MatchupSectionKey | null>(
    null,
  );
  const [sectionErrors, setSectionErrors] = useState<Partial<Record<MatchupSectionKey, string>>>(
    {},
  );
  const [status, setStatus] = useState<ReviewStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const displayMatchup = adminMatchup ?? initialMatchup;
  const isRegeneratingSection = regeneratingSectionKey !== null;
  const sections = useMemo(
    () =>
      matchupSectionDefinitions.map((section) => ({
        ...section,
        body: getMatchupSectionBody(
          displayMatchup,
          section.key,
          getSectionPlaceholder(section.key, role, section.placeholder),
        ),
        title: getMatchupDraftSectionLabel(section.key, role),
      })),
    [displayMatchup, role],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadAdminMatchup() {
      if (!supabase) {
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      const nextIsAdmin = await isAdminUser(user);

      if (!isMounted) {
        return;
      }

      setIsAdmin(nextIsAdmin);

      if (!nextIsAdmin) {
        return;
      }

      setStatus({ error: null, isLoading: true, success: null });

      const { data, error } = await supabase
        .from("league_matchups")
        .select(
          [
            "id",
            "admin_notes",
            "champion_a_id",
            "champion_b_id",
            "generation_status",
            "role",
            "overview",
            "early_game",
            "trading_pattern",
            "power_spikes",
            "danger_windows",
            "win_conditions",
            "difficulty_rating",
            "confidence_level",
            "generated_at",
            "reviewed_at",
            "reviewed_by",
            "updated_at",
          ].join(", "),
        )
        .eq("champion_a_id", championAId)
        .eq("champion_b_id", championBId)
        .eq("role", role)
        .maybeSingle<AdminMatchupRow>();

      if (!isMounted) {
        return;
      }

      if (error) {
        setStatus({
          error: error.message,
          isLoading: false,
          success: null,
        });
        return;
      }

      setAdminMatchup(data);
      setForm(getReviewFormState(data ?? initialMatchup));
      setStatus({ error: null, isLoading: false, success: null });
    }

    void loadAdminMatchup();

    return () => {
      isMounted = false;
    };
  }, [championAId, championBId, initialMatchup, role]);

  function startEditing() {
    setForm(getReviewFormState(displayMatchup));
    setIsEditing(true);
    setStatus({ error: null, isLoading: false, success: null });
  }

  function cancelEditing() {
    setForm(getReviewFormState(displayMatchup));
    setIsEditing(false);
    setStatus({ error: null, isLoading: false, success: null });
  }

  async function saveEdits() {
    if (!supabase || !adminMatchup) {
      setStatus({
        error: "Matchup row is not ready for editing.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const payload = Object.fromEntries(
      matchupSectionDefinitions.map((section) => [section.key, form[section.key].trim() || null]),
    ) as Record<MatchupSectionKey, string | null>;
    const confidence = calculateConfidenceForReviewPanelMatchup({
      ...adminMatchup,
      ...payload,
    });
    const { data, error } = await supabase
      .from("league_matchups")
      .update({
        ...payload,
        confidence_level: confidence.level,
      })
      .eq("id", adminMatchup.id)
      .select(
        "id, admin_notes, champion_a_id, champion_b_id, generation_status, role, overview, early_game, trading_pattern, power_spikes, danger_windows, win_conditions, difficulty_rating, confidence_level, generated_at, reviewed_at, reviewed_by, updated_at",
      )
      .single<AdminMatchupRow>();

    if (error) {
      setStatus({ error: error.message, isLoading: false, success: null });
      return;
    }

    console.info("League matchup confidence calculation", {
      confidence: confidence.level,
      matchupId: adminMatchup.id,
      reasons: confidence.reasons,
    });
    setAdminMatchup(data);
    setForm(getReviewFormState(data));
    setIsEditing(false);
    setStatus({
      error: null,
      isLoading: false,
      success: "Matchup guidance saved.",
    });
  }

  async function markReviewed() {
    if (!supabase || !adminMatchup) {
      setStatus({
        error: "Matchup row is not ready for review.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user: User | null = userData.user ?? null;

    if (userError || !user || !(await isAdminUser(user))) {
      setStatus({
        error: userError?.message ?? "Only admins can publish matchup guidance.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const confidence = calculateConfidenceForReviewPanelMatchup({
      ...adminMatchup,
      generation_status: "reviewed",
    });
    const { data, error } = await supabase
      .from("league_matchups")
      .update({
        confidence_level: confidence.level,
        generation_status: "reviewed",
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq("id", adminMatchup.id)
      .select(
        "id, admin_notes, champion_a_id, champion_b_id, generation_status, role, overview, early_game, trading_pattern, power_spikes, danger_windows, win_conditions, difficulty_rating, confidence_level, generated_at, reviewed_at, reviewed_by, updated_at",
      )
      .single<AdminMatchupRow>();

    if (error) {
      setStatus({ error: error.message, isLoading: false, success: null });
      return;
    }

    console.info("League matchup confidence calculation", {
      confidence: confidence.level,
      matchupId: adminMatchup.id,
      reasons: confidence.reasons,
    });
    setAdminMatchup(data);
    setStatus({
      error: null,
      isLoading: false,
      success: "Matchup marked as reviewed and published.",
    });
  }

  async function regenerateSection(sectionKey: MatchupSectionKey) {
    if (!supabase || !adminMatchup || regeneratingSectionKey) {
      return;
    }

    setRegeneratingSectionKey(sectionKey);
    setSectionErrors((current) => ({ ...current, [sectionKey]: undefined }));
    setStatus({ error: null, isLoading: false, success: null });

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (sessionError || !accessToken) {
      setSectionErrors((current) => ({
        ...current,
        [sectionKey]: sessionError?.message ?? "Admin session is not ready.",
      }));
      setRegeneratingSectionKey(null);
      return;
    }

    const result = await generateLeagueMatchupDraftSection({
      accessToken,
      matchupId: adminMatchup.id,
      sectionKey,
    });

    if (!result.ok) {
      setSectionErrors((current) => ({
        ...current,
        [sectionKey]: result.error,
      }));
      setRegeneratingSectionKey(null);
      return;
    }

    const nextMatchup = {
      ...adminMatchup,
      ...result.matchup,
    };

    setAdminMatchup(nextMatchup);
    setForm(getReviewFormState(nextMatchup));
    setRegeneratingSectionKey(null);
    setStatus({
      error: null,
      isLoading: false,
      success: `${getSectionTitle(sectionKey, role)} regenerated and marked as draft.`,
    });
  }

  return (
    <>
      {isAdmin ? (
        <section className="border border-violet-300/20 bg-[#06111f]/86 p-4 shadow-[inset_3px_0_0_rgba(167,139,250,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center border border-violet-300/25 bg-violet-500/15 text-violet-100">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">
                  Admin review
                </p>
                <p className="text-xs text-zinc-400">
                  {adminMatchup
                    ? `${getStatusLabel(adminMatchup.generation_status)} guidance shown in the public layout.`
                    : "No matchup row exists for this direction yet."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <>
                  <Button
                    className="h-9 rounded-none border-violet-300/25 bg-violet-500/25 px-3 text-white hover:border-violet-300/45 hover:bg-violet-500/35"
                    disabled={status.isLoading || isRegeneratingSection}
                    onClick={saveEdits}
                    type="button"
                  >
                    <Save className="size-3.5" aria-hidden="true" />
                    {status.isLoading ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    className="h-9 rounded-none border-white/10 bg-white/5 px-3 text-zinc-100 hover:bg-white/10"
                    disabled={status.isLoading || isRegeneratingSection}
                    onClick={cancelEditing}
                    type="button"
                    variant="ghost"
                  >
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="h-9 rounded-none border-white/10 bg-white/5 px-3 text-zinc-100 hover:bg-white/10"
                    disabled={!adminMatchup || status.isLoading || isRegeneratingSection}
                    onClick={startEditing}
                    type="button"
                    variant="ghost"
                  >
                    <Edit3 className="size-3.5" aria-hidden="true" />
                    Edit guidance
                  </Button>
                  <Button
                    className="h-9 rounded-none border-emerald-300/20 bg-emerald-500/10 px-3 text-emerald-100 hover:bg-emerald-500/20"
                    disabled={
                      !adminMatchup ||
                      status.isLoading ||
                      isRegeneratingSection ||
                      adminMatchup.generation_status === "reviewed"
                    }
                    onClick={markReviewed}
                    type="button"
                    variant="ghost"
                  >
                    <CheckCircle2 className="size-3.5" aria-hidden="true" />
                    Mark reviewed
                  </Button>
                </>
              )}
            </div>
          </div>

          {status.error ? (
            <p className="mt-3 border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
              {status.error}
            </p>
          ) : null}

          {status.success ? (
            <p className="mt-3 border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {status.success}
            </p>
          ) : null}
        </section>
      ) : null}

      <div className="grid items-stretch gap-3 md:grid-cols-2">
        {sections.map((section) => (
          <MatchupGuideCard
            canRegenerate={Boolean(
              isAdmin &&
              adminMatchup &&
              !isEditing &&
              (!isRegeneratingSection || regeneratingSectionKey === section.key),
            )}
            formValue={form[section.key]}
            isEditing={isEditing}
            isRegenerating={regeneratingSectionKey === section.key}
            key={section.title}
            feedbackContext={
              displayMatchup?.id
                ? {
                    cardType: section.key,
                    enemyChampion: championBName,
                    lane: role,
                    matchupId: displayMatchup.id,
                    playerChampion: championAName,
                  }
                : null
            }
            onChange={(value) => setForm((current) => ({ ...current, [section.key]: value }))}
            onRegenerate={() => regenerateSection(section.key)}
            regenerateError={sectionErrors[section.key] ?? null}
            section={section}
          />
        ))}
      </div>
    </>
  );
}

function MatchupGuideCard({
  canRegenerate,
  formValue,
  feedbackContext,
  isEditing,
  isRegenerating,
  onChange,
  onRegenerate,
  regenerateError,
  section,
}: {
  canRegenerate: boolean;
  formValue: string;
  feedbackContext: {
    cardType: string;
    enemyChampion: string;
    lane: LeagueRole;
    matchupId: number;
    playerChampion: string;
  } | null;
  isEditing: boolean;
  isRegenerating: boolean;
  onChange: (value: string) => void;
  onRegenerate: () => void;
  regenerateError: string | null;
  section: MatchupGuideSection;
}) {
  const Icon = section.icon;
  const bullets = getGuideBullets(section.body);

  return (
    <article
      className={`group flex h-full flex-col border border-cyan-100/15 bg-[#06111f]/86 p-4 transition hover:border-cyan-100/25 hover:bg-[#071321]/90 ${getSectionPanelAccentClass(
        section.accent,
      )}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex size-8 shrink-0 items-center justify-center border ${getSectionIconClass(
              section.accent,
            )}`}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h2
            className={`font-mono text-sm font-semibold uppercase tracking-[0.1em] ${getSectionTitleClass(
              section.accent,
            )}`}
          >
            {section.title}
          </h2>
        </div>

        {canRegenerate ? (
          <Button
            aria-label={`Regenerate ${section.title}`}
            className="h-8 rounded-none border-white/10 bg-white/5 px-2 text-xs text-zinc-100 hover:border-cyan-300/35 hover:bg-cyan-400/[0.08] hover:text-cyan-100"
            disabled={isRegenerating}
            onClick={onRegenerate}
            type="button"
            variant="ghost"
          >
            <RefreshCw
              className={`size-3.5 ${isRegenerating ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {isRegenerating ? "Regenerating..." : "Regenerate"}
          </Button>
        ) : null}
      </div>

      {regenerateError ? (
        <p className="mt-3 border border-rose-400/20 bg-rose-500/10 p-2 text-xs leading-5 text-rose-100">
          {regenerateError}
        </p>
      ) : null}

      {isEditing ? (
        <textarea
          className="mt-3 min-h-36 w-full resize-y border border-white/10 bg-[#020814]/85 px-3 py-2 text-sm leading-5 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-3 focus-visible:ring-violet-400/20"
          onChange={(event) => onChange(event.target.value)}
          value={formValue}
        />
      ) : (
        <ul className="mt-4 grow space-y-2.5 text-sm leading-6 text-zinc-300">
          {bullets.map((line, index) => (
            <li className="flex gap-2" key={`${line}-${index}`}>
              <span
                className={`mt-2 size-1.5 shrink-0 rounded-full ${getSectionDotClass(
                  section.accent,
                )}`}
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}

      {!isEditing && feedbackContext ? <MatchupFeedbackControls {...feedbackContext} /> : null}
    </article>
  );
}

function getReviewFormState(matchup: LeagueMatchup | null): ReviewFormState {
  return Object.fromEntries(
    matchupSectionDefinitions.map((section) => [section.key, matchup?.[section.key] ?? ""]),
  ) as ReviewFormState;
}

function calculateConfidenceForReviewPanelMatchup(matchup: AdminMatchupRow) {
  return calculateLeagueMatchupConfidence({
    championAName: matchup.champion_a_id,
    championAProfile: getChampionCombatProfile(matchup.champion_a_id),
    championBName: matchup.champion_b_id,
    championBProfile: getChampionCombatProfile(matchup.champion_b_id),
    draft: getReviewFormState(matchup),
    generationSource: getLeagueMatchupConfidenceSourceFromNotes(matchup.admin_notes),
    generationStatus: matchup.generation_status,
  });
}

function getMatchupSectionBody(
  matchup: LeagueMatchup | null,
  key: MatchupSectionKey,
  placeholder: string,
) {
  const value = matchup?.[key];

  return value?.trim() ? value : placeholder;
}

function getGuideBullets(value: string) {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
    return lines.map((line) => line.replace(/^-+\s*/, "")).slice(0, 4);
  }

  return value
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function getStatusLabel(status: AdminMatchupRow["generation_status"]) {
  if (status === "reviewed") {
    return "Reviewed / published";
  }

  if (status === "failed") {
    return "Generation failed";
  }

  return "Draft";
}

function getSectionPlaceholder(sectionKey: MatchupSectionKey, role: LeagueRole, fallback: string) {
  if (role !== "jungle" || sectionKey !== "trading_pattern") {
    return fallback;
  }

  return "Build the jungle plan around first clear, invade timing, river control, Scuttle or objective setup, tempo resets, and how to deny the opposing jungler's scaling window.";
}

function getSectionTitle(sectionKey: MatchupSectionKey, role: LeagueRole) {
  return getMatchupDraftSectionLabel(sectionKey, role);
}

function getSectionDotClass(accent: (typeof matchupSectionDefinitions)[number]["accent"]) {
  switch (accent) {
    case "amber":
      return "bg-amber-300/80";
    case "cyan":
      return "bg-cyan-300/80";
    case "emerald":
      return "bg-emerald-300/80";
    case "rose":
      return "bg-rose-300/80";
    case "teal":
      return "bg-teal-300/80";
    case "violet":
      return "bg-violet-300/80";
  }
}

function getSectionPanelAccentClass(accent: (typeof matchupSectionDefinitions)[number]["accent"]) {
  switch (accent) {
    case "amber":
      return "shadow-[inset_3px_0_0_rgba(252,211,77,0.28)]";
    case "cyan":
      return "shadow-[inset_3px_0_0_rgba(103,232,249,0.28)]";
    case "emerald":
      return "shadow-[inset_3px_0_0_rgba(110,231,183,0.24)]";
    case "rose":
      return "shadow-[inset_3px_0_0_rgba(253,164,175,0.24)]";
    case "teal":
      return "shadow-[inset_3px_0_0_rgba(45,212,191,0.24)]";
    case "violet":
      return "shadow-[inset_3px_0_0_rgba(167,139,250,0.24)]";
  }
}

function getSectionTitleClass(accent: (typeof matchupSectionDefinitions)[number]["accent"]) {
  switch (accent) {
    case "amber":
      return "text-amber-100";
    case "cyan":
      return "text-cyan-100";
    case "emerald":
      return "text-emerald-100";
    case "rose":
      return "text-rose-100";
    case "teal":
      return "text-teal-100";
    case "violet":
      return "text-violet-100";
  }
}

function getSectionIconClass(accent: (typeof matchupSectionDefinitions)[number]["accent"]) {
  switch (accent) {
    case "amber":
      return "border-amber-300/20 bg-amber-400/10 text-amber-200";
    case "cyan":
      return "border-cyan-300/20 bg-cyan-400/10 text-cyan-200";
    case "emerald":
      return "border-emerald-300/20 bg-emerald-400/10 text-emerald-200";
    case "rose":
      return "border-rose-300/20 bg-rose-400/10 text-rose-200";
    case "teal":
      return "border-teal-300/20 bg-teal-400/10 text-teal-200";
    case "violet":
      return "border-violet-300/20 bg-violet-400/10 text-violet-200";
  }
}
