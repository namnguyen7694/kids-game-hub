/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";

interface QuizCardProps {
  emoji: string;
  en: string;
  vi: string;
  phonetic?: string;
  options: { en: string; vi: string }[];
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export default function QuizCard({
  emoji,
  en,
  vi,
  phonetic,
  options,
  onAnswer,
  disabled: parentDisabled = false,
}: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsRevealed(false);
  }, [options]);

  useEffect(() => {
    if (parentDisabled && !selectedOption) {
      setSelectedOption("TIMEOUT");
      setIsRevealed(true);
    }
  }, [parentDisabled, selectedOption]);

  const handleOptionClick = (optionEn: string) => {
    if (selectedOption || parentDisabled) return;

    setSelectedOption(optionEn);
    const isCorrect = optionEn === en;
    setIsRevealed(true);

    onAnswer(isCorrect);

    if (isCorrect) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(en);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div
      className={`w-full max-w-[500px] flex flex-col gap-8 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${isRevealed ? "translate-y-0" : ""}`}
    >
      <div className="flex flex-col items-center gap-6 min-h-[200px] justify-center">
        <div
          className={`text-[8rem] [filter:drop-shadow(0_10px_20px_rgba(0,0,0,0.15))] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isRevealed ? "scale-75 -translate-y-2" : ""}`}
        >
          {emoji}
        </div>
        {isRevealed && (
          <div className="text-center animate-slideUp">
            <div className="text-[2.5rem] font-black text-primary capitalize leading-[1.2]">{en}</div>
            <div className="text-[1.2rem] text-[#888] italic my-[0.2rem]">{phonetic}</div>
            <div className="text-[1.5rem] text-[#555] font-semibold">{vi}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.en;
          const isCorrect = opt.en === en;

          let btnClass =
            "relative p-[1.2rem] rounded-[20px] border-2 border-[#f0f0f0] bg-white cursor-pointer text-[1.1rem] font-bold text-[#444] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center overflow-hidden hover:not-disabled:-translate-y-[3px] hover:not-disabled:shadow-[0_10px_20px_rgba(0,0,0,0.05)] active:not-disabled:-translate-y-[1px]";

          if (isRevealed) {
            if (isCorrect)
              btnClass =
                "relative p-[1.2rem] rounded-[20px] border-2 cursor-default text-[1.1rem] font-bold transition-all duration-200 flex items-center justify-center overflow-hidden bg-[#4caf50] text-white border-[#4caf50] shadow-[0_8px_20px_rgba(76,175,80,0.3)]";
            else if (isSelected)
              btnClass =
                "relative p-[1.2rem] rounded-[20px] border-2 cursor-default text-[1.1rem] font-bold transition-all duration-200 flex items-center justify-center overflow-hidden bg-[#f44336] text-white border-[#f44336] shadow-[0_8px_20px_rgba(244,67,54,0.3)]";
            else
              btnClass =
                "relative p-[1.2rem] rounded-[20px] border-2 cursor-default text-[1.1rem] font-bold transition-all duration-200 flex items-center justify-center overflow-hidden opacity-60 bg-[#f8f8f8] border-[#f0f0f0]";
          }

          return (
            <button
              key={opt.en}
              className={btnClass}
              onClick={() => handleOptionClick(opt.en)}
              disabled={isRevealed || parentDisabled}
            >
              <span>{opt.en}</span>
              {isRevealed && isCorrect && <span className="absolute right-4 text-[1.2rem] animate-pop">✓</span>}
              {isRevealed && isSelected && !isCorrect && (
                <span className="absolute right-4 text-[1.2rem] animate-pop">✕</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
