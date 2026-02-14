import { useState } from 'react';
import type { QuizQuestion } from '../types';

interface Props {
  questions: QuizQuestion[];
}

export default function QuizSection({ questions }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return null;

  const q = questions[currentIdx];
  const answered = selected !== null;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="mt-4 p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {score}/{questions.length}
          </div>
          <div className="text-sm text-slate-400 mb-3">
            {score === questions.length ? '🎉 Perfect!' : score >= questions.length / 2 ? '👍 Good job!' : '📚 Keep studying!'}
          </div>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quiz</span>
        <span className="text-xs text-slate-500">
          {currentIdx + 1}/{questions.length}
        </span>
      </div>

      <p className="text-sm text-slate-200 font-medium mb-3">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          let style = 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-700';
          if (answered) {
            if (idx === q.correctIndex) style = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
            else if (idx === selected) style = 'bg-red-500/20 border-red-500/50 text-red-300';
            else style = 'bg-slate-700/30 border-slate-700/30 text-slate-500';
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <>
          <p className="mt-3 text-xs text-slate-400 leading-relaxed">{q.explanation}</p>
          <button
            onClick={handleNext}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm text-white rounded-lg transition-colors"
          >
            {currentIdx + 1 >= questions.length ? 'See Results' : 'Next Question'}
          </button>
        </>
      )}
    </div>
  );
}
