
import React from 'react';
import { Question, QuizResult } from '../types';

interface ReviewProps {
  questions: Question[];
  result: QuizResult;
  onHome: () => void;
}

const Review: React.FC<ReviewProps> = ({ questions, result, onHome }) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Xem lại bài làm</h1>
        <button 
          onClick={onHome}
          className="px-4 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition-colors"
        >
          Xong
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const answer = result.answers.find(a => a.questionId === q.id);
          const isCorrect = answer?.isCorrect;

          return (
            <div key={q.id} className={`p-6 rounded-3xl border-2 bg-white ${isCorrect ? 'border-emerald-100' : 'border-red-100'}`}>
              <div className="flex items-start gap-4 mb-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {qIdx + 1}
                </span>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{q.text}</h3>
              </div>

              <div className="grid gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = answer?.selectedIndex === oIdx;
                  const isCorrectAnswer = q.correctIndex === oIdx;

                  let variant = 'border-slate-50 text-slate-600 bg-slate-50/50';
                  if (isCorrectAnswer) variant = 'border-emerald-200 bg-emerald-50 text-emerald-700 font-bold';
                  if (isSelected && !isCorrectAnswer) variant = 'border-red-200 bg-red-50 text-red-700 font-bold';

                  return (
                    <div key={oIdx} className={`p-3 rounded-xl border flex items-center gap-3 ${variant}`}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        isCorrectAnswer ? 'bg-emerald-500 text-white' : 
                        isSelected ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span>{opt}</span>
                      {isCorrectAnswer && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-auto text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      )}
                      {isSelected && !isCorrectAnswer && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-auto text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={onHome}
        className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all mt-4"
      >
        Về trang chủ
      </button>
    </div>
  );
};

export default Review;
