
import React, { useState, useEffect, useMemo } from 'react';
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

  const chartData = useMemo(() => [
    { name: 'T2', revenue: 4000 },
    { name: 'T3', revenue: 3000 },
    { name: 'T4', revenue: 2000 },
    { name: 'T5', revenue: 2780 },
    { name: 'T6', revenue: 1890 },
    { name: 'T7', revenue: 2390 },
    { name: 'CN', revenue: 3490 },
  ], []);

  useEffect(() => {
    const usersDB = safeParse('ge_users_db', []);
    const tasksDB = safeParse('ge_tasks_db', []);
    const txDB = safeParse('ge_tx_db', []);
    
    const totalPaid = Array.isArray(txDB) ? txDB
      .filter((tx: any) => tx.status === 'SUCCESS' && (tx.type === 'WITHDRAW' || tx.type === 'REDEEM_CARD'))
      .reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0) : 0;

    setSysStats({
      totalTasksDone: Array.isArray(usersDB) ? usersDB.reduce((acc: number, u: any) => acc + Number(u.totalTaskDone || 0), 0) : 0,
      totalSystemBalance: totalPaid,
      activeTasks: Array.isArray(tasksDB) ? tasksDB.length : 0,
      totalUsers: Array.isArray(usersDB) ? usersDB.length + 1 : 1
    });
  }, []);

  const level = Number(user.balance || 0) > 1000000 ? 'Kim Cương' : 'Bạc';
  const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${String(user.name || 'User')}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 min-h-screen">
      <div className="glass rounded-[40px] overflow-hidden border border-slate-800/30 shadow-2xl">
         <div className="h-28 bg-gradient-to-r from-amber-600/10 via-slate-900 to-blue-600/10 relative">
            <div className="absolute inset-0 opacity-5 flex items-center justify-center">
               <GarenaLogo size={300} />
            </div>
         </div>
         <div className="px-10 pb-12 -mt-12 text-center relative z-10">
            <div className="inline-block relative">
               <div className="w-24 h-24 rounded-[30px] bg-slate-950 p-1 border-4 border-slate-900 shadow-2xl overflow-hidden">
                  <img src={avatarUrl} className="w-full h-full rounded-[26px] object-cover" alt="pfp" />
               </div>
               <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-xl border-4 border-slate-950 flex items-center justify-center text-slate-950">
                  <Camera size={14} />
               </div>
            </div>
            
            <div className="mt-6">
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{String(user.name || 'Member')}</h2>
               <div className="flex items-center justify-center space-x-3 mt-2">
                  <span className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em] italic">SECURE NODE: {String(user.id || 'N/A').slice(0, 8).toUpperCase()}</span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-lg" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
               <div className="p-5 bg-slate-950/50 border border-slate-900 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Cấp độ</p>
                  <div className="flex items-center justify-center space-x-2 text-amber-500 italic">
                     <Award size={14} />
                     <span className="text-md font-black uppercase">{String(level)}</span>
                  </div>
               </div>
               <div className="p-5 bg-slate-950/50 border border-slate-900 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tham gia</p>
                  <div className="flex items-center justify-center space-x-2 text-white italic">
                     <Calendar size={14} className="text-slate-600" />
                     <span className="text-md font-black uppercase">{String(user.joinDate || 'N/A')}</span>
                  </div>
               </div>
               <div className="p-5 bg-slate-950/50 border border-slate-900 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Uy tín</p>
                  <div className="flex items-center justify-center space-x-2 text-emerald-500 italic">
                     <Star size={14} fill="currentColor" />
                     <span className="text-md font-black uppercase">100.00%</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <StatCard 
             label="Thành viên hệ thống" 
             value={String(sysStats.totalUsers)} 
             icon={Fingerprint} 
             color="text-blue-500" 
             sub="NODE" 
           />
           <StatCard 
             label="Hệ thống đã chi trả" 
             value={Number(sysStats.totalSystemBalance || 0).toLocaleString() + "đ"} 
             icon={TrendingUp} 
             color="text-amber-500" 
             sub="VNĐ" 
           />
           <div className="glass rounded-3xl p-8 border-slate-800 flex items-center justify-between group overflow-hidden">
              <div className="relative z-10">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Trạng thái máy chủ</p>
                 <div className="flex items-center space-x-2 text-emerald-500">
                    <ShieldCheck size={20} className="animate-pulse" />
                    <span className="text-lg font-black uppercase italic tracking-tighter">ENCRYPTED</span>
                 </div>
              </div>
              <Fingerprint size={80} className="opacity-5 absolute right-4 top-4 group-hover:opacity-10 transition-opacity" />
           </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-3">
           <BarChart3 className="text-emerald-500" size={20} />
           <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Phân tích thu nhập</h2>
        </div>
        <div className="glass rounded-[40px] p-6 border-slate-800 h-[350px]">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                 <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="name" stroke="#64748b" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                 <YAxis stroke="#64748b" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '9px' }} />
                 <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-8 pt-6">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic border-l-4 border-amber-500 pl-4">Nhiệm vụ khả dụng</h2>
        <TaskList />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, sub }: any) => (
  <div className="glass rounded-3xl p-8 border-slate-800 relative overflow-hidden group">
    <Icon size={60} className={`absolute -right-2 -top-2 opacity-5 ${color} group-hover:rotate-12 transition-transform duration-500`} />
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">{label}</p>
    <div className="flex items-end justify-between">
       <h3 className={`text-4xl font-black italic tracking-tighter text-white`}>{value}</h3>
       <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">{sub}</span>
    </div>
  </div>
);

export default Dashboard;
