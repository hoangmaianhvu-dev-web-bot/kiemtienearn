
import React, { useState } from 'react';
import { 
  MousePointer2, 
  UserCheck, 
  BarChart3, 
  DollarSign, 
  Copy, 
  ChevronRight, 
  Info,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  UserPlus
} from 'lucide-react';
import { UserStats } from '../types';

const MyLinks: React.FC<{ stats: UserStats, userId: string }> = ({ stats, userId }) => {
  const referralLink = `https://gearn.vn/register?ref=${userId.slice(0, 5).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Kiếm Tiền <span className="text-amber-500">Affiliate</span></h1>
        <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
           <span className="hover:text-amber-500 cursor-pointer transition-colors">Trang chủ</span>
           <span>/</span>
           <span className="text-amber-500">Affiliate Center</span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {/* Stats Grid 4 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AffiliateStatCard 
              value={stats.referralClicks} 
              label="Lượt clicks" 
              icon={MousePointer2} 
              color="bg-cyan-600" 
            />
            <AffiliateStatCard 
              value={stats.referralRegistrations} 
              label="Lượt đăng ký" 
              icon={UserCheck} 
              color="bg-emerald-600" 
            />
            <AffiliateStatCard 
              value={`${stats.conversionRate}%`} 
              label="Tỉ lệ chuyển đổi" 
              icon={BarChart3} 
              color="bg-amber-500" 
            />
            <AffiliateStatCard 
              value={`${stats.totalEarnings.toLocaleString()}đ`} 
              label="Tổng hoa hồng" 
              icon={DollarSign} 
              color="bg-red-600" 
            />
          </div>

          {/* Referral Link Box */}
          <div className="glass rounded-[40px] p-8 border-slate-800">
            <div className="flex flex-col md:flex-row border border-slate-700 rounded-2xl overflow-hidden mb-6">
               <div className="bg-slate-900 px-6 py-5 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b md:border-b-0 md:border-r border-slate-700">
                  Link giới thiệu của bạn
               </div>
               <input 
                 readOnly
                 value={referralLink}
                 className="flex-1 bg-slate-950 px-6 py-5 text-sm font-bold text-white outline-none"
               />
               <button 
                 onClick={handleCopy}
                 className="bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-5 transition-all flex items-center justify-center space-x-2 active:scale-95"
               >
                 <Copy size={16} />
                 <span className="uppercase text-xs tracking-widest">Sao chép</span>
               </button>
            </div>
            
            <div className="p-6 bg-blue-600/5 border border-blue-600/20 rounded-3xl">
              <p className="text-sm text-slate-300 leading-relaxed font-medium uppercase tracking-tight">
                Giới thiệu khách hàng để nhận ngay <strong className="text-amber-500">5%</strong> hoa hồng trọn đời khi khách hàng thực hiện các giao dịch trên hệ thống.
              </p>
            </div>
          </div>

          {/* Table Area */}
          <div className="glass rounded-[40px] p-1 border-slate-800 overflow-hidden">
             <div className="p-8 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Danh sách thành viên giới thiệu</h3>
                <TrendingUp size={18} className="text-slate-600" />
             </div>
             <div className="p-20 flex flex-col items-center justify-center text-center opacity-30">
                <UserPlus size={48} className="text-slate-600 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest italic">Hiện tại chưa có thành viên nào đăng ký qua link của bạn</p>
             </div>
          </div>
        </div>

        {/* Sidebar Summary Area */}
        <div className="w-full xl:w-96 space-y-4">
          <div className="bg-blue-600 rounded-[32px] p-10 shadow-2xl shadow-blue-600/20">
             <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2 opacity-80">Số dư hoa hồng khả dụng</p>
             <h2 className="text-5xl font-black text-white tracking-tighter italic">{stats.balance.toLocaleString()}đ</h2>
          </div>
          
          <div className="glass rounded-[32px] border-slate-800 divide-y divide-slate-800">
            <SummaryItem label="Hoa hồng chờ duyệt" value={stats.pendingCommission} color="bg-cyan-600" />
            <SummaryItem label="Hoa hồng đã rút" value={stats.withdrawnCommission} color="bg-emerald-600" />
            <SummaryItem label="Tổng thu nhập" value={stats.totalEarnings} color="bg-red-600" />
          </div>

          <div className="p-6 border border-slate-800 rounded-3xl bg-slate-900/20 space-y-4">
             <div className="flex items-center space-x-2 text-amber-500">
                <Info size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Quy định Affiliate</span>
             </div>
             <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
               Tiền hoa hồng được cộng ngay khi giao dịch hoàn tất. Vui lòng rút tiền tại mục "VÍ TIỀN" của hệ thống.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AffiliateStatCard = ({ value, label, icon: Icon, color }: any) => (
  <div className={`${color} rounded-[32px] p-8 relative overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500`}>
    <div className="relative z-10">
      <h3 className="text-4xl font-black text-white tracking-tighter mb-1 italic">{value}</h3>
      <p className="text-[10px] font-black text-white uppercase tracking-widest opacity-90">{label}</p>
    </div>
    <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-20 text-white pointer-events-none">
       <Icon size={64} strokeWidth={1} />
    </div>
  </div>
);

const SummaryItem = ({ label, value, color }: any) => (
  <div className="p-6 flex items-center justify-between">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{label}:</p>
    <span className={`${color} text-white text-[10px] font-black px-4 py-1.5 rounded-xl min-w-[32px] text-center shadow-lg shadow-white/5`}>
      {value.toLocaleString()}đ
    </span>
  </div>
);

export default MyLinks;
