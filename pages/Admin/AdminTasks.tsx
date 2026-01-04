
import React, { useState, useEffect } from 'react';
import { Zap, Globe, Key as KeyIcon, ExternalLink, DollarSign } from 'lucide-react';
import { Task, SpecialTaskType } from '../../types';
import { useNotify } from '../../App';

const AdminTasks: React.FC = () => {
  const { notify } = useNotify();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    source: '', apiKey: '', autoCredit: true, isSpecial: false, reward: 1000, limit: 10, specialType: 'REV_APP', targetUrl: ''
  });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('ge_tasks_db') || '[]');
    setTasks(savedTasks);
  }, []);

  const handleCreateTask = () => {
    if (!newTask.source) { notify("Vui lòng nhập nguồn link!", "ERROR"); return; }
    
    const task: Task = {
      ...newTask as Task,
      id: 'task-' + Date.now(),
      title: newTask.isSpecial ? `[ĐẶC BIỆT] ${newTask.specialType}` : `Vượt link ${newTask.source}`,
      done: 0,
      category: newTask.isSpecial ? 'Special' : 'Traffic',
      time: newTask.isSpecial ? '1m' : '15s',
      commission: Math.floor((newTask.reward || 0) * 0.05)
    };

    const updated = [task, ...tasks];
    setTasks(updated);
    localStorage.setItem('ge_tasks_db', JSON.stringify(updated));
    notify("Bot đã kích hoạt nhiệm vụ mới thành công!", "SUCCESS");
    
    // Reset form
    setNewTask({ source: '', apiKey: '', autoCredit: true, isSpecial: false, reward: 1000, limit: 10, specialType: 'REV_APP', targetUrl: '' });
  };

  return (
    <div className="glass rounded-[40px] p-10 border-slate-800 space-y-10 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Cấu hình BOT Nhiệm Vụ Tự Động</h2>
        <Zap className="text-amber-500 animate-pulse" size={20} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <AdminInput label="Dòng 1: Nguồn link (VD: link4m, yeumoney...)" placeholder="Tên nguồn link..." value={newTask.source} onChange={(v: string) => setNewTask({...newTask, source: v})} icon={Globe} />
          <AdminInput label="Dòng 2: API Key của nguồn link" placeholder="Nhập API Key để Bot tự rút gọn..." value={newTask.apiKey} onChange={(v: string) => setNewTask({...newTask, apiKey: v})} icon={KeyIcon} />
          
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-500 uppercase italic ml-4">Dòng 3: Tùy chọn nâng cao</label>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setNewTask({...newTask, autoCredit: !newTask.autoCredit})} className={`p-4 rounded-2xl border transition-all ${newTask.autoCredit ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest">Cộng điểm Auto</p>
              </button>
              <button onClick={() => setNewTask({...newTask, isSpecial: !newTask.isSpecial})} className={`p-4 rounded-2xl border transition-all ${newTask.isSpecial ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest">Nhiệm vụ đặc biệt</p>
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {newTask.isSpecial && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase italic ml-4">Dòng 4: Loại nhiệm vụ</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xs font-black text-white outline-none focus:border-amber-500"
                  value={newTask.specialType}
                  onChange={e => setNewTask({...newTask, specialType: e.target.value as SpecialTaskType})}
                >
                  <option value="REV_APP">Review App Store / Play Store</option>
                  <option value="REV_MAP">Review Google Map</option>
                  <option value="TIM_MAP">Tìm Map Địa Điểm</option>
                  <option value="TAI_APP">Tải & Cài Đặt Ứng Dụng</option>
                </select>
              </div>
              <AdminInput label="Dòng 5: Link đích (URL)" placeholder="https://..." value={newTask.targetUrl} onChange={(v: string) => setNewTask({...newTask, targetUrl: v})} icon={ExternalLink} />
            </div>
          )}
          <AdminInput label="Tiền thưởng mỗi lượt (VNĐ)" type="number" value={newTask.reward} onChange={(v: string) => setNewTask({...newTask, reward: parseInt(v)})} icon={DollarSign} />
          <AdminInput label="Giới hạn lượt làm / ngày" type="number" value={newTask.limit} onChange={(v: string) => setNewTask({...newTask, limit: parseInt(v)})} icon={Zap} />
          
          <button onClick={handleCreateTask} className="w-full py-5 bg-amber-500 text-slate-950 rounded-[24px] font-black uppercase text-[11px] tracking-widest shadow-2xl active:scale-95 transition-all">
            KÍCH HOẠT HỆ THỐNG BOT
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminInput = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-500 uppercase ml-4 italic tracking-widest">{label}</label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors">
        <Icon size={16} />
      </div>
      <input 
        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-white outline-none focus:border-amber-500 transition-all" 
        {...props} 
        onChange={e => props.onChange(e.target.value)} 
      />
    </div>
  </div>
);

export default AdminTasks;
