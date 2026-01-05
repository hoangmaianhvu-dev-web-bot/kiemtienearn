
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Xóa loader ban đầu sau khi app mount
const hideLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
};

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  // Thực hiện sau khi render lần đầu
  requestAnimationFrame(hideLoader);
} catch (error) {
  console.error("Critical Render Error:", error);
  const rootDiv = document.getElementById('root');
  if (rootDiv) {
    rootDiv.innerHTML = `<div style="padding: 20px; color: red; text-align: center; font-family: sans-serif;">
      <h1>Lỗi Hệ Thống (Critical Error)</h1>
      <p>Ứng dụng không thể khởi động. Vui lòng thử lại sau.</p>
      <pre style="text-align: left; background: #222; padding: 10px; border-radius: 8px;">${String(error)}</pre>
    </div>`;
  }
}
