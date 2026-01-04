
import React, { useState, useEffect } from 'react';
import { Zap, ExternalLink, Clock, Info, Layers } from 'lucide-react';
import { Task } from '../types';

// Fix: Use React.FC to include React-specific properties like 'key' in the props definition
const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
  <div className="glass rounded-[32px] p-6 card-glow transition-all flex flex-col h-full border border-slate-800 group relative overflow-hidden">
    {task.done >= task.limit && (
      <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-[2px] rounded-3xl flex items-center justify-center border border-slate-800">
         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] rotate-[-12deg] border-2 border-slate-800 px-4 py-2 rounded-xl">Hết lượt</span>
      </div>
    )}
    <div className="flex justify-between items-start mb-6">
      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${task.isSpecial ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>
        {task.isSpecial ? task.specialType : task.category}
      </span>
      <div className="flex items-center space-x-1 text-slate-600 text-[9px] font-black uppercase tracking-widest">
        <Clock size={12} />
        <span>{task.time}</span>
      </div>
    </div>
    <h3 className="font-black text-sm mb-6 group-hover:text-amber-500 transition-colors line-clamp-2 uppercase tracking-tighter italic leading-snug">
      {task.title}
    </h3>
    
    <div className="mt-auto space-y-5">
      <div className="flex items-center justify-between">
         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Tiến độ hôm nay</p>
         <p className="text-[9px] font-black text-white uppercase tracking-widest">{task.done}/{task.limit}</p>
      </div>
      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
         <div className="h-full bg-emerald-500" style={{ width: `${(task.done/task.limit)*100}%` }} />
      </div>
      
      <div className="p-4 bg-slate-950 rounded-[24px] flex items-center justify-between border border-slate-900 group-hover:border-amber-500/20 transition-all">
        <div className="flex items-center space-x-3">
          <Zap className="text-amber-500" size={16} fill="currentColor" />
          <div>
            <span className="font-black text-amber-500 text-base italic">{task.reward.toLocaleString()}đ</span>
            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Thưởng trực tiếp</p>
          </div>
        </div>
        <button onClick={() => window.open(task.targetUrl || '#', '_blank')} className="bg-white hover:bg-amber-500 text-slate-950 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xl active:scale-95 group-hover:rotate-12">
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  </div>
);

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ge_tasks_db');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const initial: Task[] = [
        { id: 't1', title: 'Vượt link lấy mã Garena 20k - Link 1s', reward: 800, commission: 40, source: 'link4m', autoCredit: true, isSpecial: false, category: 'Traffic', time: '15s', limit: 10, done: 2 },
        { id: 't2', title: 'Review Ứng Dụng Liên Quân Mobile', reward: 5000, commission: 250, source: 'Admin', autoCredit: false, isSpecial: true, specialType: 'REV_APP', targetUrl: 'https://garena.vn', category: 'Special', time: '1m', limit: 1, done: 0 }
      ];
      setTasks(initial);
      localStorage.setItem('ge_tasks_db', JSON.stringify(initial));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <div className="flex items-center space-x-3 p-5 bg-slate-900/50 border border-slate-800 rounded-3xl">
         <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500"><Info size={18} /></div>
         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
            Nhiệm vụ đặc biệt yêu cầu Admin duyệt thủ công. <span className="text-white italic">Reset lúc 00:00 Hàng Ngày</span>.
         </p>
      </div>
    </div>
  );
};

export default TaskList;
