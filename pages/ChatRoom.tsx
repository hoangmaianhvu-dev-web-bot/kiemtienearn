
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, ShieldCheck, AlertTriangle, Image, Paperclip, ShieldAlert, UserCheck, X, Clock } from 'lucide-react';
import { ChatMessage, User } from '../types.ts';

const FORBIDDEN_WORDS = ['scam', 'lừa đảo', '18+', 'khiêu dâm', 'sex', 'porn', 'link rác', 'hack', 'cave', 'phim nguoi lon'];

const ChatRoom: React.FC<{ user: User }> = ({ user: currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', userId: 'system', userName: 'Hệ Thống', role: 'ADMIN', text: 'Chào mừng bạn đến với GarenaEarn Chat!', timestamp: 'System', type: 'SYSTEM' },
    { id: '2', userId: 'bot-guard', userName: 'GARENA GUARD', role: 'ADMIN', text: 'Bot kiểm duyệt đang trực tuyến. Hệ thống cấm SCAM/18+ đang bật.', timestamp: 'Bot', type: 'SYSTEM' },
  ]);
  const [inputText, setInputText] = useState('');
  const [warnings, setWarnings] = useState(() => parseInt(localStorage.getItem(`warn_${currentUser.id}`) || '0'));
  const [banStatus, setBanStatus] = useState<{ isBanned: boolean, until: string | null, reason: string }>(() => {
    const saved = localStorage.getItem(`ban_${currentUser.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.until && new Date(parsed.until) > new Date()) return parsed;
    }
    return { isBanned: false, until: null, reason: '' };
  });
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleViolation = (reason: string) => {
    const newWarns = warnings + 1;
    setWarnings(newWarns);
    localStorage.setItem(`warn_${currentUser.id}`, newWarns.toString());

    let banUntil: Date | null = null;
    let banReason = reason;

    if (newWarns === 1) {
       notifyBotMessage(`CẢNH CÁO: @${currentUser.name}, tin nhắn của bạn chứa nội dung cấm (${newWarns}/3).`);
    } else if (newWarns === 2) {
       banUntil = new Date(Date.now() + 10 * 60 * 1000);
       banReason = "Vi phạm lần 2: Mute 10 phút";
       applyBan(true, banUntil.toISOString(), banReason);
    } else if (newWarns === 3) {
       banUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
       banReason = "Vi phạm lần 3: Khóa chat 24 giờ";
       applyBan(true, banUntil.toISOString(), banReason);
    } else {
       applyBan(true, new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(), "Vi phạm nghiêm trọng: KHÓA VĨNH VIỄN");
    }
  };

  const applyBan = (isBanned: boolean, until: string | null, reason: string) => {
    const status = { isBanned, until, reason };
    setBanStatus(status);
    localStorage.setItem(`ban_${currentUser.id}`, JSON.stringify(status));
    notifyBotMessage(`BOT LOG: ${currentUser.name} bị xử phạt: ${reason}`);
  };

  const notifyBotMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: 'bot-' + Date.now(),
      userId: 'bot-guard',
      userName: 'GARENA GUARD',
      role: 'ADMIN',
      text,
      timestamp: 'Now',
      type: 'SYSTEM'
    }]);
  };

  const handleSendMessage = (e?: React.FormEvent, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT', data?: string, fileName?: string) => {
    e?.preventDefault();
    if (banStatus.isBanned && banStatus.until && new Date(banStatus.until) > new Date()) return;
    const text = type === 'TEXT' ? inputText : '';
    if (type === 'TEXT' && !text.trim()) return;
    const lowerText = text.toLowerCase();
    const isViolating = FORBIDDEN_WORDS.some(word => lowerText.includes(word));
    if (isViolating) {
      handleViolation("Nội dung cấm (SCAM/18+)");
      setInputText('');
      return;
    }
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      text,
      timestamp: new Date().toLocaleTimeString(),
      type,
      imageUrl: type === 'IMAGE' ? data : undefined,
      fileUrl: type === 'FILE' ? data : undefined,
      fileName: type === 'FILE' ? fileName : undefined
    };
    setMessages([...messages, newMessage]);
    if (type === 'TEXT') setInputText('');
  };

  const triggerUpload = (type: 'IMAGE' | 'FILE') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'IMAGE' ? 'image/*' : '*/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => handleSendMessage(undefined, type, reader.result as string, file.name);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl relative">
            <MessageSquare className="text-white" size={24} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Phòng Chat Community</h1>
            <p className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1">
              <ShieldCheck size={12} /> Bảo mật đa lớp
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 glass rounded-[40px] border-slate-800 flex flex-col overflow-hidden relative">
        {banStatus.isBanned && banStatus.until && new Date(banStatus.until) > new Date() && (
           <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-500">
              <ShieldAlert size={80} className="text-red-500 mb-6" />
              <h2 className="text-4xl font-black text-white uppercase italic mb-2">Truy cập bị hạn chế</h2>
              <p className="text-amber-500 font-black uppercase tracking-widest text-lg mb-4">{banStatus.reason}</p>
              <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-xs">
                <Clock size={16} />
                <span>Hết hạn: {new Date(banStatus.until).toLocaleString()}</span>
              </div>
           </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.userId === currentUser.id ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center space-x-2 mb-2">
                 {msg.role === 'ADMIN' && <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Admin</span>}
                 {msg.userId === 'bot-guard' && <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Guard Bot</span>}
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{msg.userName}</span>
              </div>
              <div className={`max-w-[75%] px-6 py-3 rounded-[24px] text-sm font-bold ${
                msg.userId === 'bot-guard' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 italic' :
                msg.userId === 'system' ? 'bg-amber-500/10 text-amber-500' : 
                msg.userId === currentUser.id ? 'bg-white text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300'
              }`}>
                {msg.type === 'TEXT' && msg.text}
                {msg.type === 'IMAGE' && <img src={msg.imageUrl} className="rounded-xl max-w-full" alt="chat" />}
                {msg.type === 'FILE' && (
                  <div className="flex items-center gap-3"><Paperclip size={16} /><span className="text-xs underline truncate">{msg.fileName}</span></div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-slate-950 border-t border-slate-900">
          <div className="flex items-center gap-4 mb-4">
             <button onClick={() => triggerUpload('IMAGE')} className="p-2 text-slate-600 hover:text-amber-500 transition-colors"><Image size={20} /></button>
             <button onClick={() => triggerUpload('FILE')} className="p-2 text-slate-600 hover:text-blue-500 transition-colors"><Paperclip size={20} /></button>
          </div>
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input 
              type="text" 
              placeholder="Nhập nội dung... (Cấm SCAM/18+)" 
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
            />
            <button type="submit" className="bg-amber-500 hover:bg-white text-slate-950 p-4 rounded-2xl transition-all shadow-xl shadow-amber-500/20"><Send size={24} /></button>
          </form>
          <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase text-slate-700">
             <div className="flex items-center gap-2"><AlertTriangle size={12} /> Cảnh cáo: {warnings}/3</div>
             <div className="flex items-center gap-2"><UserCheck size={12} /> Hệ thống kiểm soát thời gian thực</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
