import React, { useState } from 'react';
import { ForumUser } from '../../types/forum';

interface ForumUserCreationFormProps {
  onCreated: (user: ForumUser) => void;
  user: ForumUser | null;
  userId?: string;
  accessToken?: string;
}

const ForumUserCreationForm: React.FC<ForumUserCreationFormProps> = ({ onCreated, userId, accessToken }) => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Try to get the user's email from the session/user context if available
  // Always ensure email is a string (never undefined)
  let email = '';
  if ((window as any).userEmail) {
    email = (window as any).userEmail;
  } else if ((window as any).user && (window as any).user.email) {
    email = (window as any).user.email;
  }
  if (typeof email !== 'string') email = '';

  const validate = () => {
    if (!username.trim()) return 'Username is required.';
    if (username.length > 32) return 'Username must be 32 characters or less.';
    if (bio.length > 256) return 'Bio must be 256 characters or less.';
    if (avatarUrl && avatarUrl.length > 256) return 'Avatar URL must be 256 characters or less.';
    if (avatarUrl && !/^https?:\/\//.test(avatarUrl)) return 'Avatar URL must be a valid URL.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    // Try to get the user's ID from props or window context
    let profileId = userId || (window as any).userId;
    if (!profileId && typeof window !== 'undefined') {
      // Try to get from a global user context if available
      profileId = (window as any).user?.id;
    }
    if (!profileId || !accessToken) {
      setError('You must be signed in to create a forum account.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        username,
        email: email || '',
        profile_id: profileId,
        is_approved_to_post: false,
        is_banned: false,
        is_muted: false,
        role: 'user',
      };
      if (bio) payload.bio = bio;
      if (avatarUrl) payload.avatar_url = avatarUrl;
      if (!accessToken) {
        setError('You must be signed in to create a forum account.');
        setLoading(false);
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/forum_users`, {
        method: 'POST',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create forum user');
      let data: any = null;
      let jsonError = false;
      try {
        data = await res.json();
      } catch (jsonErr) {
        jsonError = true;
      }
      setSuccess(true);
      if (data && data.length > 0) {
        onCreated(data[0]);
      } else if (jsonError) {
        // Treat as success if status is 2xx but response is not JSON
        if (typeof window !== 'undefined') window.location.reload();
      }
    } catch (err: any) {
      // Handle Supabase unique constraint violation for username
      if (err && err.message && typeof err.message === 'string' && err.message.includes('duplicate key value')) {
        setError('That username is already taken. Please choose another.');
      } else if (err && err.code === '23505') {
        setError('That username is already taken. Please choose another.');
      } else {
        setError(err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }


  };

  if (success) {
    return (
      <div className="p-4 text-center text-green-200 bg-green-900/40 border border-green-700 rounded-md">
        Forum account created! Please reload the page or click New Thread again.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-2 text-fuchsia-200">Create your forum account to post:</div>
      <div>
        <label className="block text-neutral-300 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          required
          maxLength={32}
        />
      </div>
      <div>
        <label className="block text-neutral-300 mb-1">Bio <span className="text-neutral-500 text-xs">(optional, 256 chars max)</span></label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          maxLength={256}
          rows={2}
        />
      </div>
      <div>
        <label className="block text-neutral-300 mb-1">Avatar URL <span className="text-neutral-500 text-xs">(optional, must start with http/https)</span></label>
        <input
          type="url"
          value={avatarUrl}
          onChange={e => setAvatarUrl(e.target.value)}
          className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          maxLength={256}
          placeholder="https://..."
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold hover:from-fuchsia-500 hover:to-pink-500 disabled:opacity-60"
          disabled={loading}
        >{loading ? 'Creating...' : 'Create Forum Account'}</button>
      </div>
    </form>
  );
};

export default ForumUserCreationForm;
