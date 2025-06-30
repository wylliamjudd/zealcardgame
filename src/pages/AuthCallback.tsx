import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// This component handles OAuth redirects and callback processing
const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    let isMounted = true;
    
    // Force redirect to home after a short delay regardless of auth outcome
    const forceRedirectTimeout = setTimeout(() => {
      if (isMounted) {

        window.location.href = '/';  // Use window.location for a hard redirect
      }
    }, 2000);
    
    // Process OAuth callback
    const handleAuthCallback = async () => {
      console.log('[AuthCallback] Mounted. Starting handleAuthCallback...');

      
      try {
        // Extract the code from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {

          setStatus('Authentication code received...');
        }
        
        // Get the current session state
        console.log('[AuthCallback] Calling supabase.auth.getSession()...');
        const { data, error } = await supabase.auth.getSession();
        console.log('[AuthCallback] getSession response:', { data, error });
        
        if (error) {
          console.error('[AuthCallback] Authentication error:', error);

          setStatus('Authentication error, redirecting...');
        } else if (data?.session) {
          console.log('[AuthCallback] Authentication successful. Session:', data.session);

          setStatus('Authentication successful, redirecting...');
          
          // If we have a valid session, redirect now
          if (isMounted) {
            clearTimeout(forceRedirectTimeout);

            navigate('/', { replace: true });
          }
        } else {

          setStatus('No session found, redirecting...');
          console.log('[AuthCallback] No session found after getSession, but no error. Redirecting.');
          
          // Redirect anyway
          if (isMounted) {
            clearTimeout(forceRedirectTimeout);
            console.log('[AuthCallback] Navigating to /');
            navigate('/', { replace: true });
          }
        }
      } catch (err) {
        console.error('[AuthCallback] Exception in handleAuthCallback:', err);

        setStatus('Authentication error, redirecting...');
        
        if (isMounted) {
          clearTimeout(forceRedirectTimeout);
          navigate('/', { replace: true });
        }
      }
    };

    handleAuthCallback();
    
    return () => {
      isMounted = false;
      clearTimeout(forceRedirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-fuchsia-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl text-fuchsia-300 font-medium">Completing authentication...</h2>
        <p className="text-neutral-400 mt-2">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
