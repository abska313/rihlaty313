import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside aria-label="حالة الاتصال" className="fixed bottom-20 left-4 z-40 flex items-center gap-2 rounded-xl bg-[#3B0A18] border border-[#6D1028] px-3.5 py-2 text-xs font-medium text-[#F4F0F1] shadow-xl animate-fade-in">
      <WifiOff className="w-4 h-4 text-[#922D48] animate-pulse" />
      <span>وضع عدم الاتصال — البيانات تُحفظ محليًا بأمان.</span>
    </aside>
  );
};
