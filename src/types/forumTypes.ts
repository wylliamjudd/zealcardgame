// Auto-generated from _documentation/ForumSchema.txt
// Types for Zeal TCG forum schema

export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';

export interface Profile {
  id: string; // uuid
  username: string | null;
  avatar_url: string | null;
  role: UserRole | null;
  created_at: string | null;
  last_sign_in: string | null;
}

export interface ForumUser {
  id: string; // uuid
  profile_id: string | null;
  username: string;
  email: string;
  password_hash: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  is_banned: boolean;
  is_muted: boolean;
  registration_ip: string | null;
  registration_user_agent: string | null;
  trust_score: number;
  privacy_opt_out: boolean;
  created_at: string;
  updated_at: string;
  is_approved_to_post: boolean;
}

export interface ForumCategory {
  id: number;
  parent_id: number | null;
  name: string;
  description: string | null;
  is_private: boolean;
  is_locked: boolean;
  sort_order: number;
  thread_count: number;
  post_count: number;
  last_activity_at: string | null;
  last_activity_by: string | null; // uuid (ForumUser)
  created_at: string;
  updated_at: string;
  profile_id: string | null;
}

export interface ForumThread {
  id: number;
  category_id: number;
  author_id: string;
  title: string;
  content: string | null;
  is_sticky: boolean;
  is_locked: boolean;
  is_private: boolean;
  is_deleted: boolean;
  is_approved: boolean;
  approval_requested: boolean;
  is_spam: boolean;
  is_bot: boolean;
  tags: string[] | null;
  reply_count: number;
  view_count: number;
  last_activity_at: string | null;
  last_activity_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  profile_id: string | null;
  views: number;
}

export interface ForumSpamEvent {
  id: number;
  user_id: string | null; // uuid
  ip: string | null;
  user_agent: string | null;
  event_type: string;
  details: any | null;
  created_at: string;
}
