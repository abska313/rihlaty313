import React from 'react';
import { Award, Flame, HeartCrack, Moon, ShieldAlert, Sparkles } from 'lucide-react';
import { UserProfile, XPRecord } from '../types';
import { calculateUserRank } from '../services/sampleData';
import { getJourneyDayInfo } from '../utils/journeyMath';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  profile: UserProfile;
  totalXP: number;
  onOpenToughDay: () => void;
  onOpenRelapseRescue: () => void;
  onNavigateToAchievements: () => void;
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  totalXP,
  onOpenToughDay,
  onOpenRelapseRescue,
  onNavigateToAchievements,
  streakCount,
}) => {
  const dayInfo = getJourneyDayInfo(profile);
  const { rank } = calculateUserRank(totalXP);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0B0B0D]/90 backdrop-blur-md border-b border-[#30262B] px-4 py-3 select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Monogram */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B0A18] to-[#151316] border border-[#6D1028]/60 shadow-md">
            <span className="text-[#F4F0F1] font-black text-xs tracking-wider">214</span>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#922D48] ring-2 ring-[#0B0B0D]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wide text-[#F4F0F1]">ABSKA</span>
              {dayInfo.isStarted && (
                <span className="text-[11px] font-bold text-[#AAA2A7]">
                  اليوم <strong className="text-[#F4F0F1] font-black">{dayInfo.currentDay}</strong> / 214
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#AAA2A7] truncate max-w-[140px] sm:max-w-none">
              {dayInfo.isStarted ? dayInfo.currentStage.title.split(':')[1]?.trim() || dayInfo.currentStage.title : 'التحوّل الشامل'}
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2">
          {/* Level & Rank Badge */}
          <button
            onClick={onNavigateToAchievements}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#151316] hover:bg-[#20151b] border border-[#30262B] text-right transition"
            title="عرض الإنجازات والألقاب"
          >
            <Award className="w-3.5 h-3.5 text-[#922D48]" />
            <div className="text-right">
              <div className="text-[10px] font-bold text-[#F4F0F1]">{rank.title}</div>
              <div className="text-[9px] text-[#AAA2A7]">{totalXP} XP</div>
            </div>
          </button>

          {/* Streak Badge */}
          {dayInfo.isStarted && streakCount > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#3B0A18]/40 border border-[#6D1028]/40 text-[#F4F0F1] text-[11px] font-bold"
              title={`${streakCount} أيام متتالية من الالتزام`}
            >
              <Flame className="w-3.5 h-3.5 text-[#922D48] fill-[#922D48]" />
              <span>{streakCount}</span>
            </div>
          )}

          {/* Quick Action: Tough Day Mode */}
          {dayInfo.isStarted && (
            <button
              onClick={onOpenToughDay}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#151316] hover:bg-[#3B0A18]/60 text-[#AAA2A7] hover:text-[#F4F0F1] border border-[#30262B] text-xs font-medium transition"
              title="تفعيل وضع اليوم الصعب عند انخفاض الطاقة"
            >
              <Moon className="w-3.5 h-3.5 text-[#922D48]" />
              <span className="hidden md:inline">يوم صعب</span>
            </button>
          )}

          {/* Quick Action: Relapse Rescue */}
          {dayInfo.isStarted && (
            <button
              onClick={onOpenRelapseRescue}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#151316] hover:bg-[#3B0A18]/60 text-[#AAA2A7] hover:text-[#F4F0F1] border border-[#30262B] text-xs font-medium transition"
              title="العودة إلى المسار دون تأنيب عند الانقطاع"
            >
              <HeartCrack className="w-3.5 h-3.5 text-[#922D48]" />
              <span className="hidden md:inline">إنقاذ المسار</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
