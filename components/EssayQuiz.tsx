
import React, { useState, useRef } from 'react';
import { ESSAY_QUESTIONS } from '../questions';
import { GoogleGenAI } from "@google/genai";

interface EssayQuizProps {
  onHome: () => void;
}

const EssayQuiz: React.FC<EssayQuizProps> = ({ onHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number, comment: string } | null>(null);
  const [showPointAnim, setShowPointAnim] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const audioContext = useRef<AudioContext | null>(null);
  const currentQ = ESSAY_QUESTIONS[currentIndex];

  const playSound = (isHigh: boolean) => {
    if (!audioContext.current) audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioContext.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = isHigh ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(isHigh ? 600 : 200, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  };

  const handleGrade = async () => {
    if (!userAnswer.trim() || isLoading) return;
    setIsLoading(true);
    setFeedback(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Bạn là một giáo viên dạy Tin học lớp 8. Hãy chấm điểm câu trả lời của học sinh cho câu hỏi sau:
      Câu hỏi: "${currentQ.text}"
      Đáp án gợi ý: "${currentQ.suggestedAnswer}"
      Câu trả lời của học sinh: "${userAnswer}"
      
      Hãy phản hồi bằng định dạng JSON: {"score": (số từ 0-10), "comment": "Lời nhận xét ngắn gọn, khích lệ và góp ý bổ sung nếu cần"}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{"score": 0, "comment": "Lỗi hệ thống"}');
      setFeedback(data);
      
      if (data.score >= 5) {
        setTotalScore(prev => prev + data.score);
        setShowPointAnim(true);
        playSound(true);
        (window as any).confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => setShowPointAnim(false), 2000);
      } else {
        playSound(false);
      }
    } catch (error) {
      console.error(error);
      setFeedback({ score: 0, comment: "Đã có lỗi xảy ra khi kết nối với Giáo viên AI." });
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < ESSAY_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setFeedback(null);
    } else {
      onHome();
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto py-2 animate-in fade-in duration-500 px-2 sm:px-0">
      {showPointAnim && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl font-black text-emerald-500 animate-float-up drop-shadow-xl">
            +{feedback?.score}
          </div>
        </div>
      )}

      {/* Stats Header */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="bg-white p-4 rounded-3xl shadow-[0_6px_0_0_#e2e8f0] border border-slate-100 flex flex-col items-center">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Câu hỏi</span>
           <span className="text-xl font-black text-slate-800">{currentIndex + 1}/{ESSAY_QUESTIONS.length}</span>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-[0_6px_0_0_#e2e8f0] border border-slate-100 flex flex-col items-center">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng điểm</span>
           <span className="text-xl font-black text-emerald-600">{totalScore}</span>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-[3rem] shadow-[0_15px_0_0_#e2e8f0] border-2 border-slate-50 flex flex-col min-h-[550px]">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-wider border border-indigo-100">
              Chủ đề: {currentQ.category}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-8 leading-snug">{currentQ.text}</h2>
          
          <div className="relative group">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isLoading || feedback !== null}
              placeholder="Nhập câu trả lời của em vào đây..."
              className="w-full h-44 p-6 rounded-3xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none text-slate-700 font-bold"
            />
            <div className="absolute bottom-4 right-4 text-[10px] font-black text-slate-300 uppercase">Tự luận AI v3.0</div>
          </div>

          {feedback && (
            <div className="mt-8 p-6 rounded-[2rem] bg-indigo-50 border-2 border-indigo-100 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-lg">👨‍🏫</div>
                   <span className="font-black text-indigo-900 uppercase text-xs tracking-wider">Giáo viên AI nhận xét:</span>
                </div>
                <div className="px-4 py-1 bg-white rounded-full shadow-sm">
                   <span className={`text-xl font-black ${feedback.score >= 8 ? 'text-emerald-600' : feedback.score >= 5 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {feedback.score}/10
                   </span>
                </div>
              </div>
              <p className="text-indigo-800 font-bold italic leading-relaxed text-sm mb-6">{feedback.comment}</p>
              <div className="pt-4 border-t border-indigo-200/50">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Đáp án tham khảo:</p>
                <p className="text-slate-600 text-xs font-bold leading-relaxed">{currentQ.suggestedAnswer}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-4 gap-3">
          {!feedback ? (
            <button
              onClick={handleGrade}
              disabled={isLoading || !userAnswer.trim()}
              className="col-span-3 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-[0_6px_0_0_#312e81] active:translate-y-1 active:shadow-none disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang chấm...</span>
                </div>
              ) : (
                "Gửi bài chấm điểm ➔"
              )}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="col-span-3 py-5 bg-slate-800 text-white font-black rounded-2xl shadow-[0_6px_0_0_#0f172a] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-lg"
            >
              {currentIndex < ESSAY_QUESTIONS.length - 1 ? "Câu tiếp theo" : "Kết thúc"} ➔
            </button>
          )}
          <button 
            onClick={onHome} 
            className="col-span-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl border-2 border-slate-200 active:translate-y-1 transition-all flex items-center justify-center"
            title="Thoát"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default EssayQuiz;
