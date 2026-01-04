
import React, { useState, useEffect } from 'react';
// Fix: Import Link component for navigation within the app
import { Link } from 'react-router-dom';
import { 
  Database, Activity, ShieldCheck, 
  Calendar, Award, Fingerprint, Camera,
  TrendingUp, Star
} from 'lucide-react';
import { UserStats, SystemStats, User, PaymentTransaction } from '../types.ts';
import TaskList from './TaskList.tsx';
import { GarenaLogo } from '../App.tsx';

const Dashboard: React.FC<{ stats: UserStats, user: User }> = ({ stats, user }) => {
  const [sysStats, setSysStats] = useState<SystemStats>({
    totalTasksDone: 0,
    totalSystemBalance: 0,
    activeTasks: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Lấy dữ liệu thực tế từ hệ thống
    const usersDB = JSON.parse(localStorage.getItem('ge_users_db') || '[]');
    const tasksDB = JSON.parse(localStorage.getItem('ge_tasks_db') || '[]');
    const txDB: PaymentTransaction[] = JSON.parse(localStorage.getItem('ge_tx_db') || '[]');
    
    // Tính tổng chi trả thực tế (Chỉ các giao dịch rút thành công)
    const totalPaid = txDB
      .filter(tx => tx.status === 'SUCCESS' && (tx.type === 'WITHDRAW' || tx.type === 'REDEEM_CARD'))
      .reduce((acc, curr) => acc + curr.amount, 0);

    setSysStats({
      totalTasksDone: usersDB.reduce((acc: number, u: any) => acc + (u.totalTaskDone || 0), 0),
      totalSystemBalance: totalPaid,
      activeTasks: tasksDB.length,
      totalUsers: usersDB.length + 1 // +1 cho Admin root
    });
  }, []);

  const level = stats.totalEarnings > 1000000 ? 'Kim Cương' : 'Bạc';
  const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Profile Section */}
      <div className="glass rounded-[40px] overflow-hidden border border-slate-800/50 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
         <div className="h-28 bg-gradient-to-r from-amber-600/20 via-slate-900 to-blue-600/10 border-b border-slate-800/50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
               <GarenaLogo size={400} />
            </div>
         </div>
         <div className="px-12 pb-12 -mt-14 text-center relative z-10">
            <div className="inline-block relative">
               <div className="w-28 h-28 rounded-[36px] bg-slate-950 p-1 border-4 border-slate-900 shadow-2xl overflow-hidden group">
                  <img src={avatarUrl} className="w-full h-full rounded-[32px] object-cover group-hover:scale-110 transition-transform duration-500" alt="pfp" />
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-2xl border-4 border-slate-950 flex items-center justify-center text-slate-950 shadow-xl">
                  <Camera size={16} />
               </div>
            </div>
            
            <div className="mt-6">
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">{user.name}</h2>
               <div className="flex items-center justify-center space-x-3 mt-2">
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] italic">SECURE NODE ID: {user.id.slice(0, 8).toUpperCase()}</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               </div>
            </div>

            <div className="h-px bg-slate-800/50 w-full my-10" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-6 bg-slate-950/50 border border-slate-900 rounded-[24px] space-y-2">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Cấp độ tài khoản</p>
                  <div className="flex items-center justify-center space-x-2 text-amber-500">
                     <Award size={18} />
                     <span className="text-lg font-black uppercase italic tracking-tighter">{level}</span>
                  </div>
               </div>
               <div className="p-6 bg-slate-950/50 border border-slate-900 rounded-[24px] space-y-2">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ngày gia nhập</p>
                  <div className="flex items-center justify-center space-x-2 text-white">
                     <Calendar size={18} className="text-slate-700" />
                     <span className="text-lg font-black uppercase italic tracking-tighter">{user.joinDate}</span>
                  </div>
               </div>
               <div className="p-6 bg-slate-950/50 border border-slate-900 rounded-[24px] space-y-2">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Uy tín hệ thống</p>
                  <div className="flex items-center justify-center space-x-2 text-emerald-500">
                     <Star size={18} className="text-emerald-500" fill="currentColor" />
                     <span className="text-lg font-black uppercase italic tracking-tighter">100.00%</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Stats Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center space-x-3">
           <Database className="text-blue-500" size={28} />
           <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Bảng tin hệ thống <span className="text-slate-700 text-xs ml-2 tracking-[0.2em] font-black not-italic">REAL-TIME DATA</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="glass rounded-[32px] p-8 border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><Activity size={80} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Hoạt động thành viên</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-5xl font-black text-white italic tracking-tighter">{sysStats.totalUsers}</h3>
                 <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-4 py-1.5 rounded-xl">Thành viên</span>
              </div>
           </div>
           
           <div className="glass rounded-[32px] p-8 border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><TrendingUp size={80} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Tổng chi trả (VNĐ)</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-5xl font-black text-amber-500 italic tracking-tighter">{sysStats.totalSystemBalance.toLocaleString()}đ</h3>
                 <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest italic">VND.UNIT</span>
              </div>
           </div>

           <div className="glass rounded-[32px] p-8 border-slate-800 flex items-center justify-between group overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:opacity-20 transition-opacity duration-1000"><Fingerprint size={120} /></div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Trạng thái bảo mật</p>
                 <div className="flex items-center space-x-3 text-emerald-500">
                    <ShieldCheck size={24} className="animate-pulse" />
                    <span className="text-xl font-black uppercase italic tracking-tighter">SECURE SERVER ON</span>
                 </div>
                 <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mt-2">v4.3.0 Global Stable</p>
              </div>
           </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-8 pt-10 border-t border-slate-900">
        <div className="flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <GarenaLogo size={48} className="rounded-[18px] shadow-2xl" />
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Nhiệm vụ mới nhất</h2>
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] mt-2">CẬP NHẬT TỰ ĐỘNG</p>
              </div>
           </div>
           <Link to="/tasks" className="text-[11px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all italic border-b-2 border-slate-900 hover:border-amber-500 pb-1">Xem tất cả kho nhiệm vụ</Link>
        </div>
        <TaskList />
      </div>
    </div>
  );
};

export default Dashboard;
