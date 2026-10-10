import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Layers,
  MoreVertical,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { PILLARS_LIST } from '../services/sampleData';
import { generateSmartProposals } from '../services/smartGrading';
import {
  JournalEntry,
  PillarId,
  SmartAdaptationProposal,
  TaskDifficulty,
  TaskItem,
  TaskStatus,
  ToughDayLog,
  UserProfile,
} from '../types';

interface TasksViewProps {
  currentDay: number;
  tasks: TaskItem[];
  journalEntries: JournalEntry[];
  toughDays: ToughDayLog[];
  profile: UserProfile;
  onAddTask: (task: TaskItem) => void;
  onUpdateTask: (task: TaskItem) => void;
  onDeleteTask: (id: string) => void;
  onBatchAddTasks: (newTasks: TaskItem[]) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  currentDay,
  tasks,
  journalEntries,
  toughDays,
  profile,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onBatchAddTasks,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPillar, setFilterPillar] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [postponeModalTaskId, setPostponeModalTaskId] = useState<string | null>(null);
  const [postponeReason, setPostponeReason] = useState('');

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPillar, setNewPillar] = useState<PillarId>('discipline');
  const [newDifficulty, setNewDifficulty] = useState<TaskDifficulty>('medium');
  const [newMinutes, setNewMinutes] = useState(20);
  const [newScheduledTime, setNewScheduledTime] = useState('');

  // Local rule smart proposals
  const smartProposals = generateSmartProposals(tasks, journalEntries, toughDays, profile);
  const [dismissedProposals, setDismissedProposals] = useState<string[]>([]);

  const activeProposals = smartProposals.filter((p) => !dismissedProposals.includes(p.id));

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'today' && t.dayNumber !== currentDay) return false;
    if (filterStatus === 'pending' && t.status !== 'pending') return false;
    if (filterStatus === 'completed' && t.status !== 'completed') return false;
    if (filterStatus === 'postponed' && t.status !== 'postponed') return false;
    if (filterPillar !== 'all' && t.pillarId !== filterPillar) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let xp = 30;
    if (newDifficulty === 'easy') xp = 20;
    if (newDifficulty === 'hard') xp = 50;

    const task: TaskItem = {
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      pillarId: newPillar,
      difficulty: newDifficulty,
      estimatedMinutes: Number(newMinutes) || 15,
      scheduledTime: newScheduledTime || undefined,
      status: 'pending',
      xp,
      dayNumber: currentDay,
      date: new Date().toISOString().split('T')[0],
    };

    onAddTask(task);
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleToggleStatus = (t: TaskItem) => {
    if (t.status === 'completed') {
      onUpdateTask({ ...t, status: 'pending', completedAt: undefined });
    } else {
      onUpdateTask({ ...t, status: 'completed', completedAt: new Date().toISOString() });
    }
  };

  const handleConfirmPostpone = () => {
    if (!postponeModalTaskId) return;
    const task = tasks.find((t) => t.id === postponeModalTaskId);
    if (task) {
      onUpdateTask({
        ...task,
        status: 'postponed',
        postponedReason: postponeReason || 'تأجيل هادئ لتنظيم الأولويات',
      });
    }
    setPostponeModalTaskId(null);
    setPostponeReason('');
  };

  const handleGenerateDayKit = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const generated: TaskItem[] = [
      {
        id: `gen_${Date.now()}_1`,
        title: 'قراءة 15 دقيقة مع تدوين فكرة عملية',
        description: 'قراءة هادئة في كتابك الحالي واستخراج تطبيق واقعي.',
        pillarId: 'knowledge',
        difficulty: 'easy',
        estimatedMinutes: 15,
        status: 'pending',
        xp: 30,
        dayNumber: currentDay,
        date: todayStr,
      },
      {
        id: `gen_${Date.now()}_2`,
        title: 'جلسة حركة أو نشاط بدني آمن 25 دقيقة',
        description: 'مشي، تمدد، أو تمارين لياقة مناسبة لمستواك الحالي.',
        pillarId: 'fitness',
        difficulty: 'medium',
        estimatedMinutes: 25,
        status: 'pending',
        xp: 40,
        dayNumber: currentDay,
        date: todayStr,
      },
      {
        id: `gen_${Date.now()}_3`,
        title: 'تنفيذ خطوة في مشروع المهارة الشخصي',
        description: 'إنجاز مهمة فرعية واحدة محددة مسبقًا في مشروع المرحلة.',
        pillarId: 'skills',
        difficulty: 'medium',
        estimatedMinutes: 30,
        status: 'pending',
        xp: 45,
        dayNumber: currentDay,
        date: todayStr,
      },
      {
        id: `gen_${Date.now()}_4`,
        title: 'تدوين التأمل المسائي وامتنان اليوم',
        description: 'تسجيل ما سار جيدًا وما يمكن تحسينه في دفتر اكتشاف الذات.',
        pillarId: 'self_discovery',
        difficulty: 'easy',
        estimatedMinutes: 10,
        status: 'pending',
        xp: 25,
        dayNumber: currentDay,
        date: todayStr,
      },
    ];

    onBatchAddTasks(generated);
  };

  const handleAcceptProposal = (proposal: SmartAdaptationProposal) => {
    if (proposal.type === 'reduce_difficulty') {
      const title = proposal.actionPayload.taskTitle;
      tasks
        .filter((t) => t.title === title && t.status !== 'completed')
        .forEach((t) => {
          onUpdateTask({
            ...t,
            difficulty: 'easy',
            estimatedMinutes: Math.max(5, Math.round(t.estimatedMinutes / 2)),
          });
        });
    }
    setDismissedProposals([...dismissedProposals, proposal.id]);
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#F4F0F1]">نظام المهام المتدرّج</h1>
          <p className="text-xs text-[#AAA2A7] mt-0.5">
            المهام مقسمة حسب المحاور مع تكيّف ذكي بالقواعد المحلية وفق أدائك الواقعي.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-[#F4F0F1] text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مهمة</span>
          </button>

          <button
            onClick={handleGenerateDayKit}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#151316] hover:bg-[#20151b] border border-[#30262B] text-[#AAA2A7] hover:text-[#F4F0F1] text-xs font-semibold transition"
            title="توليد 4 مهام يومية متوازنة لليوم الحالي"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#922D48]" />
            <span className="hidden sm:inline">باقة اليوم المقترحة</span>
          </button>
        </div>
      </div>

      {/* Smart Graded Adaptation Proposals (التكيف الذكي بالقواعد المحلية) */}
      {profile.smartGradingEnabled && activeProposals.length > 0 && (
        <div className="space-y-2">
          {activeProposals.map((prop) => (
            <div
              key={prop.id}
              className="p-4 rounded-2xl bg-[#151316] border border-[#6D1028]/60 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#3B0A18] text-[#922D48]">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#F4F0F1]">{prop.title}</h3>
                  <span className="text-[10px] text-[#AAA2A7]">(اقتراح محلي ذكي)</span>
                </div>
                <p className="text-xs text-[#AAA2A7] leading-relaxed max-w-xl">
                  {prop.explanation}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleAcceptProposal(prop)}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition"
                >
                  قبول وتطبيق
                </button>
                <button
                  onClick={() => setDismissedProposals([...dismissedProposals, prop.id])}
                  className="px-3 py-1.5 rounded-xl bg-[#0B0B0D] hover:bg-[#20151b] text-[#AAA2A7] hover:text-white text-xs font-medium border border-[#30262B] transition"
                >
                  تجاهل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters Strip */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[#151316] border border-[#30262B]">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'today', label: `اليوم (${currentDay})` },
            { id: 'pending', label: 'قيد التنفيذ' },
            { id: 'completed', label: 'مكتملة' },
            { id: 'postponed', label: 'مؤجلة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === tab.id
                  ? 'bg-[#6D1028] text-[#F4F0F1]'
                  : 'text-[#AAA2A7] hover:text-[#F4F0F1] hover:bg-[#0B0B0D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-[#30262B] hidden sm:block mx-1" />

        {/* Pillar filter dropdown */}
        <select
          value={filterPillar}
          onChange={(e) => setFilterPillar(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#AAA2A7] focus:outline-none"
        >
          <option value="all">كل المحاور</option>
          {PILLARS_LIST.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Task Cards List */}
      {filteredTasks.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-3">
          <p className="text-xs text-[#AAA2A7]">لا توجد مهام مطابقة للفلتر المحدد.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] text-white text-xs font-bold hover:bg-[#922D48] transition"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مهمة جديدة</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isPostponed = task.status === 'postponed';
            const pillarInfo = PILLARS_LIST.find((p) => p.id === task.pillarId);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition ${
                  isDone
                    ? 'bg-[#151316]/40 border-[#30262B] opacity-65'
                    : isPostponed
                    ? 'bg-[#151316]/60 border-[#30262B] border-dashed'
                    : 'bg-[#151316] border-[#30262B] hover:border-[#6D1028]/60 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Checkbox toggle */}
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isDone
                          ? 'bg-[#6D1028] text-white'
                          : 'border border-[#30262B] hover:border-[#6D1028]'
                      }`}
                    >
                      {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold ${
                            isDone ? 'line-through text-[#AAA2A7]' : 'text-[#F4F0F1]'
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.isMiniTask && (
                          <span className="text-[10px] text-[#922D48] font-bold">
                            (مهمة مصغرة - اليوم الصعب)
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-[#AAA2A7] leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Metadata inline */}
                      <div className="flex items-center gap-2 text-[10px] text-[#AAA2A7] flex-wrap pt-0.5">
                        <span>{pillarInfo?.name || task.pillarId}</span>
                        <span>·</span>
                        <span>{task.estimatedMinutes} دقيقة</span>
                        <span>·</span>
                        <span>+{task.xp} XP</span>
                        {task.scheduledTime && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.scheduledTime}
                            </span>
                          </>
                        )}
                        <span>·</span>
                        <span>اليوم {task.dayNumber}</span>
                      </div>

                      {isPostponed && task.postponedReason && (
                        <div className="text-[10px] text-[#AAA2A7] pt-1">
                          سبب التأجيل: {task.postponedReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isDone && !isPostponed && (
                      <button
                        onClick={() => setPostponeModalTaskId(task.id)}
                        className="p-1.5 rounded-lg text-[#AAA2A7] hover:text-[#F4F0F1] hover:bg-[#0B0B0D] transition text-[11px]"
                        title="تأجيل المهمة"
                      >
                        تأجيل
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-[#AAA2A7] hover:text-red-400 hover:bg-[#0B0B0D] transition"
                      title="حذف المهمة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
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
              <h3 className="text-sm font-bold text-[#F4F0F1]">إضافة مهمة جديدة</h3>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">اسم المهمة</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: قراءة 15 صفحة من الكتاب"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الوصف أو الملاحظات (اختياري)</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="تفاصيل التنفيذ..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">المحور</label>
                  <select
                    value={newPillar}
                    onChange={(e) => setNewPillar(e.target.value as PillarId)}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  >
                    {PILLARS_LIST.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">مستوى الصعوبة</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as TaskDifficulty)}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  >
                    <option value="easy">سهل (20 XP)</option>
                    <option value="medium">متوسط (30 XP)</option>
                    <option value="hard">تحدٍ (50 XP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الوقت المقدر (دقيقة)</label>
                  <input
                    type="number"
                    min={1}
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">وقت التنفيذ (اختياري)</label>
                  <input
                    type="time"
                    value={newScheduledTime}
                    onChange={(e) => setNewScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-[#F4F0F1] text-xs font-bold transition shadow-md"
                >
                  حفظ المهمة في خطة اليوم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Postpone reason modal */}
      {postponeModalTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#0B0B0D] border border-[#30262B] p-5 text-right space-y-3">
            <h4 className="text-xs font-bold text-[#F4F0F1]">تأجيل المهمة بهدوء</h4>
            <p className="text-[11px] text-[#AAA2A7] leading-relaxed">
              تأجيل مهمة ليس فشلاً؛ توثيق السبب يساعد خوارزمية التكيّف المحلي على فهم ضغوطك واقتراح تعديلات مناسبة.
            </p>
            <input
              type="text"
              value={postponeReason}
              onChange={(e) => setPostponeReason(e.target.value)}
              placeholder="مثال: ضيق الوقت اليوم، أو إرهاق بدني"
              className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleConfirmPostpone}
                className="flex-1 py-2 rounded-xl bg-[#6D1028] text-white text-xs font-bold hover:bg-[#922D48] transition"
              >
                تأكيد التأجيل
              </button>
              <button
                onClick={() => setPostponeModalTaskId(null)}
                className="px-3 py-2 rounded-xl bg-[#151316] text-[#AAA2A7] text-xs font-medium hover:bg-[#20151b] transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
