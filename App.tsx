
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, User as UserIcon, 
  Menu, Trophy, LogOut, Search, 
  MessageSquare, Store, ShieldAlert,
  CheckCircle2, XCircle, AlertTriangle, Info, Bell,
  Sparkles, MessageCircle, Phone, Send, ExternalLink, X
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

export const GarenaLogo: React.FC<{ className?: string, size?: number }> = ({ className = "", size = 40 }) => (
  <div 
    className={`relative flex items-center justify-center rounded-[28%] bg-gradient-to-br from-[#FFB129] to-[#FF8A00] shadow-xl shadow-orange-500/20 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <svg 
      viewBox="0 0 24 24" 
      width={size * 0.6} 
      height={size * 0.6} 
      fill="currentColor" 
      className="text-slate-950"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
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

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [announcement, setAnnouncement] = useState(() => {
    return localStorage.getItem('ge_announcement') || "HỆ THỐNG GARENAEARN v4.3 - CHÀO MỪNG THÀNH VIÊN MỚI - UY TÍN - HIỆN ĐẠI - TỰ ĐỘNG!";
  });

  const [userStats, setUserStats] = useState<UserStats>({
    balance: 0,
    totalClicks: 0,
    totalEarnings: 0,
    referralCount: 0,
    referralClicks: 0,
    referralRegistrations: 0,
    conversionRate: 0,
    pendingCommission: 0,
    withdrawnCommission: 0,
    taskEarnings: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('ge_user_session');
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const notify = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ge_user_session', JSON.stringify(user));
    // Đồng thời cập nhật vào database user tổng nếu có
    const usersDB = JSON.parse(localStorage.getItem('ge_users_db') || '[]');
    const updatedDB = usersDB.map((u: any) => u.id === user.id ? { ...u, balance: user.balance } : u);
    localStorage.setItem('ge_users_db', JSON.stringify(updatedDB));
  };

  const handleLogin = (user: User) => {
    updateUser(user);
    notify(`Chào mừng ${user.name} đã gia nhập hệ thống!`, 'SUCCESS');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ge_user_session');
    notify("Phiên làm việc đã kết thúc.", "CANCEL");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <div className="mb-6 animate-pulse">
        <GarenaLogo size={80} />
      </div>
      <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">GARENAEARN SECURE CONNECTING...</p>
    </div>
  );

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <AppContext.Provider value={{ notify, announcement, setAnnouncement: (text) => { setAnnouncement(text); localStorage.setItem('ge_announcement', text); }, updateUser }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200">
          <div className="marquee-container shadow-2xl">
            <div className="marquee-text uppercase tracking-widest italic">{announcement}</div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {isSidebarOpen && <div className="fixed inset-0 bg-black/90 z-50 lg:hidden backdrop-blur-xl" onClick={() => setIsSidebarOpen(false)} />}
            
            <aside className={`fixed inset-y-0 left-0 w-72 glass border-r border-slate-800/50 z-50 transform transition-transform duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="h-full flex flex-col p-6">
                <div className="flex items-center space-x-3 mb-10">
                  <GarenaLogo size={40} />
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tighter uppercase leading-none">GARENA<span className="text-amber-500">EARN</span></span>
                    <span className="text-[8px] font-black text-slate-500 tracking-[0.3em] mt-1">MANAGEMENT NODE</span>
                  </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                  {(currentUser.role === 'ADMIN' || currentUser.role === 'SUPPORT') && (
                    <UserNavLink to="/admin" icon={ShieldAlert} label="ROOT TERMINAL" badge={currentUser.role} />
                  )}
                  <UserNavLink to="/" icon={LayoutDashboard} label="Bảng điều khiển" />
                  <UserNavLink to="/tasks" icon={() => <GarenaLogo size={18} className="rounded-md" />} label="Làm nhiệm vụ" />
                  <UserNavLink to="/marketplace" icon={Store} label="CHỢ GIAO DỊCH" />
                  <UserNavLink to="/links" icon={Trophy} label="Affiliate Hub" />
                  <UserNavLink to="/chat" icon={MessageSquare} label="Phòng Chat" />
                  <UserNavLink to="/wallet" icon={Wallet} label="Ví tài chính" />
                  <UserNavLink to="/profile" icon={UserIcon} label="Hồ sơ cá nhân" />
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-900">
                  <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-3 py-4 text-slate-600 hover:text-red-500 transition-all font-black text-[9px] uppercase tracking-[0.3em]">
                    <LogOut size={16} />
                    <span>Dừng phiên làm việc</span>
                  </button>
                </div>
              </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto no-scrollbar relative">
              <header className="sticky top-0 z-40 w-full glass border-b border-slate-800/50 px-6 py-4 flex items-center justify-between">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={24} /></button>
                
                <div className="flex-1 max-w-xl mx-8 hidden md:block">
                   <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                      <input type="text" placeholder="Tìm kiếm hệ thống..." className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 pl-12 pr-6 text-[11px] font-black uppercase outline-none focus:border-amber-500/50 transition-all" />
                   </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3 bg-amber-500/5 border border-amber-500/10 px-6 py-2.5 rounded-2xl shadow-inner">
                    <Trophy size={18} className="text-amber-500" />
                    <span className="font-black text-white text-lg tracking-tighter italic">{currentUser.balance.toLocaleString()}đ</span>
                  </div>
                  <Link to="/profile" className="w-11 h-11 rounded-2xl border-2 border-slate-800 overflow-hidden hover:border-amber-500 transition-all shadow-2xl">
                    <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} alt="avatar" className="w-full h-full object-cover" />
                  </Link>
                </div>
              </header>

              <div className="p-6 md:p-10 max-w-7xl mx-auto w-full pb-32">
                <Routes>
                  <Route path="/" element={<Dashboard stats={userStats} user={currentUser} />} />
                  <Route path="/marketplace" element={<Marketplace balance={currentUser.balance} />} />
                  <Route path="/chat" element={<ChatRoom user={currentUser} />} />
                  <Route path="/tasks" element={<TaskList />} />
                  <Route path="/links" element={<MyLinks stats={userStats} userId={currentUser.id} />} />
                  <Route path="/wallet" element={<WalletPage user={currentUser} />} />
                  <Route path="/profile" element={<Profile stats={userStats} />} />
                  <Route path="/admin" element={(currentUser.role === 'ADMIN' || currentUser.role === 'SUPPORT') ? <AdminPanel /> : <Navigate to="/" />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>

              {/* Support Floating Button */}
              <div className="fixed bottom-10 right-10 z-[60]">
                 {isSupportOpen ? (
                    <div className="glass rounded-[32px] w-80 p-6 border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in zoom-in-90 slide-in-from-bottom-10 duration-300 mb-4">
                       <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-950"><Phone size={20} /></div>
                             <div>
                                <h3 className="text-sm font-black text-white uppercase italic">Hỗ Trợ Garena</h3>
                                <p className="text-[8px] font-black text-emerald-500 uppercase">Online 24/7</p>
                             </div>
                          </div>
                          <button onClick={() => setIsSupportOpen(false)} className="text-slate-600 hover:text-white"><X size={20} /></button>
                       </div>
                       
                       <div className="space-y-3">
                          <SupportLink icon={Phone} label="Zalo: 0337117930" href="https://zalo.me/0337117930" color="bg-blue-600" />
                          <SupportLink icon={Send} label="Telegram: @VanhTRUM" href="https://t.me/VanhTRUM" color="bg-cyan-500" />
                          <SupportLink icon={ExternalLink} label="Group Cộng Đồng" href="https://t.me/+JzOTfYqCwAU4MzE1" color="bg-orange-600" />
                       </div>
                    </div>
                 ) : (
                    <button 
                      onClick={() => setIsSupportOpen(true)}
                      className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 shadow-[0_10px_40px_rgba(245,158,11,0.4)] hover:scale-110 active:scale-95 transition-all animate-bounce"
                    >
                       <MessageCircle size={32} />
                    </button>
                 )}
              </div>
            </main>
          </div>
        </div>

        {/* Toasts... */}
        <div className="fixed top-10 right-10 z-[100] flex flex-col items-end space-y-4 pointer-events-none">
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} />
          ))}
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

const SupportLink = ({ icon: Icon, label, href, color }: any) => (
  <a href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-900 hover:border-amber-500/50 transition-all group">
     <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-white`}><Icon size={14} /></div>
        <span className="text-[10px] font-black text-white uppercase tracking-wider">{label}</span>
     </div>
     <ExternalLink size={14} className="text-slate-700 group-hover:text-amber-500" />
  </a>
);

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const icons = {
    SUCCESS: <CheckCircle2 className="text-emerald-500" size={20} />,
    ERROR: <XCircle className="text-red-500" size={20} />,
    CANCEL: <XCircle className="text-slate-500" size={20} />,
    WARNING: <AlertTriangle className="text-amber-500" size={20} />,
    INFO: <Info className="text-blue-500" size={20} />
  };

  const colors = {
    SUCCESS: 'border-emerald-500/20 bg-emerald-500/5',
    ERROR: 'border-red-500/20 bg-red-500/5',
    CANCEL: 'border-slate-500/20 bg-slate-500/5',
    WARNING: 'border-amber-500/20 bg-amber-500/5',
    INFO: 'border-blue-500/20 bg-blue-500/5'
  };

  return (
    <div className={`pointer-events-auto flex items-center space-x-5 p-6 rounded-[32px] border glass backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right-10 duration-500 min-w-[380px] max-w-md ${colors[toast.type]}`}>
      <div className="shrink-0 relative">
        <GarenaLogo size={50} className="shadow-2xl shadow-orange-500/20" />
        <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-1 border border-slate-800">
          {icons[toast.type]}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
           <Sparkles size={10} className="text-amber-500" />
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">HỆ THỐNG GARENAEARN</p>
        </div>
        <p className="text-[11px] font-black text-white leading-relaxed uppercase tracking-tight italic">{toast.message}</p>
      </div>
    </div>
  );
};

const UserNavLink: React.FC<{ to: string, icon: any, label: string, badge?: string }> = ({ to, icon: Icon, label, badge }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-white text-slate-950 font-black shadow-2xl' : 'text-slate-500 hover:bg-slate-900/50 hover:text-white'}`}>
      <div className="flex items-center space-x-4">
        <Icon size={18} className={active ? 'text-amber-500' : ''} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      {badge && <span className={`text-[8px] px-2 py-0.5 rounded-lg font-black bg-red-600 text-white uppercase`}>{badge}</span>}
    </Link>
  );
};

export default App;
