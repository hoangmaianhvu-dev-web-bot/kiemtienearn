import React, { useState, useEffect, createContext, useContext, useCallback, useRef, Component } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, User as UserIcon, 
  Menu, Trophy, LogOut, Search, 
  MessageSquare, Store, ShieldAlert,
  CheckCircle2, XCircle, AlertTriangle, Info, Bell,
  Sparkles, MessageCircle, Phone, Send, ExternalLink, X, ShieldCheck,
  Server, Cpu, Activity
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

// --- KẾT NỐI MÁY CHỦ THỰC SUPABASE ---
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
        <div className="glass p-10 rounded-[40px] border-red-500/20">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-white font-black uppercase italic tracking-tighter">Lỗi kết nối máy chủ Supabase</h2>
          <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase">Thử lại</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

const App: React.FC = () => {
  // Snapshot dữ liệu từ Cache để hiện UI ngay lập tức
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const local = localStorage.getItem('ge_user_session');
    if (local) {
      try { return JSON.parse(local); } catch (e) { return null; }
    }
    return null;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [announcement, setAnnouncement] = useState("GARENAEARN v5.0: ĐÃ CHUYỂN SANG MÁY CHỦ THỰC SUPABASE - TỐC ĐỘ X10 - UY TÍN TUYỆT ĐỐI!");
  
  const syncRef = useRef(false);

  // Sync trực tiếp với Supabase
  const syncProfile = useCallback(async () => {
    const session = localStorage.getItem('ge_user_session');
    if (!session || syncRef.current) return;
    
    syncRef.current = true;
    try {
      const userObj = JSON.parse(session);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userObj.id)
        .single();

      if (data && !error) {
        const updatedUser = { 
          ...data, 
          balance: Number(data.balance ?? 0),
          id: String(data.id)
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('ge_user_session', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.debug("Supabase background fetch...");
    } finally {
      syncRef.current = false;
    }
  }, []);

  useEffect(() => {
    syncProfile();
    // Realtime Sync: 30 giây một lần
    const interval = setInterval(syncProfile, 30000);
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

  if (!currentUser) return <Login onLogin={(u) => { updateUser(u); syncProfile(); }} />;

  return (
    <ErrorBoundary>
      <AppContext.Provider value={{ notify, announcement, updateUser, setAnnouncement, syncProfile }}>
        <HashRouter>
          <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 overflow-hidden">
            {/* Thanh thông báo Realtime */}
            <div className="marquee-container shadow-2xl shrink-0 border-b border-white/5">
              <div className="marquee-text italic">{String(announcement)}</div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {isSidebarOpen && <div className="fixed inset-0 bg-black/90 z-50 lg:hidden backdrop-blur-md" onClick={() => setIsSidebarOpen(false)} />}
              
              <aside className={`fixed inset-y-0 left-0 w-72 glass border-r border-slate-800/20 z-50 transform transition-all duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col p-6">
                  {/* Thương hiệu Garena Realtime */}
                  <div className="flex items-center space-x-3 mb-10 px-2 shrink-0">
                    <GarenaLogo size={40} />
                    <div className="flex flex-col">
                      <span className="text-xl font-black tracking-tighter uppercase italic leading-none">GARENA<span className="text-amber-500">EARN</span></span>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[7px] font-black text-slate-500 tracking-[0.3em] uppercase">SUPABASE CORE ONLINE</span>
                      </div>
                    </div>
                  </div>

                  <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                    {currentUser.role === 'ADMIN' && (
                      <UserNavLink to="/admin" icon={ShieldAlert} label="ADMIN TERMINAL" badge="ROOT" />
                    )}
                    <UserNavLink to="/" icon={LayoutDashboard} label="BẢNG ĐIỀU KHIỂN" />
                    <UserNavLink to="/tasks" icon={Activity} label="NHIỆM VỤ THỰC" />
                    <UserNavLink to="/marketplace" icon={Store} label="CHỢ GIAO DỊCH" />
                    <UserNavLink to="/wallet" icon={Wallet} label="VÍ TÀI CHÍNH" />
                    <UserNavLink to="/chat" icon={MessageSquare} label="CỘNG ĐỒNG" />
                    <UserNavLink to="/profile" icon={UserIcon} label="HỒ SƠ CÁ NHÂN" />
                  </nav>

                  {/* System Status Info */}
                  <div className="mt-auto pt-6 border-t border-slate-900/50 space-y-4 shrink-0">
                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[8px] font-black text-slate-500 uppercase">Server Latency</span>
                          <span className="text-[8px] font-black text-emerald-500">12ms</span>
                       </div>
                       <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div className="w-[90%] h-full bg-emerald-500" />
                       </div>
                    </div>
                    <button onClick={() => { localStorage.removeItem('ge_user_session'); window.location.reload(); }} className="w-full flex items-center justify-center space-x-3 py-4 text-slate-600 hover:text-red-500 transition-all font-black text-[9px] uppercase tracking-[0.3em]">
                      <LogOut size={16} />
                      <span>THOÁT HỆ THỐNG</span>
                    </button>
                  </div>
                </div>
              </aside>

              <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                <header className="sticky top-0 z-40 w-full glass border-b border-slate-800/20 px-6 py-4 flex items-center justify-between shrink-0">
                  <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={24} /></button>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3 bg-amber-500/5 border border-amber-500/20 px-5 py-2.5 rounded-2xl shadow-inner">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="font-black text-white text-md italic tracking-tighter">{Number(currentUser.balance ?? 0).toLocaleString()}đ</span>
                    </div>
                    <Link to="/profile" className="w-10 h-10 rounded-[14px] border border-slate-800 overflow-hidden shadow-2xl hover:border-amber-500 transition-all">
                      <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${String(currentUser.id)}`} alt="av" className="w-full h-full object-cover" />
                    </Link>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10">
                  <div className="max-w-7xl mx-auto w-full pb-20">
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
  <div className={`p-4 border rounded-xl glass shadow-2xl animate-in slide-in-from-right-10 flex items-center gap-3 min-w-[280px] ${toast.type === 'ERROR' ? 'border-red-500/30 text-red-500' : 'border-emerald-500/30 text-emerald-500'}`}>
    {toast.type === 'ERROR' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
    <span className="text-[10px] font-black uppercase tracking-tight italic">{String(toast.message)}</span>
  </div>
);

const UserNavLink: React.FC<{ to: string, icon: any, label: string, badge?: string }> = ({ to, icon: Icon, label, badge }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${active ? 'bg-white text-slate-950 font-black shadow-2xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      <div className="flex items-center space-x-3">
        <Icon size={18} className={active ? 'text-amber-500' : 'group-hover:text-amber-500 transition-colors'} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{String(label)}</span>
      </div>
      {badge && <span className="text-[7px] px-2 py-0.5 rounded-full bg-red-600 text-white font-black uppercase">{String(badge)}</span>}
    </Link>
  );
};

export default App;
