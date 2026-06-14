import { useEffect, useMemo, useState } from "react";
import { Check, Clipboard, Loader2, Play, RefreshCw, Search, UserPlus, X } from "lucide-react";

import {
  getRecentRiotScanJobs,
  getRiotScanJob,
  resolveRiotIdsToPuuids,
  startRiotScanJob,
} from "@/src/app/admin/league/counter-picks/actions";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import type {
  RiotIdResolverRow,
  RiotScanDiscoveryResult,
  RiotScanJobView,
  RiotScanMode,
  RiotScanTargetResult,
} from "@/src/features/league/riot-scan-jobs";
import { leagueRoles, type LeagueRole } from "@/src/features/league/roles";
import { supabase } from "@/src/lib/supabase";
import { cn } from "@/src/lib/utils";
import { fieldClassName, selectOptionClassName } from "../constants";
import type { AdminLeagueChampion, FormStatus } from "../types";

const maxMatchCount = 50;
const maxDisplayedResults = 100;
const maxRiotIdsPerBatch = 20;

export function RiotMatchScannerPanel({ champions }: { champions: AdminLeagueChampion[] }) {
  const [mode, setMode] = useState<RiotScanMode>("target");
  const [seedText, setSeedText] = useState("");
  const [role, setRole] = useState<LeagueRole>("mid");
  const [matchCount, setMatchCount] = useState("20");
  const [currentPatchOnly, setCurrentPatchOnly] = useState(true);
  const [enemyChampionInput, setEnemyChampionInput] = useState("Ahri");
  const [counterChampionInput, setCounterChampionInput] = useState("Yasuo");
  const [minimumGames, setMinimumGames] = useState("2");
  const [displayLimit, setDisplayLimit] = useState("20");
  const [activeJob, setActiveJob] = useState<RiotScanJobView | null>(null);
  const [recentJobs, setRecentJobs] = useState<RiotScanJobView[]>([]);
  const [formStatus, setFormStatus] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const [jobsStatus, setJobsStatus] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const uniqueSeedPuuids = useMemo(() => parseSeedPuuids(seedText), [seedText]);
  const championOptions = useMemo(
    () =>
      [...champions].sort((left, right) => {
        return left.name.localeCompare(right.name);
      }),
    [champions],
  );

  useEffect(() => {
    void refreshRecentJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeJob || (activeJob.status !== "queued" && activeJob.status !== "running")) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshJob(activeJob.id);
    }, 2500);

    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeJob]);

  async function getAccessToken() {
    if (!supabase) {
      return {
        error: "Supabase is not configured.",
        ok: false as const,
      };
    }

    const { data, error } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;

    if (error || !accessToken) {
      return {
        error: "Admin session is not ready.",
        ok: false as const,
      };
    }

    return {
      accessToken,
      ok: true as const,
    };
  }

  async function refreshRecentJobs() {
    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setJobsStatus({ error: tokenResult.error, isLoading: false, success: null });
      return;
    }

    setJobsStatus({ error: null, isLoading: true, success: null });

    const result = await getRecentRiotScanJobs({
      accessToken: tokenResult.accessToken,
      limit: 10,
    });

    if (!result.ok) {
      setJobsStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    setRecentJobs(result.jobs);
    setJobsStatus({ error: null, isLoading: false, success: null });
  }

  async function refreshJob(jobId: number) {
    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setJobsStatus({ error: tokenResult.error, isLoading: false, success: null });
      return;
    }

    const result = await getRiotScanJob({
      accessToken: tokenResult.accessToken,
      jobId,
    });

    if (!result.ok) {
      setJobsStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    setActiveJob(result.job);
    setRecentJobs((currentJobs) =>
      [result.job, ...currentJobs.filter((job) => job.id !== result.job.id)].slice(0, 10),
    );
  }

  async function handleSubmit() {
    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setFormStatus({ error: tokenResult.error, isLoading: false, success: null });
      return;
    }

    const enemyChampion = resolveChampionId(enemyChampionInput, champions);
    const counterChampion = resolveChampionId(counterChampionInput, champions);
    const parsedMatchCount = Number(matchCount);
    const parsedMinimumGames = Number(minimumGames);
    const parsedDisplayLimit = Number(displayLimit);

    if (uniqueSeedPuuids.length === 0) {
      setFormStatus({ error: "Add at least one Seed PUUID.", isLoading: false, success: null });
      return;
    }

    if (
      !Number.isInteger(parsedMatchCount) ||
      parsedMatchCount < 1 ||
      parsedMatchCount > maxMatchCount
    ) {
      setFormStatus({
        error: `Match count must be between 1 and ${maxMatchCount}.`,
        isLoading: false,
        success: null,
      });
      return;
    }

    if (mode === "target" && (!enemyChampion || !counterChampion)) {
      setFormStatus({
        error: "Select valid enemy and counter champions.",
        isLoading: false,
        success: null,
      });
      return;
    }

    if (mode === "target" && enemyChampion === counterChampion) {
      setFormStatus({
        error: "Enemy and counter champion cannot be the same.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const hasInvalidDiscoveryLimits =
      !Number.isInteger(parsedMinimumGames) ||
      parsedMinimumGames < 1 ||
      !Number.isInteger(parsedDisplayLimit) ||
      parsedDisplayLimit < 1 ||
      parsedDisplayLimit > maxDisplayedResults;

    if (mode === "discovery" && hasInvalidDiscoveryLimits) {
      setFormStatus({
        error: `Discovery limits must be valid numbers. Display limit max is ${maxDisplayedResults}.`,
        isLoading: false,
        success: null,
      });
      return;
    }

    setFormStatus({ error: null, isLoading: true, success: null });

    const result = await startRiotScanJob({
      accessToken: tokenResult.accessToken,
      counterChampion,
      currentPatchOnly,
      enemyChampion,
      matchCount: parsedMatchCount,
      maxDisplayedResults: parsedDisplayLimit,
      minimumGames: parsedMinimumGames,
      mode,
      role,
      seedPuuids: uniqueSeedPuuids,
    });

    if (!result.ok) {
      setFormStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    setActiveJob(result.job);
    setSeedText("");
    setFormStatus({ error: null, isLoading: false, success: "Riot scan job started." });
    await refreshRecentJobs();
  }

  function addPuuidsToScanner(puuids: string[]) {
    const currentPuuids = parseSeedPuuids(seedText);
    const nextPuuids = uniqueStrings([...currentPuuids, ...puuids]);
    const addedCount = nextPuuids.length - currentPuuids.length;

    setSeedText(nextPuuids.join("\n"));
    setFormStatus({
      error: null,
      isLoading: false,
      success:
        addedCount > 0
          ? `${addedCount} ${addedCount === 1 ? "PUUID" : "PUUIDs"} added to scanner.`
          : "Those PUUIDs are already in the scanner.",
    });
  }

  return (
    <div className="space-y-6">
      <RiotIdResolverPanel getAccessToken={getAccessToken} onAddPuuids={addPuuidsToScanner} />

      <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="font-mono text-xl">Riot Match Scanner</CardTitle>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Run focused Riot match scans for Counter Pick stats and discovery.
              </p>
            </div>
            <Button
              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              onClick={() => void refreshRecentJobs()}
              type="button"
              variant="ghost"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Refresh jobs
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/20 p-1">
                <ModeButton active={mode === "target"} onClick={() => setMode("target")}>
                  Target matchup
                </ModeButton>
                <ModeButton active={mode === "discovery"} onClick={() => setMode("discovery")}>
                  Matchup discovery
                </ModeButton>
              </div>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Seed PUUIDs</span>
                <textarea
                  className={`${fieldClassName} min-h-36 py-2 leading-6`}
                  disabled={formStatus.isLoading}
                  onChange={(event) => setSeedText(event.target.value)}
                  placeholder="One PUUID per line"
                  value={seedText}
                />
                <span className="text-xs text-zinc-500">
                  {uniqueSeedPuuids.length} unique seed{" "}
                  {uniqueSeedPuuids.length === 1 ? "PUUID" : "PUUIDs"} parsed
                </span>
              </label>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block space-y-2">
                  <span className="text-sm text-zinc-300">Role</span>
                  <select
                    className={`${fieldClassName} h-10`}
                    disabled={formStatus.isLoading}
                    onChange={(event) => setRole(event.target.value as LeagueRole)}
                    value={role}
                  >
                    {leagueRoles.map((leagueRole) => (
                      <option className={selectOptionClassName} key={leagueRole} value={leagueRole}>
                        {getRoleLabel(leagueRole)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm text-zinc-300">Match count per seed</span>
                  <Input
                    className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                    disabled={formStatus.isLoading}
                    max={maxMatchCount}
                    min={1}
                    onChange={(event) => setMatchCount(event.target.value)}
                    type="number"
                    value={matchCount}
                  />
                </label>

                <label className="flex items-end gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-300">
                  <input
                    checked={currentPatchOnly}
                    className="size-4 accent-cyan-400"
                    disabled={formStatus.isLoading}
                    onChange={(event) => setCurrentPatchOnly(event.target.checked)}
                    type="checkbox"
                  />
                  Current patch only
                </label>
              </div>

              {mode === "target" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <ChampionSearchInput
                    disabled={formStatus.isLoading}
                    label="Enemy champion"
                    onChange={setEnemyChampionInput}
                    options={championOptions}
                    value={enemyChampionInput}
                  />
                  <ChampionSearchInput
                    disabled={formStatus.isLoading}
                    label="Counter champion"
                    onChange={setCounterChampionInput}
                    options={championOptions}
                    value={counterChampionInput}
                  />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm text-zinc-300">Minimum games</span>
                    <Input
                      className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                      disabled={formStatus.isLoading}
                      min={1}
                      onChange={(event) => setMinimumGames(event.target.value)}
                      type="number"
                      value={minimumGames}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm text-zinc-300">Maximum displayed results</span>
                    <Input
                      className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                      disabled={formStatus.isLoading}
                      max={maxDisplayedResults}
                      min={1}
                      onChange={(event) => setDisplayLimit(event.target.value)}
                      type="number"
                      value={displayLimit}
                    />
                  </label>
                </div>
              )}

              <StatusMessage status={formStatus} />

              <Button
                className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
                disabled={formStatus.isLoading}
                onClick={() => void handleSubmit()}
                type="button"
              >
                {formStatus.isLoading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Play className="size-4" aria-hidden="true" />
                )}
                {formStatus.isLoading ? "Starting..." : "Start scan"}
              </Button>
            </div>

            <div className="space-y-4">
              {activeJob ? (
                <RiotScanJobDetails job={activeJob} />
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-400">
                  Start or open a scan job to see progress and results.
                </div>
              )}

              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">Recent scan jobs</h3>
                  {jobsStatus.isLoading ? (
                    <Loader2 className="size-4 animate-spin text-zinc-500" aria-hidden="true" />
                  ) : null}
                </div>
                {jobsStatus.error ? (
                  <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
                    {jobsStatus.error}
                  </p>
                ) : recentJobs.length === 0 ? (
                  <p className="text-sm text-zinc-500">No scan jobs yet.</p>
                ) : (
                  <div className="space-y-2">
                    {recentJobs.map((job) => (
                      <button
                        className="grid w-full gap-2 rounded-md border border-white/10 bg-black/15 p-3 text-left text-sm transition hover:bg-white/[0.06] md:grid-cols-[1fr_auto]"
                        key={job.id}
                        onClick={() => setActiveJob(job)}
                        type="button"
                      >
                        <span>
                          <span className="font-semibold text-white">{getModeLabel(job.mode)}</span>
                          <span className="ml-2 text-zinc-400">
                            {getRoleLabel(job.role)} - {getStatusLabel(job.status)}
                          </span>
                          <span className="mt-1 block text-xs text-zinc-500">
                            Scanned {formatNumber(job.summary.matchesScanned)} -{" "}
                            {formatDateTime(job.created_at)}
                          </span>
                        </span>
                        <span className="text-xs font-semibold text-cyan-200">Open details</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RiotIdResolverPanel({
  getAccessToken,
  onAddPuuids,
}: {
  getAccessToken: () => Promise<
    | {
        accessToken: string;
        ok: true;
      }
    | {
        error: string;
        ok: false;
      }
  >;
  onAddPuuids: (puuids: string[]) => void;
}) {
  const [riotIdText, setRiotIdText] = useState("");
  const [results, setResults] = useState<RiotIdResolverRow[]>([]);
  const [status, setStatus] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const uniqueRiotIds = useMemo(() => parseRiotIdLines(riotIdText), [riotIdText]);
  const successfulResults = results.filter((result) => result.ok);
  const failedResults = results.filter((result) => !result.ok);
  const successfulPuuids = successfulResults.map((result) => result.puuid);

  async function handleResolve() {
    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setStatus({ error: tokenResult.error, isLoading: false, success: null });
      return;
    }

    if (uniqueRiotIds.length === 0) {
      setStatus({ error: "Add at least one Riot ID.", isLoading: false, success: null });
      return;
    }

    if (uniqueRiotIds.length > maxRiotIdsPerBatch) {
      setStatus({
        error: `Resolve up to ${maxRiotIdsPerBatch} Riot IDs at a time.`,
        isLoading: false,
        success: null,
      });
      return;
    }

    setCopyStatus(null);
    setStatus({ error: null, isLoading: true, success: null });

    const result = await resolveRiotIdsToPuuids({
      accessToken: tokenResult.accessToken,
      riotIds: uniqueRiotIds,
    });

    if (!result.ok) {
      setStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    setResults(result.results);
    setStatus({
      error: null,
      isLoading: false,
      success: `${result.successCount} resolved, ${result.failedCount} failed.`,
    });
  }

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(label);
    } catch {
      setCopyStatus("Copy failed.");
    }
  }

  function addResultToScanner(result: RiotIdResolverRow) {
    if (!result.ok) {
      return;
    }

    onAddPuuids([result.puuid]);
  }

  function addAllToScanner() {
    onAddPuuids(successfulPuuids);
  }

  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <CardTitle className="font-mono text-xl">Riot ID → PUUID Resolver</CardTitle>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Resolve Riot IDs into seed PUUIDs before starting a scan.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Riot IDs</span>
              <textarea
                className={`${fieldClassName} min-h-32 py-2 leading-6`}
                disabled={status.isLoading}
                onChange={(event) => setRiotIdText(event.target.value)}
                placeholder="Arkura#EUW&#10;AnotherPlayer#EUW&#10;Mid Main#1234"
                value={riotIdText}
              />
              <span className="text-xs text-zinc-500">
                {uniqueRiotIds.length} unique Riot {uniqueRiotIds.length === 1 ? "ID" : "IDs"}{" "}
                detected
              </span>
            </label>

            <div className="flex flex-wrap gap-2">
              <Button
                className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
                disabled={status.isLoading}
                onClick={() => void handleResolve()}
                type="button"
              >
                {status.isLoading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Search className="size-4" aria-hidden="true" />
                )}
                {status.isLoading ? "Resolving..." : "Resolve players"}
              </Button>
              <Button
                className="h-10 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                disabled={status.isLoading && results.length === 0}
                onClick={() => {
                  setCopyStatus(null);
                  setResults([]);
                  setStatus({ error: null, isLoading: false, success: null });
                }}
                type="button"
                variant="ghost"
              >
                <X className="size-4" aria-hidden="true" />
                Clear results
              </Button>
            </div>

            <StatusMessage status={status} />
            {copyStatus ? (
              <p className="rounded-md border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
                {copyStatus}
              </p>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <ResolverStat label="Unique" value={uniqueRiotIds.length} />
              <ResolverStat label="Resolved" value={successfulResults.length} />
              <ResolverStat label="Failed" value={failedResults.length} />
            </div>

            {successfulPuuids.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                  onClick={() =>
                    void copyText(successfulPuuids.join("\n"), "All valid PUUIDs copied.")
                  }
                  type="button"
                  variant="ghost"
                >
                  <Clipboard className="size-4" aria-hidden="true" />
                  Copy all PUUIDs
                </Button>
                <Button
                  className="border-cyan-300/20 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20"
                  onClick={addAllToScanner}
                  type="button"
                  variant="ghost"
                >
                  <UserPlus className="size-4" aria-hidden="true" />
                  Add all valid players to scanner
                </Button>
              </div>
            ) : null}

            {results.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-500">
                Resolved players will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result) => (
                  <ResolverResultRow
                    key={result.originalRiotId}
                    onAddToScanner={addResultToScanner}
                    onCopy={(value) => void copyText(value, "PUUID copied.")}
                    result={result}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResolverStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/15 p-3">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

function ResolverResultRow({
  onAddToScanner,
  onCopy,
  result,
}: {
  onAddToScanner: (result: RiotIdResolverRow) => void;
  onCopy: (value: string) => void;
  result: RiotIdResolverRow;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        result.ok ? "border-emerald-300/20 bg-emerald-500/10" : "border-rose-300/20 bg-rose-500/10",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{result.riotId}</p>
          {result.ok ? (
            <>
              <p className="mt-1 text-xs text-zinc-400">
                {result.gameName}#{result.tagLine}
              </p>
              <p className="mt-2 break-all font-mono text-xs text-cyan-100">{result.puuid}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-rose-100">{result.error}</p>
          )}
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold",
            result.ok
              ? "border-emerald-300/20 text-emerald-100"
              : "border-rose-300/20 text-rose-100",
          )}
        >
          {result.ok ? (
            <Check className="size-3" aria-hidden="true" />
          ) : (
            <X className="size-3" aria-hidden="true" />
          )}
          {result.ok ? "Success" : "Error"}
        </span>
      </div>

      {result.ok ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            onClick={() => onCopy(result.puuid)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Clipboard className="size-3.5" aria-hidden="true" />
            Copy PUUID
          </Button>
          <Button
            className="border-cyan-300/20 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20"
            onClick={() => onAddToScanner(result)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <UserPlus className="size-3.5" aria-hidden="true" />
            Add to scanner
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-md px-3 py-2 text-sm font-semibold transition",
        active ? "bg-cyan-500/20 text-cyan-100" : "text-zinc-400 hover:bg-white/5 hover:text-white",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ChampionSearchInput({
  disabled,
  label,
  onChange,
  options,
  value,
}: {
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  options: AdminLeagueChampion[];
  value: string;
}) {
  const listId = `riot-scanner-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label className="block space-y-2">
      <span className="text-sm text-zinc-300">{label}</span>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        />
        <Input
          className="h-10 border-white/10 bg-white/5 pl-9 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={disabled}
          list={listId}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search champion..."
          value={value}
        />
      </div>
      <datalist id={listId}>
        {options.map((champion) => (
          <option key={champion.id} value={champion.name}>
            {champion.id}
          </option>
        ))}
      </datalist>
    </label>
  );
}

function RiotScanJobDetails({ job }: { job: RiotScanJobView }) {
  const result = job.results;
  const targetResult = !Array.isArray(result) ? result : null;
  const discoveryResults = Array.isArray(result) ? result : [];

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Job #{job.id}</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {getModeLabel(job.mode)} - {getRoleLabel(job.role)} - {job.seed_count} seed{" "}
            {job.seed_count === 1 ? "PUUID" : "PUUIDs"}
          </p>
        </div>
        <span
          className={cn(
            "rounded-md border px-2 py-1 text-xs font-semibold",
            job.status === "completed"
              ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"
              : job.status === "failed"
                ? "border-rose-300/20 bg-rose-500/10 text-rose-100"
                : "border-cyan-300/20 bg-cyan-500/10 text-cyan-100",
          )}
        >
          {getStatusLabel(job.status)}
        </span>
      </div>

      {job.error_message ? (
        <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
          {job.error_message}
        </p>
      ) : null}

      <div className="grid gap-2 text-xs text-zinc-400 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Fetched match IDs" value={job.progress.fetchedMatchIds} />
        <Metric label="Unique match IDs" value={job.progress.uniqueMatchIds} />
        <Metric label="Scanned matches" value={job.progress.matchesScanned} />
        <Metric label="Patch skipped" value={job.progress.patchSkipped} />
        <Metric label="Queue skipped" value={job.progress.queueSkipped} />
        <Metric label="Role skipped" value={job.progress.roleSkipped} />
        <Metric label="Champion pair matched" value={job.progress.championPairMatched} />
        <Metric label="Matchup pairs discovered" value={job.progress.matchupPairsDiscovered} />
        <Metric label="Observations found" value={job.progress.observationsFound} />
        <Metric label="New observations saved" value={job.progress.observationsInserted} />
        <Metric
          label="Duplicate observations skipped"
          value={job.progress.observationDuplicatesSkipped}
        />
        <Metric
          label="Observation insert failures"
          value={job.progress.observationInsertFailures}
        />
        <Metric label="Counter pick stat rows updated" value={job.progress.statsRowsUpdated} />
        <Metric label="Started" value={formatDateTime(job.started_at)} />
        <Metric label="Completed" value={formatDateTime(job.completed_at)} />
      </div>

      {targetResult ? <TargetResult result={targetResult as RiotScanTargetResult} /> : null}
      {discoveryResults.length > 0 ? (
        <DiscoveryResultTable results={discoveryResults as RiotScanDiscoveryResult[]} />
      ) : null}
    </div>
  );
}

function TargetResult({ result }: { result: RiotScanTargetResult }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/15 p-3">
      <h4 className="text-sm font-semibold text-white">Target scan result</h4>
      <div className="mt-3 grid gap-2 text-xs text-zinc-400 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Enemy champion" value={result.enemyChampion} />
        <Metric label="Counter champion" value={result.counterChampion} />
        <Metric label="Role" value={getRoleLabel(result.role)} />
        <Metric label="Games" value={result.games} />
        <Metric label="Wins" value={result.wins} />
        <Metric label="Losses" value={result.losses} />
        <Metric label="Win rate" value={`${result.winRate}%`} />
        <Metric label="Tier" value={result.tier} />
        <Metric label="Written to stats" value={result.wasWrittenToStats ? "Yes" : "No"} />
        <Metric label="Total stored games" value={result.storedGamesAfterAggregation} />
      </div>
    </div>
  );
}

function DiscoveryResultTable({ results }: { results: RiotScanDiscoveryResult[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-white/10 bg-black/15">
      <div className="grid grid-cols-[1.1fr_1.1fr_0.55fr_0.6fr_0.75fr_0.75fr_0.8fr] gap-3 border-b border-white/10 px-3 py-2 text-xs font-semibold text-zinc-400">
        <span>Champion A</span>
        <span>Champion B</span>
        <span>Role</span>
        <span>Games</span>
        <span>A wins</span>
        <span>B wins</span>
        <span>Stored stats</span>
      </div>
      <div className="max-h-72 overflow-auto">
        {results.map((result) => (
          <div
            className="grid grid-cols-[1.1fr_1.1fr_0.55fr_0.6fr_0.75fr_0.75fr_0.8fr] gap-3 border-b border-white/5 px-3 py-2 text-xs text-zinc-300 last:border-b-0"
            key={`${result.championA}-${result.championB}-${result.role}`}
          >
            <span className="font-semibold text-white">{result.championA}</span>
            <span className="font-semibold text-white">{result.championB}</span>
            <span>{getRoleLabel(result.role)}</span>
            <span>{result.games}</span>
            <span>
              {result.championAWins} - {result.championAWinRate}%
            </span>
            <span>
              {result.championBWins} - {result.championBWinRate}%
            </span>
            <span>{result.representedInStats ? "Yes" : "Pending"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string | null | undefined }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/15 p-2">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-100">
        {typeof value === "number" ? formatNumber(value) : (value ?? "Pending")}
      </p>
    </div>
  );
}

function StatusMessage({ status }: { status: FormStatus }) {
  if (status.error) {
    return (
      <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
        {status.error}
      </p>
    );
  }

  if (status.success) {
    return (
      <p className="rounded-md border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
        {status.success}
      </p>
    );
  }

  return null;
}

function parseSeedPuuids(value: string) {
  return uniqueStrings(value.split(/\r?\n/));
}

function parseRiotIdLines(value: string) {
  return uniqueStrings(value.split(/\r?\n/));
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function resolveChampionId(value: string, champions: AdminLeagueChampion[]) {
  const normalizedValue = normalizeChampionSearchValue(value);

  return (
    champions.find(
      (champion) =>
        normalizeChampionSearchValue(champion.id) === normalizedValue ||
        normalizeChampionSearchValue(champion.name) === normalizedValue,
    )?.id ?? ""
  );
}

function normalizeChampionSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function getModeLabel(mode: RiotScanMode) {
  return mode === "target" ? "Target matchup" : "Matchup discovery";
}

function getStatusLabel(status: RiotScanJobView["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getRoleLabel(role: LeagueRole) {
  return role === "adc" ? "ADC" : role.charAt(0).toUpperCase() + role.slice(1);
}

function formatNumber(value: number | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "Pending";
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
