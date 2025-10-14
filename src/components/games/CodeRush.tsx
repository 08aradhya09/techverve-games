import { useState, useEffect } from 'react';
import { Code2, Check, X, Timer, Award } from 'lucide-react';

type Challenge = {
  title: string;
  description: string;
  code: string;
  bug: string;
  fix: string;
  hint: string;
};

const challenges: Challenge[] = [
  {
    title: 'Array Bug Fix',
    description: 'This function should return the sum of array elements, but something is wrong!',
    code: `function sumArray(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}`,
    bug: 'i <= arr.length',
    fix: 'i < arr.length',
    hint: 'Check the loop condition - what happens at the last iteration?',
  },
  {
    title: 'String Comparison',
    description: 'Fix the password validation function',
    code: `function validatePassword(input, stored) {\n  if (input = stored) {\n    return true;\n  }\n  return false;\n}`,
    bug: 'input = stored',
    fix: 'input === stored',
    hint: 'Are you comparing or assigning?',
  },
  {
    title: 'Missing Return',
    description: 'This function should double a number',
    code: `function double(num) {\n  num * 2;\n}`,
    bug: 'num * 2;',
    fix: 'return num * 2;',
    hint: 'The function calculates but does not give back the result',
  },
  {
    title: 'Async Await',
    description: 'Fix the async function to properly wait for data',
    code: `async function getData() {\n  const data = fetch('/api/data');\n  console.log(data);\n}`,
    bug: 'fetch(\'/api/data\')',
    fix: 'await fetch(\'/api/data\')',
    hint: 'Promises need to be awaited in async functions',
  },
];

type CodeRushProps = {
  onComplete: (score: number, duration: number) => void;
  onClose: () => void;
};

export const CodeRush = ({ onComplete, onClose }: CodeRushProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime] = useState(Date.now());
  const [shuffledChallenges] = useState(() =>
    [...challenges].sort(() => Math.random() - 0.5).slice(0, 3)
  );

  useEffect(() => {
    if (timeLeft === 0) {
      handleComplete();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    setUserCode(shuffledChallenges[currentChallenge].code);
  }, [currentChallenge]);

  const handleComplete = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    onComplete(score, duration);
  };

  const handleSubmit = () => {
    const challenge = shuffledChallenges[currentChallenge];
    const isCorrect =
      userCode.includes(challenge.fix) && !userCode.includes(challenge.bug);

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      const bonusPoints = showHint ? 50 : 100;
      setScore(score + bonusPoints);

      setTimeout(() => {
        if (currentChallenge + 1 < shuffledChallenges.length) {
          setCurrentChallenge(currentChallenge + 1);
          setFeedback(null);
          setShowHint(false);
        } else {
          handleComplete();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  const challenge = shuffledChallenges[currentChallenge];
  const progress = ((currentChallenge + 1) / shuffledChallenges.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold text-white">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg px-4 py-2">
            <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400' : 'text-blue-400'}`} />
            <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-400">
            Challenge {currentChallenge + 1} of {shuffledChallenges.length}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Code2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
              <p className="text-slate-300">{challenge.description}</p>
            </div>
          </div>

          {showHint && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-400">
                <strong>Hint:</strong> {challenge.hint}
              </p>
            </div>
          )}

          <div className="bg-slate-900 rounded-lg p-4 mb-4 border border-slate-700">
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full bg-transparent text-green-400 font-mono text-sm focus:outline-none resize-none"
              rows={6}
              spellCheck={false}
            />
          </div>

          {feedback && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg mb-4 ${
                feedback === 'correct'
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-red-500/20 border border-red-500/50 text-red-400'
              }`}
            >
              {feedback === 'correct' ? (
                <>
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Correct! Moving to next challenge...</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5" />
                  <span className="font-semibold">Not quite right. Try again!</span>
                </>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={feedback !== null}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Solution
            </button>
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-semibold px-6 py-3 rounded-lg transition border border-yellow-500/30"
              >
                Show Hint
              </button>
            )}
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
