
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Thêm Error Boundary đơn giản bằng cách bọc trong try-catch nếu cần, 
// nhưng React 18 render mặc định đã khá an toàn. 
// Đảm bảo không có lỗi render rác ngay từ đầu.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
