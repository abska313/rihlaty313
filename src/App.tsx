/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { DayLetterModal } from './components/DayLetterModal';
import { Header } from './components/Header';
import { InAppReminders } from './components/InAppReminders';
import { NavTab, Navigation } from './components/Navigation';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OnboardingModal } from './components/OnboardingModal';
import { RelapseRescueModal } from './components/RelapseRescueModal';
import { ToughDayModal } from './components/ToughDayModal';
import {
  addXPRecord,
  deleteBook,
  deleteExperience,
  deleteJournalEntry,
  deletePhoto,
  deleteProject,
  deleteReward,
  deleteTask,
  deleteTimeBlock,
  getAchievements,
  getBooks,
  getChallenges,
  getContracts,
  getExperiences,
  getJournalEntries,
  getPhotos,
  getProjects,
  getRelapseRecords,
  getRewards,
  getReviews,
  getTasks,
  getTimeBlocks,
  getToughDays,
  getUserProfile,
  getXPLog,
  saveBook,
  saveChallenge,
  saveContract,
  saveExperience,
  saveJournalEntry,
  savePhoto,
  saveProject,
  saveRelapseRecord,
  saveReward,
  saveReview,
  saveTask,
  saveTimeBlock,
  saveToughDay,
  saveUserProfile,
} from './services/db';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_CONTRACTS,
  calculateUserRank,
} from './services/sampleData';
import {
  AchievementItem,
  BookItem,
  JournalEntry,
  NewExperience,
  PersonalChallenge,
  ProgressPhoto,
  RelapseRecord,
  RewardItem,
  SkillProject,
  StageContract,
  StageReviewReport,
  TaskItem,
  TimeBlock,
  ToughDayLog,
  UserProfile,
  XPRecord,
} from './types';
import { getJourneyDayInfo } from './utils/journeyMath';
import { AchievementsRewardsView } from './views/AchievementsRewardsView';
import { ArchiveReportsView } from './views/ArchiveReportsView';
import { ChallengesView } from './views/ChallengesView';
import { DashboardView } from './views/DashboardView';
import { ExperiencesView } from './views/ExperiencesView';
import { FitnessView } from './views/FitnessView';
import { JournalView } from './views/JournalView';
import { PillarsView } from './views/PillarsView';
import { PostJourneyView } from './views/PostJourneyView';
import { ReadingView } from './views/ReadingView';
import { RoadmapView } from './views/RoadmapView';
import { RootCauseAnalysisView } from './views/RootCauseAnalysisView';
import { SettingsBackupView } from './views/SettingsBackupView';
import { SkillsProjectsView } from './views/SkillsProjectsView';
import { StageContractView } from './views/StageContractView';
import { TasksView } from './views/TasksView';
import { TimeManagerView } from './views/TimeManagerView';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [xpLog, setXpLog] = useState<XPRecord[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [contracts, setContracts] = useState<StageContract[]>([]);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [projects, setProjects] = useState<SkillProject[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [reviews, setReviews] = useState<StageReviewReport[]>([]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [challenges, setChallenges] = useState<PersonalChallenge[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [experiences, setExperiences] = useState<NewExperience[]>([]);
  const [relapses, setRelapses] = useState<RelapseRecord[]>([]);
  const [toughDays, setToughDays] = useState<ToughDayLog[]>([]);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Modals
  const [showToughDayModal, setShowToughDayModal] = useState(false);
  const [showRelapseRescueModal, setShowRelapseRescueModal] = useState(false);
  const [showDayLetterModal, setShowDayLetterModal] = useState(false);

  // Load state from local storage on mount
  const refreshAllData = async () => {
    try {
      const [
        p,
        t,
        xp,
        ach,
        c,
        b,
        proj,
        j,
        rev,
        ph,
        ch,
        rew,
        tb,
        exp,
        rel,
        td,
      ] = await Promise.all([
        getUserProfile(),
        getTasks(),
        getXPLog(),
        getAchievements(),
        getContracts(),
        getBooks(),
        getProjects(),
        getJournalEntries(),
        getReviews(),
        getPhotos(),
        getChallenges(),
        getRewards(),
        getTimeBlocks(),
        getExperiences(),
        getRelapseRecords(),
        getToughDays(),
      ]);

      setProfile(p);
      setTasks(t);
      setXpLog(xp);
      setAchievements(ach);
      setContracts(c);
      setBooks(b);
      setProjects(proj);
      setJournalEntries(j);
      setReviews(rev);
      setPhotos(ph);
      setChallenges(ch);
      setRewards(rew);
      setTimeBlocks(tb);
      setExperiences(exp);
      setRelapses(rel);
      setToughDays(td);
    } catch (err) {
      console.error('Failed to load local database state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Journey Day Calculation
  const dayInfo = getJourneyDayInfo(profile);
  const totalXP = xpLog.reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate Streak count
  const calculateStreak = (): number => {
    if (!profile.isJourneyStarted) return 0;
    const completedDays = new Set<number>();
    for (const t of tasks) {
      if (t.status === 'completed') completedDays.add(t.dayNumber);
    }
    for (const j of journalEntries) {
      completedDays.add(j.dayNumber);
    }

    let streak = 0;
    let checkDay = dayInfo.currentDay;
    while (checkDay >= 1 && completedDays.has(checkDay)) {
      streak++;
      checkDay--;
    }
    return streak;
  };
  const streakCount = calculateStreak();

  // Helper to add XP without duplicates
  const grantXP = async (amount: number, reason: string, category: XPRecord['category'], refId?: string) => {
    const record: XPRecord = {
      id: `xp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      amount,
      reason,
      category,
      referenceId: refId,
    };
    const added = await addXPRecord(record);
    if (added) {
      setXpLog((prev) => [...prev, record]);
    }
  };

  // Task actions
  const handleAddTask = async (newTask: TaskItem) => {
    await saveTask(newTask);
    setTasks((prev) => [...prev, newTask]);
  };

  const handleBatchAddTasks = async (newTasks: TaskItem[]) => {
    for (const t of newTasks) {
      await saveTask(t);
    }
    setTasks((prev) => [...prev, ...newTasks]);
  };

  const handleUpdateTask = async (updatedTask: TaskItem) => {
    await saveTask(updatedTask);
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));

    // If marked as completed, grant XP with unique referenceId to prevent double scoring
    if (updatedTask.status === 'completed') {
      const refId = `task_complete_${updatedTask.id}`;
      await grantXP(updatedTask.xp, `إتمام مهمة: ${updatedTask.title}`, updatedTask.pillarId, refId);
    }
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Onboarding Complete
  const handleOnboardingComplete = async (finalProfile: UserProfile) => {
    await saveUserProfile(finalProfile);
    setProfile(finalProfile);

    // Initial starting XP grant
    await grantXP(100, 'انطلاق رحلة الـ 214 يومًا رسميًا', 'system', 'journey_start_xp');
  };

  // Tough Day apply
  const handleApplyToughDay = async (log: ToughDayLog, microTasks: TaskItem[]) => {
    await saveToughDay(log);
    setToughDays((prev) => [log, ...prev]);

    // Postpone heavy pending tasks for today
    const updatedTasks = tasks.map((t) => {
      if (t.dayNumber === dayInfo.currentDay && t.status === 'pending') {
        return {
          ...t,
          status: 'postponed' as const,
          postponedReason: 'تأجيل بسبب تفعيل وضع اليوم الصعب',
        };
      }
      return t;
    });

    for (const t of updatedTasks) {
      await saveTask(t);
    }

    // Add new micro tasks
    for (const mt of microTasks) {
      await saveTask(mt);
    }

    setTasks([...updatedTasks, ...microTasks]);
    await grantXP(50, 'تفعيل وضع اليوم الصعب وحماية الاستمرارية', 'discipline', `tough_day_${log.id}`);
  };

  // Relapse Recovery apply
  const handleConfirmRecovery = async (record: RelapseRecord, microTaskTitle: string) => {
    await saveRelapseRecord(record);
    setRelapses((prev) => [record, ...prev]);

    const rescueTask: TaskItem = {
      id: `rescue_${Date.now()}`,
      title: microTaskTitle,
      description: 'خطوة مصغرة لكسر حاجز المقاومة واستعادة الزخم بهدوء.',
      pillarId: 'discipline',
      difficulty: 'easy',
      estimatedMinutes: 5,
      status: 'pending',
      xp: 40,
      dayNumber: dayInfo.currentDay,
      date: new Date().toISOString().split('T')[0],
      isMiniTask: true,
    };

    await saveTask(rescueTask);
    setTasks((prev) => [...prev, rescueTask]);
    await grantXP(60, 'العودة الشجاعة إلى المسار', 'discipline', `relapse_rescue_${record.id}`);
  };

  // Sealed Letter Save
  const handleSaveSealedLetter = async (letterText: string) => {
    const updated = {
      ...profile,
      sealedLetterWritten: true,
      sealedLetterText: letterText,
    };
    await saveUserProfile(updated);
    setProfile(updated);
    setShowDayLetterModal(false);
    await grantXP(150, 'ختم رسالة اليوم الأول في كبسولة الزمن', 'self_discovery', 'letter_sealed_xp');
  };

  // Profile update
  const handleSaveProfile = async (updated: UserProfile) => {
    await saveUserProfile(updated);
    setProfile(updated);
  };

  // Book save & delete
  const handleSaveBook = async (book: BookItem) => {
    await saveBook(book);
    setBooks((prev) => {
      const idx = prev.findIndex((b) => b.id === book.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = book;
        return copy;
      }
      return [...prev, book];
    });

    if (book.status === 'completed') {
      await grantXP(300, `إتمام قراءة كتاب: ${book.title}`, 'reading', `book_done_${book.id}`);
    }
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  // Project save & delete
  const handleSaveProject = async (proj: SkillProject) => {
    await saveProject(proj);
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === proj.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = proj;
        return copy;
      }
      return [...prev, proj];
    });

    if (proj.completedAt) {
      await grantXP(450, `إنجاز مشروع مهارة: ${proj.skillName}`, 'skills', `project_done_${proj.id}`);
    }
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Journal save & delete
  const handleSaveJournalEntry = async (entry: JournalEntry) => {
    await saveJournalEntry(entry);
    setJournalEntries((prev) => {
      const idx = prev.findIndex((j) => j.id === entry.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = entry;
        return copy;
      }
      return [entry, ...prev];
    });
    await grantXP(30, 'تدوين تأمل في دفتر اكتشاف الذات', 'self_discovery', `journal_${entry.id}`);
  };

  const handleDeleteJournalEntry = async (id: string) => {
    await deleteJournalEntry(id);
    setJournalEntries((prev) => prev.filter((j) => j.id !== id));
  };

  // Reviews save
  const handleSaveReview = async (review: StageReviewReport) => {
    await saveReview(review);
    setReviews((prev) => {
      const idx = prev.findIndex((r) => r.stageNumber === review.stageNumber);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = review;
        return copy;
      }
      return [...prev, review];
    });
    await grantXP(500, `إتمام مراجعة ${review.stageTitle}`, 'review', `stage_review_${review.stageNumber}`);
  };

  // Photos save & delete
  const handleSavePhoto = async (photo: ProgressPhoto) => {
    await savePhoto(photo);
    setPhotos((prev) => [photo, ...prev]);
  };

  const handleDeletePhoto = async (id: string) => {
    await deletePhoto(id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Challenges save & update
  const handleSaveChallenge = async (ch: PersonalChallenge) => {
    await saveChallenge(ch);
    setChallenges((prev) => [...prev, ch]);
  };

  const handleUpdateChallenge = async (ch: PersonalChallenge) => {
    await saveChallenge(ch);
    setChallenges((prev) => prev.map((c) => (c.id === ch.id ? ch : c)));
    if (ch.status === 'completed') {
      await grantXP(250, `إنجاز التحدي: ${ch.title}`, 'challenge', `challenge_done_${ch.id}`);
    }
  };

  // Rewards actions
  const handleAddReward = async (r: RewardItem) => {
    await saveReward(r);
    setRewards((prev) => [...prev, r]);
  };

  const handleRedeemReward = async (r: RewardItem) => {
    const updated = { ...r, isRedeemed: true, redeemedAt: new Date().toISOString() };
    await saveReward(updated);
    setRewards((prev) => prev.map((item) => (item.id === r.id ? updated : item)));
  };

  const handleDeleteReward = async (id: string) => {
    await deleteReward(id);
    setRewards((prev) => prev.filter((r) => r.id !== id));
  };

  // Contracts save
  const handleSaveContract = async (c: StageContract) => {
    await saveContract(c);
    setContracts((prev) => {
      const idx = prev.findIndex((item) => item.stageNumber === c.stageNumber);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = c;
        return copy;
      }
      return [...prev, c];
    });
    if (c.signedAt) {
      await grantXP(200, `اعتماد عهد ${c.stageTitle}`, 'discipline', `contract_sign_${c.stageNumber}_v${c.version}`);
    }
  };

  // Experiences
  const handleSaveExperience = async (exp: NewExperience) => {
    await saveExperience(exp);
    setExperiences((prev) => {
      const idx = prev.findIndex((e) => e.id === exp.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = exp;
        return copy;
      }
      return [...prev, exp];
    });
    if (exp.status === 'completed') {
      await grantXP(200, `خوض تجربة جديدة: ${exp.title}`, 'self_discovery', `exp_done_${exp.id}`);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    await deleteExperience(id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  // Time blocks
  const handleSaveTimeBlock = async (tb: TimeBlock) => {
    await saveTimeBlock(tb);
    setTimeBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === tb.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = tb;
        return copy;
      }
      return [...prev, tb];
    });
  };

  const handleDeleteTimeBlock = async (id: string) => {
    await deleteTimeBlock(id);
    setTimeBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Weight update
  const handleUpdateWeight = async (w: number) => {
    const updated = { ...profile, currentWeight: w };
    await saveUserProfile(updated);
    setProfile(updated);
  };

  // Continuation plan update
  const handleUpdateContinuationPlan = async (habits: string[], goals: string[]) => {
    const updated: UserProfile = {
      ...profile,
      habitsToBuild: habits,
      mainGoals: goals,
      isContinuationMode: true,
    };
    await saveUserProfile(updated);
    setProfile(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0D] text-[#AAA2A7] text-xs">
        <div className="space-y-2 text-center">
          <div className="w-8 h-8 rounded-xl border-2 border-[#6D1028] border-t-transparent animate-spin mx-auto" />
          <p>جارٍ تحميل بيانات ABSKA 214...</p>
        </div>
      </div>
    );
  }

  // Pending today tasks count for badges
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasksCount = tasks.filter(
    (t) => (t.dayNumber === dayInfo.currentDay || t.date === todayStr) && t.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F4F0F1] flex flex-col font-sans select-none">
      {/* Top Header */}
      <Header
        profile={profile}
        totalXP={totalXP}
        onOpenToughDay={() => setShowToughDayModal(true)}
        onOpenRelapseRescue={() => setShowRelapseRescueModal(true)}
        onNavigateToAchievements={() => setCurrentTab('achievements')}
        streakCount={streakCount}
      />

      {/* In-app Contextual Reminders */}
      <InAppReminders
        profile={profile}
        todayTasks={tasks.filter((t) => t.dayNumber === dayInfo.currentDay || t.date === todayStr)}
        currentDay={dayInfo.currentDay}
        onNavigateToTasks={() => setCurrentTab('tasks')}
        onNavigateToReviews={() => setCurrentTab('archive')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 overflow-x-hidden">
        {currentTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            tasks={tasks}
            journalEntries={journalEntries}
            reviews={reviews}
            contracts={contracts}
            books={books}
            projects={projects}
            challenges={challenges}
            totalXP={totalXP}
            streakCount={streakCount}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenToughDay={() => setShowToughDayModal(true)}
            onOpenRelapseRescue={() => setShowRelapseRescueModal(true)}
            onOpenQuickJournal={() => setCurrentTab('journal')}
            onToggleTask={(t) =>
              handleUpdateTask({
                ...t,
                status: t.status === 'completed' ? 'pending' : 'completed',
              })
            }
          />
        )}

        {currentTab === 'tasks' && (
          <TasksView
            currentDay={dayInfo.currentDay}
            tasks={tasks}
            journalEntries={journalEntries}
            toughDays={toughDays}
            profile={profile}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onBatchAddTasks={handleBatchAddTasks}
          />
        )}

        {currentTab === 'roadmap' && (
          <RoadmapView
            profile={profile}
            tasks={tasks}
            journalEntries={journalEntries}
            reviews={reviews}
          />
        )}

        {currentTab === 'pillars' && (
          <PillarsView
            profile={profile}
            tasks={tasks}
            journalEntries={journalEntries}
            books={books}
            projects={projects}
            achievements={achievements}
          />
        )}

        {currentTab === 'contract' && (
          <StageContractView
            profile={profile}
            contracts={contracts}
            onSaveContract={handleSaveContract}
          />
        )}

        {currentTab === 'challenges' && (
          <ChallengesView
            challenges={challenges}
            profile={profile}
            currentDay={dayInfo.currentDay}
            onSaveChallenge={handleSaveChallenge}
            onUpdateChallenge={handleUpdateChallenge}
          />
        )}

        {currentTab === 'reading' && (
          <ReadingView
            books={books}
            currentDay={dayInfo.currentDay}
            onSaveBook={handleSaveBook}
            onDeleteBook={handleDeleteBook}
            onConvertApplicationToTask={handleAddTask}
          />
        )}

        {currentTab === 'skills' && (
          <SkillsProjectsView
            projects={projects}
            profile={profile}
            currentDay={dayInfo.currentDay}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {currentTab === 'journal' && (
          <JournalView
            journalEntries={journalEntries}
            currentDay={dayInfo.currentDay}
            profile={profile}
            onSaveEntry={handleSaveJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
          />
        )}

        {currentTab === 'time' && (
          <TimeManagerView
            timeBlocks={timeBlocks}
            onSaveTimeBlock={handleSaveTimeBlock}
            onDeleteTimeBlock={handleDeleteTimeBlock}
          />
        )}

        {currentTab === 'experiences' && (
          <ExperiencesView
            experiences={experiences}
            onSaveExperience={handleSaveExperience}
            onDeleteExperience={handleDeleteExperience}
          />
        )}

        {currentTab === 'fitness' && (
          <FitnessView
            profile={profile}
            currentDay={dayInfo.currentDay}
            onUpdateWeight={handleUpdateWeight}
          />
        )}

        {currentTab === 'archive' && (
          <ArchiveReportsView
            profile={profile}
            currentDay={dayInfo.currentDay}
            reviews={reviews}
            photos={photos}
            tasks={tasks}
            books={books}
            projects={projects}
            onSaveReview={handleSaveReview}
            onSavePhoto={handleSavePhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}

        {currentTab === 'achievements' && (
          <AchievementsRewardsView
            totalXP={totalXP}
            profile={profile}
            achievements={achievements}
            rewards={rewards}
            xpLog={xpLog}
            onRedeemReward={handleRedeemReward}
            onAddReward={handleAddReward}
            onDeleteReward={handleDeleteReward}
          />
        )}

        {currentTab === 'root_cause' && (
          <RootCauseAnalysisView
            tasks={tasks}
            journalEntries={journalEntries}
            relapses={relapses}
            toughDays={toughDays}
            profile={profile}
          />
        )}

        {currentTab === 'letter' && (
          <DayLetterModal
            isInline={true}
            profile={profile}
            currentDay={dayInfo.currentDay}
            tasks={tasks}
            books={books}
            projects={projects}
            onClose={() => setCurrentTab('dashboard')}
            onSaveLetter={handleSaveSealedLetter}
          />
        )}

        {currentTab === 'post_journey' && (
          <PostJourneyView
            profile={profile}
            currentDay={dayInfo.currentDay}
            onUpdateContinuationPlan={handleUpdateContinuationPlan}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsBackupView
            profile={profile}
            currentDay={dayInfo.currentDay}
            onSaveProfile={handleSaveProfile}
            onDataRestored={refreshAllData}
          />
        )}
      </main>

      {/* Floating Offline Notification */}
      <OfflineIndicator />

      {/* Bottom Floating Navigation Bar & Slide-out Menu */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Onboarding Modal (Shown on First Run before Journey Starts) */}
      {!profile.isJourneyStarted && (
        <OnboardingModal
          initialProfile={profile}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Tough Day Mode Modal */}
      {showToughDayModal && (
        <ToughDayModal
          currentDay={dayInfo.currentDay}
          tasks={tasks}
          onClose={() => setShowToughDayModal(false)}
          onApplyToughDay={handleApplyToughDay}
        />
      )}

      {/* Relapse Rescue Modal */}
      {showRelapseRescueModal && (
        <RelapseRescueModal
          currentDay={dayInfo.currentDay}
          onClose={() => setShowRelapseRescueModal(false)}
          onConfirmRecovery={handleConfirmRecovery}
        />
      )}

      {/* Day 214 Sealed Letter Modal */}
      {showDayLetterModal && (
        <DayLetterModal
          profile={profile}
          currentDay={dayInfo.currentDay}
          tasks={tasks}
          books={books}
          projects={projects}
          onClose={() => setShowDayLetterModal(false)}
          onSaveLetter={handleSaveSealedLetter}
        />
      )}
    </div>
  );
}
