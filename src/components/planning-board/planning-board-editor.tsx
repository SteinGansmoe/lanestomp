"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { ChevronDown, LockKeyhole, Save, StickyNote } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { PlanningChecklistSection } from "@/src/components/planning-board/planning-checklist-section";
import { PlanningLinksSection } from "@/src/components/planning-board/planning-links-section";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { supabase } from "@/src/lib/supabase";

type PlanningBoard = {
  id: string;
  notes: string | null;
  season_id: string;
  title: string;
  user_id: string;
};

type SeasonRecord = {
  id: string;
  name: string;
  slug: string;
};

type Status = {
  error: string | null;
  isLoading: boolean;
  success: string | null;
};

const fieldClassName =
  "w-full rounded-lg border border-white/10 bg-[#111a2c] px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-3 focus-visible:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-50";

async function createPlanningBoard(season: SeasonRecord, userId: string) {
  if (!supabase) {
    return {
      board: null,
      error: "Supabase is not configured.",
    };
  }

  const { data, error } = await supabase
    .from("planning_boards")
    .insert({
      notes: "",
      season_id: season.id,
      title: `${season.name} plan`,
      user_id: userId,
    })
    .select("id, season_id, user_id, title, notes")
    .single();

  if (error) {
    return {
      board: null,
      error: error.message,
    };
  }

  return {
    board: data as PlanningBoard,
    error: null,
  };
}

export function PlanningBoardEditor({
  fallbackTitle,
  seasonIdentifier,
}: {
  fallbackTitle: string;
  seasonIdentifier: string;
}) {
  const [board, setBoard] = useState<PlanningBoard | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>({
    error: null,
    isLoading: true,
    success: null,
  });
  const [title, setTitle] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBoard() {
      if (!supabase) {
        setStatus({
          error: "Supabase is not configured.",
          isLoading: false,
          success: null,
        });
        return;
      }

      setStatus({ error: null, isLoading: true, success: null });

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      const activeUser = userData.user ?? null;

      if (!isMounted) {
        return;
      }

      if (userError || !activeUser) {
        setUser(null);
        setStatus({ error: null, isLoading: false, success: null });
        return;
      }

      setUser(activeUser);

      const seasonByIdResult = await supabase
        .from("seasons")
        .select("id, name, slug")
        .eq("id", seasonIdentifier)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (seasonByIdResult.error) {
        setStatus({
          error: seasonByIdResult.error.message,
          isLoading: false,
          success: null,
        });
        return;
      }

      let season = seasonByIdResult.data as SeasonRecord | null;

      if (!season) {
        const { data: seasonData, error: seasonError } = await supabase
          .from("seasons")
          .select("id, name, slug")
          .eq("slug", seasonIdentifier)
          .order("game_id", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!isMounted) {
          return;
        }

        if (seasonError || !seasonData) {
          setStatus({
            error:
              seasonError?.message ??
              "Could not find this season in Supabase. Open the planning board from a live season page or My Games row.",
            isLoading: false,
            success: null,
          });
          return;
        }

        season = seasonData as SeasonRecord;
      }

      const { data: existingBoard, error: boardError } = await supabase
        .from("planning_boards")
        .select("id, season_id, user_id, title, notes")
        .eq("season_id", season.id)
        .eq("user_id", activeUser.id)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (boardError) {
        setStatus({
          error: boardError.message,
          isLoading: false,
          success: null,
        });
        return;
      }

      const createResult =
        existingBoard ? null : await createPlanningBoard(season, activeUser.id);
      const loadedBoard =
        existingBoard ? (existingBoard as PlanningBoard) : createResult?.board;

      if (!isMounted) {
        return;
      }

      if (!loadedBoard) {
        setStatus({
          error: createResult?.error ?? "Could not open planning board.",
          isLoading: false,
          success: null,
        });
        return;
      }

      setBoard(loadedBoard);
      setTitle(loadedBoard.title);
      setNotes(loadedBoard.notes ?? "");
      setStatus({ error: null, isLoading: false, success: null });
    }

    loadBoard();

    const { data: listener } =
      supabase?.auth.onAuthStateChange((_event, session) => {
        if (!session?.user) {
          setBoard(null);
          setUser(null);
          setStatus({ error: null, isLoading: false, success: null });
        }
      }) ?? { data: null };

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [seasonIdentifier]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !board) {
      return;
    }

    const nextTitle = title.trim();

    if (!nextTitle) {
      setStatus({
        error: "Board title is required.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const { data, error } = await supabase
      .from("planning_boards")
      .update({
        notes,
        title: nextTitle,
      })
      .eq("id", board.id)
      .select("id, season_id, user_id, title, notes")
      .single();

    if (error) {
      setStatus({
        error: error.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    const savedBoard = data as PlanningBoard;
    setBoard(savedBoard);
    setTitle(savedBoard.title);
    setNotes(savedBoard.notes ?? "");
    setStatus({
      error: null,
      isLoading: false,
      success: "Planning board saved.",
    });
  }

  if (status.isLoading && !board) {
    return (
      <Card className="border-white/10 bg-[#10182b]/90 p-6 text-white shadow-xl shadow-black/20 ring-1 ring-white/5">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="mt-5 h-11 rounded-lg bg-white/5" />
        <div className="mt-4 h-40 rounded-lg bg-white/5" />
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border-white/10 bg-[#10182b]/90 p-6 text-white shadow-xl shadow-black/20 ring-1 ring-white/5">
        <div className="flex size-12 items-center justify-center rounded-lg bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/20">
          <LockKeyhole className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="font-mono text-2xl">Sign in to plan</CardTitle>
        <p className="max-w-2xl text-sm leading-6 text-zinc-400">
          Planning boards are personal, so you need to be signed in before you
          can create or open this season board.
        </p>
        <Link
          className="inline-flex h-10 w-fit items-center rounded-md bg-violet-500/80 px-4 text-sm font-medium text-white transition hover:bg-violet-500"
          href="/login"
        >
          Sign in
        </Link>
      </Card>
    );
  }

  return (
    <>
      <details
        className="group rounded-xl border border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/20 ring-1 ring-white/5"
        open
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 marker:hidden sm:px-5 [&::-webkit-details-marker]:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-300/20">
              <StickyNote className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="font-mono text-xl font-semibold text-white">
                Board notes
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Keep private plans and reminders for {fallbackTitle}.
              </p>
            </div>
          </div>
          <ChevronDown
            className="size-5 shrink-0 text-zinc-500 transition group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <CardContent className="border-t border-white/10 pt-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Board title</span>
              <Input
                className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                disabled={status.isLoading}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Season plan"
                required
                value={title}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Notes</span>
              <textarea
                className={`${fieldClassName} min-h-52 resize-y py-3 leading-6`}
                disabled={status.isLoading}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Write goals, prep notes, build ideas, or anything else you want to remember for this season."
                value={notes}
              />
            </label>

            {status.error ? (
              <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
                {status.error}
              </p>
            ) : null}

            {status.success ? (
              <p className="rounded-md border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                {status.success}
              </p>
            ) : null}

            <Button
              className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
              disabled={status.isLoading}
              type="submit"
            >
              <Save className="size-4" aria-hidden="true" />
              {status.isLoading ? "Saving..." : "Save board"}
            </Button>
          </form>
        </CardContent>
      </details>

      {board ? (
        <>
          <PlanningChecklistSection boardId={board.id} userId={user.id} />
          <PlanningLinksSection boardId={board.id} userId={user.id} />
        </>
      ) : null}
    </>
  );
}
