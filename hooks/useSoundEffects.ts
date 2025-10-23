
import { useRef, useCallback } from 'react';
import { clickSound, winSound, drawSound, thinkingSound } from '../audio/sounds';

const sounds = {
  click: new Audio(clickSound),
  win: new Audio(winSound),
  draw: new Audio(drawSound),
};

// Preload sounds for better performance
Object.values(sounds).forEach(sound => {
    sound.load();
});


const useSoundEffects = () => {
  const thinkingAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((soundName: keyof typeof sounds) => {
    const sound = sounds[soundName];
    sound.currentTime = 0;
    sound.play().catch(e => {
        // Autoplay can be blocked by the browser, log error if it happens
        if (e.name === 'NotAllowedError') {
            console.log('Audio autoplay blocked by browser. Please interact with the page first.');
        } else {
            console.error("Error playing sound:", e)
        }
    });
  }, []);

  const startThinkingSound = useCallback(() => {
    if (!thinkingAudioRef.current) {
      thinkingAudioRef.current = new Audio(thinkingSound);
      thinkingAudioRef.current.loop = true;
      thinkingAudioRef.current.volume = 0.3; // Make it subtle
    }
    thinkingAudioRef.current.play().catch(e => console.error("Error playing thinking sound:", e));
  }, []);

  const stopThinkingSound = useCallback(() => {
    if (thinkingAudioRef.current) {
      thinkingAudioRef.current.pause();
      thinkingAudioRef.current.currentTime = 0;
    }
  }, []);

  return { playSound, startThinkingSound, stopThinkingSound };
};

export default useSoundEffects;
