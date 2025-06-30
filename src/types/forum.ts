// Forum types generated from the Supabase forum schema

export interface ForumUser {
  profile_id: string; // links to profiles(id)
  id: string; // uuid
  profileId?: string | null; // link to main profile
  username: string;
  email: string;
  passwordHash?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  role: 'admin' | 'moderator' | 'user' | 'guest' | 'banned';
  isBanned: boolean;
  isMuted: boolean;
  registrationIp?: string | null;
  registrationUserAgent?: string | null;
  trustScore: number;
  privacyOptOut: boolean;
  isApprovedToPost: boolean; // camelCase for frontend logic
  is_approved_to_post: boolean; // snake_case for API compatibility
  createdAt: string;
  updatedAt: string;
}

export interface ForumCategory {
  profile_id: string;
  id: number;
  parentId?: number | null;
  name: string;
  description?: string | null;
  isPrivate: boolean;
  isLocked: boolean;
  sortOrder: number;
  threadCount: number;
  postCount: number;
  lastActivityAt?: string | null;
  lastActivityBy?: string | null; // forum_users.id
  createdAt: string;
  updatedAt: string;
}

export interface ForumThread {
  views: number; // Number of views for the thread
  profile_id: string;
  id: number;
  categoryId: number;
  authorId: string; // forum_users.id
  title: string;
  content?: string | null;
  isSticky: boolean;
  isLocked: boolean;
  isPrivate: boolean;
  isDeleted: boolean;
  isApproved: boolean;
  approvalRequested: boolean;
  isSpam: boolean;
  isBot: boolean;
  tags?: string[] | null;
  replyCount: number;
  viewCount: number;
  lastActivityAt?: string | null;
  lastActivityBy?: string | null; // forum_users.id
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ForumPost {
  views: number; // Number of views for the post
  profile_id: string;
  id: number;
  threadId: number;
  parentId?: number | null;
  authorId: string; // forum_users.id
  content?: string | null;
  isDraft: boolean;
  isApproved: boolean;
  approvalRequested: boolean;
  isSpam: boolean;
  isBot: boolean;
  isDeleted: boolean;
  isHidden: boolean;
  isPrivate: boolean;
  editCount: number;
  lastEditedAt?: string | null;
  lastEditedBy?: string | null; // forum_users.id
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ForumModerationLog {
  profile_id: string;
  id: number;
  action: string;
  targetType: 'thread' | 'post' | 'user' | 'category';
  targetId?: number | null;
  performedBy?: string | null; // forum_users.id
  reason?: string | null;
  metadata?: any;
  createdAt: string;
}

export interface ForumReport {
  profile_id: string;
  id: number;
  reporterId: string; // forum_users.id
  targetType: 'thread' | 'post' | 'user';
  targetId: number;
  reason?: string | null;
  status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
  createdAt: string;
  reviewedBy?: string | null; // forum_users.id
  reviewedAt?: string | null;
}

export interface ForumApprovalQueue {
  profile_id: string;
  id: number;
  targetType: 'thread' | 'post';
  targetId: number;
  requestedBy?: string | null; // forum_users.id
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string | null; // forum_users.id
  reviewedAt?: string | null;
  notes?: string | null;
}

export interface ForumSpamEvent {
  profile_id: string;
  id: number;
  userId?: string | null; // forum_users.id
  ip?: string | null;
  userAgent?: string | null;
  eventType: string; // 'spam', 'bot', 'captcha_fail', etc.
  details?: any;
  createdAt: string;
}

export interface ForumAuditTrail {
  profile_id: string;
  id: number;
  userId?: string | null; // forum_users.id
  action: string;
  targetType: string;
  targetId?: number | null;
  metadata?: any;
  createdAt: string;
}

export interface ProfileConversion {
  id: number;
  created_at: string;
  profile_id: string | null;
  http_referer: string | null;
  headers: string | null;
}
