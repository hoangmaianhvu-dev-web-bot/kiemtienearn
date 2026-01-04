
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Copy, QrCode, History, AlertTriangle, Upload, X, Ticket, Banknote, CreditCard
} from 'lucide-react';
import { User, PaymentTransaction, TransactionStatus, SupportTicket, TransactionType } from '../types';
import { useNotify } from '../App';

const WalletPage: React.FC<{ user: User }> = ({ user }) => {
  const { notify, updateUser } = useNotify();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [withdrawType, setWithdrawType] = useState<'BANK' | 'GARENA'>('BANK');
  const [depositAmount, setDepositAmount] = useState(50000);
  const [timer, setTimer] = useState<number | null>(null);
  
  const [withdrawAmount, setWithdrawAmount] = useState(5000);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  useEffect(() => {
    const fetchHistory = () => {
      const saved = localStorage.getItem('ge_tx_db');
      if (saved) {
        setTransactions(JSON.parse(saved).filter((t: any) => t.userId === user.id));
      }
    };
    fetchHistory();
  }, [user.id, activeTab]);

  useEffect(() => {
    if (timer !== null && timer > 0) {
      const interval = setInterval(() => setTimer(t => (t !== null ? t - 1 : null)), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setTimer(null);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const createTx = (type: TransactionType, amount: number) => {
    if (amount < 5000) { notify("Số tiền rút tối thiểu là 5.000đ", "ERROR"); return; }
    
    const isWithdraw = type === 'WITHDRAW' || type === 'REDEEM_CARD';
    if (isWithdraw && amount > user.balance) {
      notify("Số dư của bạn không đủ!", "ERROR");
      return;
    }

    if (isWithdraw) {
      if (type === 'REDEEM_CARD' && !contactInfo) {
        notify("Vui lòng nhập Gmail/Telegram nhận thẻ!", "ERROR");
        return;
      }
      if (type === 'WITHDRAW' && (!bankName || !accountNumber || !accountName)) {
        notify("Vui lòng nhập đầy đủ thông tin ngân hàng!", "ERROR");
        return;
      }
    }

    const tx: PaymentTransaction = {
      id: 'TX' + Math.random().toString(36).substr(2, 7).toUpperCase(),
      userId: user.id, userName: user.name, type, amount,
      method: type === 'DEPOSIT' ? 'MB Bank' : (type === 'REDEEM_CARD' ? 'Thẻ Garena' : bankName), 
      details: type === 'DEPOSIT' ? '97042292345678' : (type === 'REDEEM_CARD' ? `Liên hệ: ${contactInfo}` : `${accountNumber} - ${accountName}`),
      content: type === 'DEPOSIT' ? `GEARN ${user.id.slice(0, 6).toUpperCase()}` : `Rút tiền GEARN`,
      status: 'PENDING', timestamp: new Date().toLocaleString(),
      contactInfo: contactInfo,
      expiresAt: type === 'DEPOSIT' ? new Date(Date.now() + 10 * 60 * 1000).toISOString() : undefined
    };
    
    const db = JSON.parse(localStorage.getItem('ge_tx_db') || '[]');
    localStorage.setItem('ge_tx_db', JSON.stringify([tx, ...db]));
    setTransactions([tx, ...transactions]); // Cập nhật lịch sử ngay lập tức
    
    if (isWithdraw) {
      // Cập nhật số dư toàn hệ thống qua Context (Không cần reload trang)
      const updatedUser = { ...user, balance: user.balance - amount };
      updateUser(updatedUser);
      notify(`Yêu cầu thành công. Đã trừ ${amount.toLocaleString()}đ khỏi ví!`, "SUCCESS");
      
      // Chuyển sang tab lịch sử để người dùng thấy đơn đang chờ
      setTimeout(() => setActiveTab('history'), 500);
    } else {
      setTimer(600);
      notify("Khởi tạo lệnh nạp 10 phút thành công!", "SUCCESS");
    }
  };

  const [reportingTx, setReportingTx] = useState<PaymentTransaction | null>(null);
  const [reportBill, setReportBill] = useState('');
  const [reportMsg, setReportMsg] = useState('');

  const handleSendReport = () => {
    if (!reportBill || !reportMsg) { notify("Vui lòng tải ảnh bill và nhập lý do!", "ERROR"); return; }
    const tickets = JSON.parse(localStorage.getItem('ge_reports_db') || '[]');
    const newTicket: SupportTicket = {
      id: 'SUP' + Date.now(), userId: user.id, userName: user.name, transactionId: reportingTx?.id,
      subject: `Lỗi GD ${reportingTx?.id}`, message: reportMsg, billImage: reportBill, status: 'OPEN', timestamp: new Date().toLocaleString()
    };
    localStorage.setItem('ge_reports_db', JSON.stringify([newTicket, ...tickets]));
    notify("Đã gửi khiếu nại thành công!", "SUCCESS");
    setReportingTx(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Financial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Trung Tâm <span className="text-amber-500">Tài Chính</span></h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mt-3 italic">HỆ THỐNG AN TOÀN - UY TÍN v4.3</p>
        </div>
        <div className="flex bg-[#0a0f1e] p-1.5 rounded-2xl border border-slate-800">
          <button onClick={() => setActiveTab('deposit')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'deposit' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-600 hover:text-white'}`}>Nạp Tiền</button>
          <button onClick={() => setActiveTab('withdraw')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'withdraw' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-600 hover:text-white'}`}>Rút Tiền</button>
          <button onClick={() => setActiveTab('history')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-600 hover:text-white'}`}>Lịch Sử</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-8">
          <div className="glass rounded-[40px] p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000"><Banknote size={140} /></div>
             <div className="relative z-10 flex items-center space-x-3 text-slate-600 mb-6 font-black text-[10px] italic">
                <ShieldCheck size={14} className="text-blue-500" /> <span>SỐ DƯ VÍ AN TOÀN</span>
             </div>
             <h2 className="text-6xl font-black text-white tracking-tighter italic relative z-10">{user.balance.toLocaleString()}đ</h2>
          </div>
          <div className="p-8 bg-[#0a0f1e] border border-slate-900 rounded-[32px] space-y-4">
             <h3 className="text-[10px] font-black text-slate-500 uppercase italic">Phương thức chấp nhận</h3>
             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center text-white text-[9px] font-black uppercase">MB BANK / MOMO</div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center text-white text-[9px] font-black uppercase">THẺ GARENA</div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {activeTab === 'deposit' && (
            <div className="glass rounded-[40px] p-10 border border-slate-800 space-y-10 animate-in slide-in-from-right-5">
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[20000, 50000, 100000, 200000, 500000, 1000000].map(val => (
                    <button key={val} onClick={() => setDepositAmount(val)} className={`py-5 rounded-2xl font-black text-sm transition-all ${depositAmount === val ? 'bg-amber-500 text-slate-950 scale-105 shadow-xl' : 'bg-slate-950 border border-slate-900 text-slate-600 hover:text-white'}`}>{val.toLocaleString()}đ</button>
                  ))}
               </div>
               <div className="bg-[#0a0f1e] p-10 rounded-[40px] border border-slate-900 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                      <DepositInfo label="Số tài khoản MB BANK" value="97042292345678" onCopy={() => notify("Đã copy STK", "INFO")} />
                      <DepositInfo label="Nội dung chuyển khoản" value={`GEARN ${user.id.slice(0, 6).toUpperCase()}`} onCopy={() => notify("Đã copy nội dung", "INFO")} highlight />
                      {timer !== null ? (
                        <div className="bg-red-600 p-5 rounded-2xl text-center animate-pulse shadow-xl shadow-red-600/20">
                           <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Hết hạn sau: {formatTime(timer)}</p>
                        </div>
                      ) : (
                        <button onClick={() => createTx('DEPOSIT', depositAmount)} className="w-full py-5 bg-white text-slate-950 rounded-[28px] font-black uppercase text-[12px] tracking-widest shadow-2xl active:scale-95 transition-all">KHỞI TẠO GD 10 PHÚT</button>
                      )}
                    </div>
                    <div className="bg-white p-8 rounded-[36px] flex flex-col items-center shadow-2xl"><QrCode size={180} className="text-slate-950" /><p className="mt-4 text-3xl font-black text-slate-950 italic tracking-tighter">{depositAmount.toLocaleString()}đ</p></div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="glass rounded-[40px] p-10 border border-slate-800 space-y-8 animate-in slide-in-from-right-5">
               <div className="flex bg-[#0a0f1e] p-1.5 rounded-2xl border border-slate-900 shadow-inner">
                  <button onClick={() => setWithdrawType('BANK')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${withdrawType === 'BANK' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-600 hover:text-white'}`}>Rút Về Ngân Hàng / Ví</button>
                  <button onClick={() => setWithdrawType('GARENA')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${withdrawType === 'GARENA' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-600 hover:text-white'}`}>Đổi Thẻ Garena</button>
               </div>

               <div className="space-y-6">
                  {withdrawType === 'BANK' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <WalletInput label="Tên Ngân hàng / Ví" placeholder="VD: MB Bank, Momo..." value={bankName} onChange={setBankName} />
                       <WalletInput label="Số tài khoản nhận" placeholder="Nhập số tài khoản..." value={accountNumber} onChange={setAccountNumber} />
                       <div className="md:col-span-2">
                          <WalletInput label="Họ tên chủ tài khoản" placeholder="VIET HOA KHONG DAU" value={accountName} onChange={v => setAccountName(v.toUpperCase())} />
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       <WalletInput label="Gmail hoặc Telegram nhận mã thẻ" placeholder="Nhập Gmail hoặc @username Telegram..." value={contactInfo} onChange={setContactInfo} icon={Ticket} />
                       <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl italic text-[9px] font-black text-amber-500 uppercase tracking-widest leading-relaxed">Admin sẽ gửi mã thẻ qua thông tin liên hệ này trong vòng 30 phút - 2 giờ làm việc sau khi duyệt lệnh.</div>
                    </div>
                  )}
                  <WalletInput label="Số tiền muốn rút (Min 5.000đ)" type="number" value={withdrawAmount} onChange={v => setWithdrawAmount(parseInt(v))} />
                  <button 
                    onClick={() => createTx(withdrawType === 'BANK' ? 'WITHDRAW' : 'REDEEM_CARD', withdrawAmount)}
                    className="w-full py-5 bg-white text-slate-950 rounded-[28px] font-black uppercase text-[12px] tracking-widest shadow-2xl active:scale-95 transition-all"
                  >XÁC NHẬN RÚT TIỀN</button>
               </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="glass rounded-[40px] border-slate-800 overflow-hidden shadow-2xl animate-in slide-in-from-right-5">
               <div className="p-8 border-b border-slate-900 bg-[#0a0f1e] flex justify-between items-center">
                  <h3 className="text-xs font-black text-white uppercase italic tracking-tighter">Lịch sử tài chính cá nhân</h3>
                  <History size={18} className="text-slate-600" />
               </div>
               <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left">
                     <thead className="bg-[#0a0f1e] text-[9px] font-black text-slate-600 uppercase tracking-widest">
                        <tr><th className="px-8 py-5">Thời gian</th><th className="px-8 py-5">Loại</th><th className="px-8 py-5">Số tiền</th><th className="px-8 py-5">Trạng thái</th><th className="px-8 py-5">Hành động</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-900">
                        {transactions.length === 0 ? (
                          <tr><td colSpan={5} className="p-20 text-center text-slate-700 italic font-black uppercase tracking-widest">Hệ thống chưa ghi nhận giao dịch</td></tr>
                        ) : transactions.map(t => (
                          <tr key={t.id} className="group hover:bg-white/5 transition-colors">
                             <td className="px-8 py-6"><p className="text-[10px] font-bold text-slate-500">{t.timestamp}</p></td>
                             <td className="px-8 py-6"><span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${t.type === 'DEPOSIT' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>{t.type}</span></td>
                             <td className="px-8 py-6"><p className="text-sm font-black text-white italic">{t.amount.toLocaleString()}đ</p></td>
                             <td className="px-8 py-6"><StatusBadge status={t.status} /></td>
                             <td className="px-8 py-6">{t.status === 'PENDING' && <button onClick={() => setReportingTx(t)} className="flex items-center gap-2 text-red-500 hover:text-white transition-colors text-[9px] font-black uppercase"><AlertTriangle size={14} /> Báo lỗi</button>}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}
        </div>
      </div>

      {reportingTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="glass rounded-[40px] w-full max-w-lg p-10 border border-red-500/30 shadow-2xl">
              <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Khiếu nại giao dịch</h2><button onClick={() => setReportingTx(null)} className="text-slate-600 hover:text-white"><X size={28} /></button></div>
              <div className="space-y-8">
                 <div className="bg-[#0a0f1e] p-6 rounded-3xl border border-slate-900">
                    <p className="text-[10px] font-black text-slate-600 uppercase italic text-center mb-4 tracking-widest">Tải ảnh minh chứng chuyển khoản (Bill)</p>
                    <div className="relative group h-48 bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl overflow-hidden flex items-center justify-center">
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e: any) => {
                         const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = () => setReportBill(r.result as string); r.readAsDataURL(f); }
                       }} />
                       {reportBill ? <img src={reportBill} className="w-full h-full object-cover" /> : <><Upload size={32} className="text-slate-700" /><span className="text-[10px] font-black uppercase ml-3">Chọn ảnh bill</span></>}
                    </div>
                 </div>
                 <textarea className="w-full bg-[#0a0f1e] border border-slate-800 rounded-2xl p-5 text-xs text-white outline-none focus:border-red-500 h-28" placeholder="Mô tả lỗi gặp phải..." value={reportMsg} onChange={e => setReportMsg(e.target.value)} />
                 <button onClick={handleSendReport} className="w-full py-5 bg-red-600 text-white rounded-[24px] font-black uppercase text-[12px] tracking-widest shadow-2xl active:scale-95 transition-all">GỬI YÊU CẦU XỬ LÝ</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const DepositInfo = ({ label, value, onCopy, highlight }: any) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-slate-600 uppercase italic tracking-widest">{label}</p>
    <div className="flex items-center gap-3">
      <p className={`text-xl font-black tracking-tighter ${highlight ? 'text-amber-500 italic' : 'text-white'}`}>{value}</p>
      <button onClick={onCopy} className="text-amber-500 hover:text-white transition-colors"><Copy size={16} /></button>
    </div>
  </div>
);

const WalletInput = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-500 uppercase ml-4 italic tracking-widest">{label}</label>
    <input className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-4 px-6 text-xs font-bold text-white outline-none focus:border-amber-500 transition-all" {...props} onChange={e => props.onChange(e.target.value)} />
  </div>
);

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  const styles = {
    PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    SUCCESS: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
    REPORTED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    EXPIRED: 'bg-slate-800 text-slate-500 border-slate-700'
  };
  return <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider ${styles[status]}`}>{status}</span>;
};

export default WalletPage;
