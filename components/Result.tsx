
import React from 'react';
import { QuizResult } from '../types';

interface ResultProps {
  result: QuizResult;
  onRestart: () => void;
  onHome: () => void;
  onReview: () => void;
}

const Result: React.FC<ResultProps> = ({ result, onRestart, onHome, onReview }) => {
  const percentage = Math.round((result.score / result.total) * 100);

  const handleDownload = () => {
    window.print();
  };
  
  return (
    <div className="flex flex-col items-center gap-8 py-4 animate-in fade-in zoom-in-95 duration-700 px-2">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-1">Xuất sắc lắm các em! 🎉</h1>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Thầy Đinh Thành tự hào về các em</p>
      </div>

      {/* Professional Certificate */}
      <div id="certificate" className="w-full max-w-2xl bg-white p-1 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-[12px] border-indigo-600 print:border-indigo-600 print:shadow-none print:m-0 print:rounded-none">
        <div className="bg-white border-2 border-indigo-100 rounded-[2rem] p-6 sm:p-12 relative">
          {/* Certificate Corner Borders */}
          <div className="absolute top-2 left-2 w-16 h-16 border-t-4 border-l-4 border-amber-400"></div>
          <div className="absolute top-2 right-2 w-16 h-16 border-t-4 border-r-4 border-amber-400"></div>
          <div className="absolute bottom-2 left-2 w-16 h-16 border-b-4 border-l-4 border-amber-400"></div>
          <div className="absolute bottom-2 right-2 w-16 h-16 border-b-4 border-r-4 border-amber-400"></div>
          
          <div className="text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full flex items-center justify-center text-white text-5xl shadow-xl border-4 border-white">🎓</div>
            </div>
            
            <h1 className="text-2xl font-black text-indigo-900 uppercase tracking-[0.2em] mb-3">Giấy Chứng Nhận</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase mb-6">Kết quả ôn tập học kỳ 1 - Năm học 2025-2026</p>
            
            <p className="text-slate-500 italic text-base mb-2">Trân trọng chứng nhận em:</p>
            <h2 className="text-4xl font-black text-slate-800 mb-1 font-serif">{result.studentInfo.fullName}</h2>
            <p className="text-indigo-600 font-black text-xl mb-6 uppercase">Lớp: {result.studentInfo.className}</p>
            
            <div className="max-w-sm mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 shadow-inner">
               <p className="text-slate-700 font-bold leading-relaxed text-sm">
                 Đã hoàn thành xuất sắc thử thách ôn tập Tin học 8 với điểm số <span className="text-indigo-600 font-black">{result.score}/{result.total}</span> (Đạt {percentage}%)
               </p>
            </div>
            
            <div className="flex justify-between items-end mt-12 px-2">
              <div className="text-left">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">Ngày hoàn thành</p>
                <p className="font-bold text-slate-800 text-sm">{new Date().toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-indigo-600 font-black uppercase tracking-widest mb-2">Giáo viên hướng dẫn</p>
                <div className="flex flex-col items-center">
                   <p className="font-serif italic text-2xl text-slate-800 leading-none mb-1">Đinh Thành</p>
                   <div className="w-24 h-[1px] bg-slate-200 mb-1"></div>
                   <p className="font-black text-[8px] text-slate-500 uppercase">Hotline: 0915.213717</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
             <div className="text-9xl font-black rotate-[-35deg] tracking-tight">EXCELLENT</div>
          </div>
        </div>
      </div>

      {/* Navigation & Actions */}
      <div className="flex flex-col w-full gap-4 max-w-xl px-4 no-print mb-10">
        <button 
          onClick={handleDownload}
          className="w-full py-5 bg-emerald-500 text-white font-black rounded-2xl shadow-[0_6px_0_0_#059669] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 text-lg"
        >
          📥 Lưu Chứng Nhận (PDF/In)
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onReview}
            className="py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-[0_4px_0_0_#312e81] active:translate-y-1 transition-all text-sm uppercase tracking-wide"
          >
            Xem lại bài
          </button>
          <button 
            onClick={onHome}
            className="py-4 bg-slate-800 text-white font-black rounded-2xl shadow-[0_4px_0_0_#0f172a] active:translate-y-1 transition-all text-sm uppercase tracking-wide"
          >
            Về trang chủ
          </button>
        </div>
      </div>
      
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest no-print">Bản quyền thầy Đinh Thành • 0915.213717</p>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate, #certificate * { visibility: visible; }
          #certificate { position: fixed; left: 0; top: 0; width: 100vw; height: auto; border: none !important; margin: 0 !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Result;
