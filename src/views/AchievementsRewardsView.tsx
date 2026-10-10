import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  Gift,
  History,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { calculateUserRank, RANKS_TABLE } from '../services/sampleData';
import { AchievementItem, RewardItem, UserProfile, XPRecord } from '../types';

interface AchievementsRewardsViewProps {
  totalXP: number;
  profile: UserProfile;
  achievements: AchievementItem[];
  rewards: RewardItem[];
  xpLog: XPRecord[];
  onRedeemReward: (reward: RewardItem) => void;
  onAddReward: (reward: RewardItem) => void;
  onDeleteReward: (id: string) => void;
}

export const AchievementsRewardsView: React.FC<AchievementsRewardsViewProps> = ({
  totalXP,
  profile,
  achievements,
  rewards,
  xpLog,
  onRedeemReward,
  onAddReward,
  onDeleteReward,
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'rewards' | 'history'>('achievements');
  const [showAddRewardModal, setShowAddRewardModal] = useState(false);
  const [celebratingReward, setCelebratingReward] = useState<RewardItem | null>(null);

  // Form states
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardDesc, setRewardDesc] = useState('');
  const [rewardCost, setRewardCost] = useState(500);

  const { rank, progressPercent } = calculateUserRank(totalXP);

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardTitle.trim()) return;

    const r: RewardItem = {
      id: `reward_${Date.now()}`,
      title: rewardTitle.trim(),
      description: rewardDesc.trim() || 'مكافأة شخصية معتدلة تبهج النفس',
      xpCost: Number(rewardCost) || 300,
      isRedeemed: false,
    };

    onAddReward(r);
    setShowAddRewardModal(false);
    setRewardTitle('');
    setRewardDesc('');
  };

  const handleClaim = (reward: RewardItem) => {
    if (totalXP < reward.xpCost) {
      alert(`رصيد نقاطك (${totalXP} XP) غير كافٍ لفتح هذه المكافأة (${reward.xpCost} XP). استمر في إنجاز المهام!`);
      return;
    }
    onRedeemReward(reward);
    setCelebratingReward(reward);
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      <div>
        <h1 className="text-xl font-black text-[#F4F0F1]">الألقاب والإنجازات وبنك المكافآت</h1>
        <p className="text-xs text-[#AAA2A7] mt-0.5">
          نظام تقدير جهودك الحقيقية؛ إنجازات نوعية لا ترتبط بالوزن إطلاقًا وبنك مكافآت آمن يعزز الحافز.
        </p>
      </div>

      {/* Rank & Level Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#151316] via-[#20151b] to-[#3B0A18]/50 border border-[#30262B] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#922D48]">{totalXP} XP</span>
            <div className="text-[10px] text-[#AAA2A7]">مجموع الخبرة المكتسبة</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-[#AAA2A7]">الرتبة واللقب</span>
              <h2 className="text-base font-black text-[#F4F0F1]">{rank.title}</h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#3B0A18] border border-[#6D1028] flex items-center justify-center text-[#922D48]">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#AAA2A7]">
            <span>المستوى {rank.level} من 8</span>
            <span>{progressPercent}% نحو اللقب التالي</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#0B0B0D] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6D1028] to-[#922D48] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#30262B] pb-2">
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'achievements'
              ? 'bg-[#151316] text-[#F4F0F1] border border-[#6D1028]'
              : 'text-[#AAA2A7] hover:text-[#F4F0F1]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>الشارات والإنجازات</span>
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'rewards'
              ? 'bg-[#151316] text-[#F4F0F1] border border-[#6D1028]'
              : 'text-[#AAA2A7] hover:text-[#F4F0F1]'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>بنك المكافآت ({rewards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-[#151316] text-[#F4F0F1] border border-[#6D1028]'
              : 'text-[#AAA2A7] hover:text-[#F4F0F1]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>سجل النقاط ({xpLog.length})</span>
        </button>
      </div>

      {/* Tab 1: Achievements */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => {
              const isUnlocked = totalXP >= ach.xpReward || !!ach.unlockedAt;

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-3xl border transition flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-[#151316] border-[#30262B] text-[#F4F0F1]'
                      : 'bg-[#0B0B0D] border-[#30262B]/50 text-[#AAA2A7] opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? 'bg-[#3B0A18] text-[#922D48] border border-[#6D1028]'
                        : 'bg-[#151316] text-[#AAA2A7]/50 border border-[#30262B]'
                    }`}
                  >
                    {isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#F4F0F1]">{ach.title}</h4>
                      <span className="text-[10px] text-[#922D48] font-bold">+{ach.xpReward} XP</span>
                    </div>
                    <p className="text-[11px] text-[#AAA2A7] leading-relaxed">{ach.description}</p>
                    <div className="text-[10px] text-[#AAA2A7]">
                      {isUnlocked ? 'شارة مفتوحة ومحققة ✓' : 'قيد التقدم'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Rewards Bank */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddRewardModal(true)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مكافأة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rewards.map((rew) => (
              <div
                key={rew.id}
                className="p-5 rounded-3xl bg-[#151316] border border-[#30262B] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#922D48]">
                      {rew.xpCost} XP
                    </span>
                    <h4 className="text-xs font-bold text-[#F4F0F1]">{rew.title}</h4>
                  </div>
                  <p className="text-xs text-[#AAA2A7] leading-relaxed">{rew.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#30262B]">
                  <button
                    onClick={() => onDeleteReward(rew.id)}
                    className="p-1 text-[#AAA2A7] hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleClaim(rew)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      rew.isRedeemed
                        ? 'bg-[#0B0B0D] text-[#AAA2A7]'
                        : 'bg-[#6D1028] hover:bg-[#922D48] text-white'
                    }`}
                  >
                    {rew.isRedeemed ? 'تم استبدالها سابقًا' : 'استبدال المكافأة'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: XP Transaction History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#AAA2A7]">سجل إضافة نقاط الخبرة الفعلي:</h3>
          {xpLog.length === 0 ? (
            <p className="text-xs text-[#AAA2A7]">لم تُسجل نقاط بعد.</p>
          ) : (
            <div className="space-y-2">
              {[...xpLog].reverse().map((record) => (
                <div
                  key={record.id}
                  className="p-3.5 rounded-2xl bg-[#151316] border border-[#30262B] flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-[#922D48]">+{record.amount} XP</span>
                  <div className="text-right">
                    <span className="text-[#F4F0F1]">{record.reason}</span>
                    <div className="text-[10px] text-[#AAA2A7]">
                      {new Date(record.timestamp).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Celebration Modal when reward is claimed */}
      {celebratingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#0B0B0D] border border-[#6D1028] p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#3B0A18] text-[#922D48] mx-auto flex items-center justify-center">
              <Gift className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#F4F0F1]">مبارك! استحققت مكافأتك</h3>
              <p className="text-xs text-[#AAA2A7] mt-1 leading-relaxed">
                «{celebratingReward.title}»
              </p>
            </div>
            <p className="text-[11px] text-[#AAA2A7]">
              استمتع بوقتك دون أي شعور بالذنب؛ المكافأة المعتدلة وقود للاستمرار.
            </p>
            <button
              onClick={() => setCelebratingReward(null)}
              className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition"
            >
              شكرًا، متابعة الرحلة
            </button>
          </div>
        </div>
      )}

      {/* Add Reward Modal */}
      {showAddRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0B0B0D] border border-[#30262B] p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
              <button
                onClick={() => setShowAddRewardModal(false)}
                className="p-1 rounded-xl text-[#AAA2A7] hover:text-[#F4F0F1]"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-bold text-[#F4F0F1]">إضافة مكافأة شخصية آمنة</h3>
            </div>

            <form onSubmit={handleCreateReward} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">اسم المكافأة</label>
                <input
                  type="text"
                  required
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                  placeholder="مثال: شراء كتاب، مشاهدة فيلم، نزهة هادئة..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">وصف المكافأة</label>
                <input
                  type="text"
                  value={rewardDesc}
                  onChange={(e) => setRewardDesc(e.target.value)}
                  placeholder="تفاصيل التجربة..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">تكلفة النقاط (XP)</label>
                <input
                  type="number"
                  min={50}
                  step={50}
                  value={rewardCost}
                  onChange={(e) => setRewardCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition"
                >
                  حفظ في بنك المكافآت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
