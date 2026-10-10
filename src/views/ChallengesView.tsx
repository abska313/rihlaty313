import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Filter,
  Plus,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { PILLARS_LIST } from '../services/sampleData';
import { PersonalChallenge, PillarId, TaskDifficulty, UserProfile } from '../types';

interface ChallengesViewProps {
  challenges: PersonalChallenge[];
  profile: UserProfile;
  currentDay: number;
  onSaveChallenge: (challenge: PersonalChallenge) => void;
  onUpdateChallenge: (challenge: PersonalChallenge) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  profile,
  currentDay,
  onSaveChallenge,
  onUpdateChallenge,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [generatedChallenge, setGeneratedChallenge] = useState<PersonalChallenge | null>(null);

  // Filter challenges
  const activeChallenges = challenges.filter((c) => c.status === 'active');
  const availableChallenges = challenges.filter((c) => c.status === 'available');
  const completedChallenges = challenges.filter((c) => c.status === 'completed');

  // Generator engine (100% local rules)
  const handleGenerate = () => {
    let pool = availableChallenges;
    if (selectedPillar !== 'all') {
      pool = pool.filter((c) => c.pillarId === selectedPillar);
    }
    if (selectedDifficulty !== 'all') {
      pool = pool.filter((c) => c.difficulty === selectedDifficulty);
    }

    if (pool.length === 0) {
      // Create a procedural local challenge
      const randomPillar = (selectedPillar !== 'all' ? selectedPillar : 'discipline') as PillarId;
      const procedural: PersonalChallenge = {
        id: `gen_ch_${Date.now()}`,
        title: `تحدي الثبات والتركيز لـ 7 أيام`,
        description: `الالتزام اليومي لمدة أسبوع بممارسة واحدة محددة لتعزيز مسار ${randomPillar}.`,
        durationDays: 7,
        difficulty: (selectedDifficulty !== 'all' ? selectedDifficulty : 'medium') as TaskDifficulty,
        pillarId: randomPillar,
        successCriteria: 'تسجيل 7 أيام متتالية من إتمام الممارسة المحددة.',
        expectedMinutesPerDay: 15,
        status: 'available',
      };
      setGeneratedChallenge(procedural);
      return;
    }

    const picked = pool[Math.floor(Math.random() * pool.length)];
    setGeneratedChallenge(picked);
  };

  const handleAcceptChallenge = (ch: PersonalChallenge) => {
    onUpdateChallenge({
      ...ch,
      status: 'active',
      acceptedAt: new Date().toISOString(),
    });
    setGeneratedChallenge(null);
  };

  const handleCompleteChallenge = (ch: PersonalChallenge) => {
    onUpdateChallenge({
      ...ch,
      status: 'completed',
    });
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      <div>
        <h1 className="text-xl font-black text-[#F4F0F1]">التحديات ومولّد التحديات الشخصي</h1>
        <p className="text-xs text-[#AAA2A7] mt-0.5">
          تحديات قصيرة ومرحلية لبناء العادات؛ يعمل المولّد دون إنترنت بقواعد محلية منتقاة.
        </p>
      </div>

      {/* Generator Tool Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#151316] via-[#1a1216] to-[#3B0A18]/30 border border-[#30262B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
          <span className="text-xs text-[#AAA2A7]">مكتبة تحديات محلية</span>
          <h2 className="text-sm font-extrabold text-[#F4F0F1] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#922D48]" />
            <span>مولّد التحدي الشخصي</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">المحور المستهدف</label>
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
            >
              <option value="all">كل المحاور</option>
              {PILLARS_LIST.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">مستوى الصعوبة</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
            >
              <option value="all">أي صعوبة</option>
              <option value="easy">سهل (مناسب للبدايات)</option>
              <option value="medium">متوسط</option>
              <option value="hard">تحدٍ متقدم</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3 rounded-2xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
        >
          <Sparkles className="w-4 h-4" />
          <span>توليد أو اقتراح تحدٍ جديد</span>
        </button>

        {/* Generated Challenge Modal/Card preview */}
        {generatedChallenge && (
          <div className="p-4 rounded-2xl bg-[#0B0B0D] border border-[#6D1028] space-y-3 mt-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#922D48] font-bold">
                المدة: {generatedChallenge.durationDays} أيام · {generatedChallenge.expectedMinutesPerDay} دقيقة/يوم
              </span>
              <h4 className="text-xs font-bold text-[#F4F0F1]">{generatedChallenge.title}</h4>
            </div>
            <p className="text-xs text-[#AAA2A7] leading-relaxed">
              {generatedChallenge.description}
            </p>
            <div className="text-[11px] text-[#AAA2A7]">
              معيار النجاح: <strong className="text-[#F4F0F1]">{generatedChallenge.successCriteria}</strong>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleAcceptChallenge(generatedChallenge)}
                className="flex-1 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition"
              >
                قبول وبدء التحدي
              </button>
              <button
                onClick={handleGenerate}
                className="px-3 py-2 rounded-xl bg-[#151316] text-[#AAA2A7] hover:text-[#F4F0F1] text-xs transition"
              >
                توليد بديل
              </button>
              <button
                onClick={() => setGeneratedChallenge(null)}
                className="p-2 rounded-xl text-[#AAA2A7] hover:text-[#F4F0F1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Challenges List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#F4F0F1] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#922D48]" />
          <span>التحديات النشطة حاليًا ({activeChallenges.length})</span>
        </h2>

        {activeChallenges.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#151316] border border-[#30262B] text-center space-y-2">
            <p className="text-xs text-[#AAA2A7]">لا توجد تحديات نشطة في الوقت الحالي.</p>
            <p className="text-[11px] text-[#AAA2A7]">استخدم المولّد بالأعلى لاختيار تحدٍ يثير حماسك.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeChallenges.map((ch) => (
              <div
                key={ch.id}
                className="p-4 rounded-2xl bg-[#151316] border border-[#30262B] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#922D48] font-bold">
                    {ch.durationDays} أيام · {ch.expectedMinutesPerDay} دقيقة يوميًا
                  </span>
                  <h3 className="text-xs font-bold text-[#F4F0F1]">{ch.title}</h3>
                </div>
                <p className="text-xs text-[#AAA2A7] leading-relaxed">{ch.description}</p>
                <div className="text-[11px] text-[#AAA2A7]">
                  معيار النجاح: <strong className="text-[#F4F0F1]">{ch.successCriteria}</strong>
                </div>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => handleCompleteChallenge(ch)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>تأكيد إكمال التحدي</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Challenges Archive */}
      {completedChallenges.length > 0 && (
        <div className="space-y-3 pt-3">
          <h2 className="text-sm font-bold text-[#AAA2A7] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#922D48]" />
            <span>التحديات المنجزة بنجاح ({completedChallenges.length})</span>
          </h2>
          <div className="space-y-2">
            {completedChallenges.map((ch) => (
              <div
                key={ch.id}
                className="p-3.5 rounded-2xl bg-[#151316]/50 border border-[#30262B] flex items-center justify-between text-xs text-[#AAA2A7]"
              >
                <span>{ch.title}</span>
                <span className="text-[#922D48] font-bold">مكتمل ✓</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
