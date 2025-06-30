export interface Category {
  id: number;
  name: string;
  description: string;
  threadCount: number;
  postCount: number;
  lastActivity?: {
    threadId: number;
    threadTitle: string;
    date: string;
    user: string;
  }
  iconName?: string;
}

export interface Thread {
  id: number;
  categoryId: number;
  title: string;
  author: string;
  authorId: number;
  createdAt: string;
  lastActivity: string;
  views: number;
  replyCount: number;
  pinned: boolean;
  locked: boolean;
  tags?: string[];
  lastReply?: {
    user: string;
    userId: number;
    date: string;
  };
  forum_users?: {
    username: string;
  };
}

export interface Post {
  id: number;
  threadId: number;
  parentId?: number | null;
  author: string;
  authorId: number;
  createdAt: string;
  editedAt?: string;
  content: string;
  likes: number;
  depth: number; // For threaded replies nesting
  views: number;
  userHasLiked?: boolean;
}

export interface User {
  id: string; // uuid
  profileId?: string | null; // link to main profile
  username: string;
  avatar?: string;
  joinDate: string;
  postCount: number;
  role: 'admin' | 'moderator' | 'user' | 'guest' | 'banned';
  // Optionally, add: profile?: Profile;
}
