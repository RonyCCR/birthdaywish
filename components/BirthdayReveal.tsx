
import React, { useState, useEffect } from 'react';
import TypingText from './TypingText';
import { BIRTHDAY_NAME, BIRTH_DATE, PROFILE_IMAGE_PATH } from '../constants';

const BirthdayReveal: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getInitials = () => {
    return BIRTHDAY_NAME
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
  };

  const generateCard = async () => {
    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- 1. MODERN MINIMAL BACKGROUND ---
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 1080, 1080);

    const gradient = ctx.createRadialGradient(540, 540, 0, 540, 540, 800);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#020617');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // --- 2. CELEBRATION PARTICLES ---
    ctx.globalAlpha = 0.5;
    const colors = ['#D4AF37', '#FFFFFF', '#94A3B8', '#FDE68A'];
    for (let i = 0; i < 150; i++) {
      ctx.save();
      const x = Math.random() * 1080;
      const y = Math.random() * 1080;
      const size = Math.random() * 5 + 1;
      const rotation = Math.random() * Math.PI * 2;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(-size, -size * 2, size * 2, size * 4);
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;

    // --- 3. PROFILE IMAGE SECTION ---
    try {
      const img = new Image();
      // FIX: Only set crossOrigin for external URLs. 
      // Local repo paths (like ./profile.jpg) must NOT have crossOrigin set to load correctly in some environments.
      if (PROFILE_IMAGE_PATH.startsWith('http')) {
        img.crossOrigin = "anonymous";
      }
      
      img.src = PROFILE_IMAGE_PATH;
      
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = () => {
          img.src = `https://api.dicebear.com/7.x/initials/png?seed=${getInitials()}&backgroundColor=020617&fontSize=40&bold=true`;
          img.onload = resolve;
        };
      });

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(540, 360, 235, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(540, 360, 225, 0, Math.PI * 2);
      ctx.clip();
      
      const aspect = img.width / img.height;
      let drawW, drawH, drawX, drawY;
      
      if (aspect > 1) {
        drawH = 450;
        drawW = 450 * aspect;
        drawX = 540 - drawW / 2;
        drawY = 360 - 225;
      } else {
        drawW = 450;
        drawH = 450 / aspect;
        drawX = 540 - 225;
        drawY = 360 - drawH / 2;
      }
      
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    } catch (e) {
      console.error("Poster generation failed", e);
    }

    // --- 4. TYPOGRAPHY (Lite Style) ---
    ctx.textAlign = 'center';
    
    // Happy Birthday (Weight 400 - Lite)
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'italic 400 52px "Playfair Display", serif';
    ctx.fillText('Happy Birthday', 540, 720);

    // Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 85px "Anek Bangla", sans-serif';
    ctx.fillText(BIRTHDAY_NAME, 540, 835);

    ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.fillRect(470, 870, 140, 1.5);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '400 34px "Hind Siliguri", sans-serif';
    ctx.fillText(BIRTH_DATE.toUpperCase(), 540, 935);

    ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.font = '600 18px sans-serif';
    ctx.fillText(`BEST WISHES | RAKIBUL HASAN RONY`, 540, 1035);

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `Birthday-Poster-${BIRTHDAY_NAME.replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();
    
    setIsGenerating(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-6 pt-16 pb-20 overflow-y-auto bg-[#020617] selection:bg-amber-500/20">
      <button 
        onClick={generateCard}
        disabled={isGenerating}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all active:scale-95 group flex items-center justify-center shadow-xl"
        title="Download Poster"
      >
        {isGenerating ? (
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <div className="flex items-center gap-2 px-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span className="hidden md:inline text-[9px] font-bold text-amber-500/60 tracking-[0.2em] uppercase">Poster</span>
          </div>
        )}
      </button>

      <div 
        className={`fixed inset-0 z-0 transition-opacity duration-[3000ms] ease-out pointer-events-none ${isLoaded ? 'opacity-40' : 'opacity-0'}`}
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5) saturate(0.7)'
        }}
      />
      
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-[#020617]/80 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        {/* Profile Section */}
        <div className="animate-soft-reveal mb-10 group">
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-amber-600/30 via-white/10 to-amber-600/30 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border border-white/5 overflow-hidden bg-slate-900 shadow-2xl relative">
              <img 
                src={PROFILE_IMAGE_PATH} 
                alt={BIRTHDAY_NAME}
                className="w-full h-full object-cover transition-transform duration-[15000ms] group-hover:scale-110"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('dicebear')) {
                    target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}&backgroundColor=020617&fontFamily=Playfair%20Display&bold=true`;
                  }
                }}
              />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] pointer-events-none"></div>
            </div>
            <div className="absolute inset-[-6px] border border-amber-500/10 rounded-full animate-[spin_20s_linear_infinite] opacity-30"></div>
          </div>
        </div>

        {/* Typographic Header (Lite Style) */}
        <p className="animate-soft-reveal [animation-delay:300ms] font-serif font-normal italic text-amber-500/90 text-2xl md:text-3xl mb-4 tracking-wide text-center">
          Happy Birthday
        </p>

        <h1 className="animate-soft-reveal [animation-delay:500ms] font-anek font-bold text-4xl md:text-6xl text-white mb-3 text-center tracking-tight gold-gradient-text drop-shadow-md">
          {BIRTHDAY_NAME}
        </h1>

        <div className="animate-soft-reveal [animation-delay:700ms] flex items-center gap-4 mb-14">
          <span className="h-[1px] w-6 bg-amber-500/20"></span>
          <p className="font-hind text-xs md:text-sm text-amber-100/60 font-medium tracking-[0.4em] uppercase">
            {/* Fixed typo: BIR_DATE was changed to BIRTH_DATE */}
            {BIRTH_DATE}
          </p>
          <span className="h-[1px] w-6 bg-amber-500/20"></span>
        </div>

        {/* Message Panel */}
        <div className="animate-soft-reveal [animation-delay:1000ms] w-full glass-panel rounded-[2rem] p-8 md:p-14 shadow-2xl border border-white/5 relative overflow-hidden backdrop-blur-2xl">
          <TypingText />
        </div>
        
        {/* Footer */}
        <div className="mt-20 text-center animate-soft-reveal [animation-delay:1500ms]">
            <p className="text-[9px] md:text-[10px] tracking-[0.4em] font-light text-white/30 uppercase">
              BEST WISHES | RAKIBUL HASAN RONY
            </p>
            <div className="w-8 h-[1px] bg-white/5 mx-auto mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayReveal;
