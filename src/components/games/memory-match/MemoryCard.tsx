"use client";

import { memo } from "react";
import styles from "./MemoryGame.module.css";
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
  const cardScale = size > 6 ? 0.9 : size > 4 ? 0.95 : 1;
  const fontSize = size > 8 ? "2rem" : size > 6 ? "3rem" : "4rem";

  return (
    <div
      className={`${styles.card} ${isMatched ? styles.matchedOut : ""}`}
      style={{
        transform: `scale(${cardScale})`,
        width: "100%",
        aspectRatio: "3/4",
        visibility: isMatched ? "hidden" : "visible",
        opacity: isMatched ? 0 : 1,
        transition: "opacity 0.5s ease, visibility 0.5s",
      }}
    >
      <div className={`${styles.inner} ${flipped ? styles.flipped : ""}`}>
        <div className={styles.front} onClick={() => !disabled && handleChoice(card)}>
          <span className={styles.backPattern} style={{ fontSize }}>
            ❓
          </span>
        </div>
        <div className={styles.back}>
          <span className={styles.icon} style={{ fontSize }}>
            {card.content}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(MemoryCard);
