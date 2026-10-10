import React, { useState } from 'react';
import { CheckCircle, Moon, ShieldCheck, X } from 'lucide-react';
import { TaskItem, ToughDayLog } from '../types';

interface ToughDayModalProps {
  currentDay: number;
  tasks: TaskItem[];
  onClose: () => void;
  onApplyToughDay: (log: ToughDayLog, microTasks: TaskItem[]) => void;
}

export const ToughDayModal: React.FC<ToughDayModalProps> = ({
  currentDay,
  tasks,
  onClose,
  onApplyToughDay,
}) => {
  const [energyScore, setEnergyScore] = useState<number>(2);
  const [reason, setReason] = useState<string>('إرهاق بدني وقلة نوم');
  const [customReason, setCustomReason] = useState<string>('');
  const [selectedMicroTasks, setSelectedMicroTasks] = useState<string[]>([
    'قراءة صفحة واحدة بتأنٍ وهدوء',
    '3 دقائق من التنفس العميق أو التمدد الخفيف',
    'كتابة سطر واحد في دفتر اكتشاف الذات',
    'شرب كوب ماء دافئ والنوم مبكرًا الليلة',
  ]);

  const defaultReasons = [
    'إرهاق بدني وقلة نوم',
    'وعكة صحية تستوجب الراحة',
    'ضغط عمل أو دراسة غير متوقع',
    'ثقل نفسي وحاجة لاستعادة التوازن',
    'ظرف عائلي طارئ',
  ];

  const suggestedMicroOptions = [
    'قراءة صفحة واحدة بتأنٍ وهدوء',
    '3 دقائق من التنفس العميق أو التمدد الخفيف',
    'كتابة سطر واحد في دفتر اكتشاف الذات',
    'شرب كوب ماء دافئ والنوم مبكرًا الليلة',
    'ترتيب زاوية صغيرة من المكتب (دقيقتان)',
    'مراجعة سريعة لأولويات الغد فقط',
  ];

  const toggleMicro = (item: string) => {
    if (selectedMicroTasks.includes(item)) {
      if (selectedMicroTasks.length > 1) {
        setSelectedMicroTasks(selectedMicroTasks.filter((x) => x !== item));
      }
    } else {
      setSelectedMicroTasks([...selectedMicroTasks, item]);
    }
  };

  const handleConfirm = () => {
    const finalReason = customReason.trim() ? customReason : reason;
    const todayStr = new Date().toISOString().split('T')[0];

    const log: ToughDayLog = {
      id: `tough_${Date.now()}`,
      date: todayStr,
      dayNumber: currentDay,
      energyScore,
      reason: finalReason,
      miniTasksCompleted: 0,
      notes: `تم تفعيل وضع اليوم الصعب لمراعاة طاقة اليوم (${energyScore}/5).`,
    };

    const newMicroTasks: TaskItem[] = selectedMicroTasks.map((title, idx) => ({
      id: `micro_${Date.now()}_${idx}`,
      title,
      description: 'مهمة مصغرة تحافظ على استمراريتك في وضع اليوم الصعب دون إجهاد.',
      pillarId: 'discipline',
      difficulty: 'easy',
      estimatedMinutes: 5,
      status: 'pending',
      xp: 25,
      dayNumber: currentDay,
      date: todayStr,
      isMiniTask: true,
    }));

    onApplyToughDay(log, newMicroTasks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-[#0B0B0D] border border-[#30262B] p-6 text-right shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#AAA2A7] hover:text-[#F4F0F1] hover:bg-[#151316] transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-[#F4F0F1]">وضع اليوم الصعب</h3>
            <div className="p-1.5 rounded-xl bg-[#3B0A18] text-[#922D48]">
              <Moon className="w-4 h-4" />
            </div>
          </div>
        </div>

        <p className="text-xs text-[#AAA2A7] leading-relaxed">
          أيام انخفاض الطاقة جزء طبيعي من الحياة. لا داعي للإحباط أو تأنيب الضمير؛ الهدف اليوم هو حماية الاستمرارية عبر الحد الأدنى الواقعي فقط.
        </p>

        {/* Energy slider */}
        <div className="space-y-2 bg-[#151316] p-4 rounded-2xl border border-[#30262B]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#922D48]">{energyScore} من 5</span>
            <span className="text-[#AAA2A7]">مستوى طاقتك اليوم</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={energyScore}
            onChange={(e) => setEnergyScore(Number(e.target.value))}
            className="w-full accent-[#6D1028]"
          />
          <div className="flex justify-between text-[10px] text-[#AAA2A7]">
            <span>1: منهك تمامًا</span>
            <span>3: طاقة متوسطة</span>
            <span>5: طاقة عالية</span>
          </div>
        </div>

        {/* Reason Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#AAA2A7]">سبب انخفاض الطاقة</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {defaultReasons.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setReason(r);
                  setCustomReason('');
                }}
                className={`p-2.5 rounded-xl border text-xs text-right transition ${
                  reason === r && !customReason
                    ? 'bg-[#151316] border-[#6D1028] text-[#F4F0F1] font-bold'
                    : 'bg-[#0B0B0D] border-[#30262B] text-[#AAA2A7] hover:text-[#F4F0F1]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Micro-Tasks Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#AAA2A7]">
            اختر المهام المصغرة لليوم (الحد الأدنى الواقعي):
          </label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {suggestedMicroOptions.map((opt) => {
              const selected = selectedMicroTasks.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleMicro(opt)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs text-right transition ${
                    selected
                      ? 'bg-[#151316] border-[#6D1028] text-[#F4F0F1]'
                      : 'bg-[#0B0B0D] border-[#30262B] text-[#AAA2A7] opacity-60'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                      selected ? 'bg-[#6D1028] text-white' : 'border border-[#30262B]'
                    }`}
                  >
                    {selected && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6D1028] to-[#922D48] text-[#F4F0F1] text-xs font-bold shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تفعيل وضع اليوم الصعب وتأجيل المهام الثقيلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
