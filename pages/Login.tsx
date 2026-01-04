
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { GarenaLogo } from '../App';

const ADMIN_CREDENTIALS = {
  email: 'admin@garena.vn',
  password: 'admin19042009'
};

const SUPPORT_CREDENTIALS = {
  email: 'supportearn@garena.vn',
  password: 'support19042009'
};

const Login: React.FC<{ onLogin: (user: UserType) => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);
    
    setTimeout(() => {
      const rawUsers = localStorage.getItem('ge_users_db');
      const usersDB = rawUsers ? JSON.parse(rawUsers) : [];

      if (isLogin) {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          onLogin({ id: 'root-admin', email, name: 'AVU DEV ROOT', role: 'ADMIN', balance: 99999999, totalTaskDone: 0, joinDate: '19/04/2009' });
          setIsProcessing(false);
          return;
        }

        if (email === SUPPORT_CREDENTIALS.email && password === SUPPORT_CREDENTIALS.password) {
          onLogin({ id: 'support-earn', email, name: 'Support Earn', role: 'SUPPORT', balance: 0, totalTaskDone: 0, joinDate: '19/04/2009' });
          setIsProcessing(false);
          return;
        }

        const foundUser = usersDB.find((u: any) => u.email === email && u.password === password);
        if (foundUser) {
          onLogin({ id: foundUser.id, email: foundUser.email, name: foundUser.name, role: 'USER', balance: foundUser.balance || 0, totalTaskDone: 0, joinDate: '20/05/2025' });
        } else {
          setError('Tài khoản hoặc mật khẩu không chính xác!');
        }
      } else {
        if (usersDB.some((u: any) => u.email === email)) {
          setError('Email này đã tồn tại trên hệ thống!');
        } else {
          const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: name || 'Thành viên mới',
            password,
            balance: 0,
            role: 'USER',
            totalTaskDone: 0,
            joinDate: new Date().toLocaleDateString('vi-VN')
          };
          usersDB.push(newUser);
          localStorage.setItem('ge_users_db', JSON.stringify(usersDB));
          alert("Khởi tạo tài khoản thành công!");
          setIsLogin(true);
        }
      }
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block mb-8 animate-pulse">
            <GarenaLogo size={80} className="shadow-2xl shadow-orange-500/40" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase italic">GARENA<span className="text-amber-500">EARN</span></h1>
          <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[9px]">Ultimate Earnings Hub</p>
        </div>

        <div className="glass rounded-[40px] p-10 md:p-12 border border-slate-800 shadow-2xl backdrop-blur-3xl">
          <div className="flex bg-slate-950 p-1.5 rounded-3xl mb-10 border border-slate-900">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Đăng nhập</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>Đăng ký</button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-500 text-xs font-bold">
               <AlertCircle size={16} />
               <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Tên hiển thị</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <input type="text" placeholder="NGUYỄN VĂN A" className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-4 pl-16 pr-8 text-white focus:border-amber-500 outline-none font-bold text-sm uppercase" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Email đăng nhập</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors" size={18} />
                <input type="email" required placeholder="name@email.com" className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-4 pl-16 pr-8 text-white focus:border-amber-500 outline-none font-bold text-sm" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Mật khẩu bảo mật</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors" size={18} />
                <input type="password" required placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-4 pl-16 pr-8 text-white focus:border-amber-500 outline-none font-bold text-sm" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <button type="submit" disabled={isProcessing} className={`w-full font-black py-5 rounded-3xl transition-all flex items-center justify-center space-x-3 mt-4 ${isLogin ? 'bg-white text-slate-950 hover:bg-slate-100 shadow-xl' : 'bg-amber-500 text-slate-950 hover:bg-amber-400'}`}>
              {isProcessing ? <Loader2 size={24} className="animate-spin" /> : (
                <>
                  <span className="uppercase tracking-[0.2em] text-xs">{isLogin ? 'Đăng Nhập Hệ Thống' : 'Khởi Tạo Thành Viên'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-900 flex flex-col items-center">
            <div className="flex items-center space-x-2 text-emerald-500">
               <ShieldCheck size={14} />
               <span className="text-[8px] font-black uppercase tracking-[0.2em]">Secure Cloud Node Active</span>
            </div>
            <p className="mt-4 text-[8px] font-black text-slate-700 uppercase tracking-widest">v3.5 Stable • Created by AVU DEV</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
