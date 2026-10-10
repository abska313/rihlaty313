import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Compass,
  Plus,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { NewExperience } from '../types';

interface ExperiencesViewProps {
  experiences: NewExperience[];
  onSaveExperience: (exp: NewExperience) => void;
  onDeleteExperience: (id: string) => void;
}

export const ExperiencesView: React.FC<ExperiencesViewProps> = ({
  experiences,
  onSaveExperience,
  onDeleteExperience,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [whyDoIt, setWhyDoIt] = useState('');
  const [excitementLevel, setExcitementLevel] = useState<number>(4);
  const [timeCommitment, setTimeCommitment] = useState('ساعتان');
  const [estimatedCost, setEstimatedCost] = useState('مجاني / رمزي');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const exp: NewExperience = {
      id: `exp_${Date.now()}`,
      title: title.trim(),
      whyDoIt: whyDoIt.trim() || 'كسر الرتابة واكتشاف اهتمامات جديدة',
      excitementLevel,
      timeCommitment: timeCommitment.trim(),
      estimatedCost: estimatedCost.trim() || undefined,
      status: 'planned',
    };

    onSaveExperience(exp);
    setShowAddModal(false);
    setTitle('');
    setWhyDoIt('');
  };

  const handleToggleComplete = (exp: NewExperience) => {
    if (exp.status === 'completed') {
      onSaveExperience({ ...exp, status: 'planned', completedAt: undefined });
    } else {
      const notes = prompt('اكتب ملاحظة أو شعورك بعد خوض التجربة:');
      onSaveExperience({
        ...exp,
        status: 'completed',
        completedAt: new Date().toISOString(),
        reflectionNotes: notes || undefined,
      });
    }
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#F4F0F1]">قائمة تجارب أريد خوضها</h1>
          <p className="text-xs text-[#AAA2A7] mt-0.5">
            تجارب جديدة تكسر الجمود وتوسع مداركك، مرتبطة بروح الاستكشاف والنمو الشخصي.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تجربة جديدة</span>
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-3">
          <p className="text-xs text-[#AAA2A7]">لم تضف تجارب جديدة حتى الآن.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] text-white text-xs font-bold hover:bg-[#922D48] transition"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة أول تجربة في قائمتك</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {experiences.map((exp) => {
            const isDone = exp.status === 'completed';
            return (
              <div
                key={exp.id}
                className={`p-5 rounded-3xl border transition flex flex-col justify-between ${
                  isDone
                    ? 'bg-[#151316]/50 border-[#30262B] opacity-75'
                    : 'bg-[#151316] border-[#30262B] hover:border-[#6D1028]/60 shadow-md'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1 text-[#922D48]">
                      {Array.from({ length: exp.excitementLevel }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#922D48]" />
                      ))}
                    </div>
                    <h3 className={`text-xs font-bold ${isDone ? 'line-through text-[#AAA2A7]' : 'text-[#F4F0F1]'}`}>
                      {exp.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#AAA2A7] leading-relaxed">
                    <strong>الدافع:</strong> {exp.whyDoIt}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-[#AAA2A7]">
                    <span>المدة: {exp.timeCommitment}</span>
                    {exp.estimatedCost && (
                      <>
                        <span>·</span>
                        <span>التكلفة: {exp.estimatedCost}</span>
                      </>
                    )}
                  </div>

                  {exp.reflectionNotes && (
                    <div className="p-2.5 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-[11px] text-[#AAA2A7]">
                      <strong>أثر التجربة:</strong> {exp.reflectionNotes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#30262B] mt-3">
                  <button
                    onClick={() => onDeleteExperience(exp.id)}
                    className="p-1 text-[#AAA2A7] hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleComplete(exp)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isDone
                        ? 'bg-[#0B0B0D] text-[#AAA2A7]'
                        : 'bg-[#6D1028] hover:bg-[#922D48] text-white'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{isDone ? 'إلغاء الإكمال' : 'تأكيد خوض التجربة'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
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
              <h3 className="text-sm font-bold text-[#F4F0F1]">إضافة تجربة جديدة</h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">وصف التجربة</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: تجربة الرماية بالسهم، أو زيارة متحف فلكي"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">سبب الرغبة في خوضها</label>
                <textarea
                  rows={2}
                  value={whyDoIt}
                  onChange={(e) => setWhyDoIt(e.target.value)}
                  placeholder="ما الذي تتوقع أن تضيفه لنفسك؟"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">مستوى الحماس (1-5)</label>
                  <select
                    value={excitementLevel}
                    onChange={(e) => setExcitementLevel(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  >
                    <option value={5}>5 - حماس شديد</option>
                    <option value={4}>4 - متحمس جدًا</option>
                    <option value={3}>3 - فضول معتدل</option>
                    <option value={2}>2 - تجربة هادئة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الوقت المتوقع</label>
                  <input
                    type="text"
                    value={timeCommitment}
                    onChange={(e) => setTimeCommitment(e.target.value)}
                    placeholder="ساعتان / نصف يوم"
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-md"
                >
                  حفظ التجربة في القائمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
