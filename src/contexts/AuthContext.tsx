import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ErrorCategory, handleError } from '../utils/ErrorUtils';

type UserProfile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  role: 'admin' | 'moderator' | 'user' | 'guest';
  created_at: string;
  last_sign_in: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch session and user on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Session fetch started
        setIsLoading(true);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          // Log detailed error but provide generic message
          handleError(error, ErrorCategory.AUTH, 'SESSION_EXPIRED');
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          // Successfully fetched session
          setSession(data.session);
          setUser(data.session.user);
          await fetchProfile(data.session.user.id);
        } else {
          // No active session - normal state, not an error
          setIsLoading(false);
        }
      } catch (error) {
        // Log detailed error but provide generic message
        handleError(error, ErrorCategory.AUTH, 'SESSION_EXPIRED');
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {

      
      if (event === 'SIGNED_IN') {

        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {

          try {
            await fetchProfile(newSession.user.id);
          } catch (error) {

          }
        }
      } 
      else if (event === 'SIGNED_OUT') {

        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
      else if (event === 'TOKEN_REFRESHED') {

        setSession(newSession);
      }
      else if (event === 'USER_UPDATED') {

        setSession(newSession);
        setUser(newSession?.user ?? null);
      } else {

      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch or create user profile
  const fetchProfile = async (userId: string) => {
    setIsLoading(true);

    try {
      // Try to fetch the profile with a reasonable timeout
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const { data, error } = await profilePromise;
      
      if (error && (error.code === 'PGRST116' || error.message.includes('No rows returned'))) {
        try {
          // Profile doesn't exist yet, so create it
          await createProfile(userId);
        } catch (createError) {
          // Log the error internally but don't expose details
          handleError(createError, ErrorCategory.AUTH, 'PROFILE_ERROR');
        }
        return;
      } else if (error) {
        // Log detailed error but provide generic message
        handleError(error, ErrorCategory.AUTH, 'PROFILE_ERROR');
        setIsLoading(false);
        return;
      }

      if (data) {
        // Successfully fetched profile
        setProfile(data as UserProfile);
        setIsLoading(false);
      } else {

        setIsLoading(false);
      }
    } catch (error) {

      // Always ensure loading state is reset
      setIsLoading(false);
    }
  };

  // Create a new user profile
  const createProfile = async (userId: string) => {
    try {
      // Get user details from auth
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (!user) {
        handleError(new Error('No user found'), ErrorCategory.AUTH, 'PROFILE_ERROR');
        throw new Error(handleError(null, ErrorCategory.AUTH, 'PROFILE_ERROR'));
      }

      // Extract username from email or use a default
      const username = user.email ? user.email.split('@')[0] : `user${Math.floor(Math.random() * 10000)}`;
      
      // Create default profile with user role
      const newProfile: Partial<UserProfile> = {
        id: userId,
        username,
        avatar_url: user.user_metadata?.avatar_url || null,
        role: 'user', // Default role
        created_at: new Date().toISOString(),
        last_sign_in: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .insert(newProfile);

      if (error) {
        // Log detailed error internally but return generic message
        handleError(error, ErrorCategory.DATA, 'SAVE_ERROR');
      } else {
        // Fetch the newly created profile
        await fetchProfile(userId);
      }
    } catch (error) {
      // Log detailed error but provide generic message
      handleError(error, ErrorCategory.AUTH, 'PROFILE_ERROR');
      setIsLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      // Get the base URL without any trailing slash
      let baseUrl = window.location.origin;
      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
          queryParams: {
            prompt: 'select_account', // Forces Google to show account selection screen
          },
        },
      });

      if (error) {
        // Log the detailed error but don't expose it to the user
        handleError(error, ErrorCategory.AUTH, 'SIGN_IN_ERROR');
        throw new Error(handleError(error, ErrorCategory.AUTH, 'SIGN_IN_ERROR'));
      }
    } catch (error) {
      // Log the detailed error but don't expose it to the user
      handleError(error, ErrorCategory.AUTH, 'SIGN_IN_ERROR');
      throw new Error(handleError(error, ErrorCategory.AUTH, 'SIGN_IN_ERROR'));
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      try {
        // Configure signOut to remove cookies and storage - use Supabase's built-in method
        // This properly removes tokens from all storage mechanisms
        await Promise.race([
          supabase.auth.signOut({
            scope: 'global' // Sign out from all tabs/windows
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]);
      } catch (signOutError) {
        // Continue with cleanup regardless of signOut errors
      }
      
      // Always clean up local state regardless of Supabase API result
      setSession(null);
      setUser(null);
      setProfile(null);
      
      // Note: We no longer manually manipulate localStorage as it's less secure
      // Supabase's signOut() properly handles token cleanup in a more secure way
    } catch (error) {
      // Don't rethrow - we want to avoid breaking the UI even if logout has issues
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      const genericError = handleError(new Error('No user logged in'), ErrorCategory.AUTH, 'UNAUTHORIZED');
      throw new Error(genericError);
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        // Log detailed error but provide generic message
        handleError(error, ErrorCategory.DATA, 'SAVE_ERROR');
        throw new Error(handleError(error, ErrorCategory.DATA, 'SAVE_ERROR'));
      }

      // Refresh the profile
      await fetchProfile(user.id);
    } catch (error) {
      // Log detailed error but provide generic message
      handleError(error, ErrorCategory.DATA, 'SAVE_ERROR');
      throw new Error(handleError(error, ErrorCategory.DATA, 'SAVE_ERROR'));
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
