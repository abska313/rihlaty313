import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Database,
  Download,
  Info,
  RefreshCw,
  Save,
  Shield,
  Sliders,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  exportFullBackup,
  importFullBackup,
  resetAllData,
  validateBackupData,
} from '../services/db';
import { BackupData, UserProfile } from '../types';
import { getJourneyDayInfo } from '../utils/journeyMath';

interface SettingsBackupViewProps {
  profile: UserProfile;
  currentDay: number;
  onSaveProfile: (profile: UserProfile) => void;
  onDataRestored: () => void;
}

export const SettingsBackupView: React.FC<SettingsBackupViewProps> = ({
  profile,
  currentDay,
  onSaveProfile,
  onDataRestored,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [importPreview, setImportPreview] = useState<{ data: BackupData; summary: string } | null>(null);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dayInfo = getJourneyDayInfo(profile);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaveSuccessMsg('تم حفظ الإعدادات بنجاح!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleExport = async () => {
    try {
      const backup = await exportFullBackup();
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ABSKA_214_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('فشل تصدير النسخة الاحتياطية.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const val = validateBackupData(parsed);
        if (val.valid && val.summary) {
          setImportPreview({ data: parsed, summary: val.summary });
          setImportError('');
        } else {
          setImportError(val.error || 'الملف غير صالح');
          setImportPreview(null);
        }
      } catch {
        setImportError('فشل قراءة الملف. تأكد من أنه ملف JSON سليم.');
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;
    try {
      await importFullBackup(importPreview.data);
      alert('تمت استعادة البيانات بنجاح!');
      setImportPreview(null);
      onDataRestored();
    } catch (err: any) {
      alert(`خطأ أثناء الاستعادة: ${err.message}`);
    }
  };

  const handleFactoryReset = async () => {
    const c1 = confirm('تحذير شديد: هل أنت متأكد من رغبتك في حذف جميع البيانات المحلية وإعادة ضبط التطبيق؟');
    if (!c1) return;
    const c2 = confirm('تأكيد نهائي: سيتم مسح المهام، المذكرات، السجلات، والكتب نهائيًا ولا يمكن التراجع.');
    if (!c2) return;

    await resetAllData();
    window.location.reload();
  };

  const handleSimulateDay = (targetDay: number) => {
    // Calculate required offset from day 1
    const offset = targetDay - 1;
    const updated = {
      ...formData,
      simulatedDayOffset: offset,
    };
    setFormData(updated);
    onSaveProfile(updated);
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      <div>
        <h1 className="text-xl font-black text-[#F4F0F1]">الإعدادات والنسخ الاحتياطي والتحكم</h1>
        <p className="text-xs text-[#AAA2A7] mt-0.5">
          إدارة ملفك الشخصي، تصدير واستعادة بياناتك بصيغة JSON، والتحكم في خصائص النظام.
        </p>
      </div>

      {/* User Profile Form */}
      <form
        onSubmit={handleSaveSettings}
        className="p-6 rounded-3xl bg-[#151316] border border-[#30262B] space-y-4 shadow-lg"
      >
        <h2 className="text-sm font-bold text-[#F4F0F1]">الملف الشخصي والإيقاع اليومي</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الاسم أو اللقب</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الوقت المتاح يوميًا (دقائق)</label>
            <input
              type="number"
              value={formData.dailyAvailableMinutes}
              onChange={(e) => setFormData({ ...formData, dailyAvailableMinutes: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">وقت النوم المعتاد</label>
            <input
              type="time"
              value={formData.sleepTime}
              onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">وقت الاستيقاظ المعتاد</label>
            <input
              type="time"
              value={formData.wakeTime}
              onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2 pt-2 border-t border-[#30262B]">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B] cursor-pointer">
            <div>
              <div className="text-xs font-bold text-[#F4F0F1]">التكيّف الذكي بالقواعد المحلية</div>
              <div className="text-[10px] text-[#AAA2A7]">اقتراح تخفيف المهام وتعديل اليوم وفق السجلات الواقعية</div>
            </div>
            <input
              type="checkbox"
              checked={formData.smartGradingEnabled}
              onChange={(e) => setFormData({ ...formData, smartGradingEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#6D1028]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B] cursor-pointer">
            <div>
              <div className="text-xs font-bold text-[#F4F0F1]">التذكيرات الداخلية عند فتح التطبيق</div>
              <div className="text-[10px] text-[#AAA2A7]">تنبيه بمهام اليوم غير المكتملة أو اقتراب نهاية المرحلة</div>
            </div>
            <input
              type="checkbox"
              checked={formData.inAppRemindersEnabled}
              onChange={(e) => setFormData({ ...formData, inAppRemindersEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#6D1028]"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التعديلات في الإعدادات</span>
        </button>

        {saveSuccessMsg && (
          <div className="text-xs font-bold text-center text-[#F4F0F1] py-1">
            {saveSuccessMsg}
          </div>
        )}
      </form>

      {/* Backup & Restore Section */}
      <div className="p-6 rounded-3xl bg-[#151316] border border-[#30262B] space-y-4 shadow-lg">
        <h2 className="text-sm font-bold text-[#F4F0F1] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#922D48]" />
          <span>النسخ الاحتياطي وإدارة البيانات (JSON)</span>
        </h2>
        <p className="text-xs text-[#AAA2A7] leading-relaxed">
          جميع بياناتك محفوظة محليًا داخل جهازك. يتيح لك التصدير حفظ نسخة احتياطية آمنة ونقلها إلى أي جهاز آخر بكل سهولة.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0B0B0D] hover:bg-[#20151b] border border-[#30262B] text-xs font-bold text-[#F4F0F1] transition shadow-sm"
          >
            <Download className="w-4 h-4 text-[#922D48]" />
            <span>تصدير نسخة احتياطية كاملة (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0B0B0D] hover:bg-[#20151b] border border-[#30262B] text-xs font-bold text-[#F4F0F1] transition shadow-sm"
          >
            <Upload className="w-4 h-4 text-[#922D48]" />
            <span>استيراد نسخة سابقة (JSON)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Import Error Message */}
        {importError && (
          <div className="p-3 rounded-2xl bg-red-950/40 border border-red-800 text-xs text-red-200">
            {importError}
          </div>
        )}

        {/* Import Preview Modal / Card */}
        {importPreview && (
          <div className="p-4 rounded-2xl bg-[#0B0B0D] border border-[#6D1028] space-y-3">
            <h4 className="text-xs font-bold text-[#F4F0F1]">معاينة النسخة قبل الاستبدال:</h4>
            <p className="text-xs text-[#AAA2A7]">{importPreview.summary}</p>
            <p className="text-[11px] text-amber-400">
              تنبيه: الاستيراد سيستبدل السجلات الحالية بالبيانات الموجودة في ملف النسخة الاحتياطية.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleConfirmImport}
                className="flex-1 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition"
              >
                تأكيد الاستعادة الآن
              </button>
              <button
                onClick={() => setImportPreview(null)}
                className="px-3 py-2 rounded-xl bg-[#151316] text-[#AAA2A7] text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Journey Milestone Testing Simulator */}
      <div className="p-6 rounded-3xl bg-[#151316] border border-[#30262B] space-y-3 shadow-lg">
        <h2 className="text-sm font-bold text-[#F4F0F1] flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#922D48]" />
          <span>محاكي أيام الرحلة (للاختبار والمراجعة)</span>
        </h2>
        <p className="text-xs text-[#AAA2A7] leading-relaxed">
          يمكّنك هذا المحاكي من اختبار سلوك التطبيق في أيام معينة (اليوم 1، 30، 31، 210، 214) دون تغيير ساعة الجهاز الحقيقية.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[
            { day: 1, label: 'اليوم 1 (البداية)' },
            { day: 30, label: 'اليوم 30 (نهاية مرحلة 1)' },
            { day: 31, label: 'اليوم 31 (بدء مرحلة 2)' },
            { day: 210, label: 'اليوم 210 (نهاية مرحلة 7)' },
            { day: 214, label: 'اليوم 214 (الختام وفك الختم)' },
          ].map((item) => (
            <button
              key={item.day}
              onClick={() => handleSimulateDay(item.day)}
              className="px-3 py-1.5 rounded-xl bg-[#0B0B0D] hover:bg-[#3B0A18] text-xs font-semibold text-[#AAA2A7] hover:text-[#F4F0F1] border border-[#30262B] transition"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleSimulateDay(1)}
            className="px-3 py-1.5 rounded-xl bg-[#151316] text-xs text-[#AAA2A7] hover:text-white"
          >
            إعادة تعيين المحاكاة
          </button>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="p-6 rounded-3xl bg-[#151316] border border-red-950/50 space-y-3">
        <h2 className="text-sm font-bold text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>منطقة الخطر: إعادة ضبط المصنع</span>
        </h2>
        <p className="text-xs text-[#AAA2A7] leading-relaxed">
          حذف جميع البيانات والسجلات والمهام المخزنة على هذا الجهاز نهائيًا والعودة لشاشة الترحيب.
        </p>
        <button
          onClick={handleFactoryReset}
          className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold transition"
        >
          إعادة ضبط ومسح جميع البيانات
        </button>
      </div>
    </div>
  );
};
