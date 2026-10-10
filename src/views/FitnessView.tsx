import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Plus,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types';

interface FitnessViewProps {
  profile: UserProfile;
  currentDay: number;
  onUpdateWeight: (newWeight: number) => void;
}

export const FitnessView: React.FC<FitnessViewProps> = ({
  profile,
  currentDay,
  onUpdateWeight,
}) => {
  const [weightInput, setWeightInput] = useState<string>(profile.currentWeight ? String(profile.currentWeight) : '');
  const [activityLogs, setActivityLogs] = useState<
    { id: string; date: string; type: string; duration: number; effort: string; notes?: string }[]
  >([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      type: 'مشي نشط وتمارين إطالة',
      duration: 30,
      effort: 'معتدل ومريح',
      notes: 'حركة خفيفة وتصفية الذهن',
    },
  ]);

  const [actType, setActType] = useState('مشي نشط');
  const [actDuration, setActDuration] = useState(25);
  const [actEffort, setActEffort] = useState('معتدل');
  const [actNotes, setActNotes] = useState('');

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(weightInput);
    if (!isNaN(val) && val > 0) {
      onUpdateWeight(val);
    }
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: `act_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: actType,
      duration: Number(actDuration) || 20,
      effort: actEffort,
      notes: actNotes.trim() || undefined,
    };
    setActivityLogs([item, ...activityLogs]);
    setActNotes('');
  };

  const initialW = profile.initialWeight || profile.currentWeight || 0;
  const currentW = profile.currentWeight || profile.initialWeight || 0;
  const weightDiff = currentW - initialW;

  return (
    <div className="space-y-6 pb-24 text-right">
      <div>
        <h1 className="text-xl font-black text-[#F4F0F1]">المتابعة البدنية والنشاط (قسم اختياري)</h1>
        <p className="text-xs text-[#AAA2A7] mt-0.5">
          النشاط البدني وسيلة لتعزيز طاقتك وصحتك؛ لا نتبنى أنظمة حرمان أو تمارين عقابية.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-3xl bg-[#3B0A18]/30 border border-[#6D1028]/50 space-y-1.5 text-xs text-[#AAA2A7] leading-relaxed">
        <div className="font-bold text-[#F4F0F1] flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-[#922D48]" />
          <span>مبدأ الأمان البدني في ABSKA 214:</span>
        </div>
        <p>
          الصحة أوسع بكثير من رقم الميزان. تجنب التمارين الشاقة في أيام الإجهاد، واستشر المختص عند أي أعراض صحية. الاستمرارية المعتدلة هي الأساس.
        </p>
      </div>

      {/* Body Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-1">
          <span className="text-[10px] text-[#AAA2A7]">الوزن الابتدائي</span>
          <div className="text-lg font-black text-[#F4F0F1]">
            {initialW ? `${initialW} كجم` : 'لم يُحدد'}
          </div>
          <div className="text-[10px] text-[#AAA2A7]">نقطة البداية</div>
        </div>

        <div className="p-4 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-1">
          <span className="text-[10px] text-[#AAA2A7]">الوزن الحالي المسجل</span>
          <div className="text-lg font-black text-[#922D48]">
            {currentW ? `${currentW} كجم` : 'لم يُسجل'}
          </div>
          <div className="text-[10px] text-[#AAA2A7]">
            {initialW && currentW ? (
              weightDiff === 0
                ? 'ثابت'
                : weightDiff > 0
                ? `+${weightDiff.toFixed(1)} كجم`
                : `${weightDiff.toFixed(1)} كجم`
            ) : (
              'بيانات قيد التكوين'
            )}
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-1">
          <span className="text-[10px] text-[#AAA2A7]">الطول</span>
          <div className="text-lg font-black text-[#F4F0F1]">
            {profile.height ? `${profile.height} سم` : 'لم يُحدد'}
          </div>
          <div className="text-[10px] text-[#AAA2A7]">
            {profile.height && currentW
              ? `مؤشر الكتلة: ${(currentW / Math.pow(profile.height / 100, 2)).toFixed(1)}`
              : 'مرجع تقديري'}
          </div>
        </div>
      </div>

      {/* Update Weight Form */}
      <form
        onSubmit={handleSaveWeight}
        className="p-4 rounded-3xl bg-[#151316] border border-[#30262B] flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <span className="text-xs font-bold text-[#F4F0F1]">تسجيل تحديث الوزن الحالي:</span>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="number"
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="مثال: 74.5"
            className="w-32 px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition"
          >
            تحديث
          </button>
        </div>
      </form>

      {/* Log Activity Form */}
      <div className="p-6 rounded-3xl bg-[#151316] border border-[#30262B] space-y-4">
        <h3 className="text-sm font-bold text-[#F4F0F1] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#922D48]" />
          <span>تسجيل نشاط حركي لليوم</span>
        </h3>

        <form onSubmit={handleAddActivity} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">نوع النشاط</label>
              <input
                type="text"
                required
                value={actType}
                onChange={(e) => setActType(e.target.value)}
                placeholder="مشي، جري خفيف، تمارين وزن الجسم..."
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">المدة (دقائق)</label>
              <input
                type="number"
                value={actDuration}
                onChange={(e) => setActDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">مستوى الجهد</label>
              <select
                value={actEffort}
                onChange={(e) => setActEffort(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
              >
                <option value="خفيف جدًا ومريح">خفيف ومريح (استشفاء)</option>
                <option value="معتدل">معتدل (تنشيط)</option>
                <option value="مرتفع قليلًا">مرتفع بنشاط</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">ملاحظات وشعورك بعد التمرين</label>
            <input
              type="text"
              value={actNotes}
              onChange={(e) => setActNotes(e.target.value)}
              placeholder="مثال: شعرت بانتعاش وصفاء ذهني..."
              className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition"
          >
            حفظ النشاط في السجل
          </button>
        </form>
      </div>

      {/* Activity Log History */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#AAA2A7]">سجل الأنشطة البدنية الأخيرة:</h3>
        <div className="space-y-2">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-[#151316] border border-[#30262B] flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-[#F4F0F1]">{log.type}</div>
                <div className="text-[10px] text-[#AAA2A7] mt-0.5">
                  {log.duration} دقيقة · جهد {log.effort} · {log.date}
                </div>
                {log.notes && (
                  <div className="text-[10px] text-[#AAA2A7] pt-0.5">{log.notes}</div>
                )}
              </div>
              <span className="p-2 rounded-xl bg-[#0B0B0D] text-[#922D48]">
                <Activity className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
