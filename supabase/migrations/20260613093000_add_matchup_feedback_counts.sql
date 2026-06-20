alter table public.matchup_feedback
add column if not exists session_id text;

create table if not exists public.matchup_feedback_counts (
  matchup_id bigint not null references public.league_matchups(id) on update cascade on delete cascade,
  card_type text not null,
  helpful_count integer not null default 0,
  not_helpful_count integer not null default 0,
  report_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (matchup_id, card_type),
  constraint matchup_feedback_counts_nonnegative_check check (
    helpful_count >= 0
    and not_helpful_count >= 0
    and report_count >= 0
  )
);

delete from public.matchup_feedback feedback
using (
  select ctid
  from (
    select
      ctid,
      row_number() over (
        partition by matchup_id, card_type, user_id
        order by updated_at desc, created_at desc, id desc
      ) as duplicate_rank
    from public.matchup_feedback
    where user_id is not null
  ) duplicates
  where duplicate_rank > 1
) duplicates
where feedback.ctid = duplicates.ctid;

create unique index if not exists matchup_feedback_unique_user_vote_idx
on public.matchup_feedback (matchup_id, card_type, user_id)
where user_id is not null;

create unique index if not exists matchup_feedback_unique_session_vote_idx
on public.matchup_feedback (matchup_id, card_type, session_id)
where user_id is null and session_id is not null;

create index if not exists matchup_feedback_session_id_idx
on public.matchup_feedback (session_id)
where session_id is not null;

insert into public.matchup_feedback_counts (
  matchup_id,
  card_type,
  helpful_count,
  not_helpful_count,
  report_count,
  updated_at
)
select
  matchup_id,
  card_type,
  count(*) filter (where feedback_type = 'helpful')::integer as helpful_count,
  count(*) filter (where feedback_type = 'not_helpful')::integer as not_helpful_count,
  count(*) filter (where feedback_type = 'report_issue')::integer as report_count,
  now() as updated_at
from public.matchup_feedback
group by matchup_id, card_type
on conflict (matchup_id, card_type) do update
set
  helpful_count = excluded.helpful_count,
  not_helpful_count = excluded.not_helpful_count,
  report_count = excluded.report_count,
  updated_at = now();

create or replace function public.refresh_matchup_feedback_counts(
  p_matchup_id bigint,
  p_card_type text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_matchup_id is null or p_card_type is null then
    return;
  end if;

  insert into public.matchup_feedback_counts (
    matchup_id,
    card_type,
    helpful_count,
    not_helpful_count,
    report_count,
    updated_at
  )
  select
    p_matchup_id,
    p_card_type,
    count(*) filter (where feedback_type = 'helpful')::integer,
    count(*) filter (where feedback_type = 'not_helpful')::integer,
    count(*) filter (where feedback_type = 'report_issue')::integer,
    now()
  from public.matchup_feedback
  where matchup_id = p_matchup_id
    and card_type = p_card_type
  on conflict (matchup_id, card_type) do update
  set
    helpful_count = excluded.helpful_count,
    not_helpful_count = excluded.not_helpful_count,
    report_count = excluded.report_count,
    updated_at = now();
end;
$$;

create or replace function public.handle_matchup_feedback_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_matchup_feedback_counts(old.matchup_id, old.card_type);
    return old;
  end if;

  if tg_op = 'UPDATE'
    and (old.matchup_id is distinct from new.matchup_id or old.card_type is distinct from new.card_type)
  then
    perform public.refresh_matchup_feedback_counts(old.matchup_id, old.card_type);
  end if;

  perform public.refresh_matchup_feedback_counts(new.matchup_id, new.card_type);
  return new;
end;
$$;

drop trigger if exists refresh_matchup_feedback_counts_after_change on public.matchup_feedback;

create trigger refresh_matchup_feedback_counts_after_change
after insert or update or delete on public.matchup_feedback
for each row execute function public.handle_matchup_feedback_counts();

create or replace function public.submit_matchup_feedback(
  p_matchup_id bigint,
  p_player_champion text,
  p_enemy_champion text,
  p_lane text,
  p_card_type text,
  p_feedback_type text,
  p_reason text default null,
  p_message text default null,
  p_session_id text default null
)
returns table (
  helpful_count integer,
  not_helpful_count integer,
  report_count integer,
  selected_feedback_type text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_updated_count integer;
begin
  if p_lane not in ('mid', 'top', 'jungle', 'adc', 'support') then
    raise exception 'Invalid lane.';
  end if;

  if p_feedback_type not in ('helpful', 'not_helpful', 'report_issue') then
    raise exception 'Invalid feedback type.';
  end if;

  if p_reason is not null
    and p_reason not in (
      'incorrect_advice',
      'missing_information',
      'too_generic',
      'wrong_champion_perspective',
      'ability_formatting_issue',
      'other'
    )
  then
    raise exception 'Invalid feedback reason.';
  end if;

  if v_user_id is null and nullif(trim(p_session_id), '') is null then
    raise exception 'A feedback session is required.';
  end if;

  if v_user_id is not null then
    update public.matchup_feedback
    set
      enemy_champion = p_enemy_champion,
      feedback_type = p_feedback_type,
      lane = p_lane,
      message = nullif(trim(coalesce(p_message, '')), ''),
      player_champion = p_player_champion,
      reason = case when p_feedback_type = 'report_issue' then p_reason else null end,
      session_id = null
    where matchup_id = p_matchup_id
      and card_type = p_card_type
      and user_id = v_user_id;

    get diagnostics v_updated_count = row_count;

    if v_updated_count = 0 then
      insert into public.matchup_feedback (
        matchup_id,
        player_champion,
        enemy_champion,
        lane,
        card_type,
        feedback_type,
        reason,
        message,
        user_id,
        session_id
      )
      values (
        p_matchup_id,
        p_player_champion,
        p_enemy_champion,
        p_lane,
        p_card_type,
        p_feedback_type,
        case when p_feedback_type = 'report_issue' then p_reason else null end,
        nullif(trim(coalesce(p_message, '')), ''),
        v_user_id,
        null
      );
    end if;
  else
    update public.matchup_feedback
    set
      enemy_champion = p_enemy_champion,
      feedback_type = p_feedback_type,
      lane = p_lane,
      message = nullif(trim(coalesce(p_message, '')), ''),
      player_champion = p_player_champion,
      reason = case when p_feedback_type = 'report_issue' then p_reason else null end,
      user_id = null
    where matchup_id = p_matchup_id
      and card_type = p_card_type
      and user_id is null
      and session_id = p_session_id;

    get diagnostics v_updated_count = row_count;

    if v_updated_count = 0 then
      insert into public.matchup_feedback (
        matchup_id,
        player_champion,
        enemy_champion,
        lane,
        card_type,
        feedback_type,
        reason,
        message,
        user_id,
        session_id
      )
      values (
        p_matchup_id,
        p_player_champion,
        p_enemy_champion,
        p_lane,
        p_card_type,
        p_feedback_type,
        case when p_feedback_type = 'report_issue' then p_reason else null end,
        nullif(trim(coalesce(p_message, '')), ''),
        null,
        p_session_id
      );
    end if;
  end if;

  return query
  select
    coalesce(counts.helpful_count, 0),
    coalesce(counts.not_helpful_count, 0),
    coalesce(counts.report_count, 0),
    p_feedback_type
  from (select 1) as one
  left join public.matchup_feedback_counts counts
    on counts.matchup_id = p_matchup_id
   and counts.card_type = p_card_type;
end;
$$;

grant select on table public.matchup_feedback_counts to anon, authenticated;
grant select, insert, update, delete on table public.matchup_feedback_counts to service_role;
grant execute on function public.submit_matchup_feedback(
  bigint,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text
) to anon, authenticated;

alter table public.matchup_feedback_counts enable row level security;

drop policy if exists "Anyone can read matchup feedback counts" on public.matchup_feedback_counts;

create policy "Anyone can read matchup feedback counts"
on public.matchup_feedback_counts
for select
to anon, authenticated
using (true);

comment on table public.matchup_feedback_counts is
  'Aggregated public counts for League matchup card feedback.';
