
import React, { useState, useEffect, useMemo } from 'react';
// Added Trophy to the lucide-react imports
import { Database, Activity, ShieldCheck, Calendar, Award, Fingerprint, Camera, TrendingUp, Star, BarChart3, Server, Zap, Trophy } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '../types.ts';
import TaskList from './TaskList.tsx';
import { GarenaLogo, supabase, useNotify } from '../App.tsx';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const { syncProfile } = useNotify();
  const [realBalance, setRealBalance] = useState<number>(Number(user.balance ?? 0));

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();
        
        if (data && !error) setRealBalance(Number(data.balance ?? 0));
      } catch (e) {
        console.debug("Supabase fetch skip.");
      }
    };

    fetchBalance();
  }, [user.id]);

  const chartData = useMemo(() => [
    { name: 'T2', revenue: 4200 }, { name: 'T3', revenue: 3500 },
    { name: 'T4', revenue: 2800 }, { name: 'T5', revenue: 3100 },
    { name: 'T6', revenue: 2100 }, { name: 'T7', revenue: 4500 },
    { name: 'CN', revenue: 5200 },
  ], []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Profile Realtime Card */}
      <div className="glass rounded-[48px] overflow-hidden border border-white/5 shadow-2xl">
         <div className="h-40 bg-gradient-to-r from-amber-600/10 via-slate-900 to-blue-600/10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
               <Server size={300} className="text-slate-800" />
            </div>
            <div className="absolute top-6 right-8 flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Supabase Realtime</span>
            </div>
         </div>
         <div className="px-12 pb-14 -mt-16 text-center lg:text-left lg:flex lg:items-end lg:justify-between relative z-10">
            <div className="lg:flex lg:items-center lg:space-x-8">
               <div className="inline-block relative">
                  <div className="w-32 h-32 rounded-[40px] bg-slate-950 p-1 border-4 border-slate-900 shadow-2xl overflow-hidden">
                     <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${String(user.id)}`} className="w-full h-full rounded-[36px] object-cover" alt="pfp" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-amber-500 rounded-2xl border-4 border-slate-950 flex items-center justify-center text-slate-950 shadow-xl">
                     <Camera size={16} />
                  </div>
               </div>
               
               <div className="mt-8 lg:mt-0">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">{String(user.name || 'Garena Player')}</h2>
                  <div className="flex items-center justify-center lg:justify-start space-x-3 mt-4">
                     <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] italic">SECURE CORE ID: {String(user.id).slice(0, 10).toUpperCase()}</span>
                  </div>
               </div>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
               <div className="p-6 bg-slate-950/80 border border-slate-900 rounded-[32px] text-center min-w-[160px]">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Hệ thống thực</p>
                  <span className="text-lg font-black text-white italic">SUPABASE v5</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <StatCard label="Số dư tài khoản" value={`${realBalance.toLocaleString()}đ`} icon={Trophy} color="text-amber-500" sub="VND" />
           <StatCard label="Thành viên Online" value="2,481" icon={Activity} color="text-blue-500" sub="PLAYERS" />
           <StatCard label="Hạ tầng bảo mật" value="SSL/2FA" icon={ShieldCheck} color="text-emerald-500" sub="ACTIVE" />
      </div>

      {/* Income Analytics */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
           <div className="flex items-center space-x-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Phân tích tăng trưởng</h2>
           </div>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Realtime Data</span>
        </div>
        <div className="glass rounded-[48px] p-10 border-white/5 h-[360px] shadow-2xl">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                 <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                 <YAxis stroke="#475569" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '20px', fontSize: '11px', fontWeight: '900', color: '#fff' }} />
                 <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Real Task Hub */}
      <div className="space-y-10 pt-10">
        <div className="flex items-center justify-between px-4">
           <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Nhiệm vụ <span className="text-amber-500">Realtime</span></h2>
           <button onClick={syncProfile} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black text-slate-300 uppercase tracking-widest transition-all">Làm mới máy chủ</button>
        </div>
        <TaskList />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, sub }: any) => (
  <div className="glass rounded-[40px] p-10 border-white/5 relative overflow-hidden group hover:border-amber-500/20 transition-all shadow-2xl">
    <Icon size={100} className={`absolute -right-6 -top-6 opacity-5 ${color} group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000`} />
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 italic">{String(label)}</p>
    <div className="flex items-end justify-between relative z-10">
       <h3 className="text-5xl font-black italic tracking-tighter text-white">{String(value)}</h3>
       <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">{String(sub)}</span>
    </div>
  </div>
);

export default Dashboard;
