import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Outlet, useOutletContext, Link } from 'react-router-dom';
import StickyMenu from '../components/StickyMenu';

// Define the shape of the context if you plan to use useOutletContext
// This should match what you pass to Outlet's context prop
// Define the order and IDs of our sections, matching StickyMenu's menuPanes
// This ensures MainLayout and StickyMenu agree on section identification.
const orderedSections = [
  { id: 'cataclysm', name: 'Cataclysm' },      // Corresponds to sectionRefs[0]
  { id: 'kickstarter', name: 'Kickstarter' },  // Corresponds to sectionRefs[1]
  { id: 'forum', name: 'Forum' },              // Corresponds to sectionRefs[2]
  { id: 'cards', name: 'Cards' },              // Corresponds to sectionRefs[3]
  { id: 'tabletop', name: 'Tabletop' },        // Corresponds to sectionRefs[4]
  { id: 'playlist', name: 'Playlist' }         // Corresponds to sectionRefs[5]
];

export interface MainLayoutContextProps {
  activePaneId: string | null; // Can be null if no section is active
  scrollToPaneById: (id: string) => void;
  sectionRefs: React.RefObject<HTMLDivElement>[]; // Keep refs if children need direct access
}

// Custom hook to use the typed outlet context
export function useMainLayoutContext() {
  return useOutletContext<MainLayoutContextProps>();
}

const MainLayout: React.FC = () => {
  // sectionRefs must be in the same order as orderedSections
  const sectionRefs = orderedSections.map(() => useRef<HTMLDivElement>(null));
  const [activePaneId, setActivePaneId] = useState<string | null>(orderedSections[0]?.id || null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.5;
      let currentActiveId: string | null = null;

      // Iterate through sections to find which one is active
      // We iterate from bottom to top of page, so last one to pass threshold is active
      for (let i = orderedSections.length - 1; i >= 0; i--) {
        const sectionRef = sectionRefs[i];
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          // If the top of the section is above the scroll threshold (e.g., in the upper half of viewport)
          if (rect.top < scrollThreshold && rect.bottom > scrollThreshold - (window.innerHeight * 0.1) ) { // Ensure some part of it is visible
            currentActiveId = orderedSections[i].id;
            break; // Found the active section
          }
        }
      }
      // If no section is actively in view by this logic (e.g., at the very top or bottom of page),
      // default to the first one or keep the last active one.
      // For simplicity, if nothing found, set to first, or null if preferred.
      setActivePaneId(currentActiveId || (orderedSections.length > 0 ? orderedSections[0].id : null));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs]); // sectionRefs itself is stable, but if its creation logic changed, this might need adjustment.

  const scrollToPaneById = useCallback((id: string) => {
    const index = orderedSections.findIndex(section => section.id === id);
    if (index !== -1 && sectionRefs[index]?.current) {
      // Get the element position
      const element = sectionRefs[index].current;
      const headerHeight = 64; // Height of the fixed header in pixels
      
      // Calculate the target scroll position (element's position - header height)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      // Scroll to the adjusted position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [sectionRefs]); // sectionRefs is stable

  // Map cataclysm to zeal for menu highlighting
  const menuActivePaneId = activePaneId === 'cataclysm' ? 'zeal' : activePaneId;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StickyMenu scrollToPaneById={scrollToPaneById} activePaneId={menuActivePaneId} />
      {/* Main content with scrollable sections */}
      <div>
        {/* Pass the context to child routes via Outlet */}
        <Outlet context={{ sectionRefs, activePaneId, scrollToPaneById } satisfies MainLayoutContextProps} />
        
        {/* Bottom section with grey-black gradient */}
        <div className="w-full py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Discover More
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Learn the game.
                </p>
              </div>
              
              {/* Legal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Privacy Policy Card */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-blue-500/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Privacy Policy</h3>
                  <p className="text-gray-300 mb-4">
                    Learn how we collect, use, and protect your personal information in accordance with data protection laws.
                  </p>
                  <Link 
                    to="/privacy-policy" 
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Read our Privacy Policy
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                
                {/* Terms of Use Card */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-purple-500/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Terms of Use</h3>
                  <p className="text-gray-300 mb-4">
                    Review the terms and conditions that govern your use of our website and services.
                  </p>
                  <Link 
                    to="/terms-of-use" 
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Read our Terms of Use
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Copyright */}
              <div className="mt-12 pt-6 border-t border-gray-800 text-center">
                <p className="text-gray-400 text-sm">
                  &copy; {new Date().getFullYear()} Zeal TCG. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;