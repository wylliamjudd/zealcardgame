import React, { useState, useEffect, useRef } from 'react';
import ForumCategoriesList from './ForumCategoriesList';
import ForumThreadsList from './ForumThreadsList';
import ThreadView from './ThreadView';
import ForumBreadcrumbs from './ForumBreadcrumbs';

// Categories now fetched from Supabase REST API
import { Category, Thread, Post } from './types';
import { ForumUser } from '../../types/forum';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthorization } from '../../hooks/useAuthorization';

// Main forum component that orchestrates the forum UI and state
const Forum: React.FC = () => {
  const { user, session, profile, signInWithGoogle, signOut } = useAuth(); // Only declaration of user, session, profile, signInWithGoogle, signOut
  // Reference to the forum container for scrolling
  const forumRef = useRef<HTMLDivElement>(null);
  
  // State declarations
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'categories' | 'threads' | 'thread'>('categories');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Forum user privilege state
  const [forumUser, setForumUser] = useState<ForumUser | null>(null);
  const [forumUserLoading, setForumUserLoading] = useState(false);
  const [forumUserError, setForumUserError] = useState<string | null>(null);

  // Threads state for selected category
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState<string | null>(null);

  // Fetch categories from Supabase REST API on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_categories`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        setCategoriesError(err.message || 'Unknown error');
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);
  
  // Use the real authentication system
  // Removed duplicate destructuring of user, profile, signInWithGoogle, signOut
  const { isLoggedIn, checkPermission, role } = useAuthorization();

  // Fetch forum user privileges after login
  useEffect(() => {
    if (!user) {
      setForumUser(null);
      return;
    }
    const fetchForumUser = async () => {
      setForumUserLoading(true);
      setForumUserError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_users?profile_id=eq.${user.id}`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': session && session.access_token ? `Bearer ${session.access_token}` : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch forum user: ${res.status}`);
        const data = await res.json();
        setForumUser(data[0] || null);
      } catch (err: any) {
        setForumUserError(err.message || 'Unknown error');
        setForumUser(null);
      } finally {
        setForumUserLoading(false);
      }
    };
    fetchForumUser();
  }, [user]);

  // Effect to scroll to the top when the component mounts or view changes
  useEffect(() => {
    // Scroll to the top of the forum section
    if (forumRef.current) {
      forumRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Reset scroll position within the section
    window.scrollTo(0, window.scrollY);
  }, [currentView]);

  // Handle category selection
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSelectedThreadId(null);
    setCurrentView('threads');
  };

  // Handle thread selection
  const handleThreadSelect = async (threadId: number) => {
    // Increment views counter before showing thread
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_threads?id=eq.${threadId}`, {
        method: 'PATCH',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ views: (threads.find(t => t.id === threadId)?.views || 0) + 1 })
      });
    } catch (err) {
      // Optionally log error
    }
    setSelectedThreadId(threadId);
    setCurrentView('thread');
  };

  // Handle back navigation
  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setSelectedThreadId(null);
    setCurrentView('categories');
  };

  const handleBackToThreads = () => {
    setSelectedThreadId(null);
    setCurrentView('threads');
  };

  // Handle sign in button click
  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
  };

  // Real sign in function using Google OAuth
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setIsSignInModalOpen(false);
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const selectedCategory = selectedCategoryId !== null
    ? categories.find((c: Category) => c.id === selectedCategoryId)
    : null;

  // Fetch threads for selected category
  useEffect(() => {
    if (!selectedCategoryId) {
      setThreads([]);
      return;
    }
    const fetchThreads = async () => {
      setThreadsLoading(true);
      setThreadsError(null);
      try {
        // Fetch threads with author username by joining forum_users
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_threads?category_id=eq.${selectedCategoryId}&order=created_at.desc&select=*,forum_users:author_id(username)`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch threads: ${res.status}`);
        const data = await res.json();
        // Map author username
        const threadsWithAuthor = data.map((thread: any) => ({
          ...thread,
          author: thread.forum_users?.username || thread.author,
        }));
        setThreads(threadsWithAuthor);
      } catch (err: any) {
        setThreadsError(err.message || 'Unknown error');
        setThreads([]);
      } finally {
        setThreadsLoading(false);
      }
    };
    fetchThreads();
  }, [selectedCategoryId]);

  // Helper to refresh threads after new thread creation
  const refreshThreads = () => {
    if (selectedCategoryId) {
      // re-fetch threads
      setThreadsLoading(true);
      setThreadsError(null);
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_threads?category_id=eq.${selectedCategoryId}&order=created_at.desc`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => setThreads(data))
        .catch(() => setThreads([]))
        .finally(() => setThreadsLoading(false));
    }
  };

  // Permission logic for posting



  
  // const filteredThreads = selectedCategoryId !== null
  
  

  const selectedThread = selectedThreadId !== null
    ? (() => {
        const t = threads.find((t: any) => t.id === selectedThreadId);
        if (!t) return null;
        // Prefer joined username if available, fallback to thread.author (which should always be set)
        return {
          ...t,
          author: t.forum_users?.username || t.author,
        };
      })()
    : null;

  // Fetch posts for the selected thread from Supabase
  const [threadPosts, setThreadPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedThreadId) {
      setThreadPosts([]);
      return;
    }
    setPostsLoading(true);
    setPostsError(null);
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_threads?id=eq.${selectedThreadId}&select=*,forum_users:author_id(username)`, {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setThreadPosts(data[0]?.posts || []))
      .catch(() => setThreadPosts([]))
      .finally(() => setPostsLoading(false));
  }, [selectedThreadId]);

  return (
    <div ref={forumRef} className="w-full min-h-screen bg-neutral-950 text-neutral-100">
      {/* Forum header with sign in */}
      <div className="fixed top-0 w-full bg-black/80 backdrop-blur-sm z-10 border-b border-fuchsia-700/30 px-4 py-2 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">
          {currentView === 'categories' && 'Zeal Forums'}
          {currentView === 'threads' && selectedCategory?.name}
          {currentView === 'thread' && selectedThread?.title}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={currentView === 'threads' ? handleBackToCategories : currentView === 'thread' ? handleBackToThreads : undefined}
            className={`px-3 py-1 rounded-md text-sm font-medium ${currentView === 'categories' ? 'invisible' : 'text-white bg-fuchsia-800 hover:bg-fuchsia-700'}`}
          >
            Back
          </button>
          {isLoggedIn() ? (
            <div className="flex items-center gap-2">
              <span className="text-fuchsia-300">{profile?.username || user?.email?.split('@')[0]}</span>
              <div className="relative group">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full cursor-pointer" 
                  />
                ) : (
                  <div className="w-8 h-8 bg-fuchsia-700 rounded-full flex items-center justify-center text-white cursor-pointer">
                    {(profile?.username || user?.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-fuchsia-700/30 rounded-md shadow-lg py-1 hidden group-hover:block z-20">
                  <div className="px-4 py-2 border-b border-neutral-800">
                    <p className="text-fuchsia-300 font-medium">{profile?.username || user?.email?.split('@')[0]}</p>
                    <p className="text-xs text-neutral-400">{role}</p>
                  </div>
                  <button 
                    onClick={handleSignOut} 
                    className="w-full text-left px-4 py-2 text-neutral-300 hover:bg-neutral-800"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleSignInClick}
              className="px-3 py-1 rounded-md text-sm font-medium bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white hover:from-fuchsia-500 hover:to-pink-500"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="w-full flex flex-col">
        {currentView === 'categories' && (
          categoriesLoading ? (
            <div className="text-center text-neutral-400 py-8">Loading categories...</div>
          ) : categoriesError ? (
            <div className="text-center text-red-400 py-8">{categoriesError}</div>
          ) : (
            <ForumCategoriesList 
              categories={categories} 
              onCategorySelect={handleCategorySelect} 
            />
          )
        )}
        
        {currentView === 'threads' && selectedCategory && (
          threadsLoading ? (
            <div className="text-center text-neutral-400 py-8">Loading threads...</div>
          ) : threadsError ? (
            <div className="text-center text-red-400 py-8">{threadsError}</div>
          ) : (
            <ForumThreadsList 
              category={selectedCategory}
              threads={threads}
              onThreadSelect={handleThreadSelect}
              isLoggedIn={isLoggedIn()}
              onSignInClick={handleSignInClick}
              onThreadCreated={refreshThreads}
              onHomeClick={handleBackToCategories}
              forumUser={forumUser}
              forumUserLoading={forumUserLoading}
              userId={user ? user.id : undefined}
              accessToken={session ? session.access_token : undefined}
            />
          )
        )}
        
        {currentView === 'thread' && selectedThread && (
          <>
            <div className="p-4 md:p-8">
              <ForumBreadcrumbs
                categoryName={selectedCategory ? selectedCategory.name : undefined}
                threadTitle={selectedThread.title}
                onHomeClick={handleBackToCategories}
                onCategoryClick={() => {
                  setCurrentView('threads');
                  setSelectedThreadId(null);
                }}
              />
            </div>
            {postsLoading ? (
              <div className="text-center text-neutral-400 py-8">Loading posts...</div>
            ) : postsError ? (
              <div className="text-center text-red-400 py-8">{postsError}</div>
            ) : (
              <ThreadView 
                thread={selectedThread}
                posts={threadPosts}
                isLoggedIn={isLoggedIn()}
                onSignInClick={handleSignInClick}
                forumUser={forumUser}
                accessToken={session ? session.access_token : undefined}
                onReplyPosted={() => {
                  if (!selectedThreadId) return;
                  setPostsLoading(true);
                  setPostsError(null);
                  fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_posts?thread_id=eq.${selectedThreadId}&order=created_at.asc`, {
                    headers: {
                      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                      'Content-Type': 'application/json',
                    },
                  })
                    .then(res => {
                      if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
                      return res.json();
                    })
                    .then(data => setThreadPosts(data))
                    .catch(err => {
                      setPostsError(err.message || 'Unknown error');
                      setThreadPosts([]);
                    })
                    .finally(() => setPostsLoading(false));
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Sign In Modal */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-neutral-900 p-6 rounded-lg border border-fuchsia-700/30 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-fuchsia-300">Sign In</h2>
              <button 
                onClick={() => setIsSignInModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-neutral-300 mb-4">Sign in to participate in the forum:</p>
            <div className="space-y-3">
              <button 
                onClick={handleSignIn}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 px-4 rounded-md font-medium hover:bg-neutral-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </div>
            <button 
              onClick={() => setIsSignInModalOpen(false)}
              className="mt-4 w-full py-2 bg-neutral-800 text-neutral-300 rounded-md hover:bg-neutral-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
