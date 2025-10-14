import { useState, useEffect } from 'react';
import { Zap, Trophy, Timer } from 'lucide-react';

type BinaryBlastProps = {
  onComplete: (score: number, duration: number) => void;
  onClose: () => void;
};

export const BinaryBlast = ({ onComplete, onClose }: BinaryBlastProps) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [startTime] = useState(Date.now());
  const [mode, setMode] = useState<'toBinary' | 'toDecimal'>('toBinary');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    generateNewNumber();
  }, [mode]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleComplete();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const generateNewNumber = () => {
    if (mode === 'toBinary') {
      setCurrentNumber(Math.floor(Math.random() * 256));
    } else {
      const binary = Array.from({ length: 8 }, () => Math.floor(Math.random() * 2)).join('');
      setCurrentNumber(parseInt(binary, 2));
    }
  };

  const handleComplete = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    onComplete(score, duration);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isCorrect = false;
    if (mode === 'toBinary') {
      const correctBinary = currentNumber.toString(2).padStart(8, '0');
      isCorrect = userAnswer === correctBinary;
    } else {
      const currentBinary = currentNumber.toString(2).padStart(8, '0');
      isCorrect = parseInt(userAnswer) === parseInt(currentBinary, 2);
    }

    if (isCorrect) {
      const points = 10 + streak * 2;
      setScore(score + points);
      setStreak(streak + 1);
      setFeedback('correct');
    } else {
      setStreak(0);
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      generateNewNumber();
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <Trophy className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Score</p>
              <p className="text-xl font-bold text-white">{score}</p>
            </div>
            <div className="text-center">
              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Streak</p>
              <p className="text-xl font-bold text-white">{streak}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg px-4 py-2">
            <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400' : 'text-blue-400'}`} />
            <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('toBinary')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mode === 'toBinary'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Decimal → Binary
            </button>
            <button
              onClick={() => setMode('toDecimal')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mode === 'toDecimal'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Binary → Decimal
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-8 mb-6">
            <p className="text-sm text-blue-400 mb-2 text-center">
              {mode === 'toBinary' ? 'Convert to Binary' : 'Convert to Decimal'}
            </p>
            <p className="text-5xl font-bold text-white text-center font-mono">
              {mode === 'toBinary' ? currentNumber : currentNumber.toString(2).padStart(8, '0')}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => {
                  const value = e.target.value;
                  if (mode === 'toBinary') {
                    if (/^[01]*$/.test(value)) {
                      setUserAnswer(value);
                    }
                  } else {
                    if (/^\d*$/.test(value)) {
                      setUserAnswer(value);
                    }
                  }
                }}
                className={`w-full px-4 py-4 bg-slate-900 border-2 rounded-lg text-white text-center text-2xl font-mono focus:outline-none transition ${
                  feedback === 'correct'
                    ? 'border-green-500 bg-green-500/10'
                    : feedback === 'incorrect'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-slate-700 focus:border-blue-500'
                }`}
                placeholder={mode === 'toBinary' ? '00000000' : '0'}
                autoFocus
                disabled={feedback !== null}
                maxLength={mode === 'toBinary' ? 8 : 3}
              />
              {mode === 'toBinary' && (
                <p className="text-xs text-slate-500 text-center mt-2">Enter 8-bit binary (e.g., 00101010)</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!userAnswer || feedback !== null}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </form>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
          <p className="text-xs text-slate-400 mb-2">Quick Reference:</p>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500">1=1</span>
            <span className="text-slate-500">2=10</span>
            <span className="text-slate-500">4=100</span>
            <span className="text-slate-500">8=1000</span>
            <span className="text-slate-500">16=10000</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition"
        >
          Exit Game
        </button>
      </div>
    </div>
  );
};
