-- SUPABASE RLS POLICIES FOR FORUM TABLES
-- Assumes JWT claims include user's forum_user id and role
-- Adjust 'auth.uid()' and custom claims as needed for your setup

-- Enable RLS on all forum tables
alter table forum_users enable row level security;
alter table forum_categories enable row level security;
alter table forum_threads enable row level security;
alter table forum_posts enable row level security;
alter table forum_moderation_log enable row level security;
alter table forum_reports enable row level security;
alter table forum_approval_queue enable row level security;
alter table forum_spam_events enable row level security;
alter table forum_audit_trail enable row level security;

-- FORUM USERS: Only allow users to read their own record
-- If you add a custom JWT claim for role, you can extend this for admin/moderator
create policy "Allow self read" on forum_users
  for select using (
    auth.uid() = id
  );
-- To allow admin/moderator via JWT claim, use:
-- create policy "Allow self or admin read" on forum_users
--   for select using (
--     auth.uid() = id OR (auth.jwt() ->> 'role') in ('admin', 'moderator')
--   );

-- CATEGORIES: Public read, only admin/moderator can insert/update/delete
create policy "Public read categories" on forum_categories
  for select using (true);
create policy "Admin or mod write categories" on forum_categories
  for all using (
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role in ('admin', 'moderator'))
  );

-- THREADS: Public read, only privileged users can insert (post)
create policy "Public read threads" on forum_threads
  for select using (true);
create policy "Privileged post threads" on forum_threads
  for insert with check (
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role in ('admin', 'moderator'))
    or
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role = 'user' and u.is_banned = false and u.is_muted = false and u.is_approved_to_post = true)
  );
create policy "Owner or admin update/delete threads" on forum_threads
  for update using (
    (author_id = auth.uid()) or
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role in ('admin', 'moderator'))
  );

-- POSTS: Public read, only privileged users can insert (reply)
create policy "Public read posts" on forum_posts
  for select using (true);
create policy "Privileged post posts" on forum_posts
  for insert with check (
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role in ('admin', 'moderator'))
    or
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role = 'user' and u.is_banned = false and u.is_muted = false and u.is_approved_to_post = true)
  );
create policy "Owner or admin update/delete posts" on forum_posts
  for update using (
    (author_id = auth.uid()) or
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role in ('admin', 'moderator'))
  );

-- MODERATION LOG/REPORTS/AUDIT: Only admins/mods can insert/select
create policy "Admin or mod only" on forum_moderation_log
  for all using (
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role in ('admin', 'moderator'))
  );
create policy "Admin or mod only" on forum_reports
  for all using (
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role in ('admin', 'moderator'))
  );
create policy "Admin or mod only" on forum_approval_queue
  for all using (
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role in ('admin', 'moderator'))
  );
create policy "Admin or mod only" on forum_audit_trail
  for all using (
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role in ('admin', 'moderator'))
  );

-- SPAM EVENTS: Users can insert their own, admins/mods can read all
create policy "User insert spam events" on forum_spam_events
  for insert with check (auth.uid() = user_id);
create policy "Admin or mod read spam events" on forum_spam_events
  for select using (
    exists (select 1 from forum_users u where u.id = auth.uid() and u.role in ('admin', 'moderator'))
  );
