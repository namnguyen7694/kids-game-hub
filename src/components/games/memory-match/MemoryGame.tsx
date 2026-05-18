'use client';

import { useState, useCallback, useEffect } from 'react';
import MemoryCard from './MemoryCard';


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
    <div className="flex flex-col items-center p-4 sm:p-8 max-w-[1200px] mx-auto min-h-screen animate-fadeIn">
      <div className="w-full flex flex-col items-center gap-4 mb-6 sm:mb-10 min-h-[200px] sm:min-h-[250px]">
        <div className="flex justify-between items-center w-full max-w-[600px] mb-2">
          <div className="bg-accent text-[#856404] px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-sm">{difficulty.label}</div>
          <button onClick={() => setGameState('setup')} className="bg-[#EEE] text-[#666] px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 hover:bg-[#E0E0E0] hover:text-primary">Thoát</button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
          {players.map((player, idx) => (
            <div 
              key={idx} 
              className={`bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-2xl shadow-sm flex flex-col items-center min-w-[100px] sm:min-w-[140px] transition-all duration-300 border-2 relative ${idx === currentPlayerIndex ? "border-primary scale-105 shadow-md" : "border-transparent opacity-70"}`}
            >
              <span className="text-[0.75rem] sm:text-[0.85rem] text-[#666] font-bold">{player.name}</span>
              <span className="text-xl sm:text-2xl font-black text-foreground">{player.score}</span>
              {idx === currentPlayerIndex && showMatchCelebration && (
                <div className="absolute -top-4 bg-secondary text-white px-3 py-1 rounded-full text-[0.65rem] sm:text-[0.75rem] font-black animate-matchPop shadow-md whitespace-nowrap z-10">TUYỆT VỜI! ✨</div>
              )}
            </div>
          ))}
        </div>

        <div className="h-14 flex items-center justify-center w-full mt-2">
          <div className={`text-xs sm:text-base font-black text-blue bg-white px-6 py-2.5 rounded-full shadow-lg flex items-center gap-3 border-2 border-blue/5 transition-all duration-500 transform ${isTimerRunning ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"} ${timeLeft <= WARNING_THRESHOLD_SECONDS && isTimerRunning ? "text-primary bg-[#FFF0F0] animate-pulse border-primary/20" : ""}`}>
            <span className="text-xl">⏱️</span>
            <span className="min-w-[3ch]">{timeLeft}s</span>
            <span className="w-px h-4 bg-gray-200 mx-1"></span>
            <span>Lượt: <span className="text-primary">{players[currentPlayerIndex].name}</span></span>
          </div>
        </div>
      </div>



      <div 
        className="grid w-full max-w-[600px] aspect-square mx-auto [perspective:1000px] px-2" 
        style={{ 
          gridTemplateColumns: `repeat(${difficulty.size}, 1fr)`,
          gap: difficulty.size > 8 ? '4px' : difficulty.size > 6 ? '6px' : '8px',
        } as React.CSSProperties}
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] backdrop-blur-[8px]">
          <div className="bg-white p-12 rounded-lg text-center max-w-[400px] w-[90%]">
            <h2 className="text-2xl font-bold mb-4">🎉 Trò chơi kết thúc! 🎉</h2>
            <div className="my-6 mx-0 mb-10 flex flex-col gap-3">
              {players.sort((a, b) => b.score - a.score).map((p, i) => (
                <div key={i} className="flex justify-between p-[12px_16px] bg-[#F8F9FA] rounded-md font-bold">
                  <span>{i === 0 ? '🏆' : ''} {p.name}</span>
                  <span>{p.score} điểm</span>
                </div>
              ))}
            </div>
            <button 
              className="bg-primary text-white p-[16px_40px] rounded-full font-extrabold w-full"
              onClick={() => setGameState('setup')}
            >
              Chơi Lại!
            </button>
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
    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl max-w-[500px] mx-auto my-6 sm:my-10 flex flex-col gap-6 sm:gap-8 w-[95%] sm:w-full">
      <h2 className="text-center text-2xl sm:text-3xl text-primary font-black">Cài đặt trò chơi</h2>
      
      <div className="flex flex-col gap-4">
        <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">👥 Người chơi</h3>
        {playerNames.map((name, i) => (
          <div key={i} className="flex gap-2">
            <input 
              type="text" 
              value={name} 
              onChange={(e) => updateName(i, e.target.value)}
              className="flex-1 px-4 py-2 sm:py-3 border-2 border-[#EEE] rounded-2xl text-sm sm:text-base outline-none transition-colors duration-200 focus:border-primary"
            />
            {playerNames.length > 1 && (
              <button onClick={() => removePlayer(i)} className="text-[#CCC] text-xl px-2 hover:text-primary transition-colors">✕</button>
            )}
          </div>
        ))}
        {playerNames.length < 4 && (
          <button onClick={addPlayer} className="text-blue font-bold text-sm text-left hover:underline">+ Thêm người chơi</button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">⭐ Cấp độ</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(DIFFICULTIES).map(([key, diff]) => (
            <button
              key={key}
              onClick={() => setSelectedDiff(key)}
              className={`p-3 border-2 border-[#EEE] rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${selectedDiff === key ? "bg-secondary border-secondary text-white shadow-md -translate-y-1" : "bg-white text-[#666] hover:border-secondary/30"}`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onStart(DIFFICULTIES[selectedDiff], playerNames)}
        className="bg-primary text-white py-4 rounded-full text-lg sm:text-xl font-black shadow-[0_8px_16px_rgba(255,107,107,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_20px_rgba(255,107,107,0.4)] active:translate-y-0 mt-2"
      >
        Bắt đầu thôi! 🚀
      </button>
    </div>

  );
}
