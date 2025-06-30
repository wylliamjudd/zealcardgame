import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from './AudioContext';
import { useAuth } from '../contexts/AuthContext';
import { useAuthorization } from '../hooks/useAuthorization';

const logo = 'https://media.zealtcg.com/assets/logoZeal.png';
const icon = 'https://media.zealtcg.com/assets/iconZeal.png';

const menuPanes = [
  {
    name: 'Zeal',
    id: 'zeal',
    showMobile: true,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    )
  },
  {
    name: 'Kickstarter',
    id: 'kickstarter',
    showMobile: true,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    name: 'Forum',
    id: 'forum',
    showMobile: false,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2h2m4-4h4a2 2 0 012 2v4m-6 4h6" /></svg>
    )
  },
  {
    name: 'Cards',
    id: 'cards',
    showMobile: true,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>
    )
  },
  {
    name: 'Tabletop',
    id: 'tabletop',
    showMobile: true,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    name: 'Playlist',
    id: 'playlist',
    showMobile: true,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V5a1 1 0 011-1h6a1 1 0 011 1v11.28a2.5 2.5 0 11-2-2.45V7h-4v12.28a2.5 2.5 0 11-2-2.45V7" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
      </svg>
    )
  }
];

// Smooth scroll animation (easeInOutQuad)
function smoothScrollTo(targetY: number, duration = 500) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let start: number | null = null;
  function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  function step(timestamp: number) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeInOutQuad(t);
    window.scrollTo(0, startY + diff * eased);
    if (t < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

function scrollToPane(paneId: string) {
  const pane = document.getElementById(paneId) as HTMLElement | null;
  if (!pane) return;
  // Account for sticky menu height (4rem = 64px)
  const y = pane.id === 'cataclysm' ? 0 : pane.offsetTop - 64;
  smoothScrollTo(y);
}

interface StickyMenuProps {
  scrollToPaneById: (id: string) => void;
  activePaneId: string | null;
}

const StickyMenu: React.FC<StickyMenuProps> = ({ scrollToPaneById, activePaneId }) => {
  const { audioOn, setAudioOn, globalVolume, setGlobalVolume, autoplayTriggered, setAutoplayTriggered, isPlaying, setIsPlaying } = useAudio();
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  // Note: The `activePaneId` prop (string) is used above to highlight the active menu item.
  // The `scrollToPaneById` prop (function taking a string ID) is used for navigation.
  // const { isLoggedIn } = useAuthorization(); // Replaced by direct 'user' check
  const [isMobileView, setIsMobileView] = useState(false);

  // Handle login button click
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // Handle logout click
  const handleLogout = async () => {

    try {
      await signOut();

    } catch (error) {

    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    // Call handler right away so state is accurate with initial window size
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black bg-opacity-80 backdrop-blur-md z-50 shadow-lg border-b border-neutral-800 overflow-hidden">
      <div className="w-full h-full flex items-center px-4 overflow-x-hidden">
        {/* Logo/Icon - responsive */}
        <Link
  to="/"
  className="mr-4 block shrink-0"
  onClick={e => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // else let Link handle navigation
  }}
>
  <img src={isMobileView ? icon : logo} alt="Zeal TCG Logo" className="h-9" />
</Link>

        {/* Navigation Menu - full width */}
        <nav className="flex items-center justify-center flex-1 overflow-x-auto scrollbar-hide">
          {menuPanes.map((pane) => (
            <button
              key={pane.id}
              onClick={() => {
                if (window.location.pathname !== '/') {
                  // If not on homepage, navigate there first
                  window.location.href = '/';
                  return;
                }
                
                if (pane.id === 'zeal') {
                  scrollToPaneById('cataclysm');
                } else {
                  scrollToPaneById(pane.id);
                }
              }}
              className={`flex items-center ${isMobileView ? 'px-1.5 py-1' : 'px-3 py-2'} rounded-md ${isMobileView ? 'mx-px' : 'mx-1'} text-sm font-medium transition-colors focus:outline-none ${activePaneId === pane.id ? 'bg-gradient-to-r from-highlight to-highlight-dark text-white shadow' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'}`}
              aria-label={pane.name}
              title={pane.name}
              >
                {pane.icon}
                <span className="hidden sm:hidden lg:inline ml-1">{pane.name}</span>
              </button>
          ))}
        </nav>
        
        <div className="flex items-center gap-2 shrink-0">
          {/* Audio controls */}
          <button
            aria-label={audioOn ? 'Mute' : 'Unmute'}
            title={audioOn ? 'Mute' : 'Unmute'}
            onClick={() => setAudioOn(!audioOn)}
            className="hidden lg:flex items-center justify-center px-2 py-2 rounded hover:bg-neutral-800 transition-colors focus:outline-none"
          >
            {audioOn ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H3v6h3l5 4V5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.54 8.46a5 5 0 010 7.07" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H3v6h3l5 4V5z" /><line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth={2} /></svg>
            )}
          </button>
          
          <button
            aria-label="Play All Tracks"
            title="Play All Tracks"
            onClick={() => {
              // Turn audio on if it's currently muted
              if (!audioOn) {
                setAudioOn(true);
              }
              setAutoplayTriggered(true);
            }}
            className="hidden lg:flex items-center justify-center px-2 py-2 rounded hover:bg-neutral-800 transition-colors focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          
          <button
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
            onClick={() => setIsPlaying(!isPlaying)}
            className="hidden lg:flex items-center justify-center px-2 py-2 rounded hover:bg-neutral-800 transition-colors focus:outline-none"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </button>

          {/* Login/Logout Section - show only icon in tablet view */}
          {!!user ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-3 py-1 rounded-md bg-gradient-to-r from-highlight to-highlight-dark text-white hover:from-highlight to-highlight-dark transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <svg className="h-5 w-5 sm:mr-0 lg:mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:hidden lg:inline text-sm">Logout</span>
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center justify-center px-3 py-1 rounded-md bg-gradient-to-r from-highlight to-highlight-dark text-white hover:from-highlight to-highlight-dark transition-colors"
              aria-label="Login"
              title="Login"
            >
              <svg className="h-5 w-5 sm:mr-0 lg:mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:hidden lg:inline text-sm">Login</span>
            </button>
          )}

          {/* Store Link - show only icon in tablet view */}
          <Link 
            to="/store" 
            className="flex items-center justify-center px-3 py-1 rounded-md bg-gradient-to-r from-highlight to-highlight-dark text-white hover:from-highlight to-highlight-dark transition-colors"
            aria-label="Store"
            title="Store"
          >
            <svg className="h-5 w-5 sm:mr-0 lg:mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span className="hidden sm:hidden lg:inline text-sm">Store</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default StickyMenu;
