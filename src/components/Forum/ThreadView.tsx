import * as React from 'react';
import { Thread, Post } from './types';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthorization } from '../../hooks/useAuthorization';

interface ThreadViewProps {
  thread: Thread;
  posts: Post[];
  isLoggedIn: boolean;
  onSignInClick: () => void;
  onBack?: () => void;
  forumUser?: import('../../types/forum').ForumUser | null;
  accessToken?: string;
  onHomeClick?: () => void;
  onReplyPosted?: () => void;
}


const ThreadView: React.FC<ThreadViewProps> = ({ thread, posts, isLoggedIn, onSignInClick, onBack, forumUser, accessToken, onHomeClick, onReplyPosted }) => {
  // Render forum breadcrumbs for thread detail
  // If you have category name available, pass it as categoryName
  
  // ...rest of the ThreadView logic

  // State hooks
  const [replyContent, setReplyContent] = React.useState('');
  const [replyingToId, setReplyingToId] = React.useState<number | null>(null);

  // ...other logic (handlers, helpers, etc)
  // --- Handlers and helpers here ---
  // (all logic outside the return)

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyContent('');
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumUser || !forumUser.profile_id || !accessToken) {
      alert('You must be logged in and approved to post.');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_posts`, {
        method: 'POST',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: thread.id,
          parent_id: replyingToId,
          content: replyContent,
          profile_id: forumUser.profile_id,
          author_id: forumUser.id,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to post reply (${res.status})`);
      }
      setReplyingToId(null);
      setReplyContent('');
      if (onReplyPosted) onReplyPosted();
    } catch (err: any) {
      alert(err.message || 'Failed to post reply');
    }
  };

  const handleReplyClick = (postId: number) => {
    setReplyingToId(postId);
  };

  const handleSignIn = () => {
    onSignInClick();
  };

  // Group posts by their parent ID to implement the threaded view
  const rootPosts = posts.filter(post => post.parentId === null || post.parentId === undefined);
  
  // Function to render a post and its replies recursively
  // Increment post view count
  const incrementPostViews = async (postId: number, currentViews: number) => {
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_posts?id=eq.${postId}`, {
        method: 'PATCH',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ views: (currentViews || 0) + 1 })
      });
    } catch (err) {
      // Optionally log error
    }
  };

  const renderPost = (post: Post, depth: number = 0) => {
    // Increment views for this post
    incrementPostViews(post.id, post.views);

    const replies = posts.filter(p => p.parentId === post.id);
    const hasReplies = replies.length > 0;
    
    return (
      <div key={post.id} className={`mt-${depth > 0 ? '4' : '0'}`}>
        <div className={`
          bg-neutral-900/70 border rounded-lg overflow-hidden
          ${depth === 0 ? 'border-fuchsia-700/30' : 'border-fuchsia-800/20 ml-6'}
        `}>
          {/* Post header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-fuchsia-900/20 px-3 md:px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-fuchsia-700 rounded-full flex items-center justify-center text-white">
                {(post.author ? post.author.charAt(0) : '?')}
              </div>
              <div>
                <div className="font-medium text-fuchsia-300">{post.author}</div>
                <div className="text-xs text-neutral-500">{post.createdAt}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {post.editedAt && (
                <span className="text-xs text-neutral-500">Edited: {post.editedAt}</span>
              )}
            </div>
          </div>
          
          {/* Post content */}
          <div className="px-4 py-3 text-neutral-200 whitespace-pre-line">
            <div className="prose prose-invert max-w-none prose-headings:text-fuchsia-300 prose-a:text-pink-400 prose-code:bg-neutral-800 prose-code:text-pink-300">
              {/* Parse markdown to HTML here in a real app */}
              {post.content}
            </div>
          </div>
          
          {/* Post footer */}
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/50 border-t border-neutral-800">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 text-sm text-neutral-400 hover:text-fuchsia-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                Like ({post.likes})
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReplyClick(post.id)}
                  className="flex items-center gap-1 text-sm text-neutral-400 hover:text-fuchsia-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Reply
                </button>
              </div>
            </div>
            {isLoggedIn && (
              <div className="text-xs">
                <button className="text-neutral-500 hover:text-neutral-300">
                  Report
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Render replies recursively */}
        {hasReplies && (
          <div className="ml-6 border-l-2 border-fuchsia-900/20 pl-4 mt-3">
            {replies.map(reply => renderPost(reply, depth + 1))}
          </div>
        )}
        
        {/* Show reply form directly below the post if replying to this post */}
        {replyingToId === post.id && (
          <div id="reply-form" className="ml-6 mt-4">
            <form onSubmit={handleSubmitReply} className="bg-neutral-900/70 border border-fuchsia-800/30 rounded-lg p-4">
              <div className="text-sm text-fuchsia-300 mb-2">
                Replying to <span className="font-medium">{post.author ? post.author : '?'}</span>
              </div>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full h-32 bg-neutral-800 border border-neutral-700 rounded-md p-3 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                required
              />
              <div className="flex flex-row-reverse justify-end gap-2 mt-3">
                <button 
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-highlight to-highlight-dark text-white rounded-md hover:from-highlight hover:to-highlight-dark"
                >
                  Post Reply
                </button>
                <button 
                  type="button"
                  onClick={handleCancelReply}
                  className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-md hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-md hover:bg-neutral-700"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };

  // Main ThreadView return
  return (
    <div className="w-full max-w-6xl mx-auto p-3 md:p-8 mb-24">

      {/* Thread meta */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-400">
          <div>Started by <span className="text-fuchsia-400">{thread.author || 'Unknown'}</span></div>
          <div>Created on {thread.createdAt ? new Date(thread.createdAt).toLocaleString() : 'Unknown'}</div>
          <div>{thread.views} views</div>
          <div>{thread.replyCount} replies</div>
        </div>
      </div>
      {/* Thread content (if exists) */}
      {thread && (thread as any).content && (
        <div className="text-neutral-300 mb-6">{(thread as any).content}</div>
      )}
      {/* Posts */}
      <div className="space-y-6">
        {rootPosts.map((post: Post) => renderPost(post))}
      </div>
      {/* Reply form */}
      {isLoggedIn ? (
        <div id="reply-form" className="mt-8">
          <h2 className="text-lg font-semibold text-fuchsia-300 mb-2">Reply to Thread</h2>
          <form onSubmit={handleSubmitReply} className="space-y-2">
            <textarea
              className="w-full px-3 py-2 rounded bg-neutral-800 text-neutral-100 border border-fuchsia-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
              rows={4}
              placeholder="Write your reply..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelReply}
                className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-md hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-gradient-to-r from-highlight to-highlight-dark text-white rounded-md font-semibold hover:from-fuchsia-700 hover:to-pink-700"
              >
                Post Reply
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-6 bg-neutral-900/50 border border-fuchsia-700/20 rounded-lg p-4 text-center">
          <p className="text-neutral-300 mb-3">You need to be signed in to post replies.</p>
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-gradient-to-r from-highlight to-highlight-dark text-white rounded-md hover:from-highlight hover:to-highlight-dark"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreadView;
