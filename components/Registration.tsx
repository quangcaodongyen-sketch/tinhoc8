
import React, { useState } from 'react';
import { StudentInfo } from '../types';

interface RegistrationProps {
  onRegister: (info: StudentInfo) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && className.trim()) {
      onRegister({ fullName, className });
    }
  };

  return (
    <div className="max-w-md mx-auto w-full animate-in fade-in zoom-in duration-700 px-2 sm:px-0">
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-t-8 border-indigo-600">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner border border-indigo-100">👨‍🎓</div>
          <h2 className="text-2xl font-black text-slate-800 mb-1 uppercase tracking-tight">Thông Tin Thí Sinh</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Ôn tập Tin học 8 - HK1</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Họ và tên học sinh</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Thị Huệ"
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Lớp đang học</label>
            <input 
              type="text" 
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Lớp 8C1"
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner text-sm"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4.5 bg-indigo-600 text-white font-black text-base rounded-2xl shadow-[0_6px_0_0_#312e81] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3 mt-4"
          >
            Bắt đầu ôn luyện ➔
          </button>
        </form>
      </div>
      <div className="text-center mt-6">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Bản quyền thầy Đinh Thành • 0915.213717</p>
      </div>
    </div>
  );
};

export default Registration;
