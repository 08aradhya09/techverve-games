import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Timer, Award } from 'lucide-react';

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
};

const triviaQuestions: Question[] = [
  {
    question: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
    correctAnswer: 0,
    category: 'Web Development',
  },
  {
    question: 'Which programming language is known as the "language of the web"?',
    options: ['Python', 'JavaScript', 'Java', 'C++'],
    correctAnswer: 1,
    category: 'Programming',
  },
  {
    question: 'What year was the first iPhone released?',
    options: ['2005', '2006', '2007', '2008'],
    correctAnswer: 2,
    category: 'Tech History',
  },
  {
    question: 'What does CPU stand for?',
    options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Computer Processing Unit'],
    correctAnswer: 0,
    category: 'Hardware',
  },
  {
    question: 'Which company created React?',
    options: ['Google', 'Microsoft', 'Facebook', 'Apple'],
    correctAnswer: 2,
    category: 'Frameworks',
  },
  {
    question: 'What is the maximum value of an 8-bit unsigned integer?',
    options: ['128', '255', '256', '512'],
    correctAnswer: 1,
    category: 'Computer Science',
  },
  {
    question: 'Which protocol is used to transfer web pages?',
    options: ['FTP', 'SMTP', 'HTTP', 'SSH'],
    correctAnswer: 2,
    category: 'Networking',
  },
  {
    question: 'What does API stand for?',
    options: ['Application Programming Interface', 'Advanced Programming Integration', 'Application Process Integration', 'Advanced Program Interface'],
    correctAnswer: 0,
    category: 'Software Development',
  },
];

type TechTriviaProps = {
  onComplete: (score: number, duration: number) => void;
  onClose: () => void;
};

export const TechTrivia = ({ onComplete, onClose }: TechTriviaProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [startTime] = useState(Date.now());
  const [questions] = useState(() =>
    [...triviaQuestions].sort(() => Math.random() - 0.5).slice(0, 5)
  );

  useEffect(() => {
    if (timeLeft === 0 && !showResult) {
      handleNextQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index);
      setShowResult(true);

      if (index === questions[currentQuestion].correctAnswer) {
        setScore(score + 100);
      }

      setTimeout(() => {
        handleNextQuestion();
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(15);
    } else {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      onComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 100 : 0), duration);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold text-white">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg px-4 py-2">
            <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-400' : 'text-blue-400'}`} />
            <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
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
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <div className="mb-8">
          <span className="inline-block bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1 text-xs font-medium text-blue-400 mb-4">
            {question.category}
          </span>
          <h3 className="text-2xl font-bold text-white mb-6">{question.question}</h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : showWrong
                      ? 'bg-red-500/20 border-red-500 text-red-400'
                      : isSelected
                      ? 'bg-blue-500/20 border-blue-500 text-white'
                      : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
                  } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showCorrect && <CheckCircle className="w-5 h-5" />}
                    {showWrong && <XCircle className="w-5 h-5" />}
                  </div>
                </button>
              );
            })}
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
