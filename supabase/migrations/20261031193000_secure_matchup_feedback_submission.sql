begin;

-- The submission RPC is the only public writer. Admin SELECT/UPDATE and
-- service-role maintenance are retained. Historical rows/indexes are untouched.
revoke insert on table public.matchup_feedback from public, anon, authenticated;
-- Remove any explicit column INSERT grants as well as the table-level grant.
do $$
declare v_columns text;
begin
  select string_agg(quote_ident(attname), ', ' order by attnum) into v_columns
  from pg_catalog.pg_attribute
  where attrelid = 'public.matchup_feedback'::regclass
    and attnum > 0 and not attisdropped;
  execute 'revoke insert (' || v_columns || ') on public.matchup_feedback from public, anon, authenticated';
end;
$$;
drop policy if exists "Anyone can submit matchup feedback" on public.matchup_feedback;

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
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_updated_count integer;
begin
  if p_lane is null or p_lane not in ('mid', 'top', 'jungle', 'adc', 'support') then
    raise exception 'Invalid lane.';
  end if;

  if p_feedback_type is null or p_feedback_type not in ('helpful', 'not_helpful', 'report_issue') then
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

  if p_card_type is null or p_card_type not in (
    'overview', 'early_game', 'trading_pattern', 'power_spikes',
    'danger_windows', 'win_conditions'
  ) then
    raise exception 'Invalid feedback card type.';
  end if;

  if char_length(coalesce(p_message, '')) > 4000 then
    raise exception 'Feedback message must be at most 4000 characters.';
  end if;

  if v_user_id is null and char_length(p_session_id) > 200 then
    raise exception 'Feedback session must be at most 200 characters.';
  end if;

  -- Serialize submissions for a card, including count refreshes and duplicate
  -- updates. Session IDs remain client-controlled, not an anti-abuse identity.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
    'matchup-feedback:' || p_matchup_id::text || ':' || p_card_type, 0));

  -- Preserve the RPC signature used by deployed clients, but derive display
  -- names from storage instead of trusting caller-provided champion labels.
  select a.name, b.name into p_player_champion, p_enemy_champion
  from public.league_matchups m
  join public.league_champions a on a.id = m.champion_a_id
  join public.league_champions b on b.id = m.champion_b_id
  where m.id = p_matchup_id and m.role = p_lane
    and m.generation_status = 'reviewed';
  if not found then
    raise exception 'A reviewed matchup with the specified lane is required.';
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
        session_id,
        status
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
        null,
        'open'
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
        session_id,
        status
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
        null,
        'open'
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
        session_id,
        status
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
        p_session_id,
        'open'
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
        session_id,
        status
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
        p_session_id,
        'open'
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

alter function public.submit_matchup_feedback(bigint, text, text, text, text, text, text, text, text) owner to postgres;
revoke all on function public.submit_matchup_feedback(bigint, text, text, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_matchup_feedback(bigint, text, text, text, text, text, text, text, text) to anon, authenticated, service_role;

-- These definer helpers mutate derived state; only triggers/maintenance need them.
alter function public.refresh_matchup_feedback_counts(bigint, text) owner to postgres;
alter function public.refresh_matchup_feedback_counts(bigint, text) set search_path = '';
alter function public.handle_matchup_feedback_counts() owner to postgres;
alter function public.handle_matchup_feedback_counts() set search_path = '';
revoke all on function public.refresh_matchup_feedback_counts(bigint, text) from public, anon, authenticated;
revoke all on function public.handle_matchup_feedback_counts() from public, anon, authenticated;
grant execute on function public.refresh_matchup_feedback_counts(bigint, text) to service_role;
grant execute on function public.handle_matchup_feedback_counts() to service_role;

notify pgrst, 'reload schema';
commit;
