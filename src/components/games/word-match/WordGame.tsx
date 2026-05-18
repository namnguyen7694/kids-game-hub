/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import WordCard from "./WordCard";
import QuizCard from "./QuizCard";
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
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [mode]);

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
    <div className="flex flex-col items-center p-8 min-h-[80vh] gap-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-4">
        Thẻ Từ Vựng Thông Minh
      </h1>

      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mb-8 w-full max-w-[800px] justify-center px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 font-bold cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed ${activeCategory === cat.id ? "bg-primary text-white border-primary shadow-md" : "bg-white text-[#666] border-transparent"}`}
            onClick={() => setActiveCategory(cat.id)}
            disabled={mode === "quiz" && quizStatus === "playing"}
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="text-sm sm:text-base">{cat.label}</span>
          </button>
        ))}
      </div>

      {mode === "learn" ? (
        <>
          <div className="flex justify-center gap-4 mb-6">
            <button
              className="px-[1.5rem] py-[0.8rem] rounded-[20px] border-2 border-primary bg-white text-primary font-bold text-base cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-[2px] hover:shadow-md"
              onClick={() => {
                setMode("quiz");
                setQuizStatus("setup");
              }}
            >
              🎯 Kiểm tra
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 w-full max-w-[1200px] px-4">
            {learnData.map((vocab, index) => (
              <WordCard key={`${vocab.en}-${index}`} vocab={vocab} />
            ))}
          </div>
        </>
      ) : (
        <div className="w-full max-w-[600px] bg-white p-8 rounded-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.05)] min-h-[500px] flex flex-col md:p-6 md:min-h-[450px]">
          {quizStatus === "setup" && (
            <div className="text-center flex flex-col gap-6 flex-1 justify-center">
              <h2 className="text-[2rem] text-primary">Sẵn sàng chưa nào?</h2>
              <p>Chọn số lượng câu hỏi bạn muốn thử sức:</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {countOptions.map((count) => (
                  <button
                    key={count}
                    className={`p-[1rem_1.5rem] border-2 rounded-[15px] font-bold cursor-pointer transition-all duration-200 ${questionCount === count ? "border-primary bg-primary text-white" : "border-[#eee] bg-white"}`}
                    onClick={() => setQuestionCount(count)}
                  >
                    {count === totalInCategory ? `Tất cả (${count})` : `${count} câu`}
                  </button>
                ))}
              </div>
              <p>
                Chủ đề: <strong>{CATEGORIES.find((c) => c.id === activeCategory)?.label}</strong>
              </p>
              <div className="flex flex-col gap-4 mt-8">
                <button
                  className="p-[1.2rem] rounded-[20px] border-none bg-primary text-white text-[1.2rem] font-extrabold cursor-pointer shadow-[0_10px_20px_rgba(255,107,107,0.3)] transition-transform duration-200 hover:scale-[1.02]"
                  onClick={startQuiz}
                >
                  Bắt đầu ngay 🚀
                </button>
                <button
                  className="p-4 border-none bg-none text-[#888] font-semibold cursor-pointer"
                  onClick={() => setMode("learn")}
                >
                  Quay lại
                </button>
              </div>
            </div>
          )}

          {quizStatus === "playing" && (
            <div className="flex flex-col gap-8 flex-1">
              <div className="flex justify-between items-center gap-6">
                <div className="flex-1">
                  <span className="text-[0.9rem] font-bold text-[#666] mb-2 block">
                    Câu hỏi {currentIndex + 1} / {questionCount}
                  </span>
                  <div className="h-[10px] bg-[#eee] rounded-[5px] overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / questionCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div
                  className={`text-2xl font-extrabold text-[#333] bg-[#f8f9fa] p-[0.5rem_1rem] rounded-[15px] min-w-[80px] text-center ${timeLeft <= 5 ? "text-[#f44336] animate-pulse" : ""}`}
                >
                  ⏱️ {timeLeft}s
                </div>
                <button
                  className="p-[0.5rem_1rem] border border-[#ddd] rounded-[12px] bg-white text-[#888] text-[0.8rem] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#fff5f5] hover:text-[#f44336] hover:border-[#f44336]"
                  onClick={() => setQuizStatus("finished")}
                >
                  Kết thúc sớm
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center">
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
            <div className="text-center flex-1 flex flex-col items-center">
              <div className="text-[5rem] mb-4">{score / questionCount >= 0.8 ? "🏆" : "👏"}</div>
              <h2 className="text-2xl font-bold">Hoàn thành xuất sắc!</h2>
              <div className="my-6 mx-0">
                <span className="text-[4rem] font-black text-primary">{score}</span>
                <span className="text-[1.5rem] text-[#888] font-bold">/ {questionCount}</span>
              </div>
              <p>
                {score === questionCount
                  ? "Tuyệt vời! Bạn đã trả lời đúng tất cả!"
                  : "Cố gắng lên nhé, bạn đang làm rất tốt!"}
              </p>

              <div className="w-full my-8 mx-0 max-h-[300px] overflow-y-auto pr-2">
                <h3 className="font-bold mb-4">Xem lại các câu trả lời:</h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
                  {quizResults.map((res, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-[10px] bg-[#f8f9fa] flex items-center justify-center gap-1 text-[0.9rem] border ${res.isCorrect ? "border-[#4caf50]" : "border-[#f44336]"}`}
                    >
                      <span>{res.emoji}</span>
                      <span>{res.en}</span>
                      <span>{res.isCorrect ? "✅" : "❌"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                <button
                  className="p-[1.2rem] rounded-[20px] border-none bg-primary text-white text-[1.2rem] font-extrabold cursor-pointer shadow-[0_10px_20px_rgba(255,107,107,0.3)] transition-transform duration-200 hover:scale-[1.02]"
                  onClick={startQuiz}
                >
                  Chơi lại 🔄
                </button>
                <button
                  className="p-4 border-none bg-none text-[#888] font-semibold cursor-pointer"
                  onClick={resetGame}
                >
                  Kết thúc
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/">
          <button className="p-[1rem_2rem] bg-[#f0f0f0] border-none rounded-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0]">
            ← Quay lại trang chủ
          </button>
        </Link>
      </div>
    </div>
  );
}
