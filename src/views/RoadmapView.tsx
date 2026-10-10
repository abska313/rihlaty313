import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Circle,
  Flag,
  Lock,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { STAGES_DEFINITIONS, StageDefinition } from '../services/sampleData';
import { JournalEntry, StageReviewReport, TaskItem, UserProfile } from '../types';
import { getJourneyDayInfo } from '../utils/journeyMath';

interface RoadmapViewProps {
  profile: UserProfile;
  tasks: TaskItem[];
  journalEntries: JournalEntry[];
  reviews: StageReviewReport[];
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  profile,
  tasks,
  journalEntries,
  reviews,
}) => {
  const dayInfo = getJourneyDayInfo(profile);
  const [selectedDay, setSelectedDay] = useState<number>(dayInfo.currentDay);
  const [activeStageFilter, setActiveStageFilter] = useState<number>(dayInfo.currentStage.stageNumber);

  // Determine completion of days: a day is "logged & active" if tasks completed or journal recorded
  const completedDaysSet = new Set<number>();
  for (const t of tasks) {
    if (t.status === 'completed') completedDaysSet.add(t.dayNumber);
  }
  for (const j of journalEntries) {
    completedDaysSet.add(j.dayNumber);
  }

  // Selected day data
  const dayTasks = tasks.filter((t) => t.dayNumber === selectedDay);
  const dayJournal = journalEntries.find((j) => j.dayNumber === selectedDay);
  const selectedStage =
    STAGES_DEFINITIONS.find((s) => selectedDay >= s.startDay && selectedDay <= s.endDay) ||
    STAGES_DEFINITIONS[0];

  return (
    <div className="space-y-6 pb-24 text-right">
      <div>
        <h1 className="text-xl font-black text-[#F4F0F1]">خريطة رحلة الـ 214 يومًا</h1>
        <p className="text-xs text-[#AAA2A7] mt-0.5">
          رحلة بصرية مقسمة إلى 8 محطات رئيسية. الأيام لا تُعتبر مكتملة تلقائيًا، واليوم الفارغ ليس فشلاً.
        </p>
      </div>

      {/* Stage Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STAGES_DEFINITIONS.map((s) => {
          const isSelected = activeStageFilter === s.stageNumber;
          const isCurrent = dayInfo.currentStage.stageNumber === s.stageNumber;
          const isPast = dayInfo.currentDay > s.endDay;

          return (
            <button
              key={s.stageNumber}
              onClick={() => {
                setActiveStageFilter(s.stageNumber);
                setSelectedDay(s.startDay);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
                isSelected
                  ? 'bg-[#6D1028] border-[#922D48] text-white shadow-md'
                  : 'bg-[#151316] border-[#30262B] text-[#AAA2A7] hover:text-[#F4F0F1]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>المرحلة {s.stageNumber}</span>
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {isPast && <CheckCircle className="w-3 h-3 text-[#922D48]" />}
              </div>
              <div className="text-[10px] font-normal opacity-80 mt-0.5">
                الأيام {s.startDay}–{s.endDay}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Details Card */}
      {(() => {
        const stage = STAGES_DEFINITIONS.find((s) => s.stageNumber === activeStageFilter) || STAGES_DEFINITIONS[0];
        const stageReviews = reviews.find((r) => r.stageNumber === stage.stageNumber);

        return (
          <div className="p-5 rounded-3xl bg-[#151316] border border-[#30262B] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#922D48] font-bold">
                المرحلة {stage.stageNumber} / 8
              </span>
              <h2 className="text-sm font-black text-[#F4F0F1]">{stage.title}</h2>
            </div>
            <p className="text-xs text-[#AAA2A7] leading-relaxed">
              <strong>فكرة المرحلة:</strong> {stage.subtitle}.<br />
              <strong>الهدف الجوهري:</strong> {stage.coreObjective}
            </p>

            {/* Days Grid for this Stage */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] text-[#AAA2A7]">
                انقر على أي يوم لاستعراض سجلاته (المكتمل مميّز، واليوم الحالي محاط بإطار):
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                {Array.from({ length: stage.endDay - stage.startDay + 1 }, (_, i) => {
                  const dNum = stage.startDay + i;
                  const isCurrent = dNum === dayInfo.currentDay;
                  const isCompleted = completedDaysSet.has(dNum);
                  const isSelected = dNum === selectedDay;
                  const isReviewDay = dNum % 30 === 0 || dNum === 214;
                  const isFuture = dNum > dayInfo.currentDay;

                  return (
                    <button
                      key={dNum}
                      onClick={() => setSelectedDay(dNum)}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition border ${
                        isSelected
                          ? 'ring-2 ring-[#922D48] ring-offset-2 ring-offset-[#0B0B0D]'
                          : ''
                      } ${
                        isCurrent
                          ? 'bg-[#3B0A18] border-[#922D48] text-white'
                          : isCompleted
                          ? 'bg-[#6D1028]/40 border-[#6D1028] text-[#F4F0F1]'
                          : isFuture
                          ? 'bg-[#0B0B0D] border-[#30262B]/50 text-[#AAA2A7]/50'
                          : 'bg-[#151316] border-[#30262B] text-[#AAA2A7]'
                      }`}
                      title={`اليوم ${dNum}`}
                    >
                      <span>{dNum}</span>
                      {isReviewDay && (
                        <Flag className="w-2.5 h-2.5 text-[#922D48] absolute top-1 left-1" />
                      )}
                      {isCompleted && (
                        <div className="w-1 h-1 rounded-full bg-[#922D48] absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Selected Day Inspector */}
      <div className="p-5 rounded-3xl bg-[#151316] border border-[#30262B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
          <div className="text-xs text-[#AAA2A7]">
            المرحلة: <strong className="text-[#F4F0F1]">{selectedStage.theme}</strong>
          </div>
          <h3 className="text-sm font-extrabold text-[#F4F0F1] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#922D48]" />
            <span>سجل اليوم {selectedDay}</span>
            {selectedDay === dayInfo.currentDay && (
              <span className="text-[10px] text-[#922D48] font-bold mr-1">(اليوم الحالي)</span>
            )}
          </h3>
        </div>

        {/* Day Tasks Snapshot */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#F4F0F1]">المهام المسجلة في هذا اليوم:</h4>
          {dayTasks.length === 0 ? (
            <p className="text-xs text-[#AAA2A7]">لم تُسجَّل مهام مخصصة لليوم {selectedDay}.</p>
          ) : (
            <div className="space-y-1.5">
              {dayTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-xl bg-[#0B0B0D] border border-[#30262B] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${
                        t.status === 'completed' ? 'bg-[#6D1028] text-white' : 'border border-[#30262B]'
                      }`}
                    >
                      {t.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={t.status === 'completed' ? 'line-through text-[#AAA2A7]' : 'text-[#F4F0F1]'}>
                      {t.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#AAA2A7]">+{t.xp} XP</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Day Journal Snapshot */}
        {dayJournal && (
          <div className="p-3.5 rounded-2xl bg-[#0B0B0D] border border-[#30262B] space-y-1 text-xs">
            <div className="flex items-center justify-between text-[#AAA2A7]">
              <span>الطاقة: {dayJournal.energyLevel}/5</span>
              <span className="font-bold text-[#F4F0F1]">ملاحظة من دفتر الذات</span>
            </div>
            {dayJournal.whatWentWell && (
              <p className="text-[#F4F0F1] leading-relaxed pt-1">
                «{dayJournal.whatWentWell}»
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
