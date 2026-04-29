/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import WordCard from "./WordCard";
import QuizCard from "./QuizCard";
import styles from "./WordGame.module.css";
import Link from "next/link";
import { VOCABULARY, CATEGORIES } from "../../../../constants";

export default function WordGame() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [mode, setMode] = useState<"learn" | "quiz">("learn");
  const [isClient, setIsClient] = useState(false);

  // Quiz States
  const [quizStatus, setQuizStatus] = useState<"setup" | "playing" | "finished">("setup");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<{ emoji: string; en: string; isCorrect: boolean }[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAnswer = (isCorrect: boolean) => {
    if (isPaused) return;
    setIsPaused(true);

    const currentWord = quizQuestions[currentIndex];
    setQuizResults((prev) => [...prev, { emoji: currentWord.emoji, en: currentWord.en, isCorrect }]);
    if (isCorrect) setScore((prev) => prev + 1);

    setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(15);
        setIsPaused(false);
      } else {
        setQuizStatus("finished");
      }
    }, 1500);
  };

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === "quiz" && quizStatus === "playing" && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStatus === "playing" && !isPaused) {
      handleAnswer(false); // Time out counts as wrong
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStatus, timeLeft, isPaused, mode]);

  const startQuiz = () => {
    const pool = activeCategory === "all" ? VOCABULARY : VOCABULARY.filter((v) => v.category === activeCategory);
    let selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, questionCount);

    if (selected.length < questionCount) {
      const others = VOCABULARY.filter((v) => !selected.find((s) => s.en === v.en)).sort(() => 0.5 - Math.random());
      selected = [...selected, ...others].slice(0, questionCount);
    }

    console.log("selected", selected);

    const questions = selected.map((vocab) => {
      const distractors = selected.filter((v) => v.en !== vocab.en);
      const shuffledDistractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [vocab, ...shuffledDistractors].sort(() => 0.5 - Math.random());
      return { ...vocab, options };
    });

    setQuizQuestions(questions);
    setQuizStatus("playing");
    setCurrentIndex(0);
    setScore(0);
    setQuizResults([]);
    setTimeLeft(15);
    setIsPaused(false);
  };

  const resetGame = () => {
    setQuizStatus("setup");
    setMode("learn");
  };

  const learnData = useMemo(() => {
    return activeCategory === "all" ? VOCABULARY : VOCABULARY.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  const totalInCategory = useMemo(() => {
    return activeCategory === "all"
      ? VOCABULARY.length
      : VOCABULARY.filter((v) => v.category === activeCategory).length;
  }, [activeCategory]);

  const countOptions = useMemo(() => {
    const base = [5, 10, 15, 20].filter((c) => c < totalInCategory);
    return [...base, totalInCategory];
  }, [totalInCategory]);

  useEffect(() => {
    if (questionCount > totalInCategory) {
      setQuestionCount(totalInCategory);
    } else if (questionCount === 0 && totalInCategory > 0) {
      setQuestionCount(Math.min(10, totalInCategory));
    }
  }, [totalInCategory, questionCount]);

  if (!isClient) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thẻ Từ Vựng Thông Minh</h1>

      <div className={styles.controls}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ""}`}
            onClick={() => setActiveCategory(cat.id)}
            disabled={mode === "quiz" && quizStatus === "playing"}
          >
            <span className={styles.categoryIcon}>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {mode === "learn" ? (
        <>
          <div className={styles.modeToggle}>
            <button
              className={`${styles.modeBtn} ${styles.quizToggleBtn}`}
              onClick={() => {
                setMode("quiz");
                setQuizStatus("setup");
              }}
            >
              🎯 Kiểm tra
            </button>
          </div>

          <div className={styles.grid}>
            {learnData.map((vocab, index) => (
              <WordCard key={`${vocab.en}-${index}`} vocab={vocab} />
            ))}
          </div>
        </>
      ) : (
        <div className={styles.quizContainer}>
          {quizStatus === "setup" && (
            <div className={styles.setupScreen}>
              <h2>Sẵn sàng chưa nào?</h2>
              <p>Chọn số lượng câu hỏi bạn muốn thử sức:</p>
              <div className={styles.countOptions}>
                {countOptions.map((count) => (
                  <button
                    key={count}
                    className={`${styles.countBtn} ${questionCount === count ? styles.active : ""}`}
                    onClick={() => setQuestionCount(count)}
                  >
                    {count === totalInCategory ? `Tất cả (${count})` : `${count} câu`}
                  </button>
                ))}
              </div>
              <p>
                Chủ đề: <strong>{CATEGORIES.find((c) => c.id === activeCategory)?.label}</strong>
              </p>
              <div className={styles.setupActions}>
                <button className={styles.startBtn} onClick={startQuiz}>
                  Bắt đầu ngay 🚀
                </button>
                <button className={styles.cancelBtn} onClick={() => setMode("learn")}>
                  Quay lại
                </button>
              </div>
            </div>
          )}

          {quizStatus === "playing" && (
            <div className={styles.playingScreen}>
              <div className={styles.quizHeader}>
                <div className={styles.progressInfo}>
                  <span>
                    Câu hỏi {currentIndex + 1} / {questionCount}
                  </span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${((currentIndex + 1) / questionCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`${styles.timer} ${timeLeft <= 5 ? styles.urgent : ""}`}>⏱️ {timeLeft}s</div>
                <button className={styles.finishEarlyBtn} onClick={() => setQuizStatus("finished")}>
                  Kết thúc sớm
                </button>
              </div>

              <div className={styles.singleCardWrapper}>
                <QuizCard
                  key={`quiz-${currentIndex}`}
                  emoji={quizQuestions[currentIndex].emoji}
                  en={quizQuestions[currentIndex].en}
                  vi={quizQuestions[currentIndex].vi}
                  phonetic={quizQuestions[currentIndex].phonetic}
                  options={quizQuestions[currentIndex].options}
                  onAnswer={handleAnswer}
                  disabled={isPaused || timeLeft === 0}
                />
              </div>
            </div>
          )}

          {quizStatus === "finished" && (
            <div className={styles.summaryScreen}>
              <div className={styles.summaryIcon}>{score / questionCount >= 0.8 ? "🏆" : "👏"}</div>
              <h2>Hoàn thành xuất sắc!</h2>
              <div className={styles.finalScore}>
                <span className={styles.scoreNum}>{score}</span>
                <span className={styles.scoreTotal}>/ {questionCount}</span>
              </div>
              <p>
                {score === questionCount
                  ? "Tuyệt vời! Bạn đã trả lời đúng tất cả!"
                  : "Cố gắng lên nhé, bạn đang làm rất tốt!"}
              </p>

              <div className={styles.resultsList}>
                <h3>Xem lại các câu trả lời:</h3>
                <div className={styles.resultsGrid}>
                  {quizResults.map((res, i) => (
                    <div
                      key={i}
                      className={`${styles.resultItem} ${res.isCorrect ? styles.resCorrect : styles.resWrong}`}
                    >
                      <span>{res.emoji}</span>
                      <span>{res.en}</span>
                      <span>{res.isCorrect ? "✅" : "❌"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.summaryActions}>
                <button className={styles.startBtn} onClick={startQuiz}>
                  Chơi lại 🔄
                </button>
                <button className={styles.cancelBtn} onClick={resetGame}>
                  Kết thúc
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.footer}>
        <Link href="/">
          <button className={styles.backBtn}>← Quay lại trang chủ</button>
        </Link>
      </div>
    </div>
  );
}
