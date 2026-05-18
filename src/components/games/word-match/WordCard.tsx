"use client";

import { useState } from "react";
import { Vocabulary } from "../../../../types";

export default function WordCard({ vocab }: { vocab: Vocabulary }) {
  const { emoji, en, vi, phonetic } = vocab;
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(en);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };


  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="[perspective:1000px] w-full aspect-[4/5] cursor-pointer select-none" onClick={handleCardClick}>
      <div className={`relative w-full h-full text-center transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] shadow-[0_8px_20px_rgba(0,0,0,0.08)] rounded-[20px] sm:rounded-[24px] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>
        {/* Front side */}
        <div className="absolute w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center rounded-[20px] sm:rounded-[24px] bg-white p-3 sm:p-6 border-[3px] sm:border-4 border-[#f0f0f0] overflow-hidden">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 sm:mb-4 [filter:drop-shadow(0_4px_8px_rgba(0,0,0,0.08))]">{emoji}</div>
        </div>
        {/* Back side */}
        <div className="absolute w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center rounded-[20px] sm:rounded-[24px] bg-[linear-gradient(135deg,#fdfbfb_0%,#ebedee_100%)] p-3 sm:p-6 border-[3px] sm:border-4 border-[#f0f0f0] [transform:rotateY(180deg)] overflow-hidden">
          <div className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-primary mb-1 sm:mb-2 capitalize text-center w-full break-words px-1 leading-snug">{en}</div>
          {phonetic && <div className="text-[10px] sm:text-xs md:text-sm text-[#888] italic mb-1 sm:mb-2 font-main text-center w-full truncate px-1">{phonetic}</div>}
          <div className="text-[11px] sm:text-xs md:text-sm text-[#666] font-medium text-center w-full break-words px-1 leading-snug">{vi}</div>
          <button className="bg-transparent border-none text-xs sm:text-sm md:text-base cursor-pointer mt-1 sm:mt-2 p-1 rounded-full transition-transform duration-200 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 hover:scale-110 hover:bg-black/5 active:scale-95" onClick={handlePronounce} aria-label="Phát âm" title="Nghe phát âm">
            🔊
          </button>
          <div className="hidden sm:block text-sm sm:text-base md:text-lg lg:text-xl mt-1 sm:mt-2">
            {emoji}
          </div>
        </div>
      </div>
    </div>
  );
}

