
import React, { useState, useEffect, createContext, useContext, useCallback, useRef, Component } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, User as UserIcon, 
  Menu, Trophy, LogOut, Search, 
  MessageSquare, Store, ShieldAlert,
  CheckCircle2, XCircle, AlertTriangle, Info, Bell,
  Sparkles, MessageCircle, Phone, Send, ExternalLink, X, ShieldCheck
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

import { User, UserStats } from './types.ts';

// Supabase Configuration
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

// Added setAnnouncement to AppContext to allow AdminPanel to update the marquee
const AppContext = createContext<{
  notify: (message: string, type: ToastType) => void;
  announcement: string;
  updateUser: (user: User) => void;
  setAnnouncement: (val: string) => void;
}>({
  notify: () => {},
  announcement: "",
  updateUser: () => {},
  setAnnouncement: () => {}
});

export const useNotify = () => useContext(AppContext);

interface ErrorBoundaryProps { children?: React.ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

// Fix: Inherit from Component imported from 'react' to ensure 'this.props' is correctly typed and accessible
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) { console.error("Critical Render Failure:", error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-10 text-center">
          <XCircle className="text-red-500 w-16 h-16 mb-4" />
          <h1 className="text-xl font-black text-white uppercase italic">Hệ thống đang bảo trì dữ liệu</h1>
          <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest">Vui lòng bấm nút bên dưới để khởi động lại Terminal</p>
          <button onClick={() => window.location.href = window.location.pathname} className="mt-6 px-8 py-3 bg-amber-500 text-slate-950 rounded-xl font-black text-[10px] uppercase">Khởi động lại</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isSyncing = useRef(false);

  // Moved announcement to state to allow dynamic updates from AdminPanel via context
  const [announcement, setAnnouncement] = useState("HỆ THỐNG GARENAEARN v4.3 - CHÀO MỪNG THÀNH VIÊN MỚI - UY TÍN - HIỆN ĐẠI - TỰ ĐỘNG!");

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (isSyncing.current) return;
    isSyncing.current = true;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) {
        const sanitizedUser: User = {
          ...data,
          balance: Number(data.balance || 0),
          id: String(data.id)
        };
        setCurrentUser(sanitizedUser);
        localStorage.setItem('ge_user_session', JSON.stringify(sanitizedUser));
      }
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      clearTimeout(timeout);
      isSyncing.current = false;
    }
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('ge_user_session');
    if (session) {
      try {
        const user = JSON.parse(session);
        setCurrentUser(user);
        fetchUserProfile(user.id); // Sync với DB thực tế
      } catch (e) {
        localStorage.removeItem('ge_user_session');
      }
    }
    setLoading(false);
  }, [fetchUserProfile]);

  const notify = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev.slice(-2), { id, message: String(message), type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const updateUser = useCallback((user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ge_user_session', JSON.stringify(user));
  }, []);

  if (loading) return null;

  if (!currentUser) return <Login onLogin={updateUser} />;

  return (
    <ErrorBoundary>
      <AppContext.Provider value={{ notify, announcement, updateUser, setAnnouncement }}>
        <HashRouter>
          <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200">
            <div className="marquee-container shadow-2xl">
              <div className="marquee-text italic">{String(announcement)}</div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {isSidebarOpen && <div className="fixed inset-0 bg-black/80 z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
              
              <aside className={`fixed inset-y-0 left-0 w-72 glass border-r border-slate-800/20 z-50 transform transition-transform duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col p-6">
                  <div className="flex items-center space-x-3 mb-10">
                    <GarenaLogo size={36} />
                    <div className="flex flex-col">
                      <span className="text-lg font-black tracking-tighter uppercase italic leading-none">GARENA<span className="text-amber-500">EARN</span></span>
                      <span className="text-[7px] font-black text-slate-500 tracking-[0.4em] mt-1 uppercase">Cloud Node Active</span>
                    </div>
                  </div>

                  <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                    {(currentUser.role === 'ADMIN') && (
                      <UserNavLink to="/admin" icon={ShieldAlert} label="Quản trị ROOT" badge="ADMIN" />
                    )}
                    <UserNavLink to="/" icon={LayoutDashboard} label="Bảng điều khiển" />
                    <UserNavLink to="/tasks" icon={() => <GarenaLogo size={16} />} label="Làm nhiệm vụ" />
                    <UserNavLink to="/marketplace" icon={Store} label="CHỢ GIAO DỊCH" />
                    <UserNavLink to="/wallet" icon={Wallet} label="Ví tài chính" />
                    <UserNavLink to="/profile" icon={UserIcon} label="Hồ sơ cá nhân" />
                  </nav>

                  <div className="mt-auto pt-6 border-t border-slate-900/50">
                    <button onClick={() => { localStorage.removeItem('ge_user_session'); window.location.reload(); }} className="w-full flex items-center justify-center space-x-3 py-4 text-slate-600 hover:text-red-500 transition-all font-black text-[9px] uppercase tracking-[0.3em]">
                      <LogOut size={16} />
                      <span>Dừng kết nối</span>
                    </button>
                  </div>
                </div>
              </aside>

              <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto no-scrollbar relative">
                <header className="sticky top-0 z-40 w-full glass border-b border-slate-800/20 px-6 py-4 flex items-center justify-between">
                  <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={24} /></button>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3 bg-amber-500/5 border border-amber-500/10 px-5 py-2 rounded-xl">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="font-black text-white text-md italic tracking-tighter">{Number(currentUser.balance || 0).toLocaleString()}đ</span>
                    </div>
                    <Link to="/profile" className="w-10 h-10 rounded-xl border border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all">
                      <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${String(currentUser.id)}`} alt="av" className="w-full h-full object-cover" />
                    </Link>
                  </div>
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto w-full pb-32">
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
    <Link to={to} className={`flex items-center justify-between px-5 py-3.5 rounded-xl transition-all group ${active ? 'bg-white text-slate-950 font-black' : 'text-slate-500 hover:text-white hover:bg-slate-900/40'}`}>
      <div className="flex items-center space-x-3">
        <Icon size={16} className={active ? 'text-amber-500' : ''} />
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{String(label)}</span>
      </div>
      {badge && <span className="text-[7px] px-1.5 py-0.5 rounded bg-red-600 text-white font-black uppercase">{String(badge)}</span>}
    </Link>
  );
};

export default App;
