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
    updated_at
  )
  select
    p_matchup_id,
    p_card_type,
    count(*) filter (where feedback_type = 'helpful')::integer,
    count(*) filter (where feedback_type = 'not_helpful')::integer,
    now()
  from public.matchup_feedback
  where matchup_id = p_matchup_id
    and card_type = p_card_type
  on conflict (matchup_id, card_type) do update
  set
    helpful_count = excluded.helpful_count,
    not_helpful_count = excluded.not_helpful_count,
    updated_at = now();
end;
$$;

alter table public.matchup_feedback_counts
drop constraint if exists matchup_feedback_counts_nonnegative_check;

alter table public.matchup_feedback_counts
drop column if exists report_count;

alter table public.matchup_feedback_counts
add constraint matchup_feedback_counts_nonnegative_check check (
  helpful_count >= 0
  and not_helpful_count >= 0
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
      and feedback_type in ('helpful', 'not_helpful')
  ) duplicates
  where duplicate_rank > 1
) duplicates
where feedback.ctid = duplicates.ctid;

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
      and feedback_type = 'report_issue'
  ) duplicates
  where duplicate_rank > 1
) duplicates
where feedback.ctid = duplicates.ctid;

delete from public.matchup_feedback feedback
using (
  select ctid
  from (
    select
      ctid,
      row_number() over (
        partition by matchup_id, card_type, session_id
        order by updated_at desc, created_at desc, id desc
      ) as duplicate_rank
    from public.matchup_feedback
    where user_id is null
      and session_id is not null
      and feedback_type in ('helpful', 'not_helpful')
  ) duplicates
  where duplicate_rank > 1
) duplicates
where feedback.ctid = duplicates.ctid;

delete from public.matchup_feedback feedback
using (
  select ctid
  from (
    select
      ctid,
      row_number() over (
        partition by matchup_id, card_type, session_id
        order by updated_at desc, created_at desc, id desc
      ) as duplicate_rank
    from public.matchup_feedback
    where user_id is null
      and session_id is not null
      and feedback_type = 'report_issue'
  ) duplicates
  where duplicate_rank > 1
) duplicates
where feedback.ctid = duplicates.ctid;

drop index if exists public.matchup_feedback_unique_user_vote_idx;
drop index if exists public.matchup_feedback_unique_user_report_idx;
drop index if exists public.matchup_feedback_unique_session_vote_idx;
drop index if exists public.matchup_feedback_unique_session_report_idx;

create unique index matchup_feedback_unique_user_vote_idx
on public.matchup_feedback (matchup_id, card_type, user_id)
where user_id is not null and feedback_type in ('helpful', 'not_helpful');

create unique index matchup_feedback_unique_user_report_idx
on public.matchup_feedback (matchup_id, card_type, user_id)
where user_id is not null and feedback_type = 'report_issue';

create unique index matchup_feedback_unique_session_vote_idx
on public.matchup_feedback (matchup_id, card_type, session_id)
where user_id is null and session_id is not null and feedback_type in ('helpful', 'not_helpful');

create unique index matchup_feedback_unique_session_report_idx
on public.matchup_feedback (matchup_id, card_type, session_id)
where user_id is null and session_id is not null and feedback_type = 'report_issue';

insert into public.matchup_feedback_counts (
  matchup_id,
  card_type,
  helpful_count,
  not_helpful_count,
  updated_at
)
select
  matchup_id,
  card_type,
  count(*) filter (where feedback_type = 'helpful')::integer as helpful_count,
  count(*) filter (where feedback_type = 'not_helpful')::integer as not_helpful_count,
  now() as updated_at
from public.matchup_feedback
group by matchup_id, card_type
on conflict (matchup_id, card_type) do update
set
  helpful_count = excluded.helpful_count,
  not_helpful_count = excluded.not_helpful_count,
  updated_at = now();

drop function if exists public.submit_matchup_feedback(
  bigint,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text
);

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

  if v_user_id is not null and p_feedback_type in ('helpful', 'not_helpful') then
    update public.matchup_feedback
    set
      enemy_champion = p_enemy_champion,
      feedback_type = p_feedback_type,
      lane = p_lane,
      message = nullif(trim(coalesce(p_message, '')), ''),
      player_champion = p_player_champion,
      reason = null,
      session_id = null
    where matchup_id = p_matchup_id
      and card_type = p_card_type
      and user_id = v_user_id
      and feedback_type in ('helpful', 'not_helpful');

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
        null,
        nullif(trim(coalesce(p_message, '')), ''),
        v_user_id,
        null
      );
    end if;
  elsif v_user_id is not null then
    update public.matchup_feedback
    set
      enemy_champion = p_enemy_champion,
      feedback_type = p_feedback_type,
      lane = p_lane,
      message = nullif(trim(coalesce(p_message, '')), ''),
      player_champion = p_player_champion,
      reason = p_reason,
      session_id = null
    where matchup_id = p_matchup_id
      and card_type = p_card_type
      and user_id = v_user_id
      and feedback_type = 'report_issue';

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
        p_reason,
        nullif(trim(coalesce(p_message, '')), ''),
        v_user_id,
        null
      );
    end if;
  elsif p_feedback_type in ('helpful', 'not_helpful') then
    update public.matchup_feedback
    set
      enemy_champion = p_enemy_champion,
      feedback_type = p_feedback_type,
      lane = p_lane,
      message = nullif(trim(coalesce(p_message, '')), ''),
      player_champion = p_player_champion,
      reason = null,
      user_id = null
    where matchup_id = p_matchup_id
      and card_type = p_card_type
      and user_id is null
      and session_id = p_session_id
      and feedback_type in ('helpful', 'not_helpful');

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
        null,
        nullif(trim(coalesce(p_message, '')), ''),
        null,
        p_session_id
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
      reason = p_reason,
      user_id = null
    where matchup_id = p_matchup_id
      and card_type = p_card_type
      and user_id is null
      and session_id = p_session_id
      and feedback_type = 'report_issue';

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
        p_reason,
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
    p_feedback_type
  from (select 1) as one
  left join public.matchup_feedback_counts counts
    on counts.matchup_id = p_matchup_id
   and counts.card_type = p_card_type;
end;
$$;

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
