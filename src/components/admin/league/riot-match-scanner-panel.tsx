import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clipboard, Loader2, Play, RefreshCw, Search, UserPlus, X } from "lucide-react";

import {
  getLeagueChampionRegistryAdminStatus,
  getRecentRiotScanJobs,
  getRiotSeedCandidates,
  getRiotScanJob,
  resolveRiotIdsToPuuids,
  startRiotScanJob,
  type LeagueChampionRegistryAdminStatusResult,
} from "@/src/app/admin/league/counter-picks/actions";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import type {
  RiotIdResolverRow,
  RiotSeedCandidateFilters,
  RiotSeedCandidateSort,
  RiotSeedCandidateSource,
  RiotSeedCandidateStatus,
  RiotSeedCandidateTopChampion,
  RiotSeedCandidateView,
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
const maxSeedCandidatesPerScan = 20;
const recentSeedCandidateScanHours = 24;
const seedCandidateStatuses: Array<RiotSeedCandidateStatus | "all"> = [
  "all",
  "candidate",
  "approved",
  "queued",
  "active",
  "cooldown",
  "ignored",
  "failed",
];
const seedCandidateSources: Array<RiotSeedCandidateSource | "all"> = [
  "all",
  "match_discovery",
  "riot_id_resolver",
  "manual",
  "ladder_import",
];
const seedCandidateSorts: Array<{
  label: string;
  value: RiotSeedCandidateSort;
}> = [
  { label: "Observed games", value: "observed_games" },
  { label: "Last seen", value: "last_seen_at" },
  { label: "Last scanned", value: "last_scanned_at" },
  { label: "Primary role share", value: "primary_role_share" },
  { label: "Primary champion share", value: "primary_champion_share" },
  { label: "Created", value: "created_at" },
];
const seedCandidateLastScannedFilters: Array<{
  label: string;
  value: NonNullable<RiotSeedCandidateFilters["lastScanned"]>;
}> = [
  { label: "All", value: "all" },
  { label: "Never scanned", value: "never" },
  { label: "Scanned within 24h", value: "recent" },
  { label: "Not scanned within 24h", value: "older" },
];
type LeagueChampionRegistryStatus = Extract<
  LeagueChampionRegistryAdminStatusResult,
  { ok: true }
>["status"];

export function RiotMatchScannerPanel({ champions }: { champions: AdminLeagueChampion[] }) {
  const scannerCardRef = useRef<HTMLDivElement | null>(null);
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
  const championDisplayNamesById = useMemo(
    () => new Map(champions.map((champion) => [champion.id, champion.name] as const)),
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

    if (uniqueSeedPuuids.length > maxSeedCandidatesPerScan) {
      setFormStatus({
        error: `You selected ${uniqueSeedPuuids.length} seed candidates. The maximum per scan job is ${maxSeedCandidatesPerScan}.`,
        isLoading: false,
        success: null,
      });
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
      discoveryFocusChampion: null,
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
    return addedCount;
  }

  function focusScanner() {
    scannerCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleSelectedScanStarted(job: RiotScanJobView) {
    setActiveJob(job);
    setRecentJobs((currentJobs) => [job, ...currentJobs.filter((item) => item.id !== job.id)]);
    void refreshRecentJobs();
  }

  return (
    <div className="space-y-6">
      <LeagueChampionRegistryStatusPanel getAccessToken={getAccessToken} />
      <RiotIdResolverPanel getAccessToken={getAccessToken} onAddPuuids={addPuuidsToScanner} />
      <RiotSeedCandidatesPanel
        champions={championOptions}
        championDisplayNamesById={championDisplayNamesById}
        getAccessToken={getAccessToken}
        onAddPuuids={addPuuidsToScanner}
        onFocusScanner={focusScanner}
        onScanStarted={handleSelectedScanStarted}
      />

      <Card
        className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15"
        ref={scannerCardRef}
      >
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

function LeagueChampionRegistryStatusPanel({
  getAccessToken,
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
}) {
  const [registryStatus, setRegistryStatus] = useState<LeagueChampionRegistryStatus | null>(null);
  const [status, setStatus] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });

  useEffect(() => {
    void loadRegistryStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRegistryStatus() {
    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setStatus({ error: tokenResult.error, isLoading: false, success: null });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const result = await getLeagueChampionRegistryAdminStatus({
      accessToken: tokenResult.accessToken,
    });

    if (!result.ok) {
      setStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    setRegistryStatus(result.status);
    setStatus({ error: null, isLoading: false, success: null });
  }

  const issueCount =
    (registryStatus?.missingCount ?? 0) +
    (registryStatus?.unknownCount ?? 0) +
    (registryStatus?.conflictCount ?? 0) +
    (registryStatus?.inactiveReturnedByRiotCount ?? 0) +
    (registryStatus?.nameMismatchCount ?? 0);

  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="font-mono text-xl">League Champion Registry</CardTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              Read-only health check for the canonical Data Dragon champion registry.
            </p>
          </div>
          <Button
            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            disabled={status.isLoading}
            onClick={() => void loadRegistryStatus()}
            type="button"
            variant="ghost"
          >
            {status.isLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="size-4" aria-hidden="true" />
            )}
            Refresh registry
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatusMessage status={status} />

        {registryStatus ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric
                label="Registry"
                value={registryStatus.registryOk ? "Healthy" : "Needs sync"}
              />
              <Metric label="Patch" value={registryStatus.sourceVersion} />
              <Metric label="Source champions" value={registryStatus.sourceChampionCount} />
              <Metric label="Active champions" value={registryStatus.activeDatabaseChampionCount} />
              <Metric label="Database rows" value={registryStatus.databaseChampionCount} />
              <Metric label="Missing" value={registryStatus.missingCount} />
              <Metric label="Unknown active" value={registryStatus.unknownCount} />
              <Metric label="Last sync" value={formatDateTime(registryStatus.lastSyncedAt)} />
            </div>

            <div
              className={cn(
                "rounded-lg border p-4 text-sm",
                registryStatus.registryOk
                  ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"
                  : "border-amber-300/20 bg-amber-500/10 text-amber-100",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-semibold">
                  {registryStatus.registryOk
                    ? "Registry matches Riot Data Dragon."
                    : `${issueCount} registry ${issueCount === 1 ? "issue" : "issues"} detected.`}
                </span>
                <span className="text-xs">
                  Sync status: {formatEnumLabel(registryStatus.lastSyncStatus)}
                </span>
              </div>
              {registryStatus.lastSyncError ? (
                <p className="mt-2 text-xs">{registryStatus.lastSyncError}</p>
              ) : null}
            </div>

            {!registryStatus.registryOk ? (
              <div className="grid gap-3 lg:grid-cols-2">
                <RegistryIssueList label="Missing champions" values={registryStatus.missing} />
                <RegistryIssueList
                  label="Unknown active champions"
                  values={registryStatus.unknown}
                />
                <RegistryIssueList label="Conflicts" values={registryStatus.conflicts} />
                <RegistryIssueList label="Name mismatches" values={registryStatus.nameMismatches} />
                <RegistryIssueList
                  label="Inactive but returned by Riot"
                  values={registryStatus.inactiveReturnedByRiot}
                />
              </div>
            ) : null}
          </>
        ) : status.isLoading ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-500">
            Checking registry status...
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function RegistryIssueList({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/15 p-3">
      <h3 className="text-sm font-semibold text-white">{label}</h3>
      <ul className="mt-2 space-y-1 text-xs text-zinc-400">
        {values.map((value) => (
          <li className="break-words" key={value}>
            {value}
          </li>
        ))}
      </ul>
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
        <CardTitle className="font-mono text-xl">Riot ID to PUUID Resolver</CardTitle>
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

function RiotSeedCandidatesPanel({
  champions,
  championDisplayNamesById,
  getAccessToken,
  onAddPuuids,
  onFocusScanner,
  onScanStarted,
}: {
  champions: AdminLeagueChampion[];
  championDisplayNamesById: Map<string, string>;
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
  onAddPuuids: (puuids: string[]) => number;
  onFocusScanner: () => void;
  onScanStarted: (job: RiotScanJobView) => void;
}) {
  const [candidates, setCandidates] = useState<RiotSeedCandidateView[]>([]);
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);
  const [platformRegion, setPlatformRegion] = useState("EUW1");
  const [statusFilter, setStatusFilter] = useState<RiotSeedCandidateStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<RiotSeedCandidateSource | "all">("all");
  const [primaryRoleFilter, setPrimaryRoleFilter] = useState<LeagueRole | "all">("all");
  const [primaryChampionFilter, setPrimaryChampionFilter] = useState("");
  const [minimumObservedGames, setMinimumObservedGames] = useState("");
  const [minimumPrimaryRoleShare, setMinimumPrimaryRoleShare] = useState("");
  const [minimumPrimaryChampionShare, setMinimumPrimaryChampionShare] = useState("");
  const [lastScannedFilter, setLastScannedFilter] =
    useState<NonNullable<RiotSeedCandidateFilters["lastScanned"]>>("all");
  const [sort, setSort] = useState<RiotSeedCandidateSort>("observed_games");
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(() => new Set());
  const [showScanPanel, setShowScanPanel] = useState(false);
  const [bulkMode, setBulkMode] = useState<RiotScanMode>("discovery");
  const [bulkRole, setBulkRole] = useState<LeagueRole>("mid");
  const [bulkMatchCount, setBulkMatchCount] = useState("20");
  const [bulkCurrentPatchOnly, setBulkCurrentPatchOnly] = useState(true);
  const [bulkMinimumGames, setBulkMinimumGames] = useState("2");
  const [bulkDisplayLimit, setBulkDisplayLimit] = useState("20");
  const [bulkDiscoveryFocusChampion, setBulkDiscoveryFocusChampion] = useState("");
  const [bulkEnemyChampionInput, setBulkEnemyChampionInput] = useState("Ahri");
  const [bulkCounterChampionInput, setBulkCounterChampionInput] = useState("Yasuo");
  const [status, setStatus] = useState<FormStatus>({
    error: null,
    isLoading: false,
    success: null,
  });
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const selectedCandidates = useMemo(
    () => candidates.filter((candidate) => selectedCandidateIds.has(candidate.id)),
    [candidates, selectedCandidateIds],
  );
  const selectedRecentScanCount = selectedCandidates.filter((candidate) =>
    wasCandidateScannedRecently(candidate.last_scanned_at),
  ).length;
  const allVisibleSelected =
    candidates.length > 0 &&
    candidates.every((candidate) => selectedCandidateIds.has(candidate.id));

  useEffect(() => {
    void loadCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCandidates() {
    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setStatus({ error: tokenResult.error, isLoading: false, success: null });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const parsedMinimumGames = Number(minimumObservedGames);
    const parsedMinimumPrimaryRoleShare = Number(minimumPrimaryRoleShare);
    const parsedMinimumPrimaryChampionShare = Number(minimumPrimaryChampionShare);
    const filters: RiotSeedCandidateFilters = {
      lastScanned: lastScannedFilter,
      platformRegion,
      primaryChampion: primaryChampionFilter,
      primaryRole: primaryRoleFilter,
      source: sourceFilter,
      status: statusFilter,
    };

    if (Number.isInteger(parsedMinimumGames) && parsedMinimumGames > 0) {
      filters.minObservedGames = parsedMinimumGames;
    }

    if (Number.isFinite(parsedMinimumPrimaryRoleShare) && parsedMinimumPrimaryRoleShare > 0) {
      filters.minPrimaryRoleShare = parsedMinimumPrimaryRoleShare;
    }

    if (
      Number.isFinite(parsedMinimumPrimaryChampionShare) &&
      parsedMinimumPrimaryChampionShare > 0
    ) {
      filters.minPrimaryChampionShare = parsedMinimumPrimaryChampionShare;
    }

    const result = await getRiotSeedCandidates({
      accessToken: tokenResult.accessToken,
      filters,
      limit: 50,
      sort,
    });

    if (!result.ok) {
      setStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    setCandidates(result.candidates);
    setSelectedCandidateIds((currentSelection) => {
      const visibleCandidateIds = new Set(result.candidates.map((candidate) => candidate.id));

      return new Set(
        [...currentSelection].filter((candidateId) => visibleCandidateIds.has(candidateId)),
      );
    });
    setStatus({
      error: null,
      isLoading: false,
      success: `${result.candidates.length} seed ${result.candidates.length === 1 ? "candidate" : "candidates"} loaded.`,
    });
  }

  async function copyPuuid(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus("PUUID copied.");
    } catch {
      setCopyStatus("Copy failed.");
    }
  }

  function toggleCandidateSelection(candidateId: string) {
    setSelectedCandidateIds((currentSelection) => {
      const nextSelection = new Set(currentSelection);

      if (nextSelection.has(candidateId)) {
        nextSelection.delete(candidateId);
      } else {
        nextSelection.add(candidateId);
      }

      return nextSelection;
    });
  }

  function selectAllVisibleCandidates() {
    setSelectedCandidateIds(new Set(candidates.map((candidate) => candidate.id)));
    setStatus({
      error: null,
      isLoading: false,
      success: `${candidates.length} visible ${candidates.length === 1 ? "candidate" : "candidates"} selected.`,
    });
  }

  function clearSelectedCandidates() {
    setSelectedCandidateIds(new Set());
    setShowScanPanel(false);
    setStatus({ error: null, isLoading: false, success: "Selection cleared." });
  }

  function addSelectedToScanner() {
    if (selectedCandidates.length === 0) {
      setStatus({ error: "No candidates selected.", isLoading: false, success: null });
      return;
    }

    const addedCount = onAddPuuids(selectedCandidates.map((candidate) => candidate.puuid));

    onFocusScanner();
    setStatus({
      error: null,
      isLoading: false,
      success:
        addedCount > 0
          ? `${addedCount} seed ${addedCount === 1 ? "candidate" : "candidates"} added to the scanner.`
          : "Selected candidates were already in the scanner.",
    });
  }

  async function scanSelectedCandidates() {
    if (selectedCandidates.length === 0) {
      setStatus({ error: "No candidates selected.", isLoading: false, success: null });
      return;
    }

    if (selectedCandidates.length > maxSeedCandidatesPerScan) {
      setStatus({
        error: `You selected ${selectedCandidates.length} candidates. The maximum per scan job is ${maxSeedCandidatesPerScan}.`,
        isLoading: false,
        success: null,
      });
      return;
    }

    const tokenResult = await getAccessToken();

    if (!tokenResult.ok) {
      setStatus({ error: tokenResult.error, isLoading: false, success: null });
      return;
    }

    const parsedMatchCount = Number(bulkMatchCount);
    const parsedMinimumGames = Number(bulkMinimumGames);
    const parsedDisplayLimit = Number(bulkDisplayLimit);
    const enemyChampion = resolveChampionId(bulkEnemyChampionInput, champions);
    const counterChampion = resolveChampionId(bulkCounterChampionInput, champions);
    const discoveryFocusChampion = bulkDiscoveryFocusChampion.trim()
      ? resolveChampionId(bulkDiscoveryFocusChampion, champions)
      : null;

    if (
      !Number.isInteger(parsedMatchCount) ||
      parsedMatchCount < 1 ||
      parsedMatchCount > maxMatchCount
    ) {
      setStatus({
        error: `Match count must be between 1 and ${maxMatchCount}.`,
        isLoading: false,
        success: null,
      });
      return;
    }

    if (bulkMode === "target" && (!enemyChampion || !counterChampion)) {
      setStatus({
        error: "Select valid target champions.",
        isLoading: false,
        success: null,
      });
      return;
    }

    if (bulkMode === "target" && enemyChampion === counterChampion) {
      setStatus({
        error: "Enemy and counter champion cannot be the same.",
        isLoading: false,
        success: null,
      });
      return;
    }

    if (bulkMode === "discovery" && bulkDiscoveryFocusChampion.trim() && !discoveryFocusChampion) {
      setStatus({
        error: "Select a valid discovery focus champion.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const result = await startRiotScanJob({
      accessToken: tokenResult.accessToken,
      counterChampion,
      currentPatchOnly: bulkCurrentPatchOnly,
      discoveryFocusChampion,
      enemyChampion,
      matchCount: parsedMatchCount,
      maxDisplayedResults:
        bulkMode === "discovery" && Number.isInteger(parsedDisplayLimit) ? parsedDisplayLimit : 20,
      minimumGames:
        bulkMode === "discovery" && Number.isInteger(parsedMinimumGames) ? parsedMinimumGames : 1,
      mode: bulkMode,
      role: bulkRole,
      seedPuuids: selectedCandidates.map((candidate) => candidate.puuid),
    });

    if (!result.ok) {
      setStatus({ error: result.error, isLoading: false, success: null });
      return;
    }

    onScanStarted(result.job);
    setStatus({
      error: null,
      isLoading: false,
      success: `${selectedCandidates.length} selected seed ${selectedCandidates.length === 1 ? "candidate" : "candidates"} sent to the scanner.`,
    });
    setShowScanPanel(false);
    setSelectedCandidateIds(new Set());
    await loadCandidates();
  }

  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="font-mono text-xl">Riot Seed Candidates</CardTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              Read-only candidate pool built from resolved Riot IDs and processed Riot matches.
            </p>
          </div>
          <Button
            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            disabled={status.isLoading}
            onClick={() => void loadCandidates()}
            type="button"
            variant="ghost"
          >
            {status.isLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="size-4" aria-hidden="true" />
            )}
            Refresh candidates
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Platform</span>
            <Input
              className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
              onChange={(event) => setPlatformRegion(event.target.value)}
              value={platformRegion}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Status</span>
            <select
              className={`${fieldClassName} h-10`}
              onChange={(event) =>
                setStatusFilter(event.target.value as RiotSeedCandidateStatus | "all")
              }
              value={statusFilter}
            >
              {seedCandidateStatuses.map((candidateStatus) => (
                <option
                  className={selectOptionClassName}
                  key={candidateStatus}
                  value={candidateStatus}
                >
                  {formatEnumLabel(candidateStatus)}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Source</span>
            <select
              className={`${fieldClassName} h-10`}
              onChange={(event) =>
                setSourceFilter(event.target.value as RiotSeedCandidateSource | "all")
              }
              value={sourceFilter}
            >
              {seedCandidateSources.map((source) => (
                <option className={selectOptionClassName} key={source} value={source}>
                  {formatEnumLabel(source)}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Primary role</span>
            <select
              className={`${fieldClassName} h-10`}
              onChange={(event) => setPrimaryRoleFilter(event.target.value as LeagueRole | "all")}
              value={primaryRoleFilter}
            >
              <option className={selectOptionClassName} value="all">
                All
              </option>
              {leagueRoles.map((leagueRole) => (
                <option className={selectOptionClassName} key={leagueRole} value={leagueRole}>
                  {getRoleLabel(leagueRole)}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Champion</span>
            <Input
              className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
              onChange={(event) => setPrimaryChampionFilter(event.target.value)}
              placeholder="Ahri"
              value={primaryChampionFilter}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Min games</span>
            <Input
              className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
              min={0}
              onChange={(event) => setMinimumObservedGames(event.target.value)}
              type="number"
              value={minimumObservedGames}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Min role %</span>
            <Input
              className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
              min={0}
              onChange={(event) => setMinimumPrimaryRoleShare(event.target.value)}
              type="number"
              value={minimumPrimaryRoleShare}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Min champion %</span>
            <Input
              className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
              min={0}
              onChange={(event) => setMinimumPrimaryChampionShare(event.target.value)}
              type="number"
              value={minimumPrimaryChampionShare}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Last scanned</span>
            <select
              className={`${fieldClassName} h-10`}
              onChange={(event) =>
                setLastScannedFilter(
                  event.target.value as NonNullable<RiotSeedCandidateFilters["lastScanned"]>,
                )
              }
              value={lastScannedFilter}
            >
              {seedCandidateLastScannedFilters.map((filter) => (
                <option className={selectOptionClassName} key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <label className="block w-full space-y-2 sm:w-64">
            <span className="text-sm text-zinc-300">Sort</span>
            <select
              className={`${fieldClassName} h-10`}
              onChange={(event) => setSort(event.target.value as RiotSeedCandidateSort)}
              value={sort}
            >
              {seedCandidateSorts.map((candidateSort) => (
                <option
                  className={selectOptionClassName}
                  key={candidateSort.value}
                  value={candidateSort.value}
                >
                  {candidateSort.label}
                </option>
              ))}
            </select>
          </label>

          <Button
            className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
            disabled={status.isLoading}
            onClick={() => void loadCandidates()}
            type="button"
          >
            {status.isLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Search className="size-4" aria-hidden="true" />
            )}
            Apply filters
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
          <div>
            <p className="text-sm font-semibold text-zinc-100">
              {selectedCandidates.length}{" "}
              {selectedCandidates.length === 1 ? "candidate" : "candidates"} selected
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Select all applies to visible results only.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              disabled={candidates.length === 0 || allVisibleSelected}
              onClick={selectAllVisibleCandidates}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Check className="size-3.5" aria-hidden="true" />
              Select all visible
            </Button>
            <Button
              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              disabled={selectedCandidates.length === 0}
              onClick={clearSelectedCandidates}
              size="sm"
              type="button"
              variant="ghost"
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear selection
            </Button>
            <Button
              className="border-cyan-300/20 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20"
              disabled={selectedCandidates.length === 0}
              onClick={addSelectedToScanner}
              size="sm"
              type="button"
              variant="ghost"
            >
              <UserPlus className="size-3.5" aria-hidden="true" />
              Add selected to scanner
            </Button>
            <Button
              className="bg-violet-500/80 text-white hover:bg-violet-500"
              disabled={selectedCandidates.length === 0}
              onClick={() => setShowScanPanel((current) => !current)}
              size="sm"
              type="button"
            >
              <Play className="size-3.5" aria-hidden="true" />
              Scan selected
            </Button>
          </div>
        </div>

        {selectedCandidates.length > maxSeedCandidatesPerScan ? (
          <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
            You selected {selectedCandidates.length} candidates. The maximum per scan job is{" "}
            {maxSeedCandidatesPerScan}.
          </p>
        ) : null}

        {selectedRecentScanCount > 0 ? (
          <p className="rounded-md border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">
            {selectedRecentScanCount} selected{" "}
            {selectedRecentScanCount === 1 ? "candidate was" : "candidates were"} scanned within the
            last {recentSeedCandidateScanHours} hours.
          </p>
        ) : null}

        {selectedCandidates.length > 0 && selectedRecentScanCount === selectedCandidates.length ? (
          <p className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-400">
            All visible selected candidates were scanned recently.
          </p>
        ) : null}

        {showScanPanel ? (
          <div className="space-y-4 rounded-lg border border-violet-300/20 bg-violet-500/10 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-violet-100">Scan selected</h4>
                <p className="mt-1 text-xs text-zinc-400">
                  {selectedCandidates.length} selected seed{" "}
                  {selectedCandidates.length === 1 ? "candidate" : "candidates"}
                </p>
              </div>
              <Button
                className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                onClick={() => setShowScanPanel(false)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <X className="size-3.5" aria-hidden="true" />
                Close
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Mode</span>
                <select
                  className={`${fieldClassName} h-10`}
                  onChange={(event) => setBulkMode(event.target.value as RiotScanMode)}
                  value={bulkMode}
                >
                  <option className={selectOptionClassName} value="discovery">
                    Matchup discovery
                  </option>
                  <option className={selectOptionClassName} value="target">
                    Target matchup
                  </option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Role</span>
                <select
                  className={`${fieldClassName} h-10`}
                  onChange={(event) => setBulkRole(event.target.value as LeagueRole)}
                  value={bulkRole}
                >
                  {leagueRoles.map((leagueRole) => (
                    <option className={selectOptionClassName} key={leagueRole} value={leagueRole}>
                      {getRoleLabel(leagueRole)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Matches per seed</span>
                <Input
                  className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                  max={maxMatchCount}
                  min={1}
                  onChange={(event) => setBulkMatchCount(event.target.value)}
                  type="number"
                  value={bulkMatchCount}
                />
              </label>

              <label className="flex items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3 py-2">
                <input
                  checked={bulkCurrentPatchOnly}
                  className="size-4 accent-cyan-400"
                  onChange={(event) => setBulkCurrentPatchOnly(event.target.checked)}
                  type="checkbox"
                />
                <span className="text-sm text-zinc-300">Current patch only</span>
              </label>
            </div>

            {bulkMode === "discovery" ? (
              <div className="grid gap-4 md:grid-cols-3">
                <ChampionSearchInput
                  disabled={status.isLoading}
                  label="Focus champion"
                  onChange={setBulkDiscoveryFocusChampion}
                  options={champions}
                  value={bulkDiscoveryFocusChampion}
                />
                <label className="block space-y-2">
                  <span className="text-sm text-zinc-300">Minimum games</span>
                  <Input
                    className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                    min={1}
                    onChange={(event) => setBulkMinimumGames(event.target.value)}
                    type="number"
                    value={bulkMinimumGames}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-zinc-300">Display limit</span>
                  <Input
                    className="h-10 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                    max={maxDisplayedResults}
                    min={1}
                    onChange={(event) => setBulkDisplayLimit(event.target.value)}
                    type="number"
                    value={bulkDisplayLimit}
                  />
                </label>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <ChampionSearchInput
                  disabled={status.isLoading}
                  label="Enemy champion"
                  onChange={setBulkEnemyChampionInput}
                  options={champions}
                  value={bulkEnemyChampionInput}
                />
                <ChampionSearchInput
                  disabled={status.isLoading}
                  label="Counter champion"
                  onChange={setBulkCounterChampionInput}
                  options={champions}
                  value={bulkCounterChampionInput}
                />
              </div>
            )}

            <Button
              className="bg-violet-500/80 text-white hover:bg-violet-500"
              disabled={status.isLoading || selectedCandidates.length > maxSeedCandidatesPerScan}
              onClick={() => void scanSelectedCandidates()}
              type="button"
            >
              {status.isLoading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="size-4" aria-hidden="true" />
              )}
              Confirm scan selected
            </Button>
          </div>
        ) : null}

        <StatusMessage status={status} />
        {copyStatus ? (
          <p className="rounded-md border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
            {copyStatus}
          </p>
        ) : null}

        {candidates.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-500">
            No seed candidates matched the current filters.
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.map((candidate) => (
              <SeedCandidateRow
                championDisplayNamesById={championDisplayNamesById}
                candidate={candidate}
                expanded={expandedCandidateId === candidate.id}
                key={candidate.id}
                onCopy={() => void copyPuuid(candidate.puuid)}
                onSelectionChange={() => toggleCandidateSelection(candidate.id)}
                onToggle={() =>
                  setExpandedCandidateId((currentId) =>
                    currentId === candidate.id ? null : candidate.id,
                  )
                }
                selected={selectedCandidateIds.has(candidate.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SeedCandidateRow({
  candidate,
  championDisplayNamesById,
  expanded,
  onCopy,
  onSelectionChange,
  onToggle,
  selected,
}: {
  candidate: RiotSeedCandidateView;
  championDisplayNamesById: Map<string, string>;
  expanded: boolean;
  onCopy: () => void;
  onSelectionChange: () => void;
  onToggle: () => void;
  selected: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/15">
      <div className="flex items-stretch">
        <label className="flex items-center border-r border-white/10 px-3">
          <input
            checked={selected}
            className="size-4 accent-cyan-400"
            onChange={onSelectionChange}
            type="checkbox"
          />
          <span className="sr-only">Select candidate</span>
        </label>
        <button
          className="grid min-w-0 flex-1 gap-3 p-3 text-left text-sm transition hover:bg-white/[0.04] md:grid-cols-[1fr_0.7fr_0.75fr_0.75fr_0.6fr_auto]"
          onClick={onToggle}
          type="button"
        >
          <span className="min-w-0">
            <span className="block truncate font-mono text-xs text-cyan-100">
              {shortenPuuid(candidate.puuid)}
            </span>
            <span className="mt-1 block text-xs text-zinc-500">
              {candidate.platform_region} - {candidate.regional_routing}
            </span>
          </span>
          <span>
            <span className="block text-xs uppercase tracking-wide text-zinc-500">Status</span>
            <span className="font-semibold text-zinc-100">{formatEnumLabel(candidate.status)}</span>
          </span>
          <span>
            <span className="block text-xs uppercase tracking-wide text-zinc-500">Role</span>
            <span className="font-semibold text-zinc-100">
              {candidate.estimated_primary_role
                ? `${getRoleLabel(candidate.estimated_primary_role)} ${formatPercent(
                    candidate.primary_role_share,
                  )}`
                : "Pending"}
            </span>
          </span>
          <span>
            <span className="block text-xs uppercase tracking-wide text-zinc-500">Champion</span>
            <span className="font-semibold text-zinc-100">
              {candidate.primary_champion
                ? `${getChampionDisplayName(
                    championDisplayNamesById,
                    candidate.primary_champion,
                  )} ${formatPercent(candidate.primary_champion_share)}`
                : "Pending"}
            </span>
          </span>
          <span>
            <span className="block text-xs uppercase tracking-wide text-zinc-500">Games</span>
            <span className="font-semibold text-zinc-100">
              {formatNumber(candidate.observed_games)}
            </span>
          </span>
          <span className="text-xs font-semibold text-cyan-200">
            {expanded ? "Hide details" : "Details"}
          </span>
        </button>
      </div>

      {expanded ? (
        <div className="space-y-4 border-t border-white/10 p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="break-all font-mono text-xs text-zinc-300">{candidate.puuid}</p>
            <Button
              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              onClick={onCopy}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Clipboard className="size-3.5" aria-hidden="true" />
              Copy PUUID
            </Button>
          </div>

          <div className="grid gap-2 text-xs text-zinc-400 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Source" value={formatEnumLabel(candidate.source)} />
            <Metric label="First seen" value={formatDateTime(candidate.first_seen_at)} />
            <Metric label="Last seen" value={formatDateTime(candidate.last_seen_at)} />
            <Metric label="Latest match" value={formatDateTime(candidate.latest_match_seen_at)} />
            <Metric label="First match" value={candidate.first_seen_match_id} />
            <Metric label="First scan job" value={candidate.first_seen_scan_job_id} />
            <Metric label="Last profiled" value={formatDateTime(candidate.last_profiled_at)} />
            <Metric label="Last scanned" value={formatDateTime(candidate.last_scanned_at)} />
            <Metric label="Times scanned" value={candidate.times_scanned} />
            <Metric label="Successful scans" value={candidate.successful_scan_count} />
            <Metric label="Failed scans" value={candidate.failed_scan_count} />
            <Metric label="Consecutive failures" value={candidate.consecutive_scan_failures} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <CandidateRoleDistribution candidate={candidate} />
            <CandidateTopChampions
              championDisplayNamesById={championDisplayNamesById}
              champions={candidate.top_champions ?? []}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CandidateRoleDistribution({ candidate }: { candidate: RiotSeedCandidateView }) {
  const entries = leagueRoles
    .map((leagueRole) => ({
      role: leagueRole,
      value: candidate.role_distribution?.[leagueRole],
    }))
    .filter((entry) => entry.value);

  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <h4 className="text-sm font-semibold text-white">Role distribution</h4>
      {entries.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">Pending</p>
      ) : (
        <div className="mt-3 space-y-2">
          {entries.map((entry) => (
            <div
              className="flex items-center justify-between gap-3 text-xs text-zinc-300"
              key={entry.role}
            >
              <span>{getRoleLabel(entry.role)}</span>
              <span>
                {entry.value?.games ?? 0} games - {formatPercent(entry.value?.share)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateTopChampions({
  championDisplayNamesById,
  champions,
}: {
  championDisplayNamesById: Map<string, string>;
  champions: RiotSeedCandidateTopChampion[];
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <h4 className="text-sm font-semibold text-white">Top champions</h4>
      {champions.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">Pending</p>
      ) : (
        <div className="mt-3 space-y-2">
          {champions.map((champion) => (
            <div
              className="grid grid-cols-[1fr_auto] gap-3 text-xs text-zinc-300"
              key={`${champion.champion}-${champion.role}`}
            >
              <span className="font-semibold text-zinc-100">
                {getChampionDisplayName(championDisplayNamesById, champion.champion)}{" "}
                {getRoleLabel(champion.role)}
              </span>
              <span>
                {champion.games} games - {champion.wins}W {champion.losses}L -{" "}
                {formatPercent(champion.share)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
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

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Matchup data collection
        </h4>
        <div className="grid gap-2 text-xs text-zinc-400 sm:grid-cols-2 lg:grid-cols-3">
          <Metric label="Fetched match IDs" value={job.progress.fetchedMatchIds} />
          <Metric label="Unique match IDs" value={job.progress.uniqueMatchIds} />
          <Metric label="Scanned matches" value={job.progress.matchesScanned} />
          <Metric label="Patch skipped" value={job.progress.patchSkipped} />
          <Metric label="Queue skipped" value={job.progress.queueSkipped} />
          <Metric label="Role skipped" value={job.progress.roleSkipped} />
          <Metric label="Champion pair matched" value={job.progress.championPairMatched} />
          <Metric
            label="Champion identifiers processed"
            value={job.progress.champion_identifiers_processed}
          />
          <Metric
            label="Champion identifiers normalized"
            value={job.progress.champion_identifiers_normalized}
          />
          <Metric
            label="Champion aliases resolved"
            value={job.progress.champion_aliases_resolved}
          />
          <Metric
            label="Champion normalization failures"
            value={job.progress.champion_normalization_failures}
          />
          <Metric
            label="Champion identifier conflicts"
            value={job.progress.champion_identifier_conflicts}
          />
          <Metric label="Matchup pairs discovered" value={job.progress.matchupPairsDiscovered} />
          <Metric label="Observations found" value={job.progress.observationsFound} />
          <Metric
            label="Matchup observations validated"
            value={job.progress.matchupObservationsValidated}
          />
          <Metric
            label="Matchup observations rejected"
            value={job.progress.matchupObservationsRejected}
          />
          <Metric label="New observations saved" value={job.progress.observationsInserted} />
          <Metric
            label="Duplicate observations skipped"
            value={job.progress.observationDuplicatesSkipped}
          />
          <Metric
            label="Observation insert failures"
            value={job.progress.observationInsertFailures}
          />
          <Metric label="Matchup batch splits" value={job.progress.matchupObservationBatchSplits} />
          <Metric
            label="Matchup isolated failures"
            value={job.progress.matchupObservationIsolatedFailures}
          />
          <Metric label="Counter pick stat rows updated" value={job.progress.statsRowsUpdated} />
          <Metric
            label="Counter pick aggregates validated"
            value={job.progress.counterPickAggregatesValidated}
          />
          <Metric
            label="Counter pick aggregate validation failures"
            value={job.progress.counterPickAggregateValidationFailures}
          />
          <Metric
            label="Counter pick aggregate insert failures"
            value={job.progress.counterPickAggregateInsertFailures}
          />
          <Metric label="Started" value={formatDateTime(job.started_at)} />
          <Metric label="Completed" value={formatDateTime(job.completed_at)} />
        </div>
      </div>

      <ValidationIssueSummary job={job} />
      <PersistenceRecoverySummary job={job} />

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Seed candidate discovery
        </h4>
        <div className="grid gap-2 text-xs text-zinc-400 sm:grid-cols-2 lg:grid-cols-3">
          <Metric
            label="Participant PUUIDs observed"
            value={job.progress.participantPuuidsObserved}
          />
          <Metric
            label="Unique candidates encountered"
            value={job.progress.uniqueCandidatesEncountered}
          />
          <Metric label="New candidates created" value={job.progress.newCandidatesCreated} />
          <Metric
            label="Existing candidates updated"
            value={job.progress.existingCandidatesUpdated}
          />
          <Metric label="Candidate IDs resolved" value={job.progress.candidateIdsResolved} />
          <Metric
            label="Unique candidate ID resolution failures"
            value={job.progress.candidateUniqueIdResolutionFailures}
          />
          <Metric
            label="Candidate observation resolution failures"
            value={job.progress.candidateObservationResolutionFailures}
          />
          <Metric
            label="Candidate observations found"
            value={job.progress.candidateObservationsFound}
          />
          <Metric
            label="Candidate observations validated"
            value={job.progress.candidateObservationsValidated}
          />
          <Metric
            label="Candidate observations rejected"
            value={job.progress.candidateObservationsRejected}
          />
          <Metric
            label="Candidate observations inserted"
            value={job.progress.candidateObservationsInserted}
          />
          <Metric
            label="Candidate observation duplicates skipped"
            value={job.progress.candidateObservationDuplicatesSkipped}
          />
          <Metric
            label="Candidate observation insert failures"
            value={job.progress.candidateObservationInsertFailures}
          />
          <Metric
            label="Candidate observation batch splits"
            value={job.progress.candidateObservationBatchSplits}
          />
          <Metric
            label="Candidate isolated failures"
            value={job.progress.candidateObservationIsolatedFailures}
          />
          <Metric
            label="Candidate profiles rebuilt"
            value={job.progress.candidateProfilesRebuilt}
          />
          <Metric
            label="Candidate profile failures"
            value={job.progress.candidateProfileFailures}
          />
          <Metric label="Candidate ID lookup chunks" value={job.progress.candidateIdLookupChunks} />
          <Metric
            label="Candidate ID lookup chunk failures"
            value={job.progress.candidateIdLookupChunkFailures}
          />
          <Metric
            label="Candidate discovery skipped"
            value={job.progress.candidateDiscoverySkipped}
          />
        </div>
      </div>

      {targetResult ? <TargetResult result={targetResult as RiotScanTargetResult} /> : null}
      {discoveryResults.length > 0 ? (
        <DiscoveryResultTable results={discoveryResults as RiotScanDiscoveryResult[]} />
      ) : null}
    </div>
  );
}

function ValidationIssueSummary({ job }: { job: RiotScanJobView }) {
  const summaries = [
    {
      label: "Matchup observation validation",
      summary: job.progress.matchupObservationValidationSummary,
    },
    {
      label: "Candidate observation validation",
      summary: job.progress.candidateObservationValidationSummary,
    },
    {
      label: "Counter-pick aggregate validation",
      summary: job.progress.counterPickAggregateValidationSummary,
    },
  ].filter((entry) => entry.summary && entry.summary.totalRejected > 0);

  if (summaries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-md border border-amber-300/20 bg-amber-500/10 p-3">
      <h4 className="text-sm font-semibold text-amber-100">Validation warnings</h4>
      <div className="grid gap-3 lg:grid-cols-3">
        {summaries.map((entry) => (
          <div className="rounded-md border border-white/10 bg-black/15 p-3" key={entry.label}>
            <p className="text-xs font-semibold text-zinc-100">{entry.label}</p>
            <p className="mt-1 text-xs text-zinc-400">
              {entry.summary?.totalRejected ?? 0} rejected
            </p>
            <div className="mt-2 space-y-1 text-xs text-zinc-400">
              {Object.entries(entry.summary?.issuesByCode ?? {}).map(([code, count]) => (
                <div className="flex justify-between gap-3" key={code}>
                  <span>{formatEnumLabel(code.toLowerCase())}</span>
                  <span className="font-semibold text-zinc-100">{count}</span>
                </div>
              ))}
            </div>
            {entry.summary?.samples?.length ? (
              <div className="mt-3 space-y-1 border-t border-white/10 pt-2 text-xs text-zinc-500">
                {entry.summary.samples.slice(0, 3).map((sample) => (
                  <p
                    className="break-words"
                    key={`${sample.code}-${sample.field}-${sample.safeValue}`}
                  >
                    {sample.field}: {sample.safeValue ?? "empty"}{" "}
                    {sample.matchId ? `(${sample.matchId})` : ""}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function PersistenceRecoverySummary({ job }: { job: RiotScanJobView }) {
  const summaries = [
    {
      attempts: job.progress.candidateObservationBatchAttempts,
      duplicates: job.progress.candidateObservationDuplicatesSkipped,
      errorGroups: job.progress.candidateObservationPersistenceErrorGroups,
      failedAttempts: job.progress.candidateObservationFailedBatchAttempts,
      failures: job.progress.candidateObservationInsertFailures,
      inserted: job.progress.candidateObservationsInserted,
      isolated: job.progress.candidateObservationIsolatedFailures,
      label: "Candidate observations",
      samples: job.progress.candidateObservationPersistenceFailureSamples,
      splits: job.progress.candidateObservationBatchSplits,
      successful: job.progress.candidateObservationSuccessfulBatches,
      transientRetries: job.progress.candidateObservationTransientRetries,
      unresolved: job.progress.candidateObservationUnresolvedBatchFailures,
    },
    {
      attempts: job.progress.matchupObservationBatchAttempts,
      duplicates: job.progress.observationDuplicatesSkipped,
      errorGroups: job.progress.matchupObservationPersistenceErrorGroups,
      failedAttempts: job.progress.matchupObservationFailedBatchAttempts,
      failures: job.progress.observationInsertFailures,
      inserted: job.progress.observationsInserted,
      isolated: job.progress.matchupObservationIsolatedFailures,
      label: "Matchup observations",
      samples: job.progress.matchupObservationPersistenceFailureSamples,
      splits: job.progress.matchupObservationBatchSplits,
      successful: job.progress.matchupObservationSuccessfulBatches,
      transientRetries: job.progress.matchupObservationTransientRetries,
      unresolved: job.progress.matchupObservationUnresolvedBatchFailures,
    },
    {
      attempts: job.progress.counterPickAggregateBatchAttempts,
      duplicates: 0,
      errorGroups: job.progress.counterPickAggregatePersistenceErrorGroups,
      failedAttempts: job.progress.counterPickAggregateFailedBatchAttempts,
      failures: job.progress.counterPickAggregateInsertFailures,
      inserted: job.progress.statsRowsUpdated,
      isolated: job.progress.counterPickAggregateIsolatedFailures,
      label: "Counter-pick aggregates",
      samples: job.progress.counterPickAggregatePersistenceFailureSamples,
      splits: job.progress.counterPickAggregateBatchSplits,
      successful: job.progress.counterPickAggregateSuccessfulBatches,
      transientRetries: job.progress.counterPickAggregateTransientRetries,
      unresolved: job.progress.counterPickAggregateUnresolvedBatchFailures,
    },
  ].filter((entry) => hasPersistenceRecoveryActivity(entry));

  if (summaries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-md border border-cyan-300/20 bg-cyan-500/10 p-3">
      <h4 className="text-sm font-semibold text-cyan-100">Persistence recovery</h4>
      <div className="grid gap-3 lg:grid-cols-3">
        {summaries.map((entry) => (
          <div className="rounded-md border border-white/10 bg-black/15 p-3" key={entry.label}>
            <p className="text-xs font-semibold text-zinc-100">{entry.label}</p>
            <p className="mt-1 text-xs text-zinc-400">
              {Number(entry.inserted ?? 0) + Number(entry.duplicates ?? 0)} rows persisted,{" "}
              {entry.failures ?? 0} failed
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-400">
              <Metric label="Batch attempts" value={entry.attempts} />
              <Metric label="Successful batches" value={entry.successful} />
              <Metric label="Failed attempts" value={entry.failedAttempts} />
              <Metric label="Batch splits" value={entry.splits} />
              <Metric label="Transient retries" value={entry.transientRetries} />
              <Metric label="Isolated rows" value={entry.isolated} />
              <Metric label="Unresolved rows" value={entry.unresolved} />
            </div>
            {entry.errorGroups?.length ? (
              <div className="mt-3 space-y-1 border-t border-white/10 pt-2 text-xs text-zinc-400">
                {entry.errorGroups.slice(0, 3).map((group) => (
                  <div
                    className="flex justify-between gap-3"
                    key={`${group.errorClass}-${group.errorCode}-${group.messageFingerprint}`}
                  >
                    <span>{formatEnumLabel(group.errorClass)}</span>
                    <span className="font-semibold text-zinc-100">{group.failureCount}</span>
                  </div>
                ))}
              </div>
            ) : null}
            {entry.samples?.length ? (
              <details className="mt-3 border-t border-white/10 pt-2 text-xs text-zinc-400">
                <summary className="cursor-pointer font-semibold text-cyan-100">
                  Failure samples
                </summary>
                <div className="mt-2 space-y-2">
                  {entry.samples.slice(0, 5).map((sample) => (
                    <div
                      className="rounded-md border border-white/10 bg-black/20 p-2"
                      key={`${sample.table}-${sample.rowIdentity}-${sample.errorClass}`}
                    >
                      <p className="font-semibold text-zinc-200">
                        {sample.rowIdentity} - {formatEnumLabel(sample.errorClass)}
                      </p>
                      <p className="mt-1 break-words text-zinc-500">{sample.message}</p>
                      <div className="mt-2 space-y-1">
                        {Object.entries(sample.safeFields).map(([field, value]) => (
                          <div className="flex justify-between gap-3" key={field}>
                            <span>{formatEnumLabel(field)}</span>
                            <span className="break-all text-right text-zinc-300">
                              {String(value ?? "empty")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function hasPersistenceRecoveryActivity(entry: {
  failedAttempts?: number;
  failures?: number;
  isolated?: number;
  splits?: number;
  transientRetries?: number;
  unresolved?: number;
}) {
  return [
    entry.failedAttempts,
    entry.failures,
    entry.isolated,
    entry.splits,
    entry.transientRetries,
    entry.unresolved,
  ].some((value) => Number(value ?? 0) > 0);
}

function TargetResult({ result }: { result: RiotScanTargetResult }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/15 p-3">
      <h4 className="text-sm font-semibold text-white">Target scan result</h4>
      <div className="mt-3 grid gap-2 text-xs text-zinc-400 sm:grid-cols-2 lg:grid-cols-3">
        <Metric
          label="Enemy champion"
          value={result.enemyChampionDisplayName ?? result.enemyChampion}
        />
        <Metric
          label="Counter champion"
          value={result.counterChampionDisplayName ?? result.counterChampion}
        />
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
            <span className="font-semibold text-white">
              {result.championADisplayName ?? result.championA}
            </span>
            <span className="font-semibold text-white">
              {result.championBDisplayName ?? result.championB}
            </span>
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

function getChampionDisplayName(championDisplayNamesById: Map<string, string>, championId: string) {
  return championDisplayNamesById.get(championId) ?? championId;
}

function shortenPuuid(value: string) {
  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-8)}`;
}

function formatPercent(value: number | null | undefined) {
  if (typeof value !== "number") {
    return "Pending";
  }

  return `${Math.round(value * 100)}%`;
}

function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
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

function wasCandidateScannedRecently(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  const timestamp = new Date(value).getTime();

  return (
    Number.isFinite(timestamp) &&
    Date.now() - timestamp < recentSeedCandidateScanHours * 60 * 60 * 1000
  );
}
