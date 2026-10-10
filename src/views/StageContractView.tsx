import React, { useState } from 'react';
import {
  CheckCircle,
  FileSignature,
  History,
  Lock,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { STAGES_DEFINITIONS } from '../services/sampleData';
import { StageContract, UserProfile } from '../types';
import { getJourneyDayInfo } from '../utils/journeyMath';

interface StageContractViewProps {
  profile: UserProfile;
  contracts: StageContract[];
  onSaveContract: (contract: StageContract) => void;
}

export const StageContractView: React.FC<StageContractViewProps> = ({
  profile,
  contracts,
  onSaveContract,
}) => {
  const dayInfo = getJourneyDayInfo(profile);
  const currentStageNum = dayInfo.currentStage.stageNumber;

  const [selectedStageNum, setSelectedStageNum] = useState<number>(currentStageNum);

  const activeContract =
    contracts.find((c) => c.stageNumber === selectedStageNum) || {
      stageNumber: selectedStageNum,
      stageTitle: STAGES_DEFINITIONS.find((s) => s.stageNumber === selectedStageNum)?.title || '',
      mainGoal: STAGES_DEFINITIONS.find((s) => s.stageNumber === selectedStageNum)?.coreObjective || '',
      topThreeGoals: [
        'الالتزام بالحد الأدنى اليومي مهما كانت الظروف',
        'تدوين ملاحظة في دفتر اكتشاف الذات بانتظام',
        'التعامل برفق وعقلانية مع أيام الطاقة المنخفضة',
      ],
      whatToImprove: 'جودة البدايات اليومية والتركيز الذهني',
      whatToStopOrReduce: 'التسويف المبرر والتشتت غير المفيد',
      minimumAcceptableStandard: 'تنفيذ مهمة واحدة مصغرة حتى في أصعب الأيام',
      anticipatedObstacles: 'انخفاض الحماس المفاجئ أو ضيق الوقت',
      toughDayPlan: 'تفعيل وضع اليوم الصعب فترات الإجهاد بدلاً من الانقطاع التام',
      chosenReward: 'مكافأة هادئة تليق بإنهاء المرحلة دون إسراف',
      version: 1,
    };

  const [formData, setFormData] = useState<StageContract>({ ...activeContract });
  const [isSigned, setIsSigned] = useState<boolean>(!!activeContract.signedAt);

  const handleStageTabChange = (num: number) => {
    setSelectedStageNum(num);
    const existing = contracts.find((c) => c.stageNumber === num);
    if (existing) {
      setFormData({ ...existing });
      setIsSigned(!!existing.signedAt);
    } else {
      const defaultData: StageContract = {
        stageNumber: num,
        stageTitle: STAGES_DEFINITIONS.find((s) => s.stageNumber === num)?.title || '',
        mainGoal: STAGES_DEFINITIONS.find((s) => s.stageNumber === num)?.coreObjective || '',
        topThreeGoals: [
          'الالتزام بالحد الأدنى اليومي',
          'تدوين الملاحظات الذاتية',
          'استئناف الروتين بسرعة عند التعثر',
        ],
        whatToImprove: 'الانضباط والتركيز',
        whatToStopOrReduce: 'التأجيل العشوائي',
        minimumAcceptableStandard: 'تنفيذ مهمة واحدة مصغرة',
        anticipatedObstacles: 'تقلب المزاج أو ضغط الوقت',
        toughDayPlan: 'تفعيل وضع اليوم الصعب',
        chosenReward: 'مكافأة شخصية معتدلة',
        version: 1,
      };
      setFormData(defaultData);
      setIsSigned(false);
    }
  };

  const handleSignContract = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StageContract = {
      ...formData,
      signedAt: new Date().toISOString(),
      version: (formData.version || 1) + (formData.signedAt ? 1 : 0),
    };
    onSaveContract(updated);
    setIsSigned(true);
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      <div>
        <h1 className="text-xl font-black text-[#F4F0F1]">عقد المرحلة الشخصي</h1>
        <p className="text-xs text-[#AAA2A7] mt-0.5">
          عهد مكتوب مع الذات في بداية كل مرحلة؛ وثيقة ملزمة أخلاقيًا تحميك من التسويف وتحدد خطة الأيام الصعبة.
        </p>
      </div>

      {/* Stage Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STAGES_DEFINITIONS.map((s) => {
          const isSelected = selectedStageNum === s.stageNumber;
          const isCurrent = currentStageNum === s.stageNumber;
          const contractItem = contracts.find((c) => c.stageNumber === s.stageNumber);

          return (
            <button
              key={s.stageNumber}
              onClick={() => handleStageTabChange(s.stageNumber)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
                isSelected
                  ? 'bg-[#6D1028] border-[#922D48] text-white shadow-sm'
                  : 'bg-[#151316] border-[#30262B] text-[#AAA2A7] hover:text-[#F4F0F1]'
              }`}
            >
              <span>المرحلة {s.stageNumber}</span>
              {contractItem?.signedAt && <span className="mr-1 text-[10px] text-white">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Contract Parchment Card */}
      <form
        onSubmit={handleSignContract}
        className="p-6 rounded-3xl bg-gradient-to-br from-[#151316] to-[#1e1319] border border-[#30262B] space-y-5 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#30262B] pb-4">
          <div className="flex items-center gap-2">
            {formData.signedAt ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#922D48]">
                <ShieldCheck className="w-4 h-4" />
                <span>معتمد وموقّع (الإصدار {formData.version})</span>
              </span>
            ) : (
              <span className="text-[11px] text-[#AAA2A7]">مسودة قيد الاعتماد</span>
            )}
          </div>
          <h2 className="text-sm font-extrabold text-[#F4F0F1] flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-[#922D48]" />
            <span>وثيقة عهد: {STAGES_DEFINITIONS.find((s) => s.stageNumber === selectedStageNum)?.title}</span>
          </h2>
        </div>

        {/* Contract Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#AAA2A7] mb-1">الهدف الرئيسي للمرحلة</label>
            <textarea
              rows={2}
              value={formData.mainGoal}
              onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#AAA2A7] mb-1">أهم ثلاثة التزامات أتعهد بها في هذه المرحلة</label>
            <div className="space-y-2">
              {[0, 1, 2].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  value={formData.topThreeGoals[idx] || ''}
                  onChange={(e) => {
                    const copy = [...formData.topThreeGoals] as [string, string, string];
                    copy[idx] = e.target.value;
                    setFormData({ ...formData, topThreeGoals: copy });
                  }}
                  placeholder={`الالتزام رقم ${idx + 1}`}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#AAA2A7] mb-1">ما الذي أريد تحسينه؟</label>
              <input
                type="text"
                value={formData.whatToImprove}
                onChange={(e) => setFormData({ ...formData, whatToImprove: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#AAA2A7] mb-1">ما الذي سأتوقف عنه أو أقلله؟</label>
              <input
                type="text"
                value={formData.whatToStopOrReduce}
                onChange={(e) => setFormData({ ...formData, whatToStopOrReduce: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#AAA2A7] mb-1">أقل مستوى مقبول من الالتزام (الحد الأدنى)</label>
              <input
                type="text"
                value={formData.minimumAcceptableStandard}
                onChange={(e) => setFormData({ ...formData, minimumAcceptableStandard: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#AAA2A7] mb-1">خطة التعامل مع الأيام الصعبة</label>
              <input
                type="text"
                value={formData.toughDayPlan}
                onChange={(e) => setFormData({ ...formData, toughDayPlan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#AAA2A7] mb-1">المكافأة التي سأمنحها لنفسي عند إتمام هذه المرحلة بنجاح</label>
            <input
              type="text"
              value={formData.chosenReward}
              onChange={(e) => setFormData({ ...formData, chosenReward: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
            />
          </div>
        </div>

        {/* Signature Box */}
        <div className="pt-2 border-t border-[#30262B] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#AAA2A7]">
            {formData.signedAt ? (
              <span>تاريخ الاعتماد: {new Date(formData.signedAt).toLocaleDateString('ar-EG')}</span>
            ) : (
              <span>التوقيع يمثل ميثاقًا شخصيًا بينك وبين مستقبلك.</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-lg"
          >
            <FileSignature className="w-4 h-4" />
            <span>{formData.signedAt ? 'تحديث وتأكيد العقد' : 'اعتماد وتوقيع العقد الشخصي'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
