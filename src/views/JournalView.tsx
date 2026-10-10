import React, { useState } from 'react';
import {
  Calendar,
  Compass,
  Download,
  Heart,
  Plus,
  Smile,
  Sparkles,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { PILLARS_LIST } from '../services/sampleData';
import { JournalEntry, PillarId, UserProfile } from '../types';

interface JournalViewProps {
  journalEntries: JournalEntry[];
  currentDay: number;
  profile: UserProfile;
  onSaveEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  journalEntries,
  currentDay,
  profile,
  onSaveEntry,
  onDeleteEntry,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [mood, setMood] = useState<JournalEntry['mood']>('good');
  const [whatWentWell, setWhatWentWell] = useState('');
  const [whatWasDifficult, setWhatWasDifficult] = useState('');
  const [whatILearned, setWhatILearned] = useState('');
  const [habitToUnderstand, setHabitToUnderstand] = useState('');
  const [whatCanAdjustTomorrow, setWhatCanAdjustTomorrow] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [valuesLived, setValuesLived] = useState('');
  const [freeNotes, setFreeNotes] = useState('');
  const [associatedPillar, setAssociatedPillar] = useState<PillarId>('self_discovery');

  const filteredEntries = journalEntries
    .filter((e) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.whatWentWell.toLowerCase().includes(q) ||
        e.whatWasDifficult.toLowerCase().includes(q) ||
        e.freeNotes.toLowerCase().includes(q) ||
        e.gratitude.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.dayNumber - a.dayNumber);

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: JournalEntry = {
      id: `journal_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dayNumber: currentDay,
      energyLevel,
      mood,
      whatWentWell: whatWentWell.trim(),
      whatWasDifficult: whatWasDifficult.trim(),
      whatILearnedAboutMyself: whatILearned.trim(),
      habitToUnderstand: habitToUnderstand.trim(),
      whatCanIAdjustTomorrow: whatCanAdjustTomorrow.trim(),
      gratitude: gratitude.trim(),
      valuesLived: valuesLived.trim(),
      freeNotes: freeNotes.trim(),
      associatedPillar,
    };

    onSaveEntry(entry);
    setShowAddModal(false);
    // Reset
    setWhatWentWell('');
    setWhatWasDifficult('');
    setWhatILearned('');
    setHabitToUnderstand('');
    setWhatCanAdjustTomorrow('');
    setGratitude('');
    setValuesLived('');
    setFreeNotes('');
  };

  const handleExportJournal = () => {
    const textContent = journalEntries
      .map(
        (e) =>
          `[اليوم ${e.dayNumber} - ${e.date}]\nطاقة: ${e.energyLevel}/5 | مزاج: ${e.mood}\nما سار جيدًا: ${e.whatWentWell}\nما كان صعبًا: ${e.whatWasDifficult}\nامتنان: ${e.gratitude}\nملاحظات: ${e.freeNotes}\n-----------------------------------\n`
      )
      .join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `مذكرات_ABSKA_اليوم_${currentDay}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#F4F0F1]">دفتر اكتشاف الذات والتأمل</h1>
          <p className="text-xs text-[#AAA2A7] mt-0.5">
            مساحة خاصة وآمنة لتوثيق المشاعر، وفهم العادات، وتأمل السلوك دون أحكام مسبقة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {journalEntries.length > 0 && (
            <button
              onClick={handleExportJournal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#151316] hover:bg-[#20151b] border border-[#30262B] text-xs font-semibold text-[#AAA2A7] hover:text-[#F4F0F1] transition"
              title="تصدير المذكرات كملف نصي"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير المذكرات</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>تدوين تأمل اليوم</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {journalEntries.length > 0 && (
        <div className="p-2 rounded-2xl bg-[#151316] border border-[#30262B]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في مذكراتك وتأملاتك السابقة..."
            className="w-full px-3 py-1.5 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
          />
        </div>
      )}

      {/* Entries Feed */}
      {filteredEntries.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-3">
          <p className="text-xs text-[#AAA2A7]">
            {searchQuery
              ? 'لا توجد نتائج بحث مطابقة.'
              : 'دفتر اكتشاف الذات فارغ حتى الآن. التدوين الصادق هو مرآة التحوّل.'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] text-white text-xs font-bold hover:bg-[#922D48] transition"
          >
            <Plus className="w-4 h-4" />
            <span>كتابة أول تدوينة تأملية</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-5 rounded-3xl bg-[#151316] border border-[#30262B] space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#30262B] pb-2.5">
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1 rounded-lg text-[#AAA2A7] hover:text-red-400"
                  title="حذف التدوينة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#AAA2A7]">الطاقة: {entry.energyLevel}/5</span>
                  <span className="text-[#AAA2A7]">·</span>
                  <span className="font-bold text-[#F4F0F1]">اليوم {entry.dayNumber}</span>
                  <span className="text-[10px] text-[#AAA2A7]">({entry.date})</span>
                </div>
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                {entry.whatWentWell && (
                  <div className="p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
                    <span className="font-bold text-[#F4F0F1] block mb-1">ما سار جيدًا اليوم:</span>
                    <p className="text-[#AAA2A7]">{entry.whatWentWell}</p>
                  </div>
                )}

                {entry.whatWasDifficult && (
                  <div className="p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
                    <span className="font-bold text-[#F4F0F1] block mb-1">ما كان صعبًا:</span>
                    <p className="text-[#AAA2A7]">{entry.whatWasDifficult}</p>
                  </div>
                )}

                {entry.gratitude && (
                  <div className="p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
                    <span className="font-bold text-[#F4F0F1] block mb-1">أشياء أمتن لها:</span>
                    <p className="text-[#AAA2A7]">{entry.gratitude}</p>
                  </div>
                )}

                {entry.whatILearnedAboutMyself && (
                  <div className="p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
                    <span className="font-bold text-[#F4F0F1] block mb-1">ما تعلمته عن نفسي:</span>
                    <p className="text-[#AAA2A7]">{entry.whatILearnedAboutMyself}</p>
                  </div>
                )}
              </div>

              {entry.freeNotes && (
                <div className="text-xs text-[#AAA2A7] leading-relaxed pt-1">
                  <strong>خواطر حرة:</strong> {entry.freeNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Journal Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-[#0B0B0D] border border-[#30262B] p-6 text-right shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-[#AAA2A7] hover:text-[#F4F0F1]"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-bold text-[#F4F0F1]">تدوين تأمل اليوم (اليوم {currentDay})</h3>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3 bg-[#151316] p-3 rounded-2xl border border-[#30262B]">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">
                    مستوى الطاقة اليوم ({energyLevel}/5)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full accent-[#6D1028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">المزاج العام</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as JournalEntry['mood'])}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  >
                    <option value="excellent">ممتاز ومتحمس</option>
                    <option value="good">جيد ومستقر</option>
                    <option value="neutral">محايد</option>
                    <option value="tired">مرهق</option>
                    <option value="stressed">مضغوط</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">1. ما الذي سار بشكل جيد اليوم؟</label>
                <textarea
                  rows={2}
                  value={whatWentWell}
                  onChange={(e) => setWhatWentWell(e.target.value)}
                  placeholder="حتى لو كان إنجازًا صغيرًا كشرب الماء أو المشي..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">2. ما الذي كان صعبًا أو استهلك طاقتك؟</label>
                <textarea
                  rows={2}
                  value={whatWasDifficult}
                  onChange={(e) => setWhatWasDifficult(e.target.value)}
                  placeholder="موقف، شعور، أو تسويف حدث اليوم..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">3. ما الأمور التي تشعر بالامتنان لوجودها اليوم؟</label>
                <input
                  type="text"
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  placeholder="مثال: صحتي، قهوة الصباح، دعم صديق..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">4. ما الشيء الذي أستطيع تعديله غدًا ليكون اليوم أفضل؟</label>
                <input
                  type="text"
                  value={whatCanAdjustTomorrow}
                  onChange={(e) => setWhatCanAdjustTomorrow(e.target.value)}
                  placeholder="تعديل وقت النوم، تقليل الهاتف في المساء..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">مساحة حرة للخواطر والأفكار</label>
                <textarea
                  rows={2}
                  value={freeNotes}
                  onChange={(e) => setFreeNotes(e.target.value)}
                  placeholder="أي فكرة تخطر ببالك..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-md"
                >
                  حفظ التدوينة في الدفتر الشخصي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
