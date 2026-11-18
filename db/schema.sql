-- Run in Supabase SQL Editor as project owner. No anonymous access is granted.
create extension if not exists pgcrypto;
create table if not exists public.roora_invitations (
 id uuid primary key default gen_random_uuid(), code_hash text unique not null check (length(code_hash)=64),
 label text not null check (length(label) between 1 and 120), max_guests integer not null check (max_guests between 1 and 20), active boolean not null default true,
 allow_updates boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.roora_responses (
 invitation_id uuid primary key references public.roora_invitations(id) on delete restrict,
 reference uuid unique not null default gen_random_uuid(), name text not null check(length(name) between 1 and 120), attending boolean not null,
 guests integer not null check(guests between 0 and 20), dietary text not null default '' check(length(dietary)<=500), travel boolean,
 message text not null default '' check(length(message)<=1000), updated_at timestamptz not null default now(), check ((attending and guests>0 and travel is not null) or (not attending and guests=0 and travel is null))
);
create table if not exists public.roora_request_receipts (
 invitation_id uuid not null references public.roora_invitations(id) on delete restrict, request_id text not null, reference uuid not null,
 request_hash text not null, created_at timestamptz not null default now(), primary key(invitation_id,request_id)
);
create table if not exists public.roora_rate_limits (key text primary key, window_started timestamptz not null, attempts integer not null);
alter table public.roora_invitations enable row level security;
alter table public.roora_responses enable row level security;
alter table public.roora_request_receipts enable row level security;
alter table public.roora_rate_limits enable row level security;
revoke all on public.roora_invitations,public.roora_responses,public.roora_request_receipts,public.roora_rate_limits from anon,authenticated;
create or replace function public.roora_rate_limit(p_key text,p_limit integer) returns boolean language plpgsql security definer set search_path='' as $$
declare hits integer;
begin
 insert into public.roora_rate_limits as r(key,window_started,attempts) values(p_key,now(),1)
 on conflict(key) do update set window_started=case when r.window_started < now()-interval '10 minutes' then now() else r.window_started end,
 attempts=case when r.window_started < now()-interval '10 minutes' then 1 else least(r.attempts+1,1000000) end returning attempts into hits;
 return hits<=p_limit;
end;$$;
create or replace function public.roora_verify(p_code_hash text) returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('label',label,'maxGuests',max_guests,'allowUpdates',allow_updates) from public.roora_invitations where code_hash=p_code_hash and active;
$$;
create or replace function public.roora_submit(p_code_hash text,p_name text,p_attending boolean,p_guests integer,p_dietary text,p_travel boolean,p_message text,p_request_id text) returns jsonb language plpgsql security definer set search_path='' as $$
declare inv public.roora_invitations%rowtype; receipt public.roora_request_receipts%rowtype; ref uuid; payload jsonb; payload_hash text;
begin
 select * into inv from public.roora_invitations where code_hash=p_code_hash and active for update;
 if not found then return jsonb_build_object('error','That invitation code was not recognized.','status',404); end if;
 payload=jsonb_build_object('name',p_name,'attending',p_attending,'guests',p_guests,'dietary',p_dietary,'travel',p_travel,'message',p_message);
 payload_hash=encode(sha256(convert_to(payload::text,'UTF8')),'hex');
 select * into receipt from public.roora_request_receipts where invitation_id=inv.id and request_id=p_request_id;
 if found then
   if receipt.request_hash<>payload_hash then return jsonb_build_object('error','This request reference has already been used. Please reload.','status',409); end if;
   return jsonb_build_object('reference',receipt.reference);
 end if;
 if p_guests>inv.max_guests then return jsonb_build_object('error','Guest count exceeds your invitation allowance.','status',400); end if;
 if not inv.allow_updates and exists(select 1 from public.roora_responses where invitation_id=inv.id) then return jsonb_build_object('error','This invitation has already been answered. Contact the organizers to update it.','status',409); end if;
 if p_attending is null or p_guests is null or p_name is null or length(trim(p_name)) not between 1 and 120 or p_dietary is null or length(p_dietary)>500 or p_message is null or length(p_message)>1000 or p_request_id is null or length(p_request_id) not between 12 and 80 or (p_attending and (p_guests<1 or p_travel is null)) or (not p_attending and (p_guests<>0 or p_travel is not null)) then return jsonb_build_object('error','Invalid RSVP details.','status',400); end if;
 insert into public.roora_responses(invitation_id,name,attending,guests,dietary,travel,message) values(inv.id,trim(p_name),p_attending,p_guests,p_dietary,p_travel,p_message)
 on conflict(invitation_id) do update set name=excluded.name,attending=excluded.attending,guests=excluded.guests,dietary=excluded.dietary,travel=excluded.travel,message=excluded.message,updated_at=now()
 returning reference into ref;
 insert into public.roora_request_receipts(invitation_id,request_id,reference,request_hash) values(inv.id,p_request_id,ref,payload_hash);
 return jsonb_build_object('reference',ref);
end;$$;
create or replace function public.roora_admin_snapshot() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('summary',jsonb_build_object('active_invitations',(select count(*) from public.roora_invitations where active),'responses',(select count(*) from public.roora_responses),'acceptances',(select count(*) from public.roora_responses where attending),'declines',(select count(*) from public.roora_responses where not attending),'total_guests',(select coalesce(sum(guests),0) from public.roora_responses)), 'responses',coalesce((select jsonb_agg(to_jsonb(r)-'invitation_id'||jsonb_build_object('label',i.label) order by r.updated_at desc) from public.roora_responses r join public.roora_invitations i on i.id=r.invitation_id),'[]'::jsonb));
$$;
revoke all on function public.roora_rate_limit(text,integer),public.roora_verify(text),public.roora_submit(text,text,boolean,integer,text,boolean,text,text),public.roora_admin_snapshot() from public,anon,authenticated;
grant execute on function public.roora_rate_limit(text,integer),public.roora_verify(text),public.roora_submit(text,text,boolean,integer,text,boolean,text,text),public.roora_admin_snapshot() to service_role;
-- Schedule pruning for old rate limit buckets through your database scheduler if desired:
-- delete from public.roora_rate_limits where window_started < now()-interval '1 day';
-- Define a family-approved post-event retention policy before deleting any RSVP data.
