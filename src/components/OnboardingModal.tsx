import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  HeartHandshake,
  Layers,
  Sparkles,
  User,
} from 'lucide-react';
import { PILLARS_LIST } from '../services/sampleData';
import { PillarId, UserProfile } from '../types';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<UserProfile>({ ...initialProfile });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStartJourney = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const targetEnd = new Date(today.getTime() + 213 * 86400000).toISOString().split('T')[0];

    const finalizedProfile: UserProfile = {
      ...formData,
      journeyStartDate: todayStr,
      journeyTargetEndDate: targetEnd,
      isJourneyStarted: true,
    };
    onComplete(finalizedProfile);
  };

  const togglePillar = (id: PillarId) => {
    const cur = formData.selectedPillars || [];
    if (cur.includes(id)) {
      if (cur.length > 1) {
        setFormData({ ...formData, selectedPillars: cur.filter((p) => p !== id) });
      }
    } else {
      setFormData({ ...formData, selectedPillars: [...cur, id] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-[#0B0B0D] border border-[#30262B] p-6 sm:p-8 text-right shadow-2xl space-y-6 my-auto">
        {/* Step Header */}
        <div className="space-y-2 border-b border-[#30262B] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#AAA2A7]">
              <span>الخطوة {step} من {totalSteps}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#F4F0F1]">ABSKA — 214</span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#6D1028]" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-[#151316] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6D1028] to-[#922D48] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: الهوية والبيانات الشخصية */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#F4F0F1]">مرحبًا بك في رحلة الـ 214 يومًا</h2>
              <p className="text-xs text-[#AAA2A7] mt-1 leading-relaxed">
                دعنا نتعرّف عليك لنصمّم إيقاعًا متدرجًا يحترم واقعك وطاقتك دون إرهاق.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الاسم أو اللقب المفضل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: أحمد، أو صاحب العزيمة"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">سنة الميلاد</label>
                  <input
                    type="number"
                    value={formData.birthYear || ''}
                    onChange={(e) => setFormData({ ...formData, birthYear: Number(e.target.value) || undefined })}
                    placeholder="1998"
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الطول (سم)</label>
                  <input
                    type="number"
                    value={formData.height || ''}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) || undefined })}
                    placeholder="175"
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الوزن الحالي (اختياري)</label>
                  <input
                    type="number"
                    value={formData.initialWeight || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value) || undefined;
                      setFormData({ ...formData, initialWeight: val, currentWeight: val });
                    }}
                    placeholder="75"
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">أبرز الأهداف التي تسعى إليها في هذه الرحلة</label>
                <textarea
                  rows={2}
                  value={formData.mainGoals.join('\n')}
                  onChange={(e) => setFormData({ ...formData, mainGoals: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="اكتب هدفًا في كل سطر..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: مجالات التطوير (شجرة الشخصية) */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#F4F0F1]">مجالات التطوير التي ترغب بالتركيز عليها</h2>
              <p className="text-xs text-[#AAA2A7] mt-1 leading-relaxed">
                حدد المسارات التي تريد تتبعها. لا يوجد مسار إلزامي؛ اختر ما يتوافق مع رؤيتك.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {PILLARS_LIST.map((pillar) => {
                const isSelected = formData.selectedPillars.includes(pillar.id);
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => togglePillar(pillar.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-right transition ${
                      isSelected
                        ? 'bg-[#151316] border-[#6D1028] shadow-inner'
                        : 'bg-[#0B0B0D] border-[#30262B] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#6D1028] text-white' : 'border border-[#30262B]'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F4F0F1]">{pillar.name}</div>
                      <div className="text-[10px] text-[#AAA2A7] mt-0.5 leading-relaxed">
                        {pillar.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: الوقت والطاقة والعادات */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#F4F0F1]">تنظيم الوقت والإيقاع اليومي</h2>
              <p className="text-xs text-[#AAA2A7] mt-1 leading-relaxed">
                حدد الوقت المتاح يوميًا ومستوى الصعوبة الذي يمنحك الاستمرارية بدل الاحتراق.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الوقت المتاح يوميًا للتحول</label>
                  <select
                    value={formData.dailyAvailableMinutes}
                    onChange={(e) => setFormData({ ...formData, dailyAvailableMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none"
                  >
                    <option value={30}>30 دقيقة (واقعي وهادئ)</option>
                    <option value={60}>ساعة واحدة (متوازن)</option>
                    <option value={90}>ساعة ونصف (نشط)</option>
                    <option value={120}>ساعتان فأكثر (مكثف)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">مستوى التدرج المفضل</label>
                  <select
                    value={formData.difficultyPreference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficultyPreference: e.target.value as 'gentle' | 'moderate' | 'rigorous',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none"
                  >
                    <option value="gentle">لطيف ومحافظ (يوصى به للاستمرارية)</option>
                    <option value="moderate">متوسط ومتوازن</option>
                    <option value="rigorous">مكثف وصارم</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">وقت النوم المعتاد</label>
                  <input
                    type="time"
                    value={formData.sleepTime}
                    onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">وقت الاستيقاظ المعتاد</label>
                  <input
                    type="time"
                    value={formData.wakeTime}
                    onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">أكبر التحديات التي تواجهك عادةً (مثل التسويف، التشتت)</label>
                <input
                  type="text"
                  value={formData.typicalChallenges.join('، ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      typicalChallenges: e.target.value.split('،').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="مثال: التسويف، قلة النوم، التشتت بالهاتف"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: ملخص الخطة والعهد «ابدأ رحلتي» */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#F4F0F1]">ملخص خطة التحوّل الشامل (214 يومًا)</h2>
              <p className="text-xs text-[#AAA2A7] mt-1 leading-relaxed">
                رحلتك تتألف من 8 مراحل متدرجة، تبدأ من اليوم الأول حتى إتمام اليوم الـ 214 بعون الله.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#151316] border border-[#30262B] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#AAA2A7]">الاسم المعتمد:</span>
                <span className="font-bold text-[#F4F0F1]">{formData.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#AAA2A7]">مدة الرحلة:</span>
                <span className="font-bold text-[#F4F0F1]">214 يومًا بالضبط</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#AAA2A7]">تاريخ البداية (اليوم الأول):</span>
                <span className="font-bold text-[#922D48]">{new Date().toLocaleDateString('ar-EG')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#AAA2A7]">الوقت المخصص يوميًا:</span>
                <span className="font-bold text-[#F4F0F1]">{formData.dailyAvailableMinutes} دقيقة</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#AAA2A7]">فلسفة النظام:</span>
                <span className="font-bold text-[#F4F0F1]">التقدم أهم من الكمال، والاستمرارية أهم من الحماس</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#3B0A18]/30 border border-[#6D1028]/40 text-xs text-[#AAA2A7] leading-relaxed">
              تذكير: بمجرد الضغط على «ابدأ رحلتي»، سيتم تثبيت تاريخ البداية رسميًا ولن يتغير عند إعادة تحميل الصفحة أو إغلاق التطبيق. يمكنك دائمًا تعديل تفاصيل ملفك من صفحة الإعدادات.
            </div>

            <button
              onClick={handleStartJourney}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6D1028] to-[#922D48] text-[#F4F0F1] text-sm font-extrabold shadow-lg hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>ابدأ رحلتي</span>
            </button>
          </div>
        )}

        {/* Step Navigation Footer */}
        {step < totalSteps && (
          <div className="flex items-center justify-between pt-2 border-t border-[#30262B]">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-[#AAA2A7] hover:text-[#F4F0F1] hover:bg-[#151316] transition"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 px-5 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-[#F4F0F1] text-xs font-bold transition shadow-sm"
            >
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
