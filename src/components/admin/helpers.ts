export function isMissingLeagueMatchupsTableError(
  error: { code?: string; message?: string } | null,
) {
  return (
    error?.code === "PGRST205" ||
    Boolean(error?.message?.includes("league_matchups") && error.message.includes("schema cache"))
  );
}

export function isMissingLeagueCounterPicksTableError(
  error: { code?: string; message?: string } | null,
) {
  return (
    error?.code === "PGRST205" ||
    Boolean(
      error?.message?.includes("league_counter_picks") && error.message.includes("schema cache"),
    )
  );
}

export function isMissingLeagueFeedbackTableError(
  error: { code?: string; message?: string } | null,
) {
  return (
    error?.code === "PGRST205" ||
    Boolean(error?.message?.includes("matchup_feedback") && error.message.includes("schema cache"))
  );
}
