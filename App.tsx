import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, User as UserIcon, 
  Menu, Trophy, LogOut, Search, 
  MessageSquare, Store, ShieldAlert,
  CheckCircle2, XCircle, AlertTriangle, Info, Bell,
  Sparkles, MessageCircle, Phone, Send, ExternalLink, X, ShieldCheck,
  Server, Cpu, Activity, Link as LinkIcon, Database, Zap
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

import Dashboard from './pages/Dashboard.tsx';
import MyLinks from './pages/MyLinks.tsx';
import TaskList from './pages/TaskList.tsx';
import WalletPage from './pages/Wallet.tsx';
import Profile from './pages/Profile.tsx';
import Marketplace from './pages/Marketplace.tsx';
import ChatRoom from './pages/ChatRoom.tsx';
import Login from './pages/Login.tsx';
import AdminPanel from './pages/Admin/AdminPanel.tsx';

import { User } from './types.ts';

// --- KẾT NỐI TRỰC TIẾP SUPABASE ---
const SUPABASE_URL = 'https://tpuozqnnzqfahwlvtvss.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdW96cW5uenFmYWh3bHZ0dnNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU5MjM4MCwiZXhwIjoyMDgzMTY4MzgwfQ.zAPsJKbgad_vlaco-WfvBCAxp8whCgmgjnzgvlCRgJI';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const GarenaLogo: React.FC<{ className?: string, size?: number }> = ({ className = "", size = 40 }) => (
  <div 
    className={`relative flex items-center justify-center rounded-[28%] bg-gradient-to-br from-[#FFB129] to-[#FF8A00] shadow-xl overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="currentColor" className="text-slate-950">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  </div>
);

type ToastType = 'SUCCESS' | 'ERROR' | 'CANCEL' | 'WARNING' | 'INFO';
interface Toast { id: string; message: string; type: ToastType; }

const AppContext = createContext<{
  notify: (message: string, type: ToastType) => void;
  announcement: string;
  updateUser: (user: User) => void;
  setAnnouncement: (val: string) => void;
  syncProfile: () => Promise<void>;
}>({
  notify: () => {},
  announcement: "",
  updateUser: () => {},
  setAnnouncement: () => {},
  syncProfile: async () => {}
});

export const useNotify = () => useContext(AppContext);

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10 text-center">
        <div className="glass p-12 rounded-[48px] border-red-500/20 max-w-md shadow-2xl">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">HỆ THỐNG GIÁN ĐOẠN</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Máy chủ Supabase không phản hồi hoặc kết nối mạng yếu.</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">THỬ KẾT NỐI LẠI</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const local = localStorage.getItem('ge_user_session');
    if (local) {
      try { return JSON.parse(local); } catch (e) { return null; }
    }
    return null;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [announcement, setAnnouncement] = useState("GARENAEARN v5.5: SUPABASE CLOUD ACTIVE - GIAO DỊCH THẬT - UY TÍN TUYỆT ĐỐI!");
  
  const syncRef = useRef(false);

  const hideLoader = useCallback(() => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        if (loader) loader.style.visibility = 'hidden';
      }, 500);
    }
  }, []);

  const syncProfile = useCallback(async () => {
    const session = localStorage.getItem('ge_user_session');
    if (!session) {
      hideLoader();
      return;
    }
    
    if (syncRef.current) return;
    
    syncRef.current = true;
    try {
      const userObj = JSON.parse(session);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Supabase Timeout")), 5000)
      );

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userObj.id)
        .single();

      const result: any = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (result && result.data && !result.error) {
        const updatedUser = { 
          ...result.data, 
          balance: Number(result.data.balance ?? 0),
          id: String(result.data.id)
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('ge_user_session', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.warn("Supabase Node Busy or Timeout. Operating in Local Mode.");
    } finally {
      syncRef.current = false;
      hideLoader();
    }
  }, [hideLoader]);

  useEffect(() => {
    syncProfile();
    const interval = setInterval(syncProfile, 15000);
    return () => clearInterval(interval);
  }, [syncProfile]);

  const notify = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev.slice(-2), { id, message: String(message), type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const updateUser = useCallback((user: User) => {
    const sanitized = { ...user, balance: Number(user.balance ?? 0) };
    setCurrentUser(sanitized);
    localStorage.setItem('ge_user_session', JSON.stringify(sanitized));
  }, []);

  const handleSidebarClose = () => setIsSidebarOpen(false);

  if (!currentUser) {
    hideLoader();
    return <Login onLogin={(u) => { updateUser(u); syncProfile(); }} />;
  }

  return (
    <ErrorBoundary>
      <AppContext.Provider value={{ notify, announcement, updateUser, setAnnouncement, syncProfile }}>
        <HashRouter>
          <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 overflow-hidden">
            <div className="marquee-container shadow-2xl shrink-0 border-b border-white/5">
              <div className="marquee-text italic">{String(announcement)}</div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {isSidebarOpen && <div className="fixed inset-0 bg-black/90 z-50 lg:hidden backdrop-blur-md" onClick={handleSidebarClose} />}
              
              <aside className={`fixed inset-y-0 left-0 w-72 glass border-r border-slate-800/20 z-50 transform transition-all duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col p-6">
                  <div className="flex items-center space-x-4 mb-10 px-2 shrink-0">
                    <GarenaLogo size={42} />
                    <div className="flex flex-col">
                      <span className="text-2xl font-black tracking-tighter uppercase italic leading-none">GARENA<span className="text-amber-500">EARN</span></span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[8px] font-black text-slate-400 tracking-[0.3em] uppercase">CLOUD ENGINE</span>
                      </div>
                    </div>
                  </div>

                  <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                    {currentUser.role === 'ADMIN' && (
                      <UserNavLink to="/admin" icon={ShieldAlert} label="ROOT TERMINAL" badge="MASTER" />
                    )}
                    <UserNavLink to="/" icon={LayoutDashboard} label="DASHBOARD" />
                    <UserNavLink to="/tasks" icon={Zap} label="MISSION HUB" />
                    <UserNavLink to="/marketplace" icon={Store} label="MARKETPLACE" />
                    <UserNavLink to="/wallet" icon={Wallet} label="FINANCE" />
                    <UserNavLink to="/chat" icon={MessageSquare} label="COMMUNITY" />
                    <UserNavLink to="/profile" icon={UserIcon} label="MY PROFILE" />
                  </nav>

                  <div className="mt-auto pt-8 border-t border-slate-900/50 space-y-6 shrink-0">
                    <div className="p-5 bg-slate-900/60 rounded-3xl border border-slate-800/50">
                       <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Link Status</span>
                          <span className="text-[9px] font-black text-emerald-500">Encrypted</span>
                       </div>
                       <div className="flex gap-1">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 4 ? 'bg-amber-500' : 'bg-slate-800'}`} />
                          ))}
                       </div>
                    </div>
                    <button onClick={() => { localStorage.removeItem('ge_user_session'); window.location.reload(); }} className="w-full flex items-center justify-center space-x-3 py-4 text-slate-600 hover:text-red-500 transition-all font-black text-[9px] uppercase tracking-[0.4em]">
                      <LogOut size={16} />
                      <span>DISCONNECT</span>
                    </button>
                  </div>
                </div>
              </aside>

              <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                <header className="sticky top-0 z-40 w-full glass border-b border-slate-800/20 px-8 py-5 flex items-center justify-between shrink-0">
                  <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={24} /></button>
                  
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-4 bg-amber-500/5 border border-amber-500/10 px-6 py-2.5 rounded-2xl shadow-inner group">
                      <Trophy size={18} className="text-amber-500 group-hover:scale-110 transition-transform" />
                      <span className="font-black text-white text-lg italic tracking-tighter">{Number(currentUser.balance ?? 0).toLocaleString()}đ</span>
                    </div>
                    <Link to="/profile" className="w-11 h-11 rounded-[16px] border border-slate-800 overflow-hidden shadow-2xl hover:border-amber-500 transition-all transform hover:rotate-6">
                      <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${String(currentUser.id)}`} alt="av" className="w-full h-full object-cover" />
                    </Link>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12">
                  <div className="max-w-7xl mx-auto w-full pb-32">
                    <Routes>
                      <Route path="/" element={<Dashboard user={currentUser} />} />
                      <Route path="/marketplace" element={<Marketplace user={currentUser} />} />
                      <Route path="/chat" element={<ChatRoom user={currentUser} />} />
                      <Route path="/tasks" element={<TaskList />} />
                      <Route path="/wallet" element={<WalletPage user={currentUser} />} />
                      <Route path="/profile" element={<Profile stats={{} as any} />} />
                      <Route path="/admin" element={currentUser.role === 'ADMIN' ? <AdminPanel /> : <Navigate to="/" />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </div>
                </div>
              </main>
            </div>
          </div>

          <div className="fixed top-12 right-6 z-[100] flex flex-col items-end space-y-3 pointer-events-none">
            {toasts.map(t => (
              <ToastItem key={t.id} toast={t} />
            ))}
          </div>
        </HashRouter>
      </AppContext.Provider>
    </ErrorBoundary>
  );
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => (
  <div className={`p-4 border rounded-2xl glass shadow-2xl animate-in slide-in-from-right-10 flex items-center gap-3 min-w-[300px] ${toast.type === 'ERROR' ? 'border-red-500/30 text-red-500' : 'border-emerald-500/30 text-emerald-500'}`}>
    {toast.type === 'ERROR' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
    <span className="text-[11px] font-black uppercase tracking-tight italic">{String(toast.message)}</span>
  </div>
);

const UserNavLink: React.FC<{ to: string, icon: any, label: string, badge?: string }> = ({ to, icon: Icon, label, badge }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center justify-between px-6 py-4 rounded-[20px] transition-all group ${active ? 'bg-white text-slate-950 font-black shadow-2xl scale-[1.02]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      <div className="flex items-center space-x-4">
        <Icon size={20} className={active ? 'text-amber-500' : 'group-hover:text-amber-500 transition-colors'} />
        <span className="text-[11px] font-black uppercase tracking-[0.25em]">{String(label)}</span>
      </div>
      {badge && <span className="text-[8px] px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black uppercase tracking-widest">{String(badge)}</span>}
    </Link>
  );
};

export default App;