import React, { useState } from 'react';
import { Award, BookOpen, Check, Lock, Mail, Sparkles, Unlock, X } from 'lucide-react';
import { BookItem, SkillProject, TaskItem, UserProfile } from '../types';

interface DayLetterModalProps {
  profile: UserProfile;
  currentDay: number;
  tasks: TaskItem[];
  books: BookItem[];
  projects: SkillProject[];
  onClose: () => void;
  onSaveLetter: (letterText: string) => void;
  isInline?: boolean;
}

export const DayLetterModal: React.FC<DayLetterModalProps> = ({
  profile,
  currentDay,
  tasks,
  books,
  projects,
  onClose,
  onSaveLetter,
  isInline = false,
}) => {
  const [whyStarted, setWhyStarted] = useState('');
  const [whatToChange, setWhatToChange] = useState('');
  const [biggestFear, setBiggestFear] = useState('');
  const [visionIn214, setVisionIn214] = useState('');
  const [realisticPromise, setRealisticPromise] = useState('');
  const [allowEarlyUnlock, setAllowEarlyUnlock] = useState(false);

  const isDay214OrCompleted = currentDay >= 214;
  const isLetterWritten = profile.sealedLetterWritten;

  const handleSealLetter = () => {
    const fullText = [
      `[لماذا بدأت الرحلة]:\n${whyStarted}`,
      `[ما الذي أردت تغييره]:\n${whatToChange}`,
      `[أكثر ما كان يقلقني]:\n${biggestFear}`,
      `[رؤيتي لحياتي بعد 214 يومًا]:\n${visionIn214}`,
      `[وعدي الواقعي لنفسي]:\n${realisticPromise}`,
    ].join('\n\n');

    onSaveLetter(fullText);
  };

  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const completedBooksCount = books.filter((b) => b.status === 'completed').length;
  const completedProjectsCount = projects.filter((p) => p.completedAt).length;

  const content = (
    <div className={`w-full max-w-xl rounded-3xl bg-[#0B0B0D] border border-[#30262B] p-6 text-right shadow-2xl space-y-5 ${isInline ? 'mx-auto' : 'my-auto'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
        {!isInline ? (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#AAA2A7] hover:text-[#F4F0F1] hover:bg-[#151316] transition"
          >
            <X className="w-5 h-5" />
          </button>
        ) : <div />}

          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-[#F4F0F1]">
              رسالة من نفسي القديمة (كبسولة الـ 214 يومًا)
            </h3>
            <div className="p-1.5 rounded-xl bg-[#3B0A18] text-[#922D48]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* State A: Letter already sealed, not yet Day 214 */}
        {isLetterWritten && !isDay214OrCompleted && !allowEarlyUnlock && (
          <div className="space-y-4 py-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#151316] border border-[#6D1028] mx-auto flex items-center justify-center text-[#922D48]">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F4F0F1]">رسالتك مختومة ومحفوظة بأمان محليًا</h4>
              <p className="text-xs text-[#AAA2A7] mt-1 max-w-sm mx-auto leading-relaxed">
                كُتبت هذه الرسالة في بداية الرحلة. وفق نظام ABSKA 214، تُفتح الرسالة رسميًا في اليوم الـ 214 لتقارن بين من كنت ومن أصبحت.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#151316] border border-[#30262B] text-xs text-[#AAA2A7] max-w-md mx-auto">
              أنت الآن في اليوم <strong className="text-[#F4F0F1]">{currentDay}</strong> من 214. تبقّى {Math.max(0, 214 - currentDay)} يومًا حتى موعد فك الختم.
            </div>

            <button
              onClick={() => setAllowEarlyUnlock(true)}
              className="text-[11px] text-[#AAA2A7] hover:text-[#F4F0F1] underline underline-offset-4"
            >
              (معاينة الرسالة الآن لغرض الاختبار)
            </button>
          </div>
        )}

        {/* State B: Day 214 Unveiling or Early test preview */}
        {isLetterWritten && (isDay214OrCompleted || allowEarlyUnlock) && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#3B0A18]/60 to-[#151316] border border-[#6D1028] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F4F0F1]">
                <Unlock className="w-4 h-4 text-[#922D48]" />
                <span>فضّ الختم: رسالتك التي كتبتها في بداية الرحلة</span>
              </div>
              <p className="text-xs text-[#AAA2A7] leading-relaxed">
                انظر كيف بدأت الرحلة وما كنت تطمح إليه، وقارنه بما حققته على أرض الواقع.
              </p>
            </div>

            {/* Letter content */}
            <div className="p-4 rounded-2xl bg-[#151316] border border-[#30262B] max-h-56 overflow-y-auto text-xs text-[#F4F0F1] whitespace-pre-wrap leading-relaxed">
              {profile.sealedLetterText || 'لا توجد نصوص محفوظة في الرسالة.'}
            </div>

            {/* Real Transformation Summary comparison */}
            <div className="p-4 rounded-2xl bg-[#0B0B0D] border border-[#30262B] space-y-2 text-xs">
              <h5 className="font-bold text-[#F4F0F1] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#922D48]" />
                <span>حصاد التحوّل الموثّق في السجلات الفعلية:</span>
              </h5>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-[#151316] border border-[#30262B]">
                  <div className="font-extrabold text-[#F4F0F1] text-sm">{completedTasksCount}</div>
                  <div className="text-[10px] text-[#AAA2A7]">مهام منجزة</div>
                </div>
                <div className="p-2 rounded-xl bg-[#151316] border border-[#30262B]">
                  <div className="font-extrabold text-[#F4F0F1] text-sm">{completedBooksCount}</div>
                  <div className="text-[10px] text-[#AAA2A7]">كتب مكتملة</div>
                </div>
                <div className="p-2 rounded-xl bg-[#151316] border border-[#30262B]">
                  <div className="font-extrabold text-[#F4F0F1] text-sm">{completedProjectsCount}</div>
                  <div className="text-[10px] text-[#AAA2A7]">مشاريع مهارات</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State C: Letter not yet written (Day 1 initial writing) */}
        {!isLetterWritten && (
          <div className="space-y-4">
            <p className="text-xs text-[#AAA2A7] leading-relaxed">
              اكتب رسالة صادقة لنفسك التي ستكون في اليوم الـ 214. سيتم قفلها ولن تراها مجددًا إلا عند إتمام الرحلة.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">1. لماذا بدأت هذه الرحلة بالذات؟</label>
                <textarea
                  rows={2}
                  value={whyStarted}
                  onChange={(e) => setWhyStarted(e.target.value)}
                  placeholder="الدافع الجوهري للبدء..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">2. ما أكثر شيء ترغب في تغييره؟</label>
                <textarea
                  rows={2}
                  value={whatToChange}
                  onChange={(e) => setWhatToChange(e.target.value)}
                  placeholder="العادة أو النمط الذي تريد تجاوزه..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">3. ما أكثر شيء يقلقك أو تخشى مواجهته؟</label>
                <textarea
                  rows={2}
                  value={biggestFear}
                  onChange={(e) => setBiggestFear(e.target.value)}
                  placeholder="المخاوف والعوائق المتوقعة..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">4. كيف تتمنى أن تكون حياتك وشعورك بعد 214 يومًا؟</label>
                <textarea
                  rows={2}
                  value={visionIn214}
                  onChange={(e) => setVisionIn214(e.target.value)}
                  placeholder="صورتك المستقبلية الواضحة..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">5. ما الوعد الواقعي الصادق الذي تقدمه لنفسك الآن؟</label>
                <textarea
                  rows={2}
                  value={realisticPromise}
                  onChange={(e) => setRealisticPromise(e.target.value)}
                  placeholder="الوعد بالاستمرار والعودة عند التعثر..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-[#F4F0F1] text-xs focus:outline-none focus:border-[#6D1028]"
                />
              </div>
            </div>

            <button
              onClick={handleSealLetter}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6D1028] to-[#922D48] text-[#F4F0F1] text-xs font-bold shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>ختم الرسالة وحفظها في كبسولة الزمن حتى اليوم 214</span>
            </button>
          </div>
        )}
      </div>
    );

  if (isInline) {
    return <div className="space-y-4 pb-24">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      {content}
    </div>
  );
};
