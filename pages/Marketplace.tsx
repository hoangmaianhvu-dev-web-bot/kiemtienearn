
import React, { useState, useEffect } from 'react';
import { Store, ShieldCheck, Zap, ShoppingCart, Star, Filter, Search, ExternalLink, Box, Gamepad2, Package } from 'lucide-react';
import { MarketProduct, ProductType } from '../types';
import { useNotify } from '../App';

const Marketplace: React.FC<{ balance: number }> = ({ balance }) => {
  const { notify } = useNotify();
  const [activeTab, setActiveTab] = useState<ProductType>('GAME');
  const [products, setProducts] = useState<MarketProduct[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ge_market_db');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      const initial: MarketProduct[] = [
        { id: 'm1', title: 'Acc Liên Quân - Full Skin SSS - Top 1 SV', price: 2500000, description: 'Verified', image: 'https://picsum.photos/seed/lq1/400/300', tag: 'LIMITED', seller: 'ADMIN', type: 'GAME', gameCategory: 'ACC' },
        { id: 'm2', title: 'Aimlock Pro v4.2 - No Recoil / No Ban', price: 500000, description: 'Secure', image: 'https://picsum.photos/seed/aim/400/300', tag: 'HOT', seller: 'ADMIN', type: 'GAME', gameCategory: 'AIM' },
        { id: 'm3', title: 'Buff Màn Hình iPad View - 120FPS', price: 200000, description: 'Stable', image: 'https://picsum.photos/seed/buff/400/300', tag: 'NEW', seller: 'ADMIN', type: 'GAME', gameCategory: 'BUFF' },
        { id: 'm4', title: 'Áo Khoác Garena Esports 2025', price: 450000, description: 'Vật phẩm thực tế', image: 'https://picsum.photos/seed/jacket/400/300', tag: 'OFFICIAL', seller: 'ADMIN', type: 'GOODS', externalUrl: 'https://shopee.vn' },
      ];
      setProducts(initial);
      localStorage.setItem('ge_market_db', JSON.stringify(initial));
    }
  }, []);

  const handleBuy = (p: MarketProduct) => {
    if (p.type === 'GOODS') {
      notify(`Đang chuyển hướng sang link mua ngoài: ${p.title}`, "INFO");
      setTimeout(() => window.open(p.externalUrl, '_blank'), 1000);
      return;
    }
    if (balance < p.price) { notify("Số dư của bạn không đủ!", "ERROR"); return; }
    notify(`Yêu cầu mua ${p.title} đã được gửi! Admin sẽ gửi thông tin qua Telegram.`, "SUCCESS");
  };

  const filtered = products.filter(p => p.type === activeTab);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Kho Hàng <span className="text-amber-500">ƯU ĐÃI</span></h1>
          <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.4em] mt-4">HỆ THỐNG TRUNG GIAN XÁC THỰC BỞI GARENAEARN</p>
        </div>
        
        <div className="flex bg-[#0a0f1e] p-1.5 rounded-[24px] border border-slate-800 shadow-2xl">
           <button onClick={() => setActiveTab('GAME')} className={`flex items-center gap-3 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'GAME' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-600 hover:text-white'}`}>
              <Gamepad2 size={16} /> <span>SẢN PHẨM GAME</span>
           </button>
           <button onClick={() => setActiveTab('GOODS')} className={`flex items-center gap-3 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'GOODS' ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'text-slate-600 hover:text-white'}`}>
              <Package size={16} /> <span>ĐỒ DÙNG</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(p => (
          <div key={p.id} className="glass rounded-[48px] overflow-hidden border-slate-800/50 hover:border-amber-500/30 transition-all group flex flex-col shadow-2xl hover:-translate-y-2 duration-500">
            <div className="relative h-64 overflow-hidden bg-slate-950">
               <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
               <div className="absolute top-8 left-8">
                  <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl ${p.type === 'GOODS' ? 'bg-orange-600' : 'bg-blue-600'} text-white`}>{p.tag}</span>
               </div>
               {p.type === 'GAME' && p.gameCategory && (
                 <div className="absolute bottom-4 right-8">
                    <span className="bg-slate-900/80 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-xl text-[8px] font-black text-white uppercase italic tracking-widest">{p.gameCategory}</span>
                 </div>
               )}
            </div>
            
            <div className="p-10 flex-1 flex flex-col -mt-12 relative z-10">
               <div className="flex items-center space-x-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-4">
                  <ShieldCheck size={14} />
                  <span>VERIFIED BY ADMIN</span>
               </div>
               <h3 className="text-xl font-black text-white mb-6 line-clamp-2 leading-tight group-hover:text-amber-500 transition-colors uppercase italic tracking-tighter">{p.title}</h3>
               
               <div className="mt-auto space-y-8">
                  <div className="flex items-end justify-between border-b border-slate-900 pb-6">
                     <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">GIÁ GIAO DỊCH</p>
                        <p className="text-3xl font-black text-white tracking-tighter italic">{p.price.toLocaleString()}đ</p>
                     </div>
                     <div className="text-right">
                        <div className="flex items-center space-x-1 text-amber-500 mb-1">
                           <Star size={10} fill="currentColor" />
                           <Star size={10} fill="currentColor" />
                           <Star size={10} fill="currentColor" />
                           <Star size={10} fill="currentColor" />
                           <Star size={10} fill="currentColor" />
                        </div>
                        <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">TRUST 100%</p>
                     </div>
                  </div>
                  
                  <button 
                    onClick={() => handleBuy(p)}
                    className={`w-full py-5 rounded-[28px] font-black flex items-center justify-center space-x-3 transition-all shadow-2xl ${p.type === 'GOODS' ? 'bg-emerald-600 hover:bg-white hover:text-emerald-600 text-white' : balance >= p.price ? 'bg-white text-slate-950 hover:bg-amber-500' : 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed'}`}
                  >
                    {p.type === 'GOODS' ? <ExternalLink size={20} /> : <ShoppingCart size={20} />}
                    <span className="uppercase tracking-[0.2em] text-[11px] italic">{p.type === 'GOODS' ? 'MUA NGOÀI WEB' : balance >= p.price ? 'MUA NGAY' : 'KHÔNG ĐỦ SỐ DƯ'}</span>
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
