"use client";

import { useState } from "react";
import styles from "./WordGame.module.css";
import { Vocabulary } from "../../../../types";

export default function WordCard({ vocab }: { vocab: Vocabulary }) {
  const { emoji, en, vi, phonetic } = vocab;
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(en);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`${styles.card} ${isFlipped ? styles.flipped : ""}`} onClick={handleCardClick}>
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <div className={styles.emoji}>{emoji}</div>
        </div>
        <div className={styles.cardBack}>
          <div className={styles.wordEn}>{en}</div>
          {phonetic && <div className={styles.phonetic}>{phonetic}</div>}
          <div className={styles.wordVi}>{vi}</div>
          <button className={styles.pronounceBtn} onClick={handlePronounce} aria-label="Phát âm" title="Nghe phát âm">
            🔊
          </button>
          <div className={styles.emoji} style={{ fontSize: "2rem", marginTop: "0.5rem" }}>
            {emoji}
          </div>
        </div>
      </div>
    </div>
  );
}
