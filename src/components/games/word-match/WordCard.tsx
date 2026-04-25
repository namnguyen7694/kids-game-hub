'use client';

import { useState } from 'react';
import styles from './WordGame.module.css';

interface WordCardProps {
  emoji: string;
  en: string;
  vi: string;
}

export default function WordCard({ emoji, en, vi }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`${styles.card} ${isFlipped ? styles.flipped : ''}`} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <div className={styles.emoji}>{emoji}</div>
          <div className={styles.hint}>Nhấn để xem từ vựng</div>
        </div>
        <div className={styles.cardBack}>
          <div className={styles.wordEn}>{en}</div>
          <div className={styles.wordVi}>{vi}</div>
          <div className={styles.emoji} style={{ fontSize: '2rem', marginTop: '1rem' }}>{emoji}</div>
        </div>
      </div>
    </div>
  );
}
