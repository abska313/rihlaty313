import React, { useState } from 'react';
import { Bell, Check, ChevronLeft, X } from 'lucide-react';
import { TaskItem, UserProfile } from '../types';

interface InAppRemindersProps {
  profile: UserProfile;
  todayTasks: TaskItem[];
  currentDay: number;
  onNavigateToTasks: () => void;
  onNavigateToReviews: () => void;
}

export const InAppReminders: React.FC<InAppRemindersProps> = ({
  profile,
  todayTasks,
  currentDay,
  onNavigateToTasks,
  onNavigateToReviews,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (!profile.inAppRemindersEnabled || dismissed || !profile.isJourneyStarted) {
    return null;
  }

  const pendingTasksCount = todayTasks.filter((t) => t.status === 'pending').length;
  const isEndOfStage = currentDay % 30 === 0 || currentDay === 214;

  let reminderText = '';
  let reminderAction: (() => void) | null = null;
  let actionLabel = '';

  if (isEndOfStage) {
    reminderText = `أنت في اليوم ${currentDay} — نهاية مرحلة! حان وقت تسجيل مراجعتك المرحلية والاحتفاء بتقدمك.`;
    reminderAction = onNavigateToReviews;
    actionLabel = 'فتح المراجعة';
  } else if (pendingTasksCount > 0) {
    reminderText = `لديك ${pendingTasksCount} مهام متبقية لليوم. كل خطوة صغيرة تصنع فارقًا حقيقيًا.`;
    reminderAction = onNavigateToTasks;
    actionLabel = 'عرض المهام';
  } else {
    // No urgent reminder needed
    return null;
  }

  return (
    <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#151316] to-[#20151b] border border-[#6D1028]/50 shadow-md flex items-center justify-between gap-3 text-right">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[#3B0A18] text-[#922D48] shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <p className="text-xs text-[#F4F0F1] leading-relaxed">{reminderText}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {reminderAction && (
          <button
            onClick={reminderAction}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#6D1028] hover:bg-[#922D48] text-[#F4F0F1] text-[11px] font-bold transition"
          >
            <span>{actionLabel}</span>
            <ChevronLeft className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg text-[#AAA2A7] hover:text-[#F4F0F1] hover:bg-[#30262B] transition"
          title="إغلاق التذكير"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
