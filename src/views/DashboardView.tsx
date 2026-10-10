import React from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Circle,
  Clock,
  Compass,
  FileSignature,
  Flame,
  HeartCrack,
  Moon,
  Plus,
  RotateCcw,
  Shield,
  Sparkles,
  TrendingUp,
  Wrench,
  Zap,
} from 'lucide-react';
import { NavTab } from '../components/Navigation';
import { calculateUserRank, STAGES_DEFINITIONS } from '../services/sampleData';
import {
  AchievementItem,
  BookItem,
  JournalEntry,
  PersonalChallenge,
  SkillProject,
  StageContract,
  StageReviewReport,
  TaskItem,
  UserProfile,
} from '../types';
import { getJourneyDayInfo } from '../utils/journeyMath';

interface DashboardViewProps {
  profile: UserProfile;
  tasks: TaskItem[];
  journalEntries: JournalEntry[];
  reviews: StageReviewReport[];
  contracts: StageContract[];
  books: BookItem[];
  projects: SkillProject[];
  challenges: PersonalChallenge[];
  totalXP: number;
  streakCount: number;
  onNavigate: (tab: NavTab) => void;
  onOpenToughDay: () => void;
  onOpenRelapseRescue: () => void;
  onOpenQuickJournal: () => void;
  onToggleTask: (task: TaskItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  tasks,
  journalEntries,
  reviews,
  contracts,
  books,
  projects,
  challenges,
  totalXP,
  streakCount,
  onNavigate,
  onOpenToughDay,
  onOpenRelapseRescue,
  onOpenQuickJournal,
  onToggleTask,
}) => {
  const dayInfo = getJourneyDayInfo(profile);
  const { rank, progressPercent: rankProgress } = calculateUserRank(totalXP);

  // Today's tasks (matched by currentDay or today's date)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.dayNumber === dayInfo.currentDay || t.date === todayStr);
  const completedTodayTasks = todayTasks.filter((t) => t.status === 'completed');
  const todayCompletionRate =
    todayTasks.length > 0 ? Math.round((completedTodayTasks.length / todayTasks.length) * 100) : 0;

  // Recent energy from today's journal or default
  const todayJournal = journalEntries.find((j) => j.dayNumber === dayInfo.currentDay || j.date === todayStr);
  const todayEnergy = todayJournal?.energyLevel ?? null;

  // Active challenge
  const activeChallenge = challenges.find((c) => c.status === 'active') || challenges[0];

  // Current stage contract
  const currentContract = contracts.find((c) => c.stageNumber === dayInfo.currentStage.stageNumber);

  // Next milestone (e.g., end of current stage)
  const stageEndDay = dayInfo.currentStage.endDay;
  const daysUntilStageEnd = Math.max(0, stageEndDay - dayInfo.currentDay);

  // Recent stage review summary
  const latestReview = reviews.length > 0 ? reviews[reviews.length - 1] : null;

  return (
    <div className="space-y-6 pb-24 text-right">
      {/* 1. Hero Card: Personalized Greeting & Day Counter */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#151316] via-[#1a1216] to-[#3B0A18]/40 border border-[#30262B] p-6 shadow-xl">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#AAA2A7]">
                المرحلة {dayInfo.currentStage.stageNumber}: {dayInfo.currentStage.theme}
              </span>
            </div>
            <span className="text-xs text-[#AAA2A7]">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#F4F0F1]">
              أهلاً بك، {profile.name}
            </h1>
            <p className="text-xs text-[#AAA2A7] mt-1 leading-relaxed">
              «التقدم أهم من الكمال، والاستمرارية اليومية تصنع التحوّل الشامل.»
            </p>
          </div>

          {/* 214-Day Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#F4F0F1]">
                اليوم <span className="text-[#922D48] text-base font-black">{dayInfo.currentDay}</span> من 214
              </span>
              <span className="text-[#AAA2A7]">
                متبقي {dayInfo.remainingDays} يومًا ({dayInfo.progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#0B0B0D] overflow-hidden border border-[#30262B]">
              <div
                className="h-full bg-gradient-to-r from-[#6D1028] via-[#922D48] to-[#b83b5e] transition-all duration-500 rounded-full"
                style={{ width: `${dayInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="p-3 rounded-2xl bg-[#0B0B0D]/70 border border-[#30262B] text-center">
              <div className="text-[10px] text-[#AAA2A7] mb-0.5">الرتبة الحالية</div>
              <div className="text-xs font-bold text-[#F4F0F1] truncate">{rank.title}</div>
              <div className="text-[9px] text-[#AAA2A7]">{totalXP} XP</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0B0B0D]/70 border border-[#30262B] text-center">
              <div className="text-[10px] text-[#AAA2A7] mb-0.5">سلسلة الالتزام</div>
              <div className="text-xs font-bold text-[#F4F0F1] flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#922D48] fill-[#922D48]" />
                <span>{streakCount} أيام</span>
              </div>
              <div className="text-[9px] text-[#AAA2A7]">ثبات مستمر</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0B0B0D]/70 border border-[#30262B] text-center">
              <div className="text-[10px] text-[#AAA2A7] mb-0.5">طاقة اليوم</div>
              <div className="text-xs font-bold text-[#F4F0F1]">
                {todayEnergy !== null ? `${todayEnergy} / 5` : 'غير مسجلة'}
              </div>
              <div className="text-[9px] text-[#AAA2A7]">
                {todayEnergy && todayEnergy <= 2 ? 'وضع هادئ' : 'طاقة متزنة'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => onNavigate('tasks')}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-[#151316] hover:bg-[#20151b] border border-[#30262B] text-right transition"
        >
          <div>
            <div className="text-xs font-bold text-[#F4F0F1]">ابدأ مهام اليوم</div>
            <div className="text-[10px] text-[#AAA2A7] mt-0.5">
              {todayTasks.length - completedTodayTasks.length} مهام متبقية
            </div>
          </div>
          <div className="p-2 rounded-xl bg-[#6D1028] text-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={onOpenToughDay}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-[#151316] hover:bg-[#3B0A18]/50 border border-[#30262B] text-right transition"
        >
          <div>
            <div className="text-xs font-bold text-[#F4F0F1]">وضع اليوم الصعب</div>
            <div className="text-[10px] text-[#AAA2A7] mt-0.5">الحد الأدنى الواقعي</div>
          </div>
          <div className="p-2 rounded-xl bg-[#3B0A18] text-[#922D48]">
            <Moon className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={onOpenRelapseRescue}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-[#151316] hover:bg-[#3B0A18]/50 border border-[#30262B] text-right transition"
        >
          <div>
            <div className="text-xs font-bold text-[#F4F0F1]">العودة إلى المسار</div>
            <div className="text-[10px] text-[#AAA2A7] mt-0.5">استئناف دون تأنيب</div>
          </div>
          <div className="p-2 rounded-xl bg-[#3B0A18] text-[#922D48]">
            <HeartCrack className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={onOpenQuickJournal}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-[#151316] hover:bg-[#20151b] border border-[#30262B] text-right transition"
        >
          <div>
            <div className="text-xs font-bold text-[#F4F0F1]">تدوين وتأمل</div>
            <div className="text-[10px] text-[#AAA2A7] mt-0.5">سجل خواطرك اليوم</div>
          </div>
          <div className="p-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#AAA2A7]">
            <Compass className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* 3. Today's Key Tasks Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('tasks')}
            className="flex items-center gap-1 text-xs text-[#AAA2A7] hover:text-[#F4F0F1] transition"
          >
            <span>عرض كل المهام ({todayTasks.length})</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <h2 className="text-sm font-bold text-[#F4F0F1]">مهام اليوم (اليوم {dayInfo.currentDay})</h2>
        </div>

        {todayTasks.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#151316] border border-[#30262B] text-center space-y-3">
            <p className="text-xs text-[#AAA2A7]">لم تقم بإضافة مهام لليوم بعد. أضف أول مهمة أو ولّد مهام متدرجة.</p>
            <button
              onClick={() => onNavigate('tasks')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة مهمة لليوم</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.slice(0, 4).map((task) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                    isDone
                      ? 'bg-[#151316]/50 border-[#30262B] opacity-70'
                      : 'bg-[#151316] border-[#30262B] hover:border-[#6D1028]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTask(task)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition ${
                        isDone ? 'bg-[#6D1028] text-white' : 'border border-[#30262B] hover:border-[#6D1028]'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <div className={`text-xs font-semibold ${isDone ? 'line-through text-[#AAA2A7]' : 'text-[#F4F0F1]'}`}>
                        {task.title}
                      </div>
                      <div className="text-[10px] text-[#AAA2A7] flex items-center gap-2 mt-0.5">
                        <span>{task.estimatedMinutes} دقيقة</span>
                        <span>·</span>
                        <span>+{task.xp} XP</span>
                        {task.isMiniTask && <span className="text-[#922D48]">· مهمة مصغرة</span>}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#AAA2A7]">
                    {task.difficulty === 'easy' ? 'سهل' : task.difficulty === 'medium' ? 'متوسط' : 'تحدٍ'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Stage Status & Upcoming Milestone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Stage Contract Snapshot */}
        <div className="p-4 rounded-2xl bg-[#151316] border border-[#30262B] space-y-2.5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('contract')}
              className="text-[11px] text-[#922D48] hover:underline"
            >
              عرض العقد الكامل
            </button>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4F0F1]">
              <FileSignature className="w-4 h-4 text-[#922D48]" />
              <span>عهد المرحلة {dayInfo.currentStage.stageNumber}</span>
            </div>
          </div>
          <p className="text-xs text-[#AAA2A7] leading-relaxed">
            الهدف الرئيسي: {currentContract?.mainGoal || dayInfo.currentStage.coreObjective}
          </p>
          <div className="text-[11px] text-[#AAA2A7]">
            الحد الأدنى المقبول: <strong className="text-[#F4F0F1]">{currentContract?.minimumAcceptableStandard || 'تنفيذ خطوة واحدة مصغرة يوميًا'}</strong>
          </div>
        </div>

        {/* Milestone Countdown */}
        <div className="p-4 rounded-2xl bg-[#151316] border border-[#30262B] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#AAA2A7]">اليوم {stageEndDay}</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4F0F1]">
              <Calendar className="w-4 h-4 text-[#922D48]" />
              <span>المحطة القادمة</span>
            </div>
          </div>
          <p className="text-xs text-[#AAA2A7] leading-relaxed">
            مراجعة نهاية المرحلة {dayInfo.currentStage.stageNumber} وتوثيق التقرير المرحلي.
          </p>
          <div className="text-[11px] font-bold text-[#F4F0F1]">
            متبقٍ <strong className="text-[#922D48]">{daysUntilStageEnd}</strong> أيام للتقييم المرحلي
          </div>
        </div>
      </div>

      {/* 5. Active Challenge & Knowledge Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Active Challenge */}
        {activeChallenge && (
          <div className="p-4 rounded-2xl bg-[#151316] border border-[#30262B] space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate('challenges')}
                className="text-[11px] text-[#922D48] hover:underline"
              >
                مولّد التحديات
              </button>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4F0F1]">
                <Sparkles className="w-4 h-4 text-[#922D48]" />
                <span>التحدي المقترح</span>
              </div>
            </div>
            <h3 className="text-xs font-bold text-[#F4F0F1]">{activeChallenge.title}</h3>
            <p className="text-[11px] text-[#AAA2A7] line-clamp-2 leading-relaxed">
              {activeChallenge.description}
            </p>
          </div>
        )}

        {/* Reading & Skills Snapshot */}
        <div className="p-4 rounded-2xl bg-[#151316] border border-[#30262B] space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('reading')}
              className="text-[11px] text-[#922D48] hover:underline"
            >
              مكتبة الكتب
            </button>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4F0F1]">
              <BookOpen className="w-4 h-4 text-[#922D48]" />
              <span>المعرفة والتطبيق</span>
            </div>
          </div>
          <div className="text-xs text-[#AAA2A7] flex items-center justify-between pt-1">
            <span>الكتب المكتملة: <strong className="text-[#F4F0F1]">{books.filter((b) => b.status === 'completed').length}</strong></span>
            <span>مشاريع المهارات: <strong className="text-[#F4F0F1]">{projects.filter((p) => p.completedAt).length}</strong></span>
          </div>
          <p className="text-[11px] text-[#AAA2A7] leading-relaxed">
            المعرفة الحقيقية هي ما ينعكس في السلوك اليومي وليس مجرد عدد الصفحات.
          </p>
        </div>
      </div>
    </div>
  );
};
