
import React, { useState, useCallback } from 'react';
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

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    setError('');
    setIsProcessing(true);
    
    // Giả lập xử lý an toàn
    setTimeout(() => {
      try {
        const rawUsers = localStorage.getItem('ge_users_db');
        const usersDB = rawUsers ? JSON.parse(rawUsers) : [];

        if (isLogin) {
          if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            onLogin({ id: 'root-admin', email, name: 'AVU DEV ROOT', role: 'ADMIN', balance: 50000000, totalTaskDone: 0, joinDate: '19/04/2009' });
            return;
          }

          if (email === SUPPORT_CREDENTIALS.email && password === SUPPORT_CREDENTIALS.password) {
            onLogin({ id: 'support-earn', email, name: 'Support Earn', role: 'SUPPORT', balance: 0, totalTaskDone: 0, joinDate: '19/04/2009' });
            return;
          }

          const foundUser = usersDB.find((u: any) => u.email === email && u.password === password);
          if (foundUser) {
            onLogin({ id: foundUser.id, email: foundUser.email, name: foundUser.name, role: 'USER', balance: Number(foundUser.balance || 0), totalTaskDone: 0, joinDate: foundUser.joinDate || '20/05/2025' });
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
              name: name || 'User',
              password,
              balance: 0,
              role: 'USER',
              totalTaskDone: 0,
              joinDate: new Date().toLocaleDateString('vi-VN')
            };
            usersDB.push(newUser);
            localStorage.setItem('ge_users_db', JSON.stringify(usersDB));
            setIsLogin(true);
            setError('');
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
          }
        }
      } catch (e) {
        setError("Lỗi dữ liệu local. Vui lòng thử lại.");
      } finally {
        setIsProcessing(false);
      }
    }, 800);
  }, [email, name, password, isLogin, isProcessing, onLogin]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block mb-6">
            <GarenaLogo size={60} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase italic">GARENA<span className="text-amber-500">EARN</span></h1>
          <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[8px]">Next-Gen Earnings Node</p>
        </div>

        <div className="glass rounded-[32px] p-8 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-8 border border-slate-900">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-slate-950' : 'text-slate-500'}`}>Đăng nhập</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-amber-500 text-slate-950' : 'text-slate-500'}`}>Đăng ký</button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-500 text-[10px] font-black uppercase italic">
               <AlertCircle size={14} />
               <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-4 italic">Tên hiển thị</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                  <input type="text" placeholder="HỌ VÀ TÊN" className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-amber-500 outline-none font-bold text-xs uppercase" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-4 italic">Email truy cập</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                <input type="email" required placeholder="name@email.com" className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-amber-500 outline-none font-bold text-xs" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-4 italic">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                <input type="password" required placeholder="••••••••" className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-amber-500 outline-none font-bold text-xs" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <button type="submit" disabled={isProcessing} className={`w-full font-black py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 mt-4 ${isLogin ? 'bg-white text-slate-950' : 'bg-amber-500 text-slate-950'}`}>
              {isProcessing ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                  <span className="uppercase tracking-[0.2em] text-[10px] italic">{isLogin ? 'VÀO HỆ THỐNG' : 'TẠO TÀI KHOẢN'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col items-center opacity-50">
            <div className="flex items-center space-x-2 text-emerald-500">
               <ShieldCheck size={12} />
               <span className="text-[7px] font-black uppercase tracking-[0.2em]">Secure Encryption Layer Active</span>
            </div>
            <p className="mt-3 text-[7px] font-black text-slate-700 uppercase tracking-widest italic">Stable Build • GEARN v4.3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
