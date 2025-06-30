import { useAuth } from '../contexts/AuthContext';

type Permission = 'createThread' | 'createPost' | 'editPost' | 'deletePost' | 'pinThread' | 'lockThread' | 'moderateContent' | 'manageUsers' | 'adminSettings';

export const useAuthorization = () => {
  const { profile, user, session } = useAuth();
  
  const checkPermission = (permission: Permission): boolean => {
    // If no profile, user has no permissions
    if (!profile) return false;
    
    // Role-based permission matrix
    const rolePermissions: Record<string, Permission[]> = {
      admin: [
        'createThread', 'createPost', 'editPost', 'deletePost',
        'pinThread', 'lockThread', 'moderateContent', 'manageUsers', 'adminSettings'
      ],
      moderator: [
        'createThread', 'createPost', 'editPost', 'deletePost',
        'pinThread', 'lockThread', 'moderateContent'
      ],
      user: ['createThread', 'createPost', 'editPost', 'deletePost'],
      guest: []
    };
    
    // Check if the user's role has the required permission
    const userRole = profile.role || 'guest';
    return rolePermissions[userRole]?.includes(permission) || false;
  };
  
  // Helpful role check functions
  const isAdmin = (): boolean => profile?.role === 'admin';
  const isModerator = (): boolean => profile?.role === 'admin' || profile?.role === 'moderator';
  const isLoggedIn = (): boolean => !!(user || session);
  
  return {
    checkPermission,
    isAdmin,
    isModerator,
    isLoggedIn,
    role: profile?.role || 'guest'
  };
};
