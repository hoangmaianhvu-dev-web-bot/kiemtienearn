import React, { useState, useEffect, useMemo } from 'react';
import { Activity, ShieldCheck, Camera, Server, Trophy, Database, Zap, ArrowUpRight, BarChart3, Fingerprint } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '../types.ts';
import TaskList from './TaskList.tsx';
import { supabase, useNotify } from '../App.tsx';

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
        console.debug("Database fetch skipped.");
      }
    };

    fetchBalance();
  }, [user.id]);

  // Reset chart data to 0
  const chartData = useMemo(() => [
    { name: 'T2', revenue: 0 }, { name: 'T3', revenue: 0 },
    { name: 'T4', revenue: 0 }, { name: 'T5', revenue: 0 },
    { name: 'T6', revenue: 0 }, { name: 'T7', revenue: 0 },
    { name: 'CN', revenue: 0 },
  ], []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Profile Live Card */}
      <div className="glass rounded-[56px] overflow-hidden border border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
         <div className="h-48 bg-gradient-to-br from-amber-600/10 via-slate-950 to-blue-600/10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 flex items-center justify-center">
               <Database size={400} className="text-white" />
            </div>
            <div className="absolute top-8 right-10 flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2 rounded-full backdrop-blur-md">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">DATABASE LIVE</span>
            </div>
         </div>
         <div className="px-14 pb-16 -mt-20 text-center lg:text-left lg:flex lg:items-end lg:justify-between relative z-10">
            <div className="lg:flex lg:items-center lg:space-x-10">
               <div className="inline-block relative group">
                  <div className="w-36 h-36 rounded-[44px] bg-slate-950 p-1 border-4 border-slate-900 shadow-2xl overflow-hidden group-hover:border-amber-500/50 transition-all duration-500">
                     <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${String(user.id)}`} className="w-full h-full rounded-[40px] object-cover" alt="pfp" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-11 h-11 bg-amber-500 rounded-2xl border-4 border-slate-950 flex items-center justify-center text-slate-950 shadow-xl group-hover:rotate-12 transition-transform">
                     <Camera size={18} />
                  </div>
               </div>
               
               <div className="mt-10 lg:mt-0">
                  <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">{String(user.name || 'Garena Player')}</h2>
                  <div className="flex items-center justify-center lg:justify-start space-x-4 mt-5">
                     <div className="flex items-center space-x-2 bg-slate-900/50 px-4 py-1.5 rounded-full border border-white/5">
                        <Fingerprint size={12} className="text-amber-500" />
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">ID: {String(user.id).slice(0, 10).toUpperCase()}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="hidden lg:flex items-center space-x-5">
               <div className="p-8 bg-slate-950/90 border border-slate-800 rounded-[36px] text-center min-w-[200px] shadow-xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 italic">Hệ thống nguồn</p>
                  <span className="text-xl font-black text-white italic tracking-tighter uppercase">Supabase Cloud</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <StatCard label="Số dư khả dụng" value={`${realBalance.toLocaleString()}đ`} icon={Trophy} color="text-amber-500" sub="AVAILABLE" />
           <StatCard label="Lưu lượng mạng" value="Active" icon={Activity} color="text-blue-500" sub="STABLE" />
           <StatCard label="Hạ tầng bảo mật" value="2FA/AES" icon={ShieldCheck} color="text-emerald-500" sub="ENCRYPTED" />
      </div>

      {/* Realtime Analytics */}
      <div className="space-y-10">
        <div className="flex items-center justify-between px-6">
           <div className="flex items-center space-x-4">
              <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Live Analytics</h2>
           </div>
           <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Zap size={14} className="text-amber-500" />
              <span>Realtime Stream</span>
           </div>
        </div>
        <div className="glass rounded-[56px] p-12 border-white/5 h-[400px] shadow-2xl overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
              <div className="grid grid-cols-12 h-full">
                {[...Array(12)].map((_, i) => <div key={i} className="border-r border-white h-full" />)}
              </div>
           </div>
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                 <XAxis dataKey="name" stroke="#475569" fontSize={11} fontWeight="900" axisLine={false} tickLine={false} dy={10} />
                 <YAxis stroke="#475569" fontSize={11} fontWeight="900" axisLine={false} tickLine={false} dx={-10} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontSize: '12px', fontWeight: '900', color: '#fff', padding: '16px' }}
                   itemStyle={{ color: '#f59e0b' }}
                 />
                 <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRev)" strokeWidth={5} />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Realtime Mission Hub */}
      <div className="space-y-12 pt-12">
        <div className="flex items-center justify-between px-6">
           <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Mission <span className="text-amber-500">Live Hub</span></h2>
           <button onClick={syncProfile} className="group flex items-center space-x-3 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-widest transition-all">
              <Zap size={14} className="text-amber-500 group-hover:animate-bounce" />
              <span>Refresh Cluster</span>
           </button>
        </div>
        <TaskList />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, sub }: any) => (
  <div className="glass rounded-[48px] p-12 border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
    <Icon size={120} className={`absolute -right-8 -top-8 opacity-5 ${color} group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000`} />
    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-10 italic flex items-center gap-2">
       <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text', 'bg')} animate-pulse`} />
       {String(label)}
    </p>
    <div className="flex items-end justify-between relative z-10">
       <h3 className="text-5xl font-black italic tracking-tighter text-white">{String(value)}</h3>
       <div className="text-right">
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] block">{String(sub)}</span>
          <ArrowUpRight size={16} className={`${color} mt-1 ml-auto`} />
       </div>
    </div>
  </div>
);

export default Dashboard;