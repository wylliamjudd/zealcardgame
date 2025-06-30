// AudioUtils.ts
// Utility functions for handling audio playback and errors

import { handleError, ErrorCategory } from './ErrorUtils';

/**
 * Plays audio with silent error handling - specifically designed to
 * suppress autoplay errors from appearing to users while still logging them
 * @param audioElement The HTML audio element to play
 * @returns A promise that resolves when playback starts or silently handles errors
 */
export function playSilently(audioElement: HTMLAudioElement): Promise<void> {
  return audioElement.play()
    .catch(error => {
      // Log the error for debugging, but don't show to user
      console.debug('Audio playback error (suppressed from UI):', error);
      
      // Still log it to our error tracking system, but don't show a toast/notification
      handleError(error, ErrorCategory.UNKNOWN, 'AUDIO_AUTOPLAY_ERROR');
      
      // Return a resolved promise so the chain continues without error
      return Promise.resolve();
    });
}
