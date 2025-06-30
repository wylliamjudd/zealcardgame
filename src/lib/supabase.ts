import { createClient, SupabaseClient } from '@supabase/supabase-js';



const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;




if (!supabaseUrl || !supabaseKey) {
  const error = new Error('Missing Supabase environment variables. Check your .env file.');
  console.error(error);
  throw error;
}

// Create the Supabase client instance with custom fetch implementation
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: async (url, options) => {
      // Create a timeout promise that rejects after 8 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Supabase request timed out')), 8000);
      });

      try {
        // Race the fetch against the timeout
        const response = await Promise.race([
          fetch(url, options),
          timeoutPromise
        ]) as Response;
        
        return response;
      } catch (error) {
        console.error('Enhanced fetch wrapper error:', error);
        throw error;
      }
    }
  }
});

// Set up auth state change handler
supabase.auth.onAuthStateChange((event, session) => {

});

// Note: The old IIFE that contained the client connection retry loop has been removed
// to simplify logging and focus on the direct client query test.

export { supabaseUrl, supabaseKey }; // Exporting these might not be necessary if not used elsewhere
                                   // but keeping for now if they were part of original design.

