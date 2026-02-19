
import React, { useState, useEffect } from 'react';
import { BANGLA_MESSAGE } from '../constants';

const TypingText: React.FC = () => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= BANGLA_MESSAGE.length) return;

    const currentLine = BANGLA_MESSAGE[currentLineIndex];
    const isSpecialChar = currentLine === "\n";
    // Significantly faster typing: 15ms for normal characters, 100ms for newlines
    const speed = isSpecialChar ? 100 : 15;

    const timeout = setTimeout(() => {
      if (currentCharIndex < currentLine.length) {
        setDisplayedText(prev => prev + currentLine[currentCharIndex]);
        setCurrentCharIndex(prev => prev + 1);
      } else {
        // Space management for natural paragraph flow
        if (currentLineIndex < BANGLA_MESSAGE.length - 1) {
            const nextLine = BANGLA_MESSAGE[currentLineIndex + 1];
            if (nextLine !== "\n" && currentLine !== "\n") {
                setDisplayedText(prev => prev + " ");
            }
        }
        
        // Faster transition to the next line: 50ms-70ms instead of 100ms-150ms
        setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, isSpecialChar ? 50 : 70);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentLineIndex, currentCharIndex]);

  return (
    <div className="font-hind text-sm md:text-lg text-slate-200 text-center leading-[2] max-w-lg mx-auto">
      <p className="transition-all duration-700 font-light whitespace-pre-line text-center">
        {displayedText}
        {currentLineIndex < BANGLA_MESSAGE.length && <span className="cursor"></span>}
      </p>
    </div>
  );
};

export default TypingText;
