import React, { createContext, useContext, useState } from 'react';

interface AudioContextType {
  audioOn: boolean;
  setAudioOn: (on: boolean) => void;
  globalVolume: number;
  setGlobalVolume: (volume: number) => void;
  autoplayTriggered: boolean;
  setAutoplayTriggered: (triggered: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playSpecificTrack: (trackUrl: string, trackName?: string) => void;
  trackToPlay: { url: string; name?: string } | null;
  setTrackToPlay: React.Dispatch<React.SetStateAction<{ url: string; name?: string; } | null>>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if we have a saved mute preference in localStorage that hasn't expired
  const getInitialAudioState = () => {
    try {
      const savedMuteState = localStorage.getItem('audioMuteState');
      if (savedMuteState) {
        const { muted, expires } = JSON.parse(savedMuteState);
        // Check if the preference has expired (24 hours)
        if (Date.now() < expires) {
          return !muted; // Return the opposite of muted (true if not muted)
        } else {
          // Clear expired preference
          localStorage.removeItem('audioMuteState');
        }
      }
    } catch (err) {
      console.error('Error reading mute state from localStorage:', err);
      localStorage.removeItem('audioMuteState');
    }
    return true; // Default to audio on if no valid saved preference
  };

  const [audioOn, setAudioOnState] = useState(getInitialAudioState());
  const [globalVolume, setGlobalVolumeState] = useState(0.5);
  const [preMuteVolume, setPreMuteVolume] = useState(0.5); // Store volume before global mute
  const [autoplayTriggered, setAutoplayTriggeredState] = useState(false);
  const [isPlaying, setIsPlayingState] = useState(false); // Default to not playing
  const [trackToPlay, setTrackToPlay] = useState<{url: string, name?: string} | null>(null);

  const setAudioOn = (on: boolean) => {
    setAudioOnState(on);
    
    // Save mute preference to localStorage with 24-hour expiration
    try {
      const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
      localStorage.setItem('audioMuteState', JSON.stringify({
        muted: !on, // Store as muted (opposite of audioOn)
        expires: expirationTime
      }));
    } catch (err) {
      console.error('Error saving mute state to localStorage:', err);
    }
    
    if (on) {
      // Unmuting: restore volume from preMuteVolume
      setGlobalVolumeState(preMuteVolume);
    } else {
      // Muting: store current volume and set globalVolume to 0
      setPreMuteVolume(globalVolume); // Save current volume before setting to 0
      setGlobalVolumeState(0);
    }
  };

  const setGlobalVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setGlobalVolumeState(clampedVolume);
    // If we are not globally muted by audioOn, this new volume is also the preMuteVolume
    if (audioOn) {
      setPreMuteVolume(clampedVolume);
    }
    // If audioOn is false, globalVolume is 0. Adjusting slider changes the preMuteVolume for when it's unmuted.
    // Or, if user sets volume to 0 via slider while audioOn is true, it also becomes preMuteVolume.
    if (!audioOn && clampedVolume > 0) {
        // If globally muted and slider is moved from 0, update preMuteVolume for when unmuted
        // but keep globalVolume at 0 until unmuted via setAudioOn(true)
        setPreMuteVolume(clampedVolume);
    } else if (audioOn) {
        setPreMuteVolume(clampedVolume);
    }

  };

  const setAutoplayTriggered = (triggered: boolean) => {
    setAutoplayTriggeredState(triggered);
  };

  const setIsPlaying = (playing: boolean) => {
    setIsPlayingState(playing);
  };
  
  const playSpecificTrack = (trackUrl: string, trackName?: string) => {
    setTrackToPlay({ url: trackUrl, name: trackName });
    setIsPlayingState(true); // Ensure the player is set to play
  };

  return (
    <AudioContext.Provider value={{ 
      audioOn, 
      setAudioOn, 
      globalVolume, 
      setGlobalVolume, 
      autoplayTriggered, 
      setAutoplayTriggered,
      isPlaying,
      setIsPlaying,
      playSpecificTrack,
      trackToPlay,
      setTrackToPlay
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
