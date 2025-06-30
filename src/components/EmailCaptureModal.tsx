import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ProfileConversion } from '../types/forum';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const trackConversion = async () => {
    try {
      // Get all headers we can access from the browser
      const headers = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        vendor: navigator.vendor,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        // Note: Most HTTP headers are not accessible from browser JavaScript
        // We can only get what the browser exposes
        referrer: document.referrer,
        url: window.location.href,
        timestamp: new Date().toISOString()
      };

      const conversionData: Omit<ProfileConversion, 'id' | 'created_at'> = {
        profile_id: user?.id || null,
        http_referer: document.referrer || null,
        headers: JSON.stringify(headers)
      };

      const { error } = await supabase
        .from('profile_conversion')
        .insert([conversionData]);

      if (error) {
        console.error('Error tracking conversion:', error);
      }
    } catch (err) {
      console.error('Error in trackConversion:', err);
    }
  };

  const handleSubmit = async (skipEmail: boolean = false) => {
    setIsLoading(true);
    
    try {
      // Track the conversion (don't await to prevent blocking)
      trackConversion().catch(err => console.error('Conversion tracking error:', err));

      // If email was provided and not skipped, you could save it here
      // For now, we'll just track the conversion
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to Kickstarter with tracking parameter
      window.open('https://www.kickstarter.com?ref=zealweb', '_blank');
      
      // Close the modal
      onClose();
      
      // Reset loading state
      setIsLoading(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setIsLoading(false);
      
      // Still redirect even if there's an error
      window.open('https://www.kickstarter.com?ref=zealweb', '_blank');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
              {/* Close button - more visible */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-purple-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all duration-200 z-10"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* VIP Badge */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-yellow-500 text-purple-900 rounded-full font-bold text-sm mb-4">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  VIP EARLY ACCESS
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Become a VIP Backer!
                </h2>
                <p className="text-purple-200">
                  Join our exclusive list for special perks and updates
                </p>
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-purple-800 bg-opacity-50 text-white placeholder-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-xs text-purple-300 mt-2">
                  Lock in your VIP status now with a valid email.
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Go to Kickstarter →'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmailCaptureModal;