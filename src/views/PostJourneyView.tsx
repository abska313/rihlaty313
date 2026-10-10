import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  FileCheck,
  Flag,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { UserProfile } from '../types';

interface PostJourneyViewProps {
  profile: UserProfile;
  currentDay: number;
  onUpdateContinuationPlan: (habits: string[], longTermGoals: string[]) => void;
}

export const PostJourneyView: React.FC<PostJourneyViewProps> = ({
  profile,
  currentDay,
  onUpdateContinuationPlan,
}) => {
  const [sustainedHabitsText, setSustainedHabitsText] = useState(
    'القراءة اليومية 20 دقيقة\nالمشي المنتظم\nتدوين التأملات الأسبوعية\nتطبيق وضع اليوم الصعب عند الإجهاد'
  );
  const [longTermGoalsText, setLongTermGoalsText] = useState(
    'الاستمرار في مشروع المهارة وتطويره لمستوى احترافي\nالحفاظ على وزن ونشاط بدني مريح\nتنظيم النوم والاستيقاظ'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isCompleted214 = currentDay >= 214;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const habits = sustainedHabitsText.split('\n').filter(Boolean);
    const goals = longTermGoalsText.split('\n').filter(Boolean);
    onUpdateContinuationPlan(habits, goals);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      <div>
        <h1 className="text-xl font-black text-[#F4F0F1]">خطة ما بعد اليوم 214 (مرحلة الاستدامة)</h1>
        <p className="text-xs text-[#AAA2A7] mt-0.5">
          التحوّل لا ينتهي مع انتهاء الأيام الـ 214؛ هذا الميثاق يضمن تحوّل المكتسبات إلى أسلوب حياة دائم.
        </p>
      </div>

      {/* Continuation Mode Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#151316] via-[#1f141a] to-[#3B0A18]/40 border border-[#30262B] space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
          <span className="text-xs text-[#AAA2A7]">
            {isCompleted214 ? 'مرحلة الاستمرار مفعّلة' : `أنت في اليوم ${currentDay} من 214`}
          </span>
          <h2 className="text-sm font-extrabold text-[#F4F0F1] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#922D48]" />
            <span>فلسفة الاستمرار: الهوية فوق المؤقت</span>
          </h2>
        </div>
        <p className="text-xs text-[#AAA2A7] leading-relaxed">
          عند الوصول إلى اليوم 214، لن يتوقف التطبيق ولن تُحذف بياناتك. يتحول النظام تلقائيًا إلى «وضع الاستمرار»، مع بقاء الأرشيف الكامل والقدرة على تتبع العادات بنفس السلاسة.
        </p>
      </div>

      {/* 30-Day Post-Journey Roadmap Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-[#151316] border border-[#30262B] space-y-4">
        <h3 className="text-sm font-bold text-[#F4F0F1]">خطة الـ 30 يومًا الأولى بعد انتهاء الرحلة</h3>

        <div>
          <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">
            العادات التي ألتزم بمواصلتها دون انقطاع (عادة في كل سطر):
          </label>
          <textarea
            rows={4}
            value={sustainedHabitsText}
            onChange={(e) => setSustainedHabitsText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028] leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">
            الأهداف والمشاريع طويلة المدى للمرحلة القادمة:
          </label>
          <textarea
            rows={3}
            value={longTermGoalsText}
            onChange={(e) => setLongTermGoalsText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028] leading-relaxed"
          />
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#AAA2A7] leading-relaxed">
          <strong className="text-[#F4F0F1] block mb-1">معدل المراجعة الذاتية المقترح:</strong>
          مراجعة شهرية في أول جمعة من كل شهر لتدقيق الالتزام وتحديث بنك المكافآت.
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>حفظ وتأكيد خطة الاستمرارية</span>
        </button>

        {savedSuccess && (
          <div className="p-2.5 rounded-xl bg-[#3B0A18] text-[#F4F0F1] text-center text-xs font-bold">
            تم حفظ خطة الاستمرار بنجاح!
          </div>
        )}
      </form>
    </div>
  );
};
