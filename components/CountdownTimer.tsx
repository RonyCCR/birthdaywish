
import React, { useState, useEffect } from 'react';
import { playTick } from '../utils/audio';
import { TIMER_DURATION, TIMER_MESSAGES } from '../constants';

interface Props {
  onComplete: () => void;
}

const CountdownTimer: React.FC<Props> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    playTick();
    
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
      {/* Floating Message Layer */}
      <div className="h-12 mb-2 flex items-end justify-center">
        <p 
          key={timeLeft} // Key forces re-mount for animation
          className="font-hind text-amber-500/80 text-xs md:text-sm tracking-[0.2em] italic animate-[fadeInUp_0.8s_ease-out_forwards]"
        >
          {TIMER_MESSAGES[timeLeft] || "প্রস্তুত থাকুন"}
        </p>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Glowing Background Rings */}
        <div className="absolute inset-0 blur-[80px] bg-amber-600/15 rounded-full scale-110 animate-pulse"></div>
        <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] border border-amber-500/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute w-[240px] h-[240px] md:w-[330px] md:h-[330px] border border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>

        {/* The Counter Number */}
        <div className={`relative transition-all duration-500 ease-out transform ${isAnimating ? 'scale-105 opacity-100' : 'scale-100 opacity-90'}`}>
          <span className="font-serif italic font-bold text-[5.5rem] md:text-[9rem] text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {timeLeft.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="w-[1px] h-10 bg-gradient-to-b from-amber-500/50 via-amber-500/10 to-transparent mb-5"></div>
        <p className="font-hind tracking-[0.6em] uppercase text-[9px] md:text-[10px] font-bold text-amber-500/70 ml-[0.6em]">
          The Celebration Awaits
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
