import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { TimeBlock } from '../types';

interface TimeManagerViewProps {
  timeBlocks: TimeBlock[];
  onSaveTimeBlock: (block: TimeBlock) => void;
  onDeleteTimeBlock: (id: string) => void;
}

export const TimeManagerView: React.FC<TimeManagerViewProps> = ({
  timeBlocks,
  onSaveTimeBlock,
  onDeleteTimeBlock,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TimeBlock['category']>('work');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [actualMinutes, setActualMinutes] = useState<number | undefined>(undefined);
  const [priority, setPriority] = useState<TimeBlock['priority']>('medium');
  const [notes, setNotes] = useState('');

  const currentDayBlocks = timeBlocks
    .filter((b) => b.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Calculate planned duration in minutes
  function calcDuration(start: string, end: string): number {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    return Math.max(0, (h2 * 60 + m2) - (h1 * 60 + m1));
  }

  // Conflict detector
  const conflicts: string[] = [];
  for (let i = 0; i < currentDayBlocks.length; i++) {
    for (let j = i + 1; j < currentDayBlocks.length; j++) {
      const b1 = currentDayBlocks[i];
      const b2 = currentDayBlocks[j];
      if (b1.startTime < b2.endTime && b2.startTime < b1.endTime) {
        conflicts.push(`تعارض في الوقت بين «${b1.title}» و «${b2.title}»`);
      }
    }
  }

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dur = calcDuration(startTime, endTime) || 60;

    const block: TimeBlock = {
      id: `block_${Date.now()}`,
      date: selectedDate,
      title: title.trim(),
      category,
      startTime,
      endTime,
      durationMinutes: dur,
      actualMinutes,
      priority,
      notes: notes.trim() || undefined,
    };

    onSaveTimeBlock(block);
    setShowAddModal(false);
    setTitle('');
    setNotes('');
  };

  const totalPlannedMinutes = currentDayBlocks.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalActualMinutes = currentDayBlocks.reduce((acc, curr) => acc + (curr.actualMinutes || curr.durationMinutes), 0);

  return (
    <div className="space-y-6 pb-24 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#F4F0F1]">تنظيم وإدارة الوقت</h1>
          <p className="text-xs text-[#AAA2A7] mt-0.5">
            مخطط يومي لجدولة الساعات، ومقارنة الوقت المخطط بالوقت الفعلي لكشف هدر الطاقة.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة فترة زمنية</span>
        </button>
      </div>

      {/* Date selector and Conflict Alert */}
      <div className="p-4 rounded-3xl bg-[#151316] border border-[#30262B] space-y-3">
        <div className="flex items-center justify-between">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
          />
          <span className="text-xs font-bold text-[#F4F0F1]">اليوم المحدد للمخطط</span>
        </div>

        {/* Metrics comparison */}
        <div className="grid grid-cols-2 gap-3 pt-1 text-center">
          <div className="p-2.5 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
            <div className="text-[10px] text-[#AAA2A7]">إجمالي الوقت المخطط</div>
            <div className="text-xs font-black text-[#F4F0F1] mt-0.5">
              {Math.floor(totalPlannedMinutes / 60)} س و {totalPlannedMinutes % 60} د
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
            <div className="text-[10px] text-[#AAA2A7]">الوقت الفعلي المسجل</div>
            <div className="text-xs font-black text-[#922D48] mt-0.5">
              {Math.floor(totalActualMinutes / 60)} س و {totalActualMinutes % 60} د
            </div>
          </div>
        </div>

        {/* Conflict Warning */}
        {conflicts.length > 0 && (
          <div className="p-3 rounded-2xl bg-[#3B0A18]/40 border border-[#6D1028] text-xs text-[#F4F0F1] space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>تنبيه بوجود تداخل في المواعيد:</span>
            </div>
            {conflicts.map((c, idx) => (
              <div key={idx} className="text-[11px] text-[#AAA2A7]">{c}</div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Blocks Feed */}
      {currentDayBlocks.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-3">
          <p className="text-xs text-[#AAA2A7]">لا توجد فترات زمنية مجدولة لهذا اليوم.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] text-white text-xs font-bold hover:bg-[#922D48] transition"
          >
            <Plus className="w-4 h-4" />
            <span>جدولة أول فترة</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {currentDayBlocks.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-[#151316] border border-[#30262B] flex items-center justify-between gap-3 text-right"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-[#922D48] shrink-0 font-mono text-xs font-bold">
                  {b.startTime}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F4F0F1]">{b.title}</div>
                  <div className="text-[10px] text-[#AAA2A7] flex items-center gap-2 mt-0.5">
                    <span>{b.startTime} إلى {b.endTime}</span>
                    <span>·</span>
                    <span>المخطط: {b.durationMinutes} د</span>
                    {b.actualMinutes !== undefined && (
                      <>
                        <span>·</span>
                        <span className="text-[#922D48] font-bold">الفعلي: {b.actualMinutes} د</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const actual = prompt('أدخل الوقت الفعلي المستغرق بالدقائق:', String(b.actualMinutes || b.durationMinutes));
                    if (actual !== null) {
                      onSaveTimeBlock({ ...b, actualMinutes: Number(actual) || b.durationMinutes });
                    }
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#0B0B0D] text-[10px] text-[#AAA2A7] hover:text-[#F4F0F1] border border-[#30262B]"
                >
                  تسجيل الفعلي
                </button>
                <button
                  onClick={() => onDeleteTimeBlock(b.id)}
                  className="p-1 rounded-lg text-[#AAA2A7] hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Time Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-[#0B0B0D] border border-[#30262B] p-6 text-right shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-[#AAA2A7] hover:text-[#F4F0F1]"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-bold text-[#F4F0F1]">إضافة فترة زمنية مجدولة</h3>
            </div>

            <form onSubmit={handleCreateBlock} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">النشاط</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: جلسة عمل عميق، أو تمرين لياقة"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">وقت البداية</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">وقت النهاية</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TimeBlock['category'])}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  >
                    <option value="work">دراسة / عمل</option>
                    <option value="fitness">حركة ورياضة</option>
                    <option value="reading">قراءة ومعرفة</option>
                    <option value="skill">مشروع مهارة</option>
                    <option value="sleep">نوم وراحة</option>
                    <option value="personal">وقت شخصي</option>
                    <option value="habits">عادات روتينية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الأولوية</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TimeBlock['priority'])}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  >
                    <option value="high">مرتفعة</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">منخفضة</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-md"
                >
                  حفظ الفترة في المخطط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
