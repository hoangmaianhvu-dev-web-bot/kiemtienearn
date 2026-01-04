
import React, { useState } from 'react';
import { ShoppingBag, Star, Zap, ShieldCheck, Search, ShoppingCart, Info, TrendingUp } from 'lucide-react';

const products = [
  { id: 'g1', name: 'Garena Card 20.000đ', basePrice: 20000, category: 'Thẻ Game' },
  { id: 'g2', name: 'Garena Card 50.000đ', basePrice: 50000, category: 'Thẻ Game' },
  { id: 'g3', name: 'Garena Card 100.000đ', basePrice: 100000, category: 'Thẻ Game' },
  { id: 'g4', name: 'Garena Card 200.000đ', basePrice: 200000, category: 'Thẻ Game' },
  { id: 'g5', name: 'Garena Card 500.000đ', basePrice: 500000, category: 'Thẻ Game' },
  { id: 'v1', name: '999 Quân Huy (Liên Quân)', basePrice: 100000, category: 'Vật phẩm' },
  { id: 'v2', name: 'Gói Kim Cương (Free Fire)', basePrice: 40000, category: 'Vật phẩm' },
  { id: 'v3', name: 'Skin SSS Tuyệt Sắc', basePrice: 300000, category: 'Vật phẩm' },
];

const ShopPage: React.FC<{ balance: number }> = ({ balance }) => {
  const [activeCat, setActiveCat] = useState('Tất cả');

  // Logic: Giá mua = Mệnh giá + 10% (cộng thêm vào giá mua)
  const calculateFinalPrice = (base: number) => base + (base * 0.1);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Banner */}
      <div className="relative rounded-[40px] p-12 md:p-20 overflow-hidden border border-amber-500/10 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 select-none pointer-events-none">
          <ShoppingBag size={400} className="text-amber-500" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-3 bg-amber-500 text-slate-950 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8 shadow-2xl shadow-amber-500/20">
            <TrendingUp size={16} />
            <span>Phí dịch vụ ưu đãi: +10%</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight uppercase">Cửa hàng <br /><span className="text-amber-500">Tự động 100%</span></h1>
          <p className="text-slate-500 text-xl mb-12 leading-relaxed font-bold uppercase tracking-tight">Dùng số dư Affiliate hoặc Tiền nạp để mua thẻ ngay. Mã thẻ trả về ngay lập tức sau khi xác nhận thanh toán.</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-4 text-emerald-500 font-black bg-emerald-500/5 border border-emerald-500/20 px-8 py-4 rounded-2xl">
              <ShieldCheck size={24} />
              <span className="text-xs uppercase tracking-widest">Giao dịch an toàn</span>
            </div>
            <div className="flex items-center space-x-4 text-blue-500 font-black bg-blue-500/5 border border-blue-500/20 px-8 py-4 rounded-2xl">
              <Star size={24} />
              <span className="text-xs uppercase tracking-widest">Mã thẻ chính hãng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => {
          const finalPrice = calculateFinalPrice(product.basePrice);
          return (
            <div key={product.id} className="glass rounded-[40px] overflow-hidden border-slate-800 hover:border-amber-500/40 transition-all group flex flex-col hover:-translate-y-2 duration-500">
              <div className="relative aspect-square overflow-hidden bg-slate-950 flex items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 w-full h-full border-4 border-slate-900 rounded-[32px] flex flex-col items-center justify-center space-y-4">
                   <Zap size={60} className="text-slate-800 group-hover:text-amber-500 transition-colors" />
                   <p className="text-3xl font-black text-white">{ (product.basePrice / 1000) }K</p>
                </div>
                <div className="absolute top-8 left-8 bg-amber-500 text-slate-950 text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl">
                  +10% FEE
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">{product.category}</p>
                <h3 className="font-black text-xl mb-6 text-white tracking-tight">{product.name}</h3>
                
                <div className="bg-slate-950 p-5 rounded-3xl border border-slate-900 mb-8">
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Giá thanh toán</p>
                        <p className="text-2xl font-black text-amber-500">{finalPrice.toLocaleString()}đ</p>
                      </div>
                      <p className="text-[10px] text-slate-800 line-through mb-1 font-bold italic">{product.basePrice.toLocaleString()}đ</p>
                   </div>
                </div>

                <button 
                  disabled={balance < finalPrice}
                  className={`mt-auto w-full py-5 rounded-[24px] font-black transition-all flex items-center justify-center space-x-3 shadow-2xl ${balance >= finalPrice ? 'bg-white text-slate-950 hover:bg-amber-500 shadow-white/5 active:scale-95' : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'}`}
                >
                  <ShoppingCart size={20} />
                  <span className="uppercase tracking-[0.2em] text-xs">{balance >= finalPrice ? 'Mua ngay' : 'Không đủ số dư'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-10 bg-slate-950 border border-slate-900 rounded-[48px] flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex items-center space-x-6 text-center lg:text-left">
          <div className="p-5 bg-amber-500/10 rounded-3xl text-amber-500">
            <Info size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Cần nạp thêm tiền?</h4>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Sử dụng hệ thống VietQR tự động để nạp tiền vào tài khoản ngay.</p>
          </div>
        </div>
        <button className="w-full lg:w-auto px-16 py-5 bg-amber-500 text-slate-950 font-black rounded-[24px] hover:bg-white transition-all shadow-2xl shadow-amber-500/20 uppercase tracking-[0.2em] text-xs">
          Nạp tiền ngay
        </button>
      </div>
    </div>
  );
};

export default ShopPage;
