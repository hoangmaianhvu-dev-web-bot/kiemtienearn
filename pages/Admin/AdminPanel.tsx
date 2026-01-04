
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Activity, DollarSign, Zap, Store, Edit3, 
  ArrowDownToLine, Globe, CheckCircle2, Star, Users, ExternalLink, 
  AlertTriangle, Check, X, Image as ImageIcon, Trash2, Info, Settings
} from 'lucide-react';
import { MarketProduct, Task, PaymentTransaction, SupportTicket, ProductType, GameCategory } from '../../types.ts';
import { useNotify } from '../../App.tsx';
import AdminTasks from './AdminTasks.tsx';

const AdminPanel: React.FC = () => {
  const { notify, announcement, setAnnouncement } = useNotify();
  const [activeTab, setActiveTab] = useState<'payments' | 'reports' | 'market' | 'tasks' | 'config' | 'system'>('system');
  
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [reports, setReports] = useState<SupportTicket[]>([]);
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Luôn đảm bảo dữ liệu được khởi tạo để tránh đen màn
    const fetchDB = () => {
      setTransactions(JSON.parse(localStorage.getItem('ge_tx_db') || '[]'));
      setReports(JSON.parse(localStorage.getItem('ge_reports_db') || '[]'));
      setProducts(JSON.parse(localStorage.getItem('ge_market_db') || '[]'));
      const usersDB = JSON.parse(localStorage.getItem('ge_users_db') || '[]');
      setUserCount(usersDB.length);
    };
    fetchDB();
  }, [activeTab]);

  const [newProduct, setNewProduct] = useState<Partial<MarketProduct>>({
    title: '', price: 0, image: '', type: 'GAME', gameCategory: 'ACC', externalUrl: '', tag: 'HOT'
  });

  const handleTxAction = (id: string, action: 'SUCCESS' | 'CANCELLED') => {
    const db = JSON.parse(localStorage.getItem('ge_tx_db') || '[]');
    const updated = db.map((t: any) => t.id === id ? {...t, status: action} : t);
    setTransactions(updated);
    localStorage.setItem('ge_tx_db', JSON.stringify(updated));
    notify(`Đã ${action === 'SUCCESS' ? 'Duyệt' : 'Hủy'} đơn ${id}`, action === 'SUCCESS' ? 'SUCCESS' : 'CANCEL');
  };

  const handleCreateProduct = () => {
    if (!newProduct.title || !newProduct.price) { notify("Thiếu thông tin sản phẩm!", "ERROR"); return; }
    const prod: MarketProduct = { ...newProduct as MarketProduct, id: 'prod-' + Date.now(), seller: 'ADMIN', description: 'Verified Product' };
    const updated = [prod, ...products];
    setProducts(updated);
    localStorage.setItem('ge_market_db', JSON.stringify(updated));
    notify("Đã đăng sản phẩm lên kho hàng!", "SUCCESS");
    setNewProduct({ title: '', price: 0, image: '', type: 'GAME', gameCategory: 'ACC', externalUrl: '', tag: 'HOT' });
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('ge_market_db', JSON.stringify(updated));
    notify("Đã xóa sản phẩm", "CANCEL");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32">
      {/* Root Terminal Header */}
      <div className="glass p-6 rounded-[32px] border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/30">
            <ShieldAlert size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none flex items-center gap-2">ROOT <span className="text-red-500">TERMINAL</span></h1>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 italic">GARENAEARN v4.3 MASTER NODE</p>
          </div>
        </div>
        
        <div className="flex bg-[#0a0f1e] p-1 rounded-2xl border border-slate-800 shadow-inner max-w-full overflow-x-auto no-scrollbar">
           <TabBtn active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} icon={ArrowDownToLine} label="Giao Dịch" />
           <TabBtn active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={AlertTriangle} label="Báo Lỗi Bill" />
           <TabBtn active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={Store} label="Sản Phẩm" />
           <TabBtn active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={Zap} label="Nhiệm Vụ" />
           <TabBtn active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon={Settings} label="Cấu Hình" />
           <TabBtn active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon={Activity} label="Stats" />
        </div>
      </div>

      {/* Tab: Giao Dịch */}
      {activeTab === 'payments' && (
        <div className="glass rounded-[40px] border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
           <div className="p-8 border-b border-slate-900 flex justify-between items-center">
              <h2 className="text-xl font-black text-white uppercase italic">Xử lý Nạp / Rút / Thẻ</h2>
              <DollarSign size={20} className="text-emerald-500" />
           </div>
           <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                 <thead className="bg-[#0a0f1e] text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <tr><th className="px-8 py-5">Giao dịch</th><th className="px-8 py-5">Loại & Tiền</th><th className="px-8 py-5">Nội dung / Liên hệ</th><th className="px-8 py-5">Xử lý</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-900">
                    {transactions.length === 0 ? (
                      <tr><td colSpan={4} className="p-20 text-center text-slate-700 italic font-black uppercase tracking-widest">Không có đơn hàng chờ</td></tr>
                    ) : transactions.map(t => (
                      <tr key={t.id} className="group hover:bg-white/5 transition-colors">
                         <td className="px-8 py-6"><p className="text-xs font-black text-white italic">{t.id}</p><p className="text-[9px] font-bold text-slate-600 uppercase">{t.timestamp}</p></td>
                         <td className="px-8 py-6"><span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${t.type === 'DEPOSIT' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>{t.type}</span><p className="text-sm font-black text-white italic mt-1">{t.amount.toLocaleString()}đ</p></td>
                         <td className="px-8 py-6"><p className="text-[10px] font-black text-amber-500 uppercase italic">{t.content}</p><p className="text-[9px] font-bold text-slate-500 uppercase mt-1">{t.contactInfo || t.details}</p></td>
                         <td className="px-8 py-6">
                            {t.status === 'PENDING' || t.status === 'REPORTED' ? (
                               <div className="flex items-center gap-3"><button onClick={() => handleTxAction(t.id, 'SUCCESS')} className="w-10 h-10 bg-emerald-600 rounded-xl text-white flex items-center justify-center hover:scale-110 transition-transform"><Check size={20} /></button><button onClick={() => handleTxAction(t.id, 'CANCELLED')} className="w-10 h-10 bg-red-600 rounded-xl text-white flex items-center justify-center hover:scale-110 transition-transform"><X size={20} /></button></div>
                            ) : <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase ${t.status === 'SUCCESS' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>{t.status}</span>}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Tab: Báo Lỗi Bill */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-300">
           {reports.length === 0 ? (
              <div className="col-span-2 glass p-20 rounded-[40px] text-center italic font-black uppercase text-slate-800 tracking-widest">Hệ thống sạch, chưa có báo lỗi bill</div>
           ) : reports.map(r => (
              <div key={r.id} className="glass rounded-[40px] p-8 border-slate-800 space-y-6">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4"><div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white"><AlertTriangle size={24} /></div><div><h3 className="text-lg font-black text-white uppercase italic">{r.userName}</h3><p className="text-[9px] font-black text-slate-500 uppercase">{r.timestamp}</p></div></div>
                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-4 py-1 rounded-xl">ID: {r.transactionId}</span>
                 </div>
                 <div className="p-5 bg-slate-950 rounded-2xl border border-slate-900"><p className="text-[11px] font-bold text-slate-300 italic uppercase">"{r.message}"</p></div>
                 {r.billImage && <div className="h-64 rounded-3xl overflow-hidden shadow-2xl"><img src={r.billImage} className="w-full h-full object-cover" /></div>}
                 <button onClick={() => { localStorage.setItem('ge_reports_db', JSON.stringify(reports.filter(x => x.id !== r.id))); setReports(reports.filter(x => x.id !== r.id)); notify("Đã xử lý xong!", "SUCCESS"); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Duyệt Thành Công & Đóng</button>
              </div>
           ))}
        </div>
      )}

      {/* Tab: Nhiệm Vụ */}
      {activeTab === 'tasks' && <AdminTasks />}

      {/* Tab: Sản Phẩm */}
      {activeTab === 'market' && (
        <div className="space-y-10 animate-in zoom-in-95 duration-300">
           <div className="glass rounded-[40px] p-10 border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Quản Lý Kho Hàng</h2>
                 <AdminInput label="Tên sản phẩm" value={newProduct.title} onChange={(v: string) => setNewProduct({...newProduct, title: v})} icon={Edit3} />
                 <AdminInput label="Giá bán (VNĐ)" type="number" value={newProduct.price} onChange={(v: string) => setNewProduct({...newProduct, price: parseInt(v)})} icon={DollarSign} />
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setNewProduct({...newProduct, type: 'GAME'})} className={`p-4 rounded-2xl border transition-all ${newProduct.type === 'GAME' ? 'bg-blue-600/10 border-blue-600 text-blue-500' : 'bg-slate-950 border-slate-800 text-slate-600'}`}><p className="text-[10px] font-black uppercase">GAME (WEB)</p></button>
                    <button onClick={() => setNewProduct({...newProduct, type: 'GOODS'})} className={`p-4 rounded-2xl border transition-all ${newProduct.type === 'GOODS' ? 'bg-orange-600/10 border-orange-600 text-orange-500' : 'bg-slate-950 border-slate-800 text-slate-600'}`}><p className="text-[10px] font-black uppercase">ĐỒ DÙNG (MUA NGOÀI)</p></button>
                 </div>
              </div>
              <div className="space-y-6">
                 {newProduct.type === 'GAME' && (
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase ml-4 italic">Danh mục Game</label>
                       <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-xs font-black text-white" value={newProduct.gameCategory} onChange={e => setNewProduct({...newProduct, gameCategory: e.target.value as GameCategory})}>
                          <option value="ACC">Account Game</option><option value="REG">Regedit / Aimlock</option><option value="AIM">Aim Control</option><option value="BUFF">Buff Màn Hình</option><option value="DATA">Data Garena</option><option value="HACK">Hack / Cheat</option><option value="MODSKIN">Mod Skin</option>
                       </select>
                    </div>
                 )}
                 <AdminInput label="Link tải / Hướng dẫn / Link ngoài" placeholder="https://..." value={newProduct.externalUrl} onChange={(v: string) => setNewProduct({...newProduct, externalUrl: v})} icon={ExternalLink} />
                 <AdminInput label="URL Hình ảnh" placeholder="Nhập link ảnh..." value={newProduct.image} onChange={(v: string) => setNewProduct({...newProduct, image: v})} icon={ImageIcon} />
                 <button onClick={handleCreateProduct} className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase text-[11px] tracking-widest shadow-2xl transition-all">ĐĂNG TẢI SẢN PHẨM</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                 <div key={p.id} className="p-6 bg-slate-950 border border-slate-900 rounded-[32px] flex items-center justify-between group animate-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                          <img src={p.image} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-white uppercase italic">{p.title}</p>
                          <p className="text-[9px] font-bold text-amber-500 uppercase">{p.price.toLocaleString()}đ • {p.type}</p>
                       </div>
                    </div>
                    <button onClick={() => deleteProduct(p.id)} className="text-slate-700 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Tab: Cấu Hình */}
      {activeTab === 'config' && (
        <div className="glass rounded-[40px] p-10 border-slate-800 space-y-6 animate-in zoom-in-95 duration-300">
           <h3 className="text-xl font-black text-white uppercase italic">Thông báo hệ thống (Marquee)</h3>
           <textarea className="w-full bg-slate-950 border border-slate-800 rounded-[32px] p-8 text-sm font-bold text-amber-500 h-32 uppercase tracking-widest italic outline-none focus:border-amber-500" value={announcement} onChange={e => setAnnouncement(e.target.value)} />
           <div className="flex items-center gap-3 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10"><Info size={16} className="text-amber-500" /><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Nội dung sẽ được cập nhật thời gian thực cho tất cả người dùng.</p></div>
        </div>
      )}

      {/* Tab: System Stats */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in zoom-in-95 duration-300">
           <StatBox label="Thành viên" value={userCount} icon={Users} color="text-blue-500" />
           <StatBox label="Giao dịch Chờ" value={transactions.filter(t => t.status === 'PENDING').length} icon={DollarSign} color="text-emerald-500" />
           <StatBox label="Báo lỗi mới" value={reports.length} icon={AlertTriangle} color="text-red-500" />
        </div>
      )}
    </div>
  );
};

const TabBtn = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center shrink-0 space-x-3 px-6 py-4 rounded-xl transition-all ${active ? 'bg-white text-slate-950 shadow-2xl' : 'text-slate-500 hover:text-white'}`}>
     <Icon size={16} /><span className="text-[9px] font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

const AdminInput = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-2">
     <label className="text-[9px] font-black text-slate-500 uppercase ml-4 italic tracking-widest">{label}</label>
     <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors"><Icon size={16} /></div>
        <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-white outline-none focus:border-amber-500 transition-all" {...props} onChange={e => props.onChange(e.target.value)} />
     </div>
  </div>
);

const StatBox = ({ label, value, icon: Icon, color }: any) => (
  <div className="glass p-10 rounded-[40px] border-slate-800 relative overflow-hidden group hover:border-white/10 transition-all shadow-2xl">
    <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}><Icon size={120} /></div>
    <div className="relative z-10"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{label}</p><h3 className={`text-5xl font-black tracking-tighter italic ${color}`}>{value}</h3></div>
  </div>
);

export default AdminPanel;
