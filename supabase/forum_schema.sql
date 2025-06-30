-- SUPABASE FORUM SCHEMA MIGRATION
-- Highly dynamic, production-worthy forum system
-- Includes moderation, drafts, approval, spam/bot blocking, privacy, audit

-- USERS TABLE (linked to profiles)
create table forum_users (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid references profiles(id) on delete set null, -- link to main profile
    username text not null unique,
    email text not null unique,
    password_hash text, -- nullable for OAuth
    avatar_url text,
    bio text,
    role text not null default 'user', -- 'admin', 'moderator', 'user', 'guest', 'banned'
    is_banned boolean not null default false,
    is_muted boolean not null default false,
    registration_ip inet,
    registration_user_agent text,
    trust_score int not null default 0,
    privacy_opt_out boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- CATEGORIES TABLE
create table forum_categories (
    id bigserial primary key,
    parent_id bigint references forum_categories(id) on delete set null,
    name text not null,
    description text,
    is_private boolean not null default false,
    is_locked boolean not null default false,
    sort_order int not null default 0,
    thread_count int not null default 0,
    post_count int not null default 0,
    last_activity_at timestamptz,
    last_activity_by uuid references forum_users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- THREADS TABLE
create table forum_threads (
    id bigserial primary key,
    category_id bigint not null references forum_categories(id) on delete cascade,
    author_id uuid not null references forum_users(id) on delete set null,
    title text not null,
    content text, -- initial post content (optional, for thread starter)
    is_sticky boolean not null default false,
    is_locked boolean not null default false,
    is_private boolean not null default false,
    is_deleted boolean not null default false,
    is_approved boolean not null default true,
    approval_requested boolean not null default false,
    is_spam boolean not null default false,
    is_bot boolean not null default false,
    tags text[],
    reply_count int not null default 0,
    view_count int not null default 0,
    last_activity_at timestamptz,
    last_activity_by uuid references forum_users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- POSTS TABLE
create table forum_posts (
    id bigserial primary key,
    thread_id bigint not null references forum_threads(id) on delete cascade,
    parent_id bigint references forum_posts(id) on delete set null, -- for nested replies
    author_id uuid not null references forum_users(id) on delete set null,
    content text,
    is_draft boolean not null default false,
    is_approved boolean not null default true,
    approval_requested boolean not null default false,
    is_spam boolean not null default false,
    is_bot boolean not null default false,
    is_deleted boolean not null default false,
    is_hidden boolean not null default false,
    is_private boolean not null default false,
    edit_count int not null default 0,
    last_edited_at timestamptz,
    last_edited_by uuid references forum_users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- MODERATION ACTIONS LOG
create table forum_moderation_log (
    id bigserial primary key,
    action text not null, -- e.g. 'delete', 'ban', 'approve', 'edit', 'warn', etc.
    target_type text not null, -- 'thread', 'post', 'user', 'category'
    target_id bigint,
    performed_by uuid references forum_users(id),
    reason text,
    metadata jsonb,
    created_at timestamptz not null default now()
);

-- REPORTS (USER FLAGS)
create table forum_reports (
    id bigserial primary key,
    reporter_id uuid not null references forum_users(id),
    target_type text not null, -- 'thread', 'post', 'user'
    target_id bigint not null,
    reason text,
    status text not null default 'pending', -- 'pending', 'reviewed', 'dismissed', 'actioned'
    created_at timestamptz not null default now(),
    reviewed_by uuid references forum_users(id),
    reviewed_at timestamptz
);

-- APPROVAL QUEUE (for posts/threads needing manual review)
create table forum_approval_queue (
    id bigserial primary key,
    target_type text not null, -- 'thread', 'post'
    target_id bigint not null,
    requested_by uuid references forum_users(id),
    requested_at timestamptz not null default now(),
    status text not null default 'pending', -- 'pending', 'approved', 'rejected'
    reviewed_by uuid references forum_users(id),
    reviewed_at timestamptz,
    notes text
);

-- SPAM/BOT EVENTS (for anti-abuse tracking)
create table forum_spam_events (
    id bigserial primary key,
    user_id uuid references forum_users(id),
    ip inet,
    user_agent text,
    event_type text not null, -- 'spam', 'bot', 'captcha_fail', etc.
    details jsonb,
    created_at timestamptz not null default now()
);

-- INDEXES FOR PERFORMANCE
create index idx_forum_threads_category_id on forum_threads(category_id);
create index idx_forum_posts_thread_id on forum_posts(thread_id);
create index idx_forum_posts_parent_id on forum_posts(parent_id);
create index idx_forum_threads_author_id on forum_threads(author_id);
create index idx_forum_posts_author_id on forum_posts(author_id);
create index idx_forum_categories_parent_id on forum_categories(parent_id);

-- FORUM AUDIT TRAIL (optional, for privacy and compliance)
create table forum_audit_trail (
    id bigserial primary key,
    user_id uuid references forum_users(id),
    action text not null,
    target_type text not null,
    target_id bigint,
    metadata jsonb,
    created_at timestamptz not null default now()
);
