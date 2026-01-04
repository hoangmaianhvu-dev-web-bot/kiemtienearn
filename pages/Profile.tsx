
import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Shield, Smartphone, Camera, Key, Lock, Bell, CheckCircle2, Send, Info } from 'lucide-react';
import { UserStats } from '../types';

const Profile: React.FC<{ stats: UserStats }> = ({ stats }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ge_user_session');
    return saved ? JSON.parse(saved) : { name: 'Thành viên', email: 'guest@garena.vn', joinDate: '20/05/2025' };
  });

  const [avatar, setAvatar] = useState(user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`);
  const [telegram, setTelegram] = useState(user.telegramHandle || '');
  const [is2FA, setIs2FA] = useState(user.is2FA || false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        const updated = { ...user, avatar: reader.result };
        localStorage.setItem('ge_user_session', JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTelegram = () => {
    if (!telegram.startsWith('@')) {
      alert("Telegram Handle phải bắt đầu bằng @");
      return;
    }
    const updated = { ...user, telegramHandle: telegram };
    setUser(updated);
    localStorage.setItem('ge_user_session', JSON.stringify(updated));
    alert("Đã cập nhật Telegram! Thông báo nạp/rút sẽ được gửi qua @GarenaEarnBot");
  };

  const handleOTPChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyOTP = () => {
    if (otp.join('').length < 6) return;
    setIs2FA(true);
    setShowOTP(false);
    const updated = { ...user, is2FA: true };
    localStorage.setItem('ge_user_session', JSON.stringify(updated));
    alert("Kích hoạt bảo mật 2FA thành công!");
  };

  const start2FA = () => {
    if (!telegram) {
      alert("Vui lòng nhập Telegram trước khi kích hoạt 2FA");
      return;
    }
    setShowOTP(true);
    alert("Hệ thống đã gửi mã OTP gồm 6 số đến Telegram của bạn qua @GarenaEarnBot");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="glass rounded-[40px] p-10 relative overflow-hidden border-slate-800">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-amber-500/20 to-blue-500/20" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-[36px] bg-slate-950 p-1 mb-6 border-2 border-slate-800 group-hover:border-amber-500 transition-all overflow-hidden">
              <img src={avatar} className="w-full h-full object-cover rounded-[32px]" alt="avatar" />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-4 right-0 p-2.5 bg-amber-500 text-slate-950 rounded-2xl shadow-xl hover:scale-110 transition-transform border-4 border-slate-950"
            >
              <Camera size={16} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">{user.name}</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Member ID: {user.id?.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3">
             <Shield size={18} className="text-blue-500" /> Telegram & Bảo mật
          </h3>
          
          <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
             <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                   <Send size={20} />
                </div>
                <div className="flex-1">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Telegram Handle</p>
                   <input 
                     type="text" 
                     placeholder="@username" 
                     className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                     value={telegram}
                     onChange={(e) => setTelegram(e.target.value)}
                   />
                </div>
                <button 
                  onClick={handleSaveTelegram}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500"
                >Lưu</button>
             </div>
             <div className="flex items-start space-x-2 text-slate-500">
                <Info size={12} className="mt-0.5" />
                <p className="text-[8px] font-bold uppercase leading-relaxed">Phải bắt đầu bằng @. Bạn sẽ nhận thông báo nạp/rút và mã OTP tại đây.</p>
             </div>
          </div>

          <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                   <div className={`p-3 rounded-2xl ${is2FA ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                      <Lock size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Xác thực 2 lớp (2FA)</p>
                      <p className="text-xs font-bold text-white uppercase">{is2FA ? 'Đang hoạt động' : 'Chưa kích hoạt'}</p>
                   </div>
                </div>
                {!is2FA && (
                  <button 
                    onClick={start2FA}
                    className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest"
                  >Kích hoạt</button>
                )}
             </div>

             {showOTP && (
               <div className="pt-4 border-t border-slate-800 space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <p className="text-[9px] font-black text-amber-500 uppercase text-center tracking-widest">Nhập mã OTP từ Telegram Bot</p>
                  <div className="flex justify-center space-x-2">
                    {otp.map((digit, idx) => (
                      <input 
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        className="w-10 h-12 bg-slate-950 border border-slate-800 rounded-xl text-center text-xl font-black text-white focus:border-amber-500 outline-none transition-all"
                        value={digit}
                        onChange={(e) => handleOTPChange(idx, e.target.value)}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={verifyOTP}
                    className="w-full py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >Xác nhận mã</button>
               </div>
             )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3">
             <User size={18} className="text-amber-500" /> Thông tin cá nhân
          </h3>
          <ProfileField icon={Mail} label="Email tài khoản" value={user.email} />
          <ProfileField icon={Smartphone} label="Số điện thoại" value={user.phoneNumber || 'Chưa cập nhật'} action="Sửa" />
          <ProfileField icon={Key} label="Mật khẩu" value="••••••••••••" action="Đổi" />
          
          <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center justify-between">
             <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-slate-800 text-blue-500">
                   <Bell size={20} />
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Thông báo hệ thống</p>
                   <p className="text-xs font-bold text-white uppercase">Gửi qua Telegram Bot</p>
                </div>
             </div>
             <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon: Icon, label, value, action }: any) => (
  <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center justify-between group">
     <div className="flex items-center space-x-4">
        <div className="p-3 rounded-2xl bg-slate-800 text-slate-400 group-hover:text-amber-500 transition-colors">
           <Icon size={20} />
        </div>
        <div>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
           <p className="text-xs font-bold text-white uppercase">{value}</p>
        </div>
     </div>
     {action && (
       <button className="text-[9px] font-black text-amber-500 uppercase tracking-widest hover:underline">{action}</button>
     )}
  </div>
);

export default Profile;
