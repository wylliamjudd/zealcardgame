import React, { useState, useEffect } from 'react';
import { useAudio } from './AudioContext';

const VolumeControl: React.FC = () => {
  const { globalVolume, setGlobalVolume, audioOn } = useAudio();
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalVolume(parseFloat(event.target.value));
  };

  // Hide on mobile
  if (isMobile) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-neutral-800/50 rounded-lg">
      <label htmlFor="global-volume" className="text-sm text-highlight select-none">
        Master Volume:
      </label>
      <input
        type="range"
        id="global-volume"
        min="0"
        max="1"
        step="0.01"
        value={globalVolume}
        onChange={handleVolumeChange}
        disabled={!audioOn} // Disable slider if audio is globally off
        className={`w-32 h-2 rounded-lg appearance-none cursor-pointer 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    [&::-webkit-slider-runnable-track]:rounded-lg 
                    [&::-webkit-slider-runnable-track]:bg-neutral-700
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:h-4 
                    [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-highlight 
                    [&::-webkit-slider-thumb]:hover:bg-highlight-dark
                    [&::-moz-range-track]:rounded-lg 
                    [&::-moz-range-track]:bg-neutral-700
                    [&::-moz-range-thumb]:appearance-none 
                    [&::-moz-range-thumb]:h-4 
                    [&::-moz-range-thumb]:w-4 
                    [&::-moz-range-thumb]:rounded-full 
                    [&::-moz-range-thumb]:border-none
                    [&::-moz-range-thumb]:bg-highlight
                    [&::-moz-range-thumb]:hover:bg-highlight-dark`}
      />
      <span className="text-xs text-highlight w-8 text-right select-none">
        {Math.round(globalVolume * 100)}%
      </span>
    </div>
  );
};

export default VolumeControl;
