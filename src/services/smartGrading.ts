/**
 * ABSKA — 214 | Smart Local Rule Engine
 * التكيّف الذكي بالقواعد المحلية
 * Analyzes local records and generates non-coercive adaptation proposals.
 */

import {
  JournalEntry,
  RelapseRecord,
  SmartAdaptationProposal,
  TaskItem,
  ToughDayLog,
  UserProfile,
} from '../types';

export interface RootCauseInsight {
  category: 'energy' | 'delay' | 'habits' | 'time' | 'sample_size';
  headline: string;
  detail: string;
  recommendation: string;
  confidence: 'initial' | 'moderate' | 'high';
}

export function generateSmartProposals(
  tasks: TaskItem[],
  journalEntries: JournalEntry[],
  toughDays: ToughDayLog[],
  userProfile: UserProfile
): SmartAdaptationProposal[] {
  if (!userProfile.smartGradingEnabled) return [];

  const proposals: SmartAdaptationProposal[] = [];
  const now = new Date().toISOString();

  // 1. Check for repeatedly postponed tasks
  const postponedCounts: Record<string, number> = {};
  for (const t of tasks) {
    if (t.status === 'postponed') {
      postponedCounts[t.title] = (postponedCounts[t.title] || 0) + 1;
    }
  }

  for (const [title, count] of Object.entries(postponedCounts)) {
    if (count >= 2) {
      proposals.push({
        id: `prop_reduce_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'reduce_difficulty',
        title: `تخفيف مهمة «${title}»`,
        explanation: `تشير السجلات إلى أن هذه المهمة تأجلت ${count} مرات. نقترح تقليص وقتها المقدر بمقدار النصف أو تحويلها إلى مستوى أسهل لكسر حاجز المقاومة.`,
        actionPayload: { taskTitle: title, originalCount: count },
        createdAt: now,
        status: 'pending',
      });
    }
  }

  // 2. Check for recent low energy trend (last 3 journal entries)
  const recentJournals = [...journalEntries].sort((a, b) => b.dayNumber - a.dayNumber).slice(0, 3);
  if (recentJournals.length >= 2) {
    const avgEnergy = recentJournals.reduce((acc, curr) => acc + curr.energyLevel, 0) / recentJournals.length;
    if (avgEnergy <= 2.2) {
      proposals.push({
        id: `prop_rest_${Date.now()}`,
        type: 'suggest_rest',
        title: 'اقتراح يوم تعافٍ نشط',
        explanation: 'متوسط طاقتك المسجل في الأيام الأخيرة منخفض (أقل من 2.5 من 5). نقترح خفض مهام الغد إلى الحد الأدنى وتفعيل جلسة مشي أو راحة مبكرة لتجديد النشاط.',
        actionPayload: { avgEnergy },
        createdAt: now,
        status: 'pending',
      });
    }
  }

  // 3. Check for high completion stability (Encouraging slight step up)
  const recentTasks = tasks.slice(-10);
  const completedRecent = recentTasks.filter((t) => t.status === 'completed');
  if (recentTasks.length >= 8 && completedRecent.length / recentTasks.length >= 0.85) {
    proposals.push({
      id: `prop_stepup_${Date.now()}`,
      type: 'step_up',
      title: 'استقرار ممتاز: إضافة تحدٍ نوعي بسيط',
      explanation: 'لقد حافظت على نسبة إنجاز تتجاوز 85% في مهامك الأخيرة. إذا كنت تشعر بالراحة، يمكنك إضافة خطوة جديدة في مشروع مهاراتك أو زيادة 5 دقائق في القراءة.',
      actionPayload: { completionRate: completedRecent.length / recentTasks.length },
      createdAt: now,
      status: 'pending',
    });
  }

  return proposals;
}

export function analyzeRootCauses(
  tasks: TaskItem[],
  journalEntries: JournalEntry[],
  relapses: RelapseRecord[],
  toughDays: ToughDayLog[],
  userProfile: UserProfile
): {
  insights: RootCauseInsight[];
  sampleSizeDays: number;
  dataQuality: 'insufficient' | 'forming' | 'robust';
} {
  const insights: RootCauseInsight[] = [];
  const uniqueDays = new Set([
    ...tasks.map((t) => t.dayNumber),
    ...journalEntries.map((j) => j.dayNumber),
  ]);
  const sampleSizeDays = uniqueDays.size;

  let dataQuality: 'insufficient' | 'forming' | 'robust' = 'insufficient';
  if (sampleSizeDays >= 14) dataQuality = 'robust';
  else if (sampleSizeDays >= 3) dataQuality = 'forming';

  if (sampleSizeDays < 3) {
    insights.push({
      category: 'sample_size',
      headline: 'البيانات قيد التكوين الأولي',
      detail: `عدد الأيام الموثقة حاليًا هو ${sampleSizeDays} يومًا فقط. يتطلب التحليل السلوكي العميق 3 إلى 7 أيام من التسجيل المستمر لرصد الأنماط بدقة.`,
      recommendation: 'واصل توثيق المهام والملاحظات يوميًا لتظهر لك استنتاجات مستندة إلى بياناتك الحقيقية.',
      confidence: 'initial',
    });
    return { insights, sampleSizeDays, dataQuality };
  }

  // Analyze delayed tasks by pillar
  const pillarDelays: Record<string, number> = {};
  for (const t of tasks) {
    if (t.status === 'postponed') {
      pillarDelays[t.pillarId] = (pillarDelays[t.pillarId] || 0) + 1;
    }
  }

  const mostDelayedPillar = Object.entries(pillarDelays).sort((a, b) => b[1] - a[1])[0];
  if (mostDelayedPillar && mostDelayedPillar[1] >= 2) {
    const pillarNames: Record<string, string> = {
      fitness: 'الجسم واللياقة',
      discipline: 'الانضباط والاستمرارية',
      knowledge: 'المعرفة والقراءة',
      skills: 'المهارات والمشاريع',
      time: 'تنظيم الوقت',
      self_discovery: 'اكتشاف الذات',
      spiritual: 'العادات الشخصية والروحية',
    };
    insights.push({
      category: 'delay',
      headline: `تأجيل متكرر في مسار «${pillarNames[mostDelayedPillar[0]] || mostDelayedPillar[0]}»`,
      detail: `سجلاتك تظهر تأجيل مهام هذا المجال ${mostDelayedPillar[1]} مرات خلال ${sampleSizeDays} يومًا مسجلاً. قد يكون التوقيت المحدد غير مناسب أو أن حجم المهمة أكبر من الطاقة المتوفرة.`,
      recommendation: 'جرّب جدولة هذه المهمة في أول ساعة بعد الاستيقاظ أو تقسيمها إلى مهمة مصغرة مدتها 10 دقائق فقط.',
      confidence: sampleSizeDays > 10 ? 'high' : 'moderate',
    });
  }

  // Analyze Energy vs Adherence
  const lowEnergyEntries = journalEntries.filter((j) => j.energyLevel <= 2);
  if (lowEnergyEntries.length > 0) {
    insights.push({
      category: 'energy',
      headline: `تم رصد ${lowEnergyEntries.length} يومًا بطاقة منخفضة`,
      detail: `الأيام ذات التقييم المنخفض تمثل ${Math.round((lowEnergyEntries.length / journalEntries.length) * 100)}% من أيام التدوين. وضع اليوم الصعب يساعد على عبور هذه الفترات بأمان.`,
      recommendation: 'راجع ساعات النوم ووقت الاسترخاء في المساء، وتجنب تعويض الطاقة المنخفضة بتمارين مجهدة.',
      confidence: 'moderate',
    });
  }

  // Analyze Relapse Causes
  if (relapses.length > 0) {
    const reasonFreq: Record<string, number> = {};
    for (const r of relapses) {
      for (const reason of r.reasons) {
        reasonFreq[reason] = (reasonFreq[reason] || 0) + 1;
      }
    }
    const topReason = Object.entries(reasonFreq).sort((a, b) => b[1] - a[1])[0];
    if (topReason) {
      insights.push({
        category: 'habits',
        headline: `السبب الأكثر تكرارًا في الانقطاع: «${topReason[0]}»`,
        detail: `تكرر هذا السبب ${topReason[1]} مرات في سجلات العودة للمسار. التعرف الواعي على العائق هو نصف الحل.`,
        recommendation: 'صمّم خطة استباقية مسبقة لمواجهة هذا العامل عند حدوثه قبل أن يتسبب في إيقاف الروتين.',
        confidence: 'high',
      });
    }
  }

  return { insights, sampleSizeDays, dataQuality };
}
