import React from 'react';
import ForumBreadcrumbs from './ForumBreadcrumbs';
import { Category, Thread } from './types';

import { ForumUser } from '../../types/forum';
import ForumUserCreationForm from './ForumUserCreationForm';

interface ForumThreadsListProps {
  category: Category;
  threads: Thread[];
  onThreadSelect: (threadId: number) => void;
  isLoggedIn: boolean;

  onSignInClick: () => void;
  onThreadCreated?: () => void; // callback to refresh threads
  onHomeClick?: () => void; // callback for breadcrumbs home
  forumUser?: ForumUser | null;
  forumUserLoading?: boolean;
  userId?: string;
  accessToken?: string;
}

import { useState } from 'react';

const ForumThreadsList: React.FC<ForumThreadsListProps> = ({ 
  category, 
  threads, 
  onThreadSelect,
  isLoggedIn,

  onSignInClick,
  onThreadCreated,
  onHomeClick,
  forumUser,
  forumUserLoading,
  userId,
  accessToken
}) => {


  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState(false);

  const handleOpenModal = () => {
    setTitle('');
    setContent('');
    setError(null);
    setSuccess(false);
    setShowModal(true);
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_threads`, {
        method: 'POST',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_id: category.id,
          title,
          content,
          profile_id: forumUser?.profile_id,
          author_id: forumUser?.id,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to create thread (${res.status})`);
      }
      setSuccess(true);
      setShowModal(false);
      if (onThreadCreated) onThreadCreated();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      {/* Breadcrumbs for threads list */}
      <ForumBreadcrumbs 
        categoryName={category.name}
        onHomeClick={onHomeClick}
      />
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-neutral-400">
          {threads.length} {threads.length === 1 ? 'thread' : 'threads'}
        </div>
        <div className="flex items-center gap-4">
          {forumUser && forumUser.username && (
            <span className="text-xs text-fuchsia-300 bg-neutral-800 border border-fuchsia-700 px-2 py-1 rounded-md select-all" title="Your forum username">
              <span className="font-mono">{forumUser.username}</span>
            </span>
          )}
          {isLoggedIn ? (
            <button 
              onClick={handleOpenModal}
              className="px-4 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white hover:from-fuchsia-500 hover:to-pink-500 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Thread
            </button>
          ) : (
            <span className="text-xs text-neutral-400">Login status: {String(isLoggedIn)}</span>
          )}
        </div>
      </div>
      
      {!isLoggedIn ? (
        <div className="mb-4 p-3 bg-fuchsia-900/20 border border-fuchsia-800/30 rounded-md text-sm text-fuchsia-200">
          <span className="font-medium">Note:</span> You need to sign in to create new threads or post replies.
        </div>
      ) : !forumUser ? (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-md text-sm text-yellow-200">
          <span className="font-medium">Note:</span> Setting up your forum account...
        </div>
      ) : null}

      {/* New Thread Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-neutral-900 p-6 rounded-lg border border-fuchsia-700/30 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-fuchsia-300">Create New Thread</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {forumUserLoading ? (
              <div className="p-4 text-center text-neutral-300">Loading your forum account status...</div>
            ) : !forumUser ? (
              <ForumUserCreationForm 
                onCreated={user => {
                  if (typeof window !== 'undefined') window.location.reload(); // force reload to get new forumUser
                }} 
                user={null}
                userId={userId}
                accessToken={accessToken}
              />
            ) : forumUser ? (
              !forumUser.is_approved_to_post ? (
                <div className="p-4 text-center text-yellow-200 bg-yellow-900/60 border border-yellow-700 rounded-md">
                  Posting is restricted. Please contact an admin to request posting privileges.
                </div>
              ) : (
                <form onSubmit={handleCreateThread} className="space-y-4">
                  <div>
                    <label className="block text-neutral-300 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      required
                      maxLength={64}
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1">Content</label>
                    <textarea 
                      value={content} 
                      onChange={e => setContent(e.target.value)} 
                      className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      required
                      maxLength={2048}
                      rows={4}
                    />
                  </div>
                  {error && <div className="text-red-400 text-sm">{error}</div>}
                  <div className="flex justify-end gap-2">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    >Cancel</button>
                    <button 
                      type="submit"
                      className="px-4 py-2 rounded-md bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold hover:from-fuchsia-500 hover:to-pink-500 disabled:opacity-60"
                      disabled={loading}
                    >{loading ? 'Creating...' : 'Create Thread'}</button>
                  </div>
                </form>
              )
            ) : null}
          </div>
        </div>
      )}
      
      <div className="bg-neutral-900/70 border border-fuchsia-700/30 rounded-lg overflow-hidden mb-4">
        <div className="block md:hidden">  {/* Mobile view */}
          {threads.map((thread) => (
            <div 
              key={thread.id}
              onClick={() => onThreadSelect(thread.id)}
              className={`border-b border-neutral-800 p-3 ${thread.pinned ? 'bg-fuchsia-950/20' : ''} hover:bg-fuchsia-900/10 cursor-pointer`}
            >
              <div className="flex items-center gap-2">
                {thread.pinned && (
                  <span className="px-1.5 py-0.5 bg-fuchsia-900/50 text-fuchsia-300 text-xs rounded-md">
                    Pinned
                  </span>
                )}
                {thread.locked && (
                  <span className="text-neutral-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                )}
              </div>
              <h3 className="font-medium text-fuchsia-300 mt-1">{thread.title}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {thread.tags?.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-1.5 py-0.5 bg-neutral-800 text-neutral-400 text-xs rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center mt-2 text-xs">
                <div className="text-fuchsia-400">{thread.author}</div>
                <div className="text-neutral-500">{thread.views} views · {thread.replyCount} replies</div>
              </div>
              {thread.lastReply && (
                <div className="mt-2 pt-2 border-t border-neutral-800/50 text-xs">
                  <div className="flex justify-between">
                    <div>Last reply by: <span className="text-pink-400">{thread.lastReply.user}</span></div>
                    <div className="text-neutral-500">{thread.lastReply.date}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <table className="w-full text-neutral-300 hidden md:table">{/* Desktop view */}<thead className="bg-fuchsia-900/50 text-fuchsia-100 text-left text-sm"><tr><th className="py-3 px-4">Thread</th><th className="py-3 px-2 w-24">Author</th><th className="py-3 px-2 w-20 text-center">Replies</th><th className="py-3 px-2 w-20 text-center">Views</th><th className="py-3 px-2 w-32">Last Activity</th></tr></thead><tbody>{threads.map((thread) => (<tr key={thread.id} onClick={() => onThreadSelect(thread.id)} className={`border-t border-neutral-800 hover:bg-fuchsia-900/10 cursor-pointer transition-colors ${thread.pinned ? 'bg-fuchsia-950/20' : ''}`}><td className="py-3 px-4"><div className="flex items-center gap-2">{thread.locked && (<span className="text-neutral-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></span>)}<div><div className="font-medium text-fuchsia-300 hover:text-fuchsia-200">{thread.title}</div><div className="flex flex-wrap gap-1 mt-1">{thread.pinned && (<span className="px-1.5 py-0.5 bg-fuchsia-900/50 text-fuchsia-300 text-xs rounded-md">Pinned</span>)}{thread.tags?.map((tag) => (<span key={tag} className="px-1.5 py-0.5 bg-neutral-800 text-neutral-400 text-xs rounded-md">#{tag}</span>))}</div></div></div></td><td className="py-3 px-2"><span className="text-sm text-fuchsia-400">{thread.author}</span></td><td className="py-3 px-2 text-center"><span className="text-sm">{thread.replyCount}</span></td><td className="py-3 px-2 text-center"><span className="text-sm">{thread.views}</span></td><td className="py-3 px-2">{thread.lastReply ? (<div className="text-xs"><div className="text-pink-400">{thread.lastReply.user}</div><div className="text-neutral-500">{thread.lastReply.date}</div></div>) : (<div className="text-xs text-neutral-500">{thread.createdAt}</div>)}</td></tr>))}</tbody></table>
      </div>
      
      <div className="flex justify-between items-center text-sm text-neutral-400">
        <div>Page 1 of 1</div>
        <div className="flex gap-1">
          <button disabled className="px-3 py-1 bg-neutral-800 rounded-md text-neutral-500 cursor-not-allowed">
            Previous
          </button>
          <button disabled className="px-3 py-1 bg-neutral-800 rounded-md text-neutral-500 cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumThreadsList;
