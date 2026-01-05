
import React, { useState, useEffect } from 'react';
import { Store, ShieldCheck, Zap, ShoppingCart, Star, ExternalLink, Gamepad2, Package } from 'lucide-react';
import { MarketProduct, ProductType, User } from '../types';
import { useNotify } from '../App.tsx';

const Marketplace: React.FC<{ user: User }> = ({ user }) => {
  const { notify, updateUser } = useNotify();
  const [activeTab, setActiveTab] = useState<ProductType>('GAME');
  const [products, setProducts] = useState<MarketProduct[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ge_market_db');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      const initial: MarketProduct[] = [
        { id: 'm1', title: 'Acc Liên Quân - Full Skin SSS', price: 2500000, description: 'Verified', image: 'https://picsum.photos/seed/lq1/400/300', tag: 'LIMITED', seller: 'ADMIN', type: 'GAME', gameCategory: 'ACC', externalUrl: 'https://garena.vn' },
        { id: 'm2', title: 'Aimlock Pro v4.2 - No Ban', price: 500000, description: 'Secure', image: 'https://picsum.photos/seed/aim/400/300', tag: 'HOT', seller: 'ADMIN', type: 'GAME', gameCategory: 'AIM', externalUrl: 'https://garena.vn' },
        { id: 'm4', title: 'Áo Khoác Garena Esports 2025', price: 450000, description: 'Vật phẩm thực tế', image: 'https://picsum.photos/seed/jacket/400/300', tag: 'OFFICIAL', seller: 'ADMIN', type: 'GOODS', externalUrl: 'https://shopee.vn' },
      ];
      setProducts(initial);
      localStorage.setItem('ge_market_db', JSON.stringify(initial));
    }
  }, []);

  const handleBuy = (p: MarketProduct) => {
    if (p.type === 'GOODS') {
      notify(`Đang chuyển hướng sang link mua ngoài: ${String(p.title)}`, "INFO");
      if (p.externalUrl) {
        setTimeout(() => window.open(String(p.externalUrl), '_blank'), 1500);
      }
      return;
    }

    if (Number(user.balance) < Number(p.price)) { 
      notify("Số dư của bạn không đủ!", "ERROR"); 
      return; 
    }

    const newBalance = Number(user.balance) - Number(p.price);
    updateUser({ ...user, balance: newBalance });

    notify(`Thanh toán thành công. Đang lấy dữ liệu sản phẩm...`, "SUCCESS");

    if (p.externalUrl) {
      setTimeout(() => {
        window.open(String(p.externalUrl), '_blank');
        notify("Hệ thống đã tự động chuyển hướng đến link sản phẩm.", "INFO");
      }, 2000);
    }
  };

  const filtered = products.filter(p => p.type === activeTab);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Chợ <span className="text-amber-500">Giao Dịch</span></h1>
          <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.4em] mt-4 italic">XÁC THỰC BỞI GARENAEARN NODE</p>
        </div>
        
        <div className="flex bg-[#0a0f1e] p-1.5 rounded-[24px] border border-slate-800 shadow-2xl">
           <button onClick={() => setActiveTab('GAME')} className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'GAME' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-600 hover:text-white'}`}>
              <Gamepad2 size={16} /> <span>GAME HUB</span>
           </button>
           <button onClick={() => setActiveTab('GOODS')} className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'GOODS' ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-600 hover:text-white'}`}>
              <Package size={16} /> <span>ĐỒ DÙNG</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(p => (
          <div key={p.id} className="glass rounded-[48px] overflow-hidden border-slate-800/50 hover:border-amber-500/30 transition-all group flex flex-col shadow-2xl hover:-translate-y-2 duration-500">
            <div className="relative h-60 overflow-hidden bg-slate-950">
               <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60" alt="product" />
               <div className="absolute top-8 left-8">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${p.type === 'GOODS' ? 'bg-orange-600' : 'bg-blue-600'} text-white`}>{String(p.tag)}</span>
               </div>
            </div>
            
            <div className="p-10 flex-1 flex flex-col -mt-10 relative z-10">
               <div className="flex items-center space-x-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-4 italic">
                  <ShieldCheck size={14} /> <span>BẢO HIỂM ADMIN</span>
               </div>
               <h3 className="text-xl font-black text-white mb-6 line-clamp-2 leading-tight uppercase italic tracking-tighter">{String(p.title)}</h3>
               
               <div className="mt-auto space-y-8">
                  <div className="flex items-end justify-between border-b border-slate-900 pb-6">
                     <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">GIÁ BÁN</p>
                        <p className="text-2xl font-black text-white tracking-tighter italic">{Number(p.price || 0).toLocaleString()}đ</p>
                     </div>
                     <div className="text-right">
                        <div className="flex items-center space-x-1 text-amber-500 mb-1">
                           <Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" />
                        </div>
                        <p className="text-[8px] font-black text-slate-700 uppercase">UY TÍN</p>
                     </div>
                  </div>
                  
                  <button 
                    onClick={() => handleBuy(p)}
                    className={`w-full py-5 rounded-[28px] font-black flex items-center justify-center space-x-3 transition-all shadow-2xl ${p.type === 'GOODS' ? 'bg-emerald-600 hover:bg-white hover:text-emerald-600 text-white' : Number(user.balance) >= Number(p.price) ? 'bg-white text-slate-950 hover:bg-amber-500' : 'bg-slate-900 text-slate-700 cursor-not-allowed'}`}
                  >
                    {p.type === 'GOODS' ? <ExternalLink size={20} /> : <ShoppingCart size={20} />}
                    <span className="uppercase tracking-[0.2em] text-[11px] italic">{p.type === 'GOODS' ? 'MUA NGOÀI WEB' : Number(user.balance) >= Number(p.price) ? 'MUA NGAY' : 'HẾT SỐ DƯ'}</span>
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
