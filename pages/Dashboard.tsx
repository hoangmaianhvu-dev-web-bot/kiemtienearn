
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, Activity, ShieldCheck, 
  Calendar, Award, Fingerprint, Camera,
  TrendingUp, Star, BarChart3
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { UserStats, SystemStats, User, PaymentTransaction } from '../types.ts';
import TaskList from './TaskList.tsx';
import { GarenaLogo, safeParse } from '../App.tsx';

const Dashboard: React.FC<{ stats: UserStats, user: User }> = ({ stats, user }) => {
  const [sysStats, setSysStats] = useState<SystemStats>({
    totalTasksDone: 0,
    totalSystemBalance: 0,
    activeTasks: 0,
    totalUsers: 0
  });

  // Dữ liệu biểu đồ tĩnh để đảm bảo luôn render được
  const chartData = [
    { name: 'T2', revenue: 4000 },
    { name: 'T3', revenue: 3000 },
    { name: 'T4', revenue: 2000 },
    { name: 'T5', revenue: 2780 },
    { name: 'T6', revenue: 1890 },
    { name: 'T7', revenue: 2390 },
    { name: 'CN', revenue: 3490 },
  ];

  useEffect(() => {
    const usersDB = safeParse('ge_users_db', []);
    const tasksDB = safeParse('ge_tasks_db', []);
    const txDB: PaymentTransaction[] = safeParse('ge_tx_db', []);
    
    const totalPaid = txDB
      .filter(tx => tx.status === 'SUCCESS' && (tx.type === 'WITHDRAW' || tx.type === 'REDEEM_CARD'))
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    setSysStats({
      totalTasksDone: usersDB.reduce((acc: number, u: any) => acc + Number(u.totalTaskDone || 0), 0),
      totalSystemBalance: totalPaid,
      activeTasks: tasksDB.length,
      totalUsers: usersDB.length + 1
    });
  }, []);

  const level = stats.totalEarnings > 1000000 ? 'Kim Cương' : 'Bạc';
  const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${String(user.name || 'Member')}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 min-h-screen">
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
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">{String(user.name || 'Thành viên')}</h2>
               <div className="flex items-center justify-center space-x-3 mt-2">
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] italic">SECURE NODE ID: {String(user.id || 'N/A').slice(0, 8).toUpperCase()}</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               </div>
            </div>

            <div className="h-px bg-slate-800/50 w-full my-10" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-6 bg-slate-950/50 border border-slate-900 rounded-[24px] space-y-2">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Cấp độ tài khoản</p>
                  <div className="flex items-center justify-center space-x-2 text-amber-500">
                     <Award size={18} />
                     <span className="text-lg font-black uppercase italic tracking-tighter">{String(level)}</span>
                  </div>
               </div>
               <div className="p-6 bg-slate-950/50 border border-slate-900 rounded-[24px] space-y-2">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ngày gia nhập</p>
                  <div className="flex items-center justify-center space-x-2 text-white">
                     <Calendar size={18} className="text-slate-700" />
                     <span className="text-lg font-black uppercase italic tracking-tighter">{String(user.joinDate || 'N/A')}</span>
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

      {/* Analytics Chart Container - Fixed min-height */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center space-x-3">
           <BarChart3 className="text-emerald-500" size={24} />
           <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Phân tích thu nhập <span className="text-slate-700 text-xs ml-2 tracking-[0.2em] font-black not-italic">BIỂU ĐỒ 7 NGÀY</span></h2>
        </div>
        <div className="glass rounded-[40px] p-8 border-slate-800 min-h-[350px] flex items-center justify-center overflow-hidden">
           <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="glass rounded-[32px] p-8 border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700"><Activity size={80} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Tổng thành viên</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-5xl font-black text-white italic tracking-tighter">{String(sysStats.totalUsers)}</h3>
                 <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-4 py-1.5 rounded-xl">Node</span>
              </div>
           </div>
           
           <div className="glass rounded-[32px] p-8 border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700"><TrendingUp size={80} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Hệ thống chi trả</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-5xl font-black text-amber-500 italic tracking-tighter">{Number(sysStats.totalSystemBalance || 0).toLocaleString()}đ</h3>
                 <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest italic">VNĐ</span>
              </div>
           </div>

           <div className="glass rounded-[32px] p-8 border-slate-800 flex items-center justify-between group overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:opacity-20 transition-opacity duration-1000"><Fingerprint size={120} /></div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Máy chủ Garena</p>
                 <div className="flex items-center space-x-3 text-emerald-500">
                    <ShieldCheck size={24} className="animate-pulse" />
                    <span className="text-xl font-black uppercase italic tracking-tighter">ENCRYPTED ON</span>
                 </div>
              </div>
           </div>
      </div>

      <div className="space-y-8 pt-10 border-t border-slate-900">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Nhiệm vụ khả dụng</h2>
        <TaskList />
      </div>
    </div>
  );
};

export default Dashboard;
