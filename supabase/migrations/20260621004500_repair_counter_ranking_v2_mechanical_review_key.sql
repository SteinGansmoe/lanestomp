do $$
begin
  if to_regclass('public.counter_ranking_v2_mechanical_reviews') is null then
    return;
  end if;

  if exists (
    select 1
    from pg_constraint
    where conname = 'counter_ranking_v2_mechanical_reviews_unique'
      and conrelid = 'public.counter_ranking_v2_mechanical_reviews'::regclass
  ) then
    return;
  end if;

  if to_regclass('public.counter_ranking_v2_mechanical_reviews_unique_idx') is not null then
    execute 'alter table public.counter_ranking_v2_mechanical_reviews add constraint counter_ranking_v2_mechanical_reviews_unique unique using index counter_ranking_v2_mechanical_reviews_unique_idx';
  else
    execute 'alter table public.counter_ranking_v2_mechanical_reviews add constraint counter_ranking_v2_mechanical_reviews_unique unique (enemy_champion_id, counter_champion_id, role)';
  end if;
end $$;
