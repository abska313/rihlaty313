import React, { useState } from 'react';
import { CheckCircle, HeartCrack, RotateCcw, ShieldCheck, X } from 'lucide-react';
import { RelapseRecord, TaskItem } from '../types';

interface RelapseRescueModalProps {
  currentDay: number;
  onClose: () => void;
  onConfirmRecovery: (record: RelapseRecord, microTaskTitle: string) => void;
}

export const RelapseRescueModal: React.FC<RelapseRescueModalProps> = ({
  currentDay,
  onClose,
  onConfirmRecovery,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>(['ضيق الوقت والمشاغل غير المتوقعة']);
  const [customReason, setCustomReason] = useState<string>('');
  const [chosenMicroStep, setChosenMicroStep] = useState<string>('إكمال خطوة واحدة لا تتجاوز 5 دقائق لكسر الجمود');
  const [preventionPlan, setPreventionPlan] = useState<string>('تخفيض حجم المهام اليومية والتركيز على الروتين الصباحي أولاً');

  const availableReasons = [
    'ضيق الوقت والمشاغل غير المتوقعة',
    'انخفاض الحماس والفتور المؤقت',
    'وضع مهام شديدة الصعوبة أو مثالية مفرطة',
    'التشتت الشديد بالهاتف ووسائل التواصل',
    'ظرف صحي أو نفسي مفاجئ',
    'فقدان وضوح الهدف مؤقتًا',
  ];

  const microStepsList = [
    'إكمال خطوة واحدة لا تتجاوز 5 دقائق لكسر الجمود',
    'كتابة تدوينة صريحة في دفتر اكتشاف الذات',
    'قراءة 5 صفحات فقط من كتابك الحالي',
    'المشي الخفيف لمدة 10 دقائق وتصفية الذهن',
    'ترتيب قائمة مهام الغد بأسلوب واقعي وهادئ',
  ];

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      if (selectedReasons.length > 1) {
        setSelectedReasons(selectedReasons.filter((r) => r !== reason));
      }
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleSubmit = () => {
    const finalReasons = [...selectedReasons];
    if (customReason.trim()) finalReasons.push(customReason.trim());

    const record: RelapseRecord = {
      id: `relapse_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dayNumber: currentDay,
      reasons: finalReasons,
      microStepChosen: chosenMicroStep,
      preventionPlan: preventionPlan.trim() || 'الاستمرار بالحد الأدنى دون تأنيب.',
      resolved: true,
    };

    onConfirmRecovery(record, chosenMicroStep);
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
            <h3 className="text-base font-extrabold text-[#F4F0F1]">العودة إلى المسار</h3>
            <div className="p-1.5 rounded-xl bg-[#3B0A18] text-[#922D48]">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Serene Supportive Message */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#151316] to-[#25151b] border border-[#6D1028]/40 space-y-1.5">
          <h4 className="text-xs font-bold text-[#F4F0F1]">التعثر جزء طبيعي من كل تحوّل حقيقي</h4>
          <p className="text-xs text-[#AAA2A7] leading-relaxed">
            الرحلة لم تنتهِ، ونقاطك وإنجازاتك محفوظة بالكامل. الفارق بين من يغيّر حياته ومن يتوقف ليس في عدم الانقطاع، بل في سرعة النهوض بهدوء والعودة دون قسوة على النفس.
          </p>
        </div>

        {/* Reasons Multi-Select */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#AAA2A7]">
            ما الأسباب التي أدت إلى الانقطاع؟ (يمكنك اختيار أكثر من سبب)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {availableReasons.map((r) => {
              const active = selectedReasons.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleReason(r)}
                  className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs text-right transition ${
                    active
                      ? 'bg-[#151316] border-[#6D1028] text-[#F4F0F1] font-semibold'
                      : 'bg-[#0B0B0D] border-[#30262B] text-[#AAA2A7] hover:text-[#F4F0F1]'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                      active ? 'bg-[#6D1028] text-white' : 'border border-[#30262B]'
                    }`}
                  >
                    {active && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <span>{r}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Micro-Step to Resume */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#AAA2A7]">
            اختر خطوة صغيرة جدًا للبدء الآن (كسر حاجز المقاومة):
          </label>
          <div className="space-y-1.5">
            {microStepsList.map((step) => {
              const isSelected = chosenMicroStep === step;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setChosenMicroStep(step)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs text-right transition ${
                    isSelected
                      ? 'bg-[#151316] border-[#6D1028] text-[#F4F0F1] font-bold'
                      : 'bg-[#0B0B0D] border-[#30262B] text-[#AAA2A7] opacity-70'
                  }`}
                >
                  <span>{step}</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#6D1028] text-white' : 'border border-[#30262B]'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prevention plan */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#AAA2A7]">
            خطة لتفادي تكرار هذا العائق مستقبلاً:
          </label>
          <input
            type="text"
            value={preventionPlan}
            onChange={(e) => setPreventionPlan(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6D1028] to-[#922D48] text-[#F4F0F1] text-xs font-bold shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>توثيق العودة واستئناف المسار الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
