alter table public.planning_links
rename column title to label;

alter table public.planning_links
add column type text not null default 'other';

alter table public.planning_links
drop constraint if exists planning_links_type_check;

alter table public.planning_links
add constraint planning_links_type_check
check (type in ('youtube', 'maxroll', 'mobalytics', 'reddit', 'other'));
