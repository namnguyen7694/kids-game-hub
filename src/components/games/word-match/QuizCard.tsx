/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import styles from "./WordGame.module.css";

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
      const utterance = new SpeechSynthesisUtterance(en);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`${styles.quizCard} ${isRevealed ? styles.revealed : ""}`}>
      <div className={styles.quizCardTop}>
        <div className={styles.quizEmoji}>{emoji}</div>
        {isRevealed && (
          <div className={styles.quizAnswerInfo}>
            <div className={styles.quizEn}>{en}</div>
            <div className={styles.quizPhonetic}>{phonetic}</div>
            <div className={styles.quizVi}>{vi}</div>
          </div>
        )}
      </div>

      <div className={styles.quizOptionsGrid}>
        {options.map((opt) => {
          const isSelected = selectedOption === opt.en;
          const isCorrect = opt.en === en;

          let btnClass = styles.quizOptionBtn;
          if (isRevealed) {
            if (isCorrect) btnClass += ` ${styles.correctOption}`;
            else if (isSelected) btnClass += ` ${styles.wrongOption}`;
            else btnClass += ` ${styles.disabledOption}`;
          }

          return (
            <button
              key={opt.en}
              className={btnClass}
              onClick={() => handleOptionClick(opt.en)}
              disabled={isRevealed || parentDisabled}
            >
              <span className={styles.optionText}>{opt.en}</span>
              {isRevealed && isCorrect && <span className={styles.optionStatus}>✓</span>}
              {isRevealed && isSelected && !isCorrect && <span className={styles.optionStatus}>✕</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
