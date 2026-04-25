'use client';

import { useState, useCallback, useEffect } from 'react';
import MemoryCard from './MemoryCard';
import styles from './MemoryGame.module.css';

const ALL_EMOJIS = [
  '🦁', '🐯', '🦒', '🦓', '🐘', '🦏', '🦛', '🐄', '🐎', '🐖', 
  '🐑', '🐐', '🐕', '🐈', '🐓', '🦆', '🦉', '🐢', '🐍', '🐸',
  '🐋', '🐬', '🐙', '🦀', '🦐', '🐝', '🦋', '🐞', '🐜', '🕷️',
  '🍎', '🍌', '🍉', '🍇', '🍓', '🍍', '🥝', '🌽', '🥕', '🥦',
  '🍕', '🍔', '🍟', '🍦', '🍩', '🍪', '🍬', '🍭', '🎨', '🎸',
  '⚽', '🏀', '🎾', '🎿', '🚲', '🚗', '🚀', '🚁', '🏠', '🗼'
];

export interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Player {
  name: string;
  score: number;
}

interface Difficulty {
  label: string;
  size: number;
  pairs: number;
}

const DIFFICULTIES: Record<string, Difficulty> = {
  easy: { label: 'Dễ (4x4)', size: 4, pairs: 8 },
  medium: { label: 'Vừa (6x6)', size: 6, pairs: 18 },
  hard: { label: 'Khó (8x8)', size: 8, pairs: 32 },
  super: { label: 'Siêu Khó (10x10)', size: 10, pairs: 50 },
};

const TURN_TIMEOUT_SECONDS = 10;
const MATCH_SCORE = 10;
const WARNING_THRESHOLD_SECONDS = 3;

export default function MemoryGame() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES.easy);
  const [players, setPlayers] = useState<Player[]>([{ name: 'Người chơi 1', score: 0 }]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showMatchCelebration, setShowMatchCelebration] = useState(false);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [choiceOne, setChoiceOne] = useState<Card | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(TURN_TIMEOUT_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const startGame = useCallback((selectedDifficulty: Difficulty, selectedPlayers: string[]) => {
    const pairsCount = selectedDifficulty.pairs;
    const shuffledEmojis = [...ALL_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairsCount);

    const gameCards = [...shuffledEmojis, ...shuffledEmojis]
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(gameCards);
    setDifficulty(selectedDifficulty);
    setPlayers(selectedPlayers.map(name => ({ name, score: 0 })));
    setCurrentPlayerIndex(0);
    setGameState('playing');
    setTotalMatches(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
    setShowMatchCelebration(false);
    setIsTimerRunning(false);
    setTimeLeft(TURN_TIMEOUT_SECONDS);
  }, []);

  const resetTurn = useCallback((isMatch: boolean) => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
    setShowMatchCelebration(false);
    setIsTimerRunning(false);
    setTimeLeft(TURN_TIMEOUT_SECONDS);

    if (!isMatch) {
      setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    }
  }, [players.length]);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time's up! Switch turns
      setTimeout(() => resetTurn(false), 0);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, resetTurn]);

  const handleChoice = useCallback((card: Card) => {
    if (disabled || card.isMatched || (choiceOne && card.id === choiceOne.id)) return;

    if (!choiceOne) {
      setChoiceOne(card);
      setIsTimerRunning(true);
      setTimeLeft(TURN_TIMEOUT_SECONDS);
      return;
    }

    // Stop timer when second card is chosen
    setIsTimerRunning(false);
    setChoiceTwo(card);
    setDisabled(true);

    if (choiceOne.content === card.content) {
      setShowMatchCelebration(true);
      
      setTimeout(() => {
        setCards(prevCards => 
          prevCards.map(c => 
            c.content === card.content ? { ...c, isMatched: true } : c
          )
        );
        
        setPlayers(prev => {
          const newPlayers = [...prev];
          newPlayers[currentPlayerIndex].score += MATCH_SCORE;
          return newPlayers;
        });
        
        setTotalMatches(prev => prev + 1);
        
        if (totalMatches + 1 === difficulty.pairs) {
          setTimeout(() => setGameState('finished'), 800);
        } else {
          resetTurn(true);
        }
      }, 1000);
    } else {
      setTimeout(() => resetTurn(false), 1000);
    }
  }, [choiceOne, disabled, currentPlayerIndex, difficulty.pairs, totalMatches, resetTurn]);

  if (gameState === 'setup') {
    return <SetupScreen onStart={startGame} />;
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <div className={styles.difficultyBadge}>{difficulty.label}</div>
        <div className={styles.scoreBoard}>
          {players.map((player, idx) => (
            <div 
              key={idx} 
              className={`${styles.playerScore} ${idx === currentPlayerIndex ? styles.activePlayer : ''}`}
            >
              <span className={styles.playerName}>{player.name}</span>
              <span className={styles.scoreValue}>{player.score}</span>
              {idx === currentPlayerIndex && showMatchCelebration && (
                <div className={styles.matchBadge}>TUYỆT VỜI! ✨</div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.timerContainer}>
          {isTimerRunning && (
            <div className={`${styles.timer} ${timeLeft <= WARNING_THRESHOLD_SECONDS ? styles.timerWarning : ''}`}>
              ⏱️ {timeLeft}s - Lượt của <strong>{players[currentPlayerIndex].name}</strong>
            </div>
          )}
        </div>
        <button onClick={() => setGameState('setup')} className={styles.quitBtn}>Thoát</button>
      </div>

      <div 
        className={styles.cardGrid} 
        style={{ gridTemplateColumns: `repeat(${difficulty.size}, 1fr)` }}
      >
        {cards.map(card => (
          <MemoryCard 
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card.id === choiceOne?.id || card.id === choiceTwo?.id || card.isMatched}
            isMatched={card.isMatched}
            disabled={disabled}
            size={difficulty.size}
          />
        ))}
      </div>

      {gameState === 'finished' && (
        <div className={styles.winModal}>
          <div className={styles.winContent}>
            <h2>🎉 Trò chơi kết thúc! 🎉</h2>
            <div className={styles.finalScores}>
              {players.sort((a, b) => b.score - a.score).map((p, i) => (
                <div key={i} className={styles.finalScoreRow}>
                  <span>{i === 0 ? '🏆' : ''} {p.name}</span>
                  <span>{p.score} điểm</span>
                </div>
              ))}
            </div>
            <button onClick={() => setGameState('setup')}>Chơi Lại!</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SetupScreen({ onStart }: { onStart: (d: Difficulty, p: string[]) => void }) {
  const [playerNames, setPlayerNames] = useState(['Người chơi 1']);
  const [selectedDiff, setSelectedDiff] = useState('easy');

  const addPlayer = () => {
    if (playerNames.length < 4) {
      setPlayerNames([...playerNames, `Người chơi ${playerNames.length + 1}`]);
    }
  };

  const updateName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  return (
    <div className={styles.setupScreen}>
      <h2 className={styles.setupTitle}>Cài đặt trò chơi</h2>
      
      <div className={styles.setupSection}>
        <h3>👥 Người chơi</h3>
        {playerNames.map((name, i) => (
          <div key={i} className={styles.playerInputRow}>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => updateName(i, e.target.value)}
              className={styles.setupInput}
            />
            {playerNames.length > 1 && (
              <button onClick={() => removePlayer(i)} className={styles.removeBtn}>✕</button>
            )}
          </div>
        ))}
        {playerNames.length < 4 && (
          <button onClick={addPlayer} className={styles.addPlayerBtn}>+ Thêm người chơi</button>
        )}
      </div>

      <div className={styles.setupSection}>
        <h3>⭐ Cấp độ</h3>
        <div className={styles.difficultyGrid}>
          {Object.entries(DIFFICULTIES).map(([key, diff]) => (
            <button
              key={key}
              onClick={() => setSelectedDiff(key)}
              className={`${styles.diffBtn} ${selectedDiff === key ? styles.diffActive : ''}`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onStart(DIFFICULTIES[selectedDiff], playerNames)}
        className={styles.startBtn}
      >
        Bắt đầu thôi! 🚀
      </button>
    </div>
  );
}
