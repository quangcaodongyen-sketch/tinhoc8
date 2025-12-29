
import React from 'react';

interface HomeProps {
  onStartQuiz: (mode: 'all' | 'random' | 'essay') => void;
}

const Home: React.FC<HomeProps> = ({ onStartQuiz }) => {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 px-1">
      {/* Hero Block */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 rounded-[2.5rem] p-6 text-white shadow-[0_15px_0_0_#312e81] mb-2">
        <div className="relative z-10 text-center sm:text-left">
           <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">Học kỳ 1 • 2025</span>
           <h1 className="text-4xl sm:text-6xl font-black mb-2 leading-none tracking-tight">ÔN TẬP<br/>TIN HỌC 8</h1>
           <p className="text-indigo-100 text-xs sm:text-base font-bold opacity-80 mb-6">Mastery Edition • Bám sát 148 câu hỏi đề cương</p>
           <div className="flex justify-center sm:justify-start">
              <div className="w-16 h-1 bg-white/30 rounded-full"></div>
           </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
      </section>

      {/* Modes Grid */}
      <div className="space-y-4">
        <button 
          onClick={() => onStartQuiz('all')}
          className="w-full group p-5 bg-white border-4 border-indigo-100 rounded-[2rem] shadow-[0_10px_0_0_#e2e8f0] active:translate-y-2 active:shadow-none transition-all flex items-center gap-5"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">🏁</div>
          <div className="text-left">
            <h3 className="text-xl font-black text-slate-800 uppercase leading-none mb-1">LUYỆN TẬP 148 CÂU</h3>
            <p className="text-slate-400 font-bold text-xs uppercase">Học toàn bộ kiến thức đề cương</p>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onStartQuiz('random')}
            className="p-5 bg-amber-400 border-4 border-amber-300 rounded-[2rem] shadow-[0_10px_0_0_#b45309] active:translate-y-2 active:shadow-none transition-all flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-3xl">🎲</div>
            <div>
              <h3 className="text-lg font-black text-amber-900 leading-none mb-1">NGẪU NHIÊN</h3>
              <p className="text-amber-800/60 font-black text-[10px] uppercase">Thử thách 30 câu</p>
            </div>
          </button>

          <button 
            onClick={() => onStartQuiz('essay')}
            className="p-5 bg-emerald-500 border-4 border-emerald-400 rounded-[2rem] shadow-[0_10px_0_0_#065f46] active:translate-y-2 active:shadow-none transition-all flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-3xl">🤖</div>
            <div>
              <h3 className="text-lg font-black text-white leading-none mb-1">TỰ LUẬN AI</h3>
              <p className="text-emerald-100/60 font-black text-[10px] uppercase">Học máy chấm điểm</p>
            </div>
          </button>
        </div>
      </div>

      {/* Author Info */}
      <div className="bg-slate-800 rounded-[2rem] p-6 text-white shadow-[0_10px_0_0_#0f172a] mt-2">
         <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-lg">💡</div>
            <h2 className="text-sm font-black uppercase tracking-widest">Lời chúc từ thầy Đinh Thành</h2>
         </div>
         <p className="text-slate-300 text-xs font-bold leading-relaxed italic">
           "Chúc các em học sinh ôn tập thật tốt và đạt kết quả cao trong kỳ thi sắp tới. Sự nỗ lực hôm nay là thành công ngày mai!"
         </p>
      </div>
    </div>
  );
};

export default Home;
