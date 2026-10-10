import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6D1028] hover:bg-[#922D48] text-[#F4F0F1] text-xs font-semibold transition border border-[#922D48]/40 shadow-sm"
        title="تثبيت التطبيق على جهازك للعمل دون إنترنت"
      >
        <Download className="w-3.5 h-3.5" />
        <span>تثبيت PWA</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151316] hover:bg-[#252024] text-[#AAA2A7] hover:text-[#F4F0F1] text-xs font-medium border border-[#30262B] transition"
        >
          <Download className="w-3.5 h-3.5 text-[#922D48]" />
          <span>تثبيت على آيفون</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#151316] border border-[#30262B] p-6 text-right shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-[#AAA2A7] hover:text-[#F4F0F1] hover:bg-[#30262B]"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-base font-bold text-[#F4F0F1]">تثبيت ABSKA على iOS</h3>
              </div>
              <p className="text-xs text-[#AAA2A7] leading-relaxed mb-4">
                1. اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح سفاري بالأسفل.<br />
                2. مرّر للأسفل واضغط على <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.<br />
                3. سيعمل التطبيق كبرنامج أصلي بدون إنترنت.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#6D1028] text-[#F4F0F1] text-xs font-bold hover:bg-[#922D48] transition"
              >
                فهمت، شكرًا
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
