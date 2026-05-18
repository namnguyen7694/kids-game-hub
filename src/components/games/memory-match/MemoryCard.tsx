"use client";

import { memo } from "react";
import { Card } from "./MemoryGame";


interface CardProps {
  card: Card;
  handleChoice: (card: Card) => void;
  flipped: boolean;
  isMatched: boolean;
  disabled: boolean;
  size: number;
}
function MemoryCard({ card, handleChoice, flipped, isMatched, disabled, size }: CardProps) {
  const fontSize = size > 8 ? "1.5rem" : size > 6 ? "2.5rem" : "4rem";

  return (
    <div
      className={`relative cursor-pointer transition-all duration-500 ${isMatched ? "pointer-events-none animate-matchedShrink opacity-0 invisible" : "opacity-100 visible"}`}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div className={`relative w-full h-full transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        <div 
          className="absolute w-full h-full [backface-visibility:hidden] rounded-md flex items-center justify-center shadow-sm border-2 border-white bg-primary text-white" 
          onClick={() => !disabled && handleChoice(card)}
        >
          <span className="opacity-80" style={{ fontSize }}>
            ❓
          </span>
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-md flex items-center justify-center shadow-sm border-2 border-white bg-white [transform:rotateY(180deg)]">
          <span className="animate-pop" style={{ fontSize }}>
            {card.content}
          </span>
        </div>
      </div>
    </div>
  );
}


export default memo(MemoryCard);
