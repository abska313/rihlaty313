import React, { useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Compass,
  HeartHandshake,
  Layers,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { PILLARS_LIST } from '../services/sampleData';
import {
  AchievementItem,
  BookItem,
  JournalEntry,
  PillarId,
  SkillProject,
  TaskItem,
  UserProfile,
} from '../types';

interface PillarsViewProps {
  profile: UserProfile;
  tasks: TaskItem[];
  journalEntries: JournalEntry[];
  books: BookItem[];
  projects: SkillProject[];
  achievements: AchievementItem[];
}

export const PillarsView: React.FC<PillarsViewProps> = ({
  profile,
  tasks,
  journalEntries,
  books,
  projects,
  achievements,
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<PillarId>('discipline');

  // Calculate pillar scores based on completed real items
  const pillarStats = PILLARS_LIST.map((pillar) => {
    const pTasks = tasks.filter((t) => t.pillarId === pillar.id);
    const pCompletedTasks = pTasks.filter((t) => t.status === 'completed');
    const taskRate = pTasks.length > 0 ? (pCompletedTasks.length / pTasks.length) * 100 : 0;

    // Domain specific bonus calculations
    let domainSpecificPoints = 0;
    if (pillar.id === 'knowledge') {
      const finishedBooks = books.filter((b) => b.status === 'completed').length;
      domainSpecificPoints += finishedBooks * 25;
    }
    if (pillar.id === 'skills') {
      const finishedProjects = projects.filter((p) => p.completedAt).length;
      domainSpecificPoints += finishedProjects * 30;
    }
    if (pillar.id === 'self_discovery') {
      domainSpecificPoints += Math.min(40, journalEntries.length * 5);
    }

    const calculatedScore = Math.min(100, Math.round(pCompletedTasks.length * 10 + domainSpecificPoints));
    const level = Math.floor(calculatedScore / 25) + 1;

    return {
      pillar,
      level,
      score: calculatedScore,
      totalTasks: pTasks.length,
      completedTasks: pCompletedTasks.length,
    };
  });

  const activeStat = pillarStats.find((p) => p.pillar.id === selectedPillarId) || pillarStats[0];

  // Radar/Polygon SVG calculations
  const numPillars = PILLARS_LIST.length;
  const cx = 150;
  const cy = 150;
  const radius = 100;

  const points = pillarStats.map((stat, i) => {
    const angle = (Math.PI * 2 / numPillars) * i - Math.PI / 2;
    const r = (Math.max(15, stat.score) / 100) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridCircles = [0.25, 0.5, 0.75, 1];

  return (
    <div className="space-y-6 pb-24 text-right">
      <div>
        <h1 className="text-xl font-black text-[#F4F0F1]">شجرة تطوير الشخصية والمقياس الشامل</h1>
        <p className="text-xs text-[#AAA2A7] mt-0.5">
          7 مسارات مستقلة؛ انخفاض الأداء في مسار لا يلغي التقدم المحقق في المسارات الأخرى.
        </p>
      </div>

      {/* Comprehensive Radar Graph & Overall Index */}
      <div className="p-6 rounded-3xl bg-[#151316] border border-[#30262B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
          <span className="text-xs text-[#AAA2A7]">أوزان متساوية ومعلنة لكل مسار</span>
          <h2 className="text-sm font-extrabold text-[#F4F0F1] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#922D48]" />
            <span>مقياس التغيير الشامل (مخطط الرادار)</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around gap-6 pt-2">
          {/* SVG Radar */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
              {/* Concentric polygons */}
              {gridCircles.map((factor, idx) => {
                const polyPoints = Array.from({ length: numPillars }, (_, i) => {
                  const angle = (Math.PI * 2 / numPillars) * i - Math.PI / 2;
                  const r = factor * radius;
                  const x = cx + r * Math.cos(angle);
                  const y = cy + r * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polygon
                    key={idx}
                    points={polyPoints}
                    fill="none"
                    stroke="#30262B"
                    strokeWidth="1"
                    strokeDasharray={factor < 1 ? '4 4' : undefined}
                  />
                );
              })}

              {/* Axis lines */}
              {Array.from({ length: numPillars }, (_, i) => {
                const angle = (Math.PI * 2 / numPillars) * i - Math.PI / 2;
                const x = cx + radius * Math.cos(angle);
                const y = cy + radius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="#30262B"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data Polygon */}
              <polygon
                points={points}
                fill="#6D1028"
                fillOpacity="0.4"
                stroke="#922D48"
                strokeWidth="2.5"
              />

              {/* Corner labels */}
              {pillarStats.map((stat, i) => {
                const angle = (Math.PI * 2 / numPillars) * i - Math.PI / 2;
                const labelR = radius + 24;
                const x = cx + labelR * Math.cos(angle);
                const y = cy + labelR * Math.sin(angle);
                return (
                  <text
                    key={stat.pillar.id}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#AAA2A7"
                    fontSize="9"
                    fontWeight="700"
                    className="cursor-pointer"
                    onClick={() => setSelectedPillarId(stat.pillar.id)}
                  >
                    {stat.pillar.name.split(' ')[0]}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Overall Metrics Summary */}
          <div className="space-y-3 max-w-sm text-right">
            <h3 className="text-xs font-bold text-[#F4F0F1]">توزيع المؤشر الشامل</h3>
            <p className="text-xs text-[#AAA2A7] leading-relaxed">
              المقياس لا يعتمد على الوزن أو الشكل البدني وحده؛ بل يعكس جهودك الحقيقية في المعرفة، الانضباط، الوقت، وإتقان المهارات.
            </p>
            <div className="space-y-2 pt-1">
              {pillarStats.map((stat) => (
                <div key={stat.pillar.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#F4F0F1]">{stat.score}%</span>
                    <span className="text-[#AAA2A7]">{stat.pillar.name}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#0B0B0D] overflow-hidden">
                    <div
                      className="h-full bg-[#6D1028] rounded-full transition-all duration-300"
                      style={{ width: `${stat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7 Pillars Horizontal Track Selector */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#AAA2A7]">اختر مسارًا لاستعراض تفاصيل شجرته:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {pillarStats.map((stat) => {
            const isSelected = selectedPillarId === stat.pillar.id;
            return (
              <button
                key={stat.pillar.id}
                onClick={() => setSelectedPillarId(stat.pillar.id)}
                className={`p-3 rounded-2xl border text-right transition ${
                  isSelected
                    ? 'bg-[#151316] border-[#6D1028] shadow-md ring-1 ring-[#922D48]'
                    : 'bg-[#151316]/50 border-[#30262B] text-[#AAA2A7] hover:text-[#F4F0F1]'
                }`}
              >
                <div className="text-xs font-bold text-[#F4F0F1] truncate">{stat.pillar.name}</div>
                <div className="text-[10px] text-[#922D48] mt-1 font-semibold">المستوى {stat.level}</div>
                <div className="text-[10px] text-[#AAA2A7]">{stat.completedTasks} مهام منجزة</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pillar Detailed Tree Node */}
      <div className="p-6 rounded-3xl bg-[#151316] border border-[#30262B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#3B0A18] text-[#922D48] text-xs font-bold">
              المستوى {activeStat.level}
            </span>
            <span className="text-xs text-[#AAA2A7]">تقدم المسار: {activeStat.score}%</span>
          </div>
          <h3 className="text-base font-extrabold text-[#F4F0F1]">{activeStat.pillar.name}</h3>
        </div>

        <p className="text-xs text-[#AAA2A7] leading-relaxed">
          {activeStat.pillar.description}
        </p>

        {/* Milestones Hierarchy Tree */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-[#F4F0F1]">مراحل النمو المقترحة لهذا المسار:</h4>
          <div className="space-y-2">
            {[
              { title: 'المرحلة 1: بناء الوعي والحد الأدنى', desc: 'التعرف على نقاط القوة والتحديات وتثبيت عادة صغيرة جدًا.', done: activeStat.score >= 25 },
              { title: 'المرحلة 2: تعزيز الثبات ومواجهة الانقطاع', desc: 'الاستمرار لعدة أسابيع وإتقان العودة السريعة بعد التعثر.', done: activeStat.score >= 50 },
              { title: 'المرحلة 3: تعميق الأثر والنتائج الملموسة', desc: 'تحويل العادة إلى إنجاز معرفي أو بدني أو مهاري حقيقي.', done: activeStat.score >= 75 },
              { title: 'المرحلة 4: الاستدامة كطبيعة أصيلة', desc: 'ترسيخ الممارسة لتستمر تلقائيًا لما بعد اليوم 214.', done: activeStat.score >= 95 },
            ].map((m, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition ${
                  m.done
                    ? 'bg-[#3B0A18]/20 border-[#6D1028] text-[#F4F0F1]'
                    : 'bg-[#0B0B0D] border-[#30262B] text-[#AAA2A7] opacity-60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    m.done ? 'bg-[#6D1028] text-white' : 'border border-[#30262B]'
                  }`}
                >
                  {m.done && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F4F0F1]">{m.title}</div>
                  <div className="text-[11px] text-[#AAA2A7] mt-0.5 leading-relaxed">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
