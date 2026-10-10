import React, { useRef, useState } from 'react';
import {
  Calendar,
  Camera,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import { STAGES_DEFINITIONS } from '../services/sampleData';
import {
  BookItem,
  ProgressPhoto,
  SkillProject,
  StageReviewReport,
  TaskItem,
  UserProfile,
} from '../types';
import { compressImageFile } from '../utils/journeyMath';

interface ArchiveReportsViewProps {
  profile: UserProfile;
  currentDay: number;
  reviews: StageReviewReport[];
  photos: ProgressPhoto[];
  tasks: TaskItem[];
  books: BookItem[];
  projects: SkillProject[];
  onSaveReview: (review: StageReviewReport) => void;
  onSavePhoto: (photo: ProgressPhoto) => void;
  onDeletePhoto: (id: string) => void;
}

export const ArchiveReportsView: React.FC<ArchiveReportsViewProps> = ({
  profile,
  currentDay,
  reviews,
  photos,
  tasks,
  books,
  projects,
  onSaveReview,
  onSavePhoto,
  onDeletePhoto,
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'photos'>('reports');
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New report form state
  const currentStageNum = Math.min(8, Math.max(1, Math.ceil(currentDay / 30)));
  const [stageNum, setStageNum] = useState<number>(currentStageNum);
  const [improvedHabits, setImprovedHabits] = useState('');
  const [stubbornHabits, setStubbornHabits] = useState('');
  const [keyLesson, setKeyLesson] = useState('');
  const [nextStageGoal, setNextStageGoal] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');

  // Total photo storage size in KB
  const totalStorageBytes = photos.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);
  const totalStorageKB = Math.round(totalStorageBytes / 1024);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const stageTasks = tasks.filter((t) => {
      const s = STAGES_DEFINITIONS.find((x) => x.stageNumber === stageNum);
      return s ? t.dayNumber >= s.startDay && t.dayNumber <= s.endDay : true;
    });

    const completedT = stageTasks.filter((t) => t.status === 'completed').length;
    const postponedT = stageTasks.filter((t) => t.status === 'postponed').length;
    const rate = stageTasks.length > 0 ? Math.round((completedT / stageTasks.length) * 100) : 100;

    const report: StageReviewReport = {
      id: `review_${Date.now()}`,
      stageNumber: stageNum,
      stageTitle: STAGES_DEFINITIONS.find((s) => s.stageNumber === stageNum)?.title || `المرحلة ${stageNum}`,
      completedAt: new Date().toISOString(),
      completionRatePercent: rate,
      totalTasksCompleted: completedT,
      totalTasksPostponed: postponedT,
      improvedHabits: improvedHabits.split('\n').filter(Boolean),
      stubbornHabits: stubbornHabits.split('\n').filter(Boolean),
      activitySummary: `تم إنجاز ${completedT} مهمة خلال المرحلة بنسبة التزام ${rate}%.`,
      currentWeight: profile.currentWeight,
      booksProgressSummary: `كتب مكتملة: ${books.filter((b) => b.status === 'completed').length}`,
      skillsProgressSummary: `مشاريع منجزة: ${projects.filter((p) => p.completedAt).length}`,
      unlockedAchievementsCount: 0,
      keyLesson: keyLesson.trim() || 'الاستمرار بالحد الأدنى يحمي العزيمة من الانطفاء.',
      nextStageGoal: nextStageGoal.trim() || 'تعزيز الالتزام بالروتين الصباحي.',
      personalNotes: personalNotes.trim(),
    };

    onSaveReview(report);
    setShowAddReportModal(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { dataUrl, sizeBytes } = await compressImageFile(file);
      const newPhoto: ProgressPhoto = {
        id: `photo_${Date.now()}`,
        stageNumber: currentStageNum,
        dayNumber: currentDay,
        date: new Date().toISOString().split('T')[0],
        dataUrl,
        sizeBytes,
        notes: `صورة مرحلية توثيقية في اليوم ${currentDay}`,
      };
      onSavePhoto(newPhoto);
    } catch (err) {
      alert('حدث خطأ أثناء معالجة الصورة محليًا.');
    }
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#F4F0F1]">أرشيف التغيير والتقارير المرحلية</h1>
          <p className="text-xs text-[#AAA2A7] mt-0.5">
            توثيق دائم لمراجعات كل 30 يومًا، مع صور مرحلية اختيارية محفوظة محليًا على جهازك.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'reports' ? (
            <button
              onClick={() => setShowAddReportModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء تقرير مرحلي</span>
            </button>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>إضافة صورة مرحلية</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#30262B] pb-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-[#151316] text-[#F4F0F1] border border-[#6D1028]'
              : 'text-[#AAA2A7] hover:text-[#F4F0F1]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>التقارير المرحلية ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'photos'
              ? 'bg-[#151316] text-[#F4F0F1] border border-[#6D1028]'
              : 'text-[#AAA2A7] hover:text-[#F4F0F1]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>الصور والمقارنة البصرية ({photos.length})</span>
        </button>
      </div>

      {/* Reports Feed */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-3">
              <p className="text-xs text-[#AAA2A7]">
                لم تقم بإنشاء تقارير مرحلية بعد. في نهاية كل 30 يومًا، يتم توثيق الإنجازات والدروس.
              </p>
              <button
                onClick={() => setShowAddReportModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] text-white text-xs font-bold hover:bg-[#922D48] transition"
              >
                <Plus className="w-4 h-4" />
                <span>توثيق أول تقرير مرحلي</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-3xl bg-[#151316] border border-[#30262B] space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
                    <span className="text-[11px] text-[#AAA2A7]">
                      تاريخ الاعتماد: {new Date(rev.completedAt).toLocaleDateString('ar-EG')}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#F4F0F1]">{rev.stageTitle}</h3>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
                      <div className="text-[10px] text-[#AAA2A7]">نسبة الالتزام</div>
                      <div className="text-sm font-black text-[#922D48] mt-0.5">
                        {rev.completionRatePercent}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
                      <div className="text-[10px] text-[#AAA2A7]">مهام منجزة</div>
                      <div className="text-sm font-black text-[#F4F0F1] mt-0.5">
                        {rev.totalTasksCompleted}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
                      <div className="text-[10px] text-[#AAA2A7]">مهام مؤجلة</div>
                      <div className="text-sm font-black text-[#AAA2A7] mt-0.5">
                        {rev.totalTasksPostponed}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
                      <div className="text-[10px] text-[#AAA2A7]">الوزن (إن وجد)</div>
                      <div className="text-sm font-black text-[#F4F0F1] mt-0.5">
                        {rev.currentWeight ? `${rev.currentWeight} كجم` : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Lessons & Goals */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                    <div className="p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
                      <span className="font-bold text-[#F4F0F1] block mb-1">أهم درس مستفاد من المرحلة:</span>
                      <p className="text-[#AAA2A7]">«{rev.keyLesson}»</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B]">
                      <span className="font-bold text-[#F4F0F1] block mb-1">هدف المرحلة التالية:</span>
                      <p className="text-[#AAA2A7]">«{rev.nextStageGoal}»</p>
                    </div>
                  </div>

                  {rev.personalNotes && (
                    <div className="text-xs text-[#AAA2A7] leading-relaxed pt-1">
                      <strong>ملاحظات شخصية:</strong> {rev.personalNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photos & Comparison Feed */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#151316] border border-[#30262B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#F4F0F1]">الخصوصية والتخزين المحلي للصور:</span>
              <p className="text-[#AAA2A7] leading-relaxed">
                الصور مشفرة ومحفوظة داخل متصفحك محليًا (IndexedDB) دون رفعها لأي خادم. الصور اختيارية تمامًا ولا تشترط لاكتمال التقارير.
              </p>
            </div>
            <div className="text-[11px] text-[#AAA2A7] shrink-0 font-mono">
              المساحة المستهلكة: <strong className="text-[#F4F0F1]">{totalStorageKB} KB</strong>
            </div>
          </div>

          {photos.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-3">
              <p className="text-xs text-[#AAA2A7]">لا توجد صور مرحلية محفوظة حتى الآن.</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] text-white text-xs font-bold hover:bg-[#922D48] transition"
              >
                <Camera className="w-4 h-4" />
                <span>إضافة صورة من جهازك</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Side-by-side comparison (First photo vs Latest photo) */}
              {photos.length >= 2 && (
                <div className="p-5 rounded-3xl bg-[#151316] border border-[#30262B] space-y-3">
                  <h3 className="text-xs font-bold text-[#F4F0F1] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#922D48]" />
                    <span>مقارنة بصرية بين البداية والحالي:</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 text-center">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#0B0B0D] border border-[#30262B]">
                        <img
                          src={photos[0].dataUrl}
                          alt="بداية الرحلة"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[11px] font-bold text-[#AAA2A7]">
                        البداية (اليوم {photos[0].dayNumber})
                      </div>
                    </div>

                    <div className="space-y-1.5 text-center">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#0B0B0D] border border-[#30262B]">
                        <img
                          src={photos[photos.length - 1].dataUrl}
                          alt="المرحلة الحالية"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[11px] font-bold text-[#922D48]">
                        الحالي (اليوم {photos[photos.length - 1].dayNumber})
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Photos Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative rounded-2xl overflow-hidden bg-[#151316] border border-[#30262B] aspect-square flex flex-col justify-end p-2.5 shadow-md"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={`صورة اليوم ${photo.dayNumber}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                    <div className="relative z-10 flex items-center justify-between text-white text-[11px] font-bold">
                      <span>اليوم {photo.dayNumber}</span>
                      <button
                        onClick={() => onDeletePhoto(photo.id)}
                        className="p-1 rounded-lg bg-black/60 hover:bg-red-900/80 text-white transition"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Report Modal */}
      {showAddReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B0B0D] border border-[#30262B] p-6 text-right shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
              <button
                onClick={() => setShowAddReportModal(false)}
                className="p-1 rounded-xl text-[#AAA2A7] hover:text-[#F4F0F1]"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-bold text-[#F4F0F1]">إنشاء تقرير مرحلي</h3>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">المرحلة</label>
                <select
                  value={stageNum}
                  onChange={(e) => setStageNum(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                >
                  {STAGES_DEFINITIONS.map((s) => (
                    <option key={s.stageNumber} value={s.stageNumber}>
                      {s.title} (الأيام {s.startDay}–{s.endDay})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">عادات تحسنت خلال المرحلة</label>
                <textarea
                  rows={2}
                  value={improvedHabits}
                  onChange={(e) => setImprovedHabits(e.target.value)}
                  placeholder="القراءة المسائية، شرب الماء، تقليل التشتت..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">أهم درس مستفاد من هذه المرحلة</label>
                <input
                  type="text"
                  required
                  value={keyLesson}
                  onChange={(e) => setKeyLesson(e.target.value)}
                  placeholder="مثال: الاستمرار الهادئ أفضل من الاندفاع المفرط"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الهدف المقترح للمرحلة التالية</label>
                <input
                  type="text"
                  required
                  value={nextStageGoal}
                  onChange={(e) => setNextStageGoal(e.target.value)}
                  placeholder="مثال: إتمام قراءة كتابين وإنجاز مشروع المهارة"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">ملاحظات شخصية عامة</label>
                <textarea
                  rows={2}
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="أي مشاعر أو خلاصة..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-md"
                >
                  اعتماد وحفظ التقرير في الأرشيف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
