# ⚡ GarenaEarn - Modern Link Shortener Platform

GarenaEarn là một nền tảng rút gọn link kiếm tiền hiện đại, được thiết kế dành riêng cho cộng đồng game thủ với khả năng đổi thưởng thẻ Garena tự động.

## ✨ Tính năng nổi bật

- **Giao diện Modern Dark Mode:** Thiết kế sang trọng, tối ưu trải nghiệm người dùng (UX/UI).
- **Hệ thống nhiệm vụ tự động:** Tích hợp Bot xử lý và duyệt nhiệm vụ thời thực.
- **Quản lý tài chính:** Nạp/Rút tiền tự động qua VietQR và đổi thẻ Garena 24/7.
- **Bảo mật tối cao:** Xác thực 2 lớp (2FA) qua Telegram và mã hóa dữ liệu đầu cuối.
- **Admin Dashboard (Root Terminal):** Quyền kiểm soát toàn bộ hệ thống dành cho quản trị viên.
- **Cơ sở dữ liệu:** Sử dụng Supabase Cloud cho tốc độ truy xuất cực nhanh.

## 🚀 Công nghệ sử dụng

- **Frontend:** React 19, Tailwind CSS, Lucide React, Recharts.
- **Backend/DB:** Supabase (PostgreSQL), Realtime Engine.
- **Package Management:** ESM.sh (No-build setup).

## 🛠 Cấu hình & Chạy dự án

1. Clone dự án:
   ```bash
   git clone https://github.com/your-username/garena-earn.git
   ```
2. Mở file `index.html` trực tiếp bằng trình duyệt hoặc sử dụng Live Server (VS Code).

## ⚠️ Lưu ý bảo mật
Dự án hiện đang sử dụng API Key Supabase trực tiếp trong `App.tsx` cho mục đích demo. Khi triển khai thực tế, vui lòng cấu hình Row Level Security (RLS) trên Supabase.

---
Developed by **AVU DEV ROOT**
