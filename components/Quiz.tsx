
import React, { useState, useEffect, useRef } from 'react';
import { Question, QuizResult } from '../types';

interface QuizProps {
  questions: Question[];
  studentName: string;
  onFinish: (result: Omit<QuizResult, 'studentInfo'>) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, studentName, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showPointAnim, setShowPointAnim] = useState(false);

  const audioContext = useRef<AudioContext | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const playSound = (type: 'correct' | 'wrong') => {
    try {
      if (!audioContext.current) audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioContext.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      if (type === 'correct') {
          osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      } else {
          osc.type = 'sawtooth'; osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      }
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showFeedback) setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [showFeedback]);

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    const correct = idx === questions[currentIndex].correctIndex;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = idx;
    setSelectedAnswers(newAnswers);
    setIsCorrect(correct);
    
    if (correct) {
      setShowPointAnim(true);
      playSound('correct');
      if (typeof (window as any).confetti === 'function') {
        (window as any).confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
      setTimeout(() => setShowPointAnim(false), 1200);
    } else {
      playSound('wrong');
    }
    setShowFeedback(true);
    
    // Auto-scroll to feedback area
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 200);
  };

  const handleNext = () => {
    if (!showFeedback) return;
    setShowFeedback(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const score = selectedAnswers.reduce((acc, sel, idx) => sel === questions[idx].correctIndex ? acc + 1 : acc, 0);
    onFinish({
      score,
      total: questions.length,
      answers: selectedAnswers.map((sel, idx) => ({ questionId: questions[idx].id, selectedIndex: sel, isCorrect: sel === questions[idx].correctIndex })),
      timeTaken: secondsElapsed
    });
  };

  const currentQuestion = questions[currentIndex];
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Color mapping for A, B, C, D (3D Blocks)
  const blockStyles = [
    { 
      base: 'bg-blue-50 border-blue-200 text-blue-900', 
      shadow: 'shadow-[0_8px_0_0_#2563eb]', 
      iconBg: 'bg-blue-600 text-white',
      feedbackCorrect: 'bg-emerald-600 border-emerald-400 text-white shadow-[0_8px_0_0_#064e3b]',
      feedbackWrong: 'bg-rose-600 border-rose-400 text-white shadow-[0_8px_0_0_#9f1239]'
    },
    { 
      base: 'bg-emerald-50 border-emerald-200 text-emerald-900', 
      shadow: 'shadow-[0_8px_0_0_#059669]', 
      iconBg: 'bg-emerald-600 text-white',
      feedbackCorrect: 'bg-emerald-600 border-emerald-400 text-white shadow-[0_8px_0_0_#064e3b]',
      feedbackWrong: 'bg-rose-600 border-rose-400 text-white shadow-[0_8px_0_0_#9f1239]'
    },
    { 
      base: 'bg-amber-50 border-amber-200 text-amber-900', 
      shadow: 'shadow-[0_8px_0_0_#d97706]', 
      iconBg: 'bg-amber-600 text-white',
      feedbackCorrect: 'bg-emerald-600 border-emerald-400 text-white shadow-[0_8px_0_0_#064e3b]',
      feedbackWrong: 'bg-rose-600 border-rose-400 text-white shadow-[0_8px_0_0_#9f1239]'
    },
    { 
      base: 'bg-rose-50 border-rose-200 text-rose-900', 
      shadow: 'shadow-[0_8px_0_0_#e11d48]', 
      iconBg: 'bg-rose-600 text-white',
      feedbackCorrect: 'bg-emerald-600 border-emerald-400 text-white shadow-[0_8px_0_0_#064e3b]',
      feedbackWrong: 'bg-rose-600 border-rose-400 text-white shadow-[0_8px_0_0_#9f1239]'
    }
  ];

  return (
    <div className="fixed inset-0 bg-[#f8fafc] flex flex-col select-none overflow-hidden safe-area-inset">
      {/* Floating Point Animation */}
      {showPointAnim && (
        <div className="fixed inset-0 pointer-events-none z-[300] flex items-center justify-center">
          <div className="text-[12rem] font-black text-emerald-500 animate-float-up drop-shadow-2xl">+10</div>
        </div>
      )}

      {/* Optimized Header for Mobile */}
      <div className="px-4 py-3 bg-white border-b-2 border-slate-100 flex justify-between items-center shrink-0 z-10 shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-0.5">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                Tiến độ:
             </span>
             <span className="bg-indigo-100 text-indigo-700 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                {currentIndex + 1}/{questions.length}
             </span>
          </div>
          <h1 className="text-xl xs:text-2xl font-black text-slate-800 leading-none">
             Câu {currentIndex + 1}
             <span className="text-slate-300 font-bold text-xs ml-2">
               (Câu {currentQuestion.id} - trong 148 câu)
             </span>
          </h1>
        </div>

        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
           <span className="text-lg">⏱️</span>
           <span className="text-xl font-black font-mono leading-none">{formatTime(secondsElapsed)}</span>
        </div>
      </div>

      {/* Main Content Area - Scrollable for long questions/feedback */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
           {/* Question Container */}
           <div className="bg-white p-6 rounded-[2rem] shadow-[0_4px_0_0_#f1f5f9] border border-slate-50">
             <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug tracking-tight text-center">
               {currentQuestion.text}
             </h2>
           </div>

           {/* 3D Answer Blocks */}
           <div className="flex flex-col gap-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                const isCorrectIdx = currentQuestion.correctIndex === idx;
                const style = blockStyles[idx % blockStyles.length];
                
                let dynamicClass = `${style.base} ${style.shadow}`;
                
                if (showFeedback) {
                  if (isCorrectIdx) {
                    dynamicClass = style.feedbackCorrect;
                  } else if (isSelected && !isCorrectIdx) {
                    dynamicClass = style.feedbackWrong;
                  } else {
                    dynamicClass = "bg-slate-100 border-slate-200 text-slate-400 shadow-[0_6px_0_0_#cbd5e1] opacity-30 scale-[0.98]";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showFeedback}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-5 rounded-[1.8rem] border-2 transition-all flex items-center gap-5 active:translate-y-1 active:shadow-none ${dynamicClass}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-2xl shrink-0 ${showFeedback ? 'bg-white/20' : style.iconBg}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-black text-lg sm:text-xl leading-tight flex-1 tracking-tight">
                      {option}
                    </span>
                  </button>
                );
              })}
           </div>

           {/* Feedback Area at the end */}
           {showFeedback && (
             <div className="mt-6 mb-12 animate-in slide-in-from-top-4 duration-500">
                <div className={`p-6 rounded-[2.5rem] border-4 shadow-xl flex flex-col items-center gap-5 ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                   <div className="flex flex-col items-center gap-1">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-md border-2 border-white ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white animate-bounce'}`}>
                        {isCorrect ? '✨' : '📝'}
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter mt-1">
                        {isCorrect ? 'Chính xác!' : 'Xem lại nhé!'}
                      </h3>
                   </div>
                   
                   <div className="text-center bg-white/50 p-4 rounded-2xl border border-white w-full">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đáp án đúng</p>
                      <p className="text-lg font-bold text-slate-800 leading-snug">
                        {String.fromCharCode(65 + currentQuestion.correctIndex)}. {currentQuestion.options[currentQuestion.correctIndex]}
                      </p>
                   </div>

                   <button 
                     onClick={handleNext}
                     className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.8rem] shadow-[0_8px_0_0_#312e81] active:translate-y-1 active:shadow-none transition-all text-xl uppercase tracking-widest flex items-center justify-center gap-3"
                   >
                     TIẾP TỤC ➔
                   </button>
                </div>
             </div>
           )}

           {/* Footer Copyright */}
           <div className="py-8 text-center opacity-40">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">Thầy Đinh Thành • 0915.213717</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
