import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import StickyMenu from '../components/StickyMenu';

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, children }) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Dummy function for StickyMenu props
  const scrollToPaneById = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <SEO title={title} />
      <StickyMenu 
        scrollToPaneById={scrollToPaneById} 
        activePaneId={null} 
      />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
