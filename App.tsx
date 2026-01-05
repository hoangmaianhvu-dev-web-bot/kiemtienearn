
import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, User as UserIcon, 
  Menu, Trophy, LogOut, Search, 
  MessageSquare, Store, ShieldAlert,
  CheckCircle2, XCircle, AlertTriangle, Info, Bell,
  Sparkles, MessageCircle, Phone, Send, ExternalLink, X, ShieldCheck
} from 'lucide-react';

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

// Helper an toàn tuyệt đối cho LocalStorage
export const safeParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return parsed === null ? fallback : parsed;
  } catch (e) {
    console.error(`Lỗi dữ liệu tại ${key}:`, e);
    return fallback;
  }
};

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
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const AppContext = createContext<{
  notify: (message: string, type: ToastType) => void;
  announcement: string;
  setAnnouncement: (text: string) => void;
  updateUser: (user: User) => void;
}>({
  notify: () => {},
  announcement: "",
  setAnnouncement: () => {},
  updateUser: () => {}
});

export const useNotify = () => useContext(AppContext);

interface ErrorBoundaryProps { children?: React.ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

// Fix: Explicitly define the state property and make children optional to resolve TS errors where state/props are not recognized or children are falsely reported as missing
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }
  
  componentDidCatch(error: any, errorInfo: any) { console.error("Crash App:", error, errorInfo); }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-center">
          <XCircle className="text-red-500 w-20 h-20 mb-6" />
          <h1 className="text-2xl font-black text-white uppercase mb-4 italic">LỖI XUNG ĐỘT RENDER</h1>
          <p className="text-slate-500 text-sm mb-8 uppercase tracking-widest font-black">Hệ thống đã tự động ngắt kết nối để bảo vệ dữ liệu. Vui lòng tải lại.</p>
          <button onClick={() => window.location.reload()} className="px-10 py-4 bg-amber-500 text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest">Khởi động lại Terminal</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isUpdating = useRef(false);

  const [announcement, setAnnouncementState] = useState(() => 
    String(localStorage.getItem('ge_announcement') || "CHÀO MỪNG ĐẾN VỚI GARENAEARN - HỆ THỐNG KIẾM TIỀN TỰ ĐỘNG UY TÍN HÀNG ĐẦU!")
  );

  const [userStats, setUserStats] = useState<UserStats>({
    balance: 0, totalClicks: 0, totalEarnings: 0, referralCount: 0,
    referralClicks: 0, referralRegistrations: 0, conversionRate: 0,
    pendingCommission: 0, withdrawnCommission: 0, taskEarnings: 0
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        const session = safeParse('ge_user_session', null);
        if (session && session.id) {
          setCurrentUser(session);
        }
      } catch (e) {
        console.error("Init Error", e);
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, []);

  const notify = useCallback((message: string, type: ToastType) => {
    // Ngăn chặn spam thông báo
    const id = Date.now().toString(36);
    setToasts(prev => {
      if (prev.length > 3) return [...prev.slice(1), { id, message: String(message), type }];
      return [...prev, { id, message: String(message), type }];
    });
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const updateUser = useCallback((user: User) => {
    if (isUpdating.current) return;
    isUpdating.current = true;
    
    try {
      const sanitizedUser = { ...user, balance: Number(user.balance || 0) };
      setCurrentUser(sanitizedUser);
      localStorage.setItem('ge_user_session', JSON.stringify(sanitizedUser));
      
      const usersDB = safeParse('ge_users_db', []);
      if (Array.isArray(usersDB)) {
        const updatedDB = usersDB.map((u: any) => 
          u.id === sanitizedUser.id ? { ...u, balance: sanitizedUser.balance } : u
        );
        localStorage.setItem('ge_users_db', JSON.stringify(updatedDB));
      }
    } finally {
      setTimeout(() => { isUpdating.current = false; }, 100);
    }
  }, []);

  const setAnnouncement = useCallback((text: string) => {
    const val = String(text);
    setAnnouncementState(val);
    localStorage.setItem('ge_announcement', val);
  }, []);

  if (loading) return null;

  if (!currentUser) return <Login onLogin={(u) => { 
    updateUser(u); 
    notify(`Xin chào ${String(u.name)}!`, "SUCCESS"); 
  }} />;

  return (
    <ErrorBoundary>
      <AppContext.Provider value={{ notify, announcement, setAnnouncement, updateUser }}>
        <HashRouter>
          <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 selection:bg-amber-500/30">
            <div className="marquee-container shadow-2xl">
              <div className="marquee-text italic">{String(announcement)}</div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {isSidebarOpen && <div className="fixed inset-0 bg-black/80 z-50 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
              
              <aside className={`fixed inset-y-0 left-0 w-72 glass border-r border-slate-800/30 z-50 transform transition-transform duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col p-6">
                  <div className="flex items-center space-x-3 mb-10 px-2">
                    <GarenaLogo size={36} />
                    <div className="flex flex-col">
                      <span className="text-lg font-black tracking-tighter uppercase leading-none italic">GARENA<span className="text-amber-500">EARN</span></span>
                      <span className="text-[7px] font-black text-slate-500 tracking-[0.4em] mt-1 uppercase">Cloud Management</span>
                    </div>
                  </div>

                  <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                    {(currentUser.role === 'ADMIN' || currentUser.role === 'SUPPORT') && (
                      <UserNavLink to="/admin" icon={ShieldAlert} label="ROOT TERMINAL" badge={String(currentUser.role)} />
                    )}
                    <UserNavLink to="/" icon={LayoutDashboard} label="Bảng điều khiển" />
                    <UserNavLink to="/tasks" icon={() => <GarenaLogo size={16} />} label="Làm nhiệm vụ" />
                    <UserNavLink to="/marketplace" icon={Store} label="CHỢ GIAO DỊCH" />
                    <UserNavLink to="/links" icon={Trophy} label="Affiliate Hub" />
                    <UserNavLink to="/chat" icon={MessageSquare} label="Phòng Chat" />
                    <UserNavLink to="/wallet" icon={Wallet} label="Ví tài chính" />
                    <UserNavLink to="/profile" icon={UserIcon} label="Hồ sơ cá nhân" />
                  </nav>

                  <div className="mt-auto pt-6 border-t border-slate-900/50">
                    <button onClick={() => { localStorage.removeItem('ge_user_session'); window.location.reload(); }} className="w-full flex items-center justify-center space-x-3 py-4 text-slate-600 hover:text-red-500 transition-all font-black text-[9px] uppercase tracking-[0.3em]">
                      <LogOut size={16} />
                      <span>ĐĂNG XUẤT</span>
                    </button>
                  </div>
                </div>
              </aside>

              <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto no-scrollbar">
                <header className="sticky top-0 z-40 w-full glass border-b border-slate-800/30 px-6 py-4 flex items-center justify-between">
                  <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={24} /></button>
                  
                  <div className="flex-1 max-w-xl mx-8 hidden md:block">
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                        <input type="text" placeholder="TÌM KIẾM HỆ THỐNG..." className="w-full bg-slate-950/50 border border-slate-900 rounded-xl py-2 pl-12 pr-6 text-[10px] font-black uppercase outline-none focus:border-amber-500/30 transition-all" />
                     </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3 bg-amber-500/5 border border-amber-500/10 px-5 py-2 rounded-xl">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="font-black text-white text-md tracking-tighter italic">{Number(currentUser.balance || 0).toLocaleString()}đ</span>
                    </div>
                    <Link to="/profile" className="w-10 h-10 rounded-xl border border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all">
                      <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${String(currentUser.name)}`} alt="av" className="w-full h-full object-cover" />
                    </Link>
                  </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full pb-32">
                  <Routes>
                    <Route path="/" element={<Dashboard stats={userStats} user={currentUser} />} />
                    <Route path="/marketplace" element={<Marketplace user={currentUser} />} />
                    <Route path="/chat" element={<ChatRoom user={currentUser} />} />
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="/links" element={<MyLinks stats={userStats} userId={String(currentUser.id)} />} />
                    <Route path="/wallet" element={<WalletPage user={currentUser} />} />
                    <Route path="/profile" element={<Profile stats={userStats} />} />
                    <Route path="/admin" element={(currentUser.role === 'ADMIN' || currentUser.role === 'SUPPORT') ? <AdminPanel /> : <Navigate to="/" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>

                <div className="fixed bottom-8 right-8 z-[60]">
                   {isSupportOpen ? (
                      <div className="glass rounded-3xl w-72 p-5 border border-amber-500/20 shadow-2xl animate-in zoom-in-95 duration-200 mb-4">
                         <div className="flex justify-between items-center mb-5">
                            <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Hỗ trợ 24/7</span>
                            <button onClick={() => setIsSupportOpen(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
                         </div>
                         <div className="space-y-2">
                            <SupportLink icon={Send} label="Telegram: @VanhTRUM" href="https://t.me/VanhTRUM" />
                            <SupportLink icon={Phone} label="Zalo Admin" href="https://zalo.me/0337117930" />
                         </div>
                      </div>
                   ) : (
                      <button onClick={() => setIsSupportOpen(true)} className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-xl hover:scale-110 active:scale-95 transition-all">
                         <MessageCircle size={28} />
                      </button>
                   )}
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

const SupportLink = ({ icon: Icon, label, href }: any) => (
  <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-900 rounded-xl hover:border-amber-500/30 transition-all group">
     <Icon size={14} className="text-amber-500" />
     <span className="text-[9px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">{String(label)}</span>
  </a>
);

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const themes = {
    SUCCESS: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500',
    ERROR: 'border-red-500/30 bg-red-500/5 text-red-500',
    CANCEL: 'border-slate-500/30 bg-slate-500/5 text-slate-500',
    WARNING: 'border-amber-500/30 bg-amber-500/5 text-amber-500',
    INFO: 'border-blue-500/30 bg-blue-500/5 text-blue-500'
  };

  return (
    <div className={`p-4 border rounded-xl glass shadow-2xl animate-in slide-in-from-right-10 flex items-center gap-3 min-w-[280px] ${themes[toast.type]}`}>
      {toast.type === 'SUCCESS' ? <CheckCircle2 size={16} /> : <Info size={16} />}
      <span className="text-[10px] font-black uppercase tracking-tight italic">{String(toast.message)}</span>
    </div>
  );
};

const UserNavLink: React.FC<{ to: string, icon: any, label: string, badge?: string }> = ({ to, icon: Icon, label, badge }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center justify-between px-5 py-3.5 rounded-xl transition-all group ${active ? 'bg-white text-slate-950 font-black shadow-lg' : 'text-slate-500 hover:text-white hover:bg-slate-900/40'}`}>
      <div className="flex items-center space-x-3">
        <Icon size={16} className={active ? 'text-amber-500' : ''} />
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{String(label)}</span>
      </div>
      {badge && <span className="text-[7px] px-1.5 py-0.5 rounded bg-red-600 text-white font-black uppercase tracking-widest">{String(badge)}</span>}
    </Link>
  );
};

export default App;
