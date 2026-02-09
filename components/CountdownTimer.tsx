
import React, { useState, useEffect } from 'react';
import { playTick } from '../utils/audio';

interface Props {
  onComplete: () => void;
}

const CountdownTimer: React.FC<Props> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(23);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    // Trigger tick sound
    playTick();
    
    // Simple pulse animation trigger
    setIsAnimating(true);
    const animTimer = setTimeout(() => setIsAnimating(false), 500);

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(animTimer);
    };
  }, [timeLeft, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center select-none p-4">
      <div className="relative flex items-center justify-center">
        {/* Glowing Background Rings */}
        <div className="absolute inset-0 blur-[100px] bg-amber-600/20 rounded-full scale-125 animate-pulse"></div>
        <div className="absolute w-[240px] h-[240px] md:w-[350px] md:h-[350px] border border-amber-500/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] border border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>

        {/* The Counter Number - Adjusted Size */}
        <div className={`relative transition-all duration-500 ease-out transform ${isAnimating ? 'scale-105 opacity-100' : 'scale-100 opacity-90'}`}>
          <span className="font-serif italic font-bold text-[7rem] md:text-[12rem] text-white leading-none drop-shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
            {timeLeft.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <div className="w-[1px] h-14 bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent mb-6"></div>
        <p className="font-hind tracking-[0.8em] uppercase text-[10px] md:text-xs font-bold text-amber-500/80 ml-[0.8em]">
          The Celebration Awaits
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
