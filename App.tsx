
import React, { useState, useCallback } from 'react';
import { AppState, QuizResult, Question, StudentInfo } from './types';
import { QUESTIONS } from './questions';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Review from './components/Review';
import EssayQuiz from './components/EssayQuiz';
import Registration from './components/Registration';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.REGISTRATION);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  const handleRegister = (info: StudentInfo) => {
    setStudentInfo(info);
    setAppState(AppState.HOME);
  };

  const startQuiz = useCallback((mode: 'all' | 'random' | 'essay') => {
    if (mode === 'essay') {
      setAppState(AppState.ESSAY);
      return;
    }
    
    let selectedQuestions = [...QUESTIONS];
    if (mode === 'random') {
      // Cập nhật thành 30 câu ngẫu nhiên theo yêu cầu mới
      selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5).slice(0, 30);
    }
    setQuizQuestions(selectedQuestions);
    setAppState(AppState.QUIZ);
  }, []);

  const finishQuiz = useCallback((resultData: Omit<QuizResult, 'studentInfo'>) => {
    if (studentInfo) {
      const fullResult: QuizResult = { ...resultData, studentInfo };
      setCurrentResult(fullResult);
      setAppState(AppState.RESULT);
    }
  }, [studentInfo]);

  const goToHome = () => setAppState(AppState.HOME);
  const goToReview = () => setAppState(AppState.REVIEW);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col font-sans selection:bg-indigo-100 overflow-x-hidden">
      <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={studentInfo ? goToHome : undefined}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-[0_4px_0_0_#312e81] group-active:translate-y-1 group-active:shadow-none transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg leading-tight tracking-tight text-slate-800">TIN HỌC 8</span>
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-[0.2em]">Mastery Edition</span>
            </div>
          </div>
          {studentInfo && appState !== AppState.HOME && (
            <div className="flex items-center gap-2">
              <div className="hidden xs:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase">Học sinh</span>
                <span className="text-xs font-black text-slate-700 truncate max-w-[120px]">{studentInfo.fullName}</span>
              </div>
              <button 
                onClick={goToHome}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col justify-center">
        {appState === AppState.REGISTRATION && <Registration onRegister={handleRegister} />}
        {appState === AppState.HOME && <Home onStartQuiz={startQuiz} />}
        {appState === AppState.QUIZ && <Quiz questions={quizQuestions} studentName={studentInfo?.fullName || ""} onFinish={finishQuiz} />}
        {appState === AppState.ESSAY && <EssayQuiz onHome={goToHome} />}
        {appState === AppState.RESULT && currentResult && (
          <Result result={currentResult} onRestart={() => startQuiz('all')} onHome={goToHome} onReview={goToReview} />
        )}
        {appState === AppState.REVIEW && currentResult && (
          <Review questions={quizQuestions} result={currentResult} onHome={goToHome} />
        )}
      </main>

      <footer className="bg-white/50 border-t border-slate-200 py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-800 font-black mb-1 text-sm">
            Bản quyền thuộc về thầy <span className="text-indigo-600 uppercase">Đinh Thành</span>
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <span className="font-mono font-bold">0915.213717</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
