import React, { useState, useEffect } from 'react';
import { Destination, QuizQuestion } from '../../types/game';
import { soundManager } from '../../services/sound';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Award, Compass, Timer, Sparkles } from 'lucide-react';

interface Props {
  destination: Destination;
  onFinish: (scoreEarned: number, stampAwarded: boolean) => void;
  onBack: () => void;
  onPlanHoliday: (destinationId: string) => void;
}

export const GuessDestinationGame: React.FC<Props> = ({
  destination,
  onFinish,
  onBack,
  onPlanHoliday,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  const questions: QuizQuestion[] = destination.quizQuestions;
  const currentQ = questions[currentIdx];

  // Timer effect
  useEffect(() => {
    if (hasAnswered || isCompleted) return;

    if (timeLeft <= 0) {
      handleSelectOption(-1); // Time out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasAnswered, isCompleted]);

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      soundManager.playSuccessChime();
      const bonus = timeLeft > 10 ? 10 : 0;
      setScore((prev) => prev + currentQ.points + bonus);
      setCorrectCount((prev) => prev + 1);
    } else {
      soundManager.playError();
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
      setTimeLeft(20);
    } else {
      setIsCompleted(true);
      const stampAwarded = correctCount >= 2;
      if (stampAwarded) {
        soundManager.playVictory();
      }
      onFinish(score, stampAwarded);
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setCorrectCount(0);
    setIsCompleted(false);
    setTimeLeft(20);
  };

  if (isCompleted) {
    const passed = correctCount >= 2;
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 my-6">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-500 shadow-inner">
          {passed ? <Award className="w-10 h-10" /> : <Compass className="w-10 h-10" />}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          {passed ? 'Destination Unlocked!' : 'Adventure Debrief'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {passed
            ? `Fantastic exploring! You answered ${correctCount}/${questions.length} questions correctly.`
            : `You scored ${correctCount}/${questions.length}. Practice makes a seasoned globetrotter!`}
        </p>

        <div className="w-full bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Points Earned</span>
            <span className="font-bold text-base text-amber-600 tabular-nums">+{score} PTS</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Passport Stamp Status</span>
            <span className={`font-semibold ${passed ? 'text-emerald-600' : 'text-slate-500'}`}>
              {passed ? `Stamped: ${destination.name}` : 'Needs 2+ Correct'}
            </span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={() => onPlanHoliday(destination.id)}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-md hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Plan Your {destination.name} Holiday
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 active:scale-[0.98] transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Play Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-900 text-white font-semibold text-xs hover:bg-blue-800 active:scale-[0.98] transition"
            >
              Back to Quest
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden my-4">
      {/* Top Header bar with progress & timer */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-900 p-4 text-white">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium text-blue-200">
            Question {currentIdx + 1} of {questions.length} · {destination.name}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold tabular-nums">+{score} pts</span>
            <button
              onClick={onBack}
              className="text-xs text-blue-300 hover:text-white transition px-2 py-0.5 rounded bg-blue-800/60"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="relative w-full h-2 bg-blue-950/80 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft > 10 ? 'bg-amber-400' : timeLeft > 5 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${(timeLeft / 20) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-blue-300 mt-1">
          <span className="flex items-center gap-1">
            <Timer className="w-3 h-3 text-amber-400" /> {timeLeft}s remaining
          </span>
          <span>Fast answer bonus: +10 pts</span>
        </div>
      </div>

      {/* Destination Landmark Photo / Illustration */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[10px] tracking-wider uppercase text-amber-300 font-bold">
            Posch Quest Discovery
          </span>
          <h3 className="text-base font-bold leading-tight">{destination.name} Landmark Trivia</h3>
        </div>
      </div>

      {/* Question Body */}
      <div className="p-5">
        <h4 className="text-base font-semibold text-slate-900 mb-2 leading-snug">
          {currentQ.question}
        </h4>
        <p className="text-xs text-slate-500 mb-4 italic">💡 Hint: {currentQ.hint}</p>

        {/* 4 Answer Options */}
        <div className="space-y-2.5 mb-5">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;
            let btnClass = 'border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50/50';

            if (hasAnswered) {
              if (isCorrect) {
                btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-sm';
              } else if (isSelected) {
                btnClass = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold';
              } else {
                btnClass = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnClass}`}
              >
                <span>{option}</span>
                {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Trigger */}
        {hasAnswered && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 mb-4 animate-in fade-in">
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              <span className="font-bold text-amber-700">Exploration Note: </span>
              {currentQ.explanation}
            </p>
          </div>
        )}

        {hasAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-3 px-5 rounded-xl bg-blue-900 text-white text-xs font-bold shadow-md hover:bg-blue-800 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>{currentIdx + 1 < questions.length ? 'Next Question' : 'Complete Challenge'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
