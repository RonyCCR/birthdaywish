
import React, { useState, useCallback } from 'react';
import { AppPhase } from './types';
import CountdownTimer from './components/CountdownTimer';
import BirthdayReveal from './components/BirthdayReveal';
import { startConfetti } from './utils/confetti';
import { playBlast } from './utils/audio';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.COUNTDOWN);

  const handleCountdownComplete = useCallback(() => {
    // Start visual celebration
    startConfetti();
    
    // Play audio celebration
    playBlast();
    
    // Slight pause at 00 for dramatic effect before revealing content
    setTimeout(() => {
      setPhase(AppPhase.REVEAL);
    }, 800);
  }, []);

  return (
    <main className="min-h-screen selection:bg-amber-500/30 selection:text-white bg-[#020617]">
      {phase === AppPhase.COUNTDOWN && (
        <div className="h-screen flex items-center justify-center">
          <CountdownTimer onComplete={handleCountdownComplete} />
        </div>
      )}

      {phase === AppPhase.REVEAL && (
        <BirthdayReveal />
      )}
    </main>
  );
};

export default App;
