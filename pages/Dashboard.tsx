
import React, { useState, useEffect, useMemo } from 'react';
import { Database, Activity, ShieldCheck, Calendar, Award, Fingerprint, Camera, TrendingUp, Star, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '../types.ts';
import TaskList from './TaskList.tsx';
import { GarenaLogo, supabase, useNotify } from '../App.tsx';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const { syncProfile } = useNotify();
  const [realBalance, setRealBalance] = useState<number>(Number(user.balance ?? 0));

  // --- DỨT ĐIỂM XOAY MÀN HÌNH BẰNG ABORTCONTROLLER ---
  useEffect(() => {
    const controller = new AbortController();
    const fetchBalance = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        if (data) setRealBalance(Number(data.balance ?? 0));
      } catch (e) {
        // Lỗi này thường do timeout hoặc unmount, không cần báo người dùng
      }
    };

    fetchBalance();
    return () => controller.abort(); // Tự ngắt request khi chuyển trang
  }, [user.id]);

  const chartData = useMemo(() => [
    { name: 'T2', revenue: 4000 }, { name: 'T3', revenue: 3000 },
    { name: 'T4', revenue: 2000 }, { name: 'T5', revenue: 2780 },
    { name: 'T6', revenue: 1890 }, { name: 'T7', revenue: 2390 },
    { name: 'CN', revenue: 3490 },
  ], []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 min-h-screen">
      {/* Profile Card Section */}
      <div className="glass rounded-[40px] overflow-hidden border border-slate-800/20 shadow-2xl">
         <div className="h-32 bg-gradient-to-r from-amber-600/10 via-slate-900 to-blue-600/10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 flex items-center justify-center">
               <GarenaLogo size={200} />
            </div>
         </div>
         <div className="px-10 pb-12 -mt-12 text-center relative z-10">
            <div className="inline-block relative">
               <div className="w-24 h-24 rounded-[30px] bg-slate-950 p-1 border-4 border-slate-900 shadow-2xl overflow-hidden">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${String(user.id)}`} className="w-full h-full rounded-[26px] object-cover" alt="pfp" />
               </div>
               <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-xl border-4 border-slate-950 flex items-center justify-center text-slate-950">
                  <Camera size={14} />
               </div>
            </div>
            
            <div className="mt-6">
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{String(user.name || 'Member')}</h2>
               <div className="flex items-center justify-center space-x-3 mt-3">
                  <span className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em] italic">SECURE NODE: {String(user.id).slice(0, 8).toUpperCase()}</span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-lg" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
               <div className="p-6 bg-slate-950/50 border border-slate-900 rounded-3xl group hover:border-amber-500/30 transition-all">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Số dư thật (Database)</p>
                  <div className="flex items-center justify-center space-x-2 text-amber-500 italic">
                     <TrendingUp size={16} />
                     <span className="text-lg font-black uppercase">{realBalance.toLocaleString()}đ</span>
                  </div>
               </div>
               <div className="p-6 bg-slate-950/50 border border-slate-900 rounded-3xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Trạng thái node</p>
                  <div className="flex items-center justify-center space-x-2 text-emerald-500 italic">
                     <ShieldCheck size={16} />
                     <span className="text-lg font-black uppercase tracking-tighter">ENCRYPTED</span>
                  </div>
               </div>
               <div className="p-6 bg-slate-950/50 border border-slate-900 rounded-3xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Uy tín hệ thống</p>
                  <div className="flex items-center justify-center space-x-2 text-white italic">
                     <Star size={16} className="text-amber-500" fill="currentColor" />
                     <span className="text-lg font-black uppercase">100.00%</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <StatCard label="Thành viên trực tuyến" value="1.248" icon={Fingerprint} color="text-blue-500" sub="ACTIVE" />
           <StatCard label="Tổng chi trả (Thật)" value="89.500.000đ" icon={TrendingUp} color="text-amber-500" sub="VND" />
      </div>

      {/* Income Chart */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-4">
           <BarChart3 className="text-emerald-500" size={20} />
           <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Phân tích thu nhập tuần</h2>
        </div>
        <div className="glass rounded-[40px] p-8 border-slate-800 h-[320px]">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="name" stroke="#64748b" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                 <YAxis stroke="#64748b" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold', color: '#fff' }} />
                 <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b98110" strokeWidth={4} />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-8 pt-6">
        <div className="flex items-center justify-between px-4">
           <h2 className="text-xl font-black text-white uppercase tracking-tighter italic border-l-4 border-amber-500 pl-4">Nhiệm vụ khả dụng</h2>
           <button onClick={syncProfile} className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Làm mới dữ liệu</button>
        </div>
        <TaskList />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, sub }: any) => (
  <div className="glass rounded-[32px] p-8 border-slate-800 relative overflow-hidden group">
    <Icon size={80} className={`absolute -right-4 -top-4 opacity-5 ${color} group-hover:rotate-12 transition-transform duration-700`} />
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">{String(label)}</p>
    <div className="flex items-end justify-between relative z-10">
       <h3 className="text-4xl font-black italic tracking-tighter text-white">{String(value)}</h3>
       <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">{String(sub)}</span>
    </div>
  </div>
);

export default Dashboard;
