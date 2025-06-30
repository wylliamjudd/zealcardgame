-- Add is_approved_to_post to forum_users for posting permission
alter table forum_users add column is_approved_to_post boolean not null default false;
