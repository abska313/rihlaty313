import React from 'react';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Compass,
  Info,
  Layers,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { analyzeRootCauses } from '../services/smartGrading';
import {
  JournalEntry,
  RelapseRecord,
  TaskItem,
  ToughDayLog,
  UserProfile,
} from '../types';

interface RootCauseAnalysisViewProps {
  tasks: TaskItem[];
  journalEntries: JournalEntry[];
  relapses: RelapseRecord[];
  toughDays: ToughDayLog[];
  profile: UserProfile;
}

export const RootCauseAnalysisView: React.FC<RootCauseAnalysisViewProps> = ({
  tasks,
  journalEntries,
  relapses,
  toughDays,
  profile,
}) => {
  const { insights, sampleSizeDays, dataQuality } = analyzeRootCauses(
    tasks,
    journalEntries,
    relapses,
    toughDays,
    profile
  );

  return (
    <div className="space-y-6 pb-24 text-right">
      <div>
        <h1 className="text-xl font-black text-[#F4F0F1]">تحليل أسباب التعثر السلوكي</h1>
        <p className="text-xs text-[#AAA2A7] mt-0.5">
          استقراء أنماط التأجيل وفترات انخفاض الطاقة من واقع سجلاتك الفعلية لتقديم حلول واقعية.
        </p>
      </div>

      {/* Sample Size Transparency Banner */}
      <div className="p-4 rounded-3xl bg-[#151316] border border-[#30262B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#922D48]" />
            <span className="font-bold text-[#F4F0F1]">
              حجم العينة المعتمدة في التحليل: {sampleSizeDays} أيام موثقة
            </span>
          </div>
          <p className="text-[#AAA2A7] leading-relaxed">
            {dataQuality === 'robust'
              ? 'العينة كافية لاستخراج أنماط سلوكية قوية ومتكررة.'
              : dataQuality === 'forming'
              ? 'الأنماط قيد التكوين الأولي؛ كل يوم توثيق إضافي يزيد من دقة الاستنتاجات.'
              : 'البيانات ما زالت في بدايتها. دوّن مهامك وملاحظاتك لعدة أيام لتظهر النتائج.'}
          </p>
        </div>

        <div className="text-[11px] px-3 py-1 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-[#AAA2A7] font-semibold">
          {dataQuality === 'robust' ? 'بيانات قوية' : dataQuality === 'forming' ? 'قيد التكوين' : 'بداية التوثيق'}
        </div>
      </div>

      {/* Insights Cards */}
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-[#151316] border border-[#30262B] space-y-3 shadow-md"
          >
            <div className="flex items-center justify-between border-b border-[#30262B] pb-2.5">
              <span className="text-[10px] text-[#922D48] font-bold">
                {insight.confidence === 'high'
                  ? 'ثقة عالية في النمط'
                  : insight.confidence === 'moderate'
                  ? 'نمط مرجّح'
                  : 'ملاحظة أولية'}
              </span>
              <h3 className="text-xs font-bold text-[#F4F0F1] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#922D48]" />
                <span>{insight.headline}</span>
              </h3>
            </div>

            <p className="text-xs text-[#AAA2A7] leading-relaxed">
              {insight.detail}
            </p>

            <div className="p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B] text-xs space-y-1">
              <span className="font-bold text-[#F4F0F1] block">الاقتراح العملي القابل للتطبيق:</span>
              <p className="text-[#AAA2A7] leading-relaxed">{insight.recommendation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer on Psychological/Medical Diagnostics */}
      <div className="p-4 rounded-3xl bg-[#0B0B0D] border border-[#30262B] text-[11px] text-[#AAA2A7] leading-relaxed">
        <strong>تنويه منهجي:</strong> هذا التحليل مبني على سجلات أوقات المهام وحالات التأجيل المحفوظة محليًا فقط. لا يمثل تشخيصًا طبيًا أو نفسيًا ولا يدعي ذلك. الاقتراحات احتمالية وقابلة للمراجعة والتعديل بحرية كاملة من جانبك.
      </div>
    </div>
  );
};
