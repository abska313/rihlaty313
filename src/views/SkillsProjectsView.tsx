import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Layers,
  Plus,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { STAGES_DEFINITIONS } from '../services/sampleData';
import { SkillProject, UserProfile } from '../types';
import { getJourneyDayInfo } from '../utils/journeyMath';

interface SkillsProjectsViewProps {
  projects: SkillProject[];
  profile: UserProfile;
  currentDay: number;
  onSaveProject: (project: SkillProject) => void;
  onDeleteProject: (id: string) => void;
}

export const SkillsProjectsView: React.FC<SkillsProjectsViewProps> = ({
  projects,
  profile,
  currentDay,
  onSaveProject,
  onDeleteProject,
}) => {
  const dayInfo = getJourneyDayInfo(profile);
  const [selectedStage, setSelectedStage] = useState<number>(dayInfo.currentStage.stageNumber);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [skillName, setSkillName] = useState('');
  const [targetOutcome, setTargetOutcome] = useState('');
  const [whyChosen, setWhyChosen] = useState('');
  const [currentLevel, setCurrentLevel] = useState('مبتدئ');
  const [estimatedHours, setEstimatedHours] = useState(15);
  const [notesResources, setNotesResources] = useState('');
  const [subTasksText, setSubTasksText] = useState('');

  const currentStageProjects = projects.filter((p) => p.stageNumber === selectedStage);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    const subTasks = subTasksText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t, idx) => ({
        id: `sub_${Date.now()}_${idx}`,
        title: t,
        completed: false,
      }));

    const newProject: SkillProject = {
      id: `proj_${Date.now()}`,
      stageNumber: selectedStage,
      skillName: skillName.trim(),
      targetOutcome: targetOutcome.trim() || 'إتقان الأساسيات وتطبيق نموذج عملي',
      whyChosen: whyChosen.trim() || 'خدمة أهدافي في التطوير المهني أو الشخصي',
      currentLevel,
      subTasks: subTasks.length > 0 ? subTasks : [
        { id: `sub_${Date.now()}_1`, title: 'دراسة الأساسيات والمصادر', completed: false },
        { id: `sub_${Date.now()}_2`, title: 'تنفيذ تطبيق أو تمرين أولي', completed: false },
        { id: `sub_${Date.now()}_3`, title: 'إنهاء المشروع النهائي ونشره أو توثيقه', completed: false },
      ],
      estimatedHours: Number(estimatedHours) || 10,
      notesAndResources: notesResources.trim(),
    };

    onSaveProject(newProject);
    setShowAddModal(false);
    setSkillName('');
    setTargetOutcome('');
    setWhyChosen('');
    setNotesResources('');
    setSubTasksText('');
  };

  const handleToggleSubTask = (project: SkillProject, subId: string) => {
    const updatedSub = project.subTasks.map((s) =>
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    const allDone = updatedSub.every((s) => s.completed);
    onSaveProject({
      ...project,
      subTasks: updatedSub,
      completedAt: allDone ? new Date().toISOString() : undefined,
    });
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#F4F0F1]">مشاريع المهارات العملية</h1>
          <p className="text-xs text-[#AAA2A7] mt-0.5">
            مشروع مهارة لكل مرحلة؛ تعلّم عبر الممارسة وتقسيم الهدف الكبير إلى خطوات ملموسة.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مشروع للمرحلة</span>
        </button>
      </div>

      {/* Stage Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STAGES_DEFINITIONS.map((s) => {
          const isSelected = selectedStage === s.stageNumber;
          const stageProjs = projects.filter((p) => p.stageNumber === s.stageNumber);
          const hasCompleted = stageProjs.some((p) => p.completedAt);

          return (
            <button
              key={s.stageNumber}
              onClick={() => setSelectedStage(s.stageNumber)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
                isSelected
                  ? 'bg-[#6D1028] border-[#922D48] text-white shadow-sm'
                  : 'bg-[#151316] border-[#30262B] text-[#AAA2A7] hover:text-[#F4F0F1]'
              }`}
            >
              <span>المرحلة {s.stageNumber}</span>
              {hasCompleted && <span className="mr-1 text-[10px] text-white">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Projects List for Selected Stage */}
      {currentStageProjects.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-3">
          <p className="text-xs text-[#AAA2A7]">
            لم تضف بعد مشروع مهارة للمرحلة {selectedStage} ({STAGES_DEFINITIONS.find((s) => s.stageNumber === selectedStage)?.theme}).
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] text-white text-xs font-bold hover:bg-[#922D48] transition"
          >
            <Plus className="w-4 h-4" />
            <span>تحديد مهارة والبدء في مشروعها</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {currentStageProjects.map((project) => {
            const completedCount = project.subTasks.filter((s) => s.completed).length;
            const progress =
              project.subTasks.length > 0
                ? Math.round((completedCount / project.subTasks.length) * 100)
                : 0;

            return (
              <div
                key={project.id}
                className="p-6 rounded-3xl bg-[#151316] border border-[#30262B] space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#30262B] pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-[#F4F0F1]">
                        {project.skillName}
                      </h3>
                      {project.completedAt && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#3B0A18] text-[#922D48]">
                          مكتمل بنجاح
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#AAA2A7]">
                      النتيجة المستهدفة: {project.targetOutcome}
                    </p>
                  </div>

                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="p-1 rounded-lg text-[#AAA2A7] hover:text-red-400"
                    title="حذف المشروع"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#AAA2A7]">
                    <span>{progress}% مكتمل</span>
                    <span>
                      {completedCount} من {project.subTasks.length} خطوات منجزة (تقدير {project.estimatedHours} ساعة)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0B0B0D] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6D1028] to-[#922D48] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Sub-milestones Checklist */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-[#F4F0F1]">الخطوات والمهام الفرعية:</h4>
                  <div className="space-y-1.5">
                    {project.subTasks.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => handleToggleSubTask(project, sub.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer select-none transition ${
                          sub.completed
                            ? 'bg-[#0B0B0D]/50 border-[#30262B] opacity-60'
                            : 'bg-[#0B0B0D] border-[#30262B] hover:border-[#6D1028]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            sub.completed ? 'bg-[#6D1028] text-white' : 'border border-[#30262B]'
                          }`}
                        >
                          {sub.completed && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                        <span
                          className={`text-xs ${
                            sub.completed ? 'line-through text-[#AAA2A7]' : 'text-[#F4F0F1]'
                          }`}
                        >
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes/Resources */}
                {project.notesAndResources && (
                  <div className="text-[11px] text-[#AAA2A7] pt-1">
                    <strong>المصادر والملاحظات:</strong> {project.notesAndResources}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Project Modal */}
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
              <h3 className="text-sm font-bold text-[#F4F0F1]">
                مشروع مهارة للمرحلة {selectedStage}
              </h3>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">اسم المهارة</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="مثال: التصميم الجرافيكي، أو إتقان محادثة لغة"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">النتيجة الملموسة المطلوبة</label>
                <input
                  type="text"
                  value={targetOutcome}
                  onChange={(e) => setTargetOutcome(e.target.value)}
                  placeholder="مثال: تصميم ملصق كامل، أو إجراء محادثة 5 دقائق"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">المستوى الحالي</label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  >
                    <option value="مبتدئ تمامًا">مبتدئ تمامًا</option>
                    <option value="معرفة أساسية">معرفة أساسية</option>
                    <option value="متوسط">متوسط</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">المدة التقديرية (ساعات)</label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">
                  الخطوات الفرعية (خطوة واحدة في كل سطر)
                </label>
                <textarea
                  rows={3}
                  value={subTasksText}
                  onChange={(e) => setSubTasksText(e.target.value)}
                  placeholder="الخطوة 1: اختيار دورة أو كتاب&#10;الخطوة 2: التطبيق العملي الأسبوعي&#10;الخطوة 3: تسليم النموذج النهائي"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-md"
                >
                  حفظ المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
