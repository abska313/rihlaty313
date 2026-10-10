import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error Boundary to prevent any blank white screen
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ABSKA Runtime Error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0D] text-[#F4F0F1] flex items-center justify-center p-6 text-right" dir="rtl">
          <div className="max-w-md w-full bg-[#151316] border border-[#6D1028] p-6 rounded-3xl space-y-4 shadow-2xl">
            <h2 className="text-base font-black text-[#F4F0F1]">حدث تنبيه في تحميل الواجهة</h2>
            <p className="text-xs text-[#AAA2A7] leading-relaxed">
              واجه المتصفح صعوبة في تشغيل بعض العمليات المحلية. بياناتك محفوظة بأمان. يمكنك إعادة تحميل الصفحة للمتابعة.
            </p>
            <div className="p-3 bg-[#0B0B0D] rounded-xl text-[11px] text-[#922D48] font-mono break-all">
              {this.state.error?.message || 'غير محدد'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 rounded-xl bg-[#6D1028] text-white text-xs font-bold hover:bg-[#922D48] transition"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Register PWA Service Worker dynamically using import.meta.env.BASE_URL
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL || './'}service-worker.js`;
    navigator.serviceWorker
      .register(swPath)
      .then((reg) => {
        console.log('[ABSKA] Service Worker registered successfully with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[ABSKA] Service Worker registration skipped:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

