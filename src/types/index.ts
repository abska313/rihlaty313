/**
 * ABSKA — 214 | Type Definitions
 * Complete schema for the 214-day life transformation system.
 */

export type PillarId =
  | 'fitness'        // الجسم واللياقة
  | 'discipline'     // الانضباط والاستمرارية
  | 'knowledge'      // المعرفة والقراءة
  | 'skills'         // المهارات والمشاريع
  | 'time'           // تنظيم الوقت والحياة
  | 'self_discovery' // اكتشاف الذات والسلوك
  | 'spiritual';     // العادات الشخصية والروحية

export interface PillarMeta {
  id: PillarId;
  name: string;
  description: string;
  iconName: string;
  color: string;
}

export type TaskDifficulty = 'easy' | 'medium' | 'hard';
export type TaskStatus = 'pending' | 'completed' | 'postponed';
export type TaskType = 'daily' | 'weekly' | 'challenge' | 'long_term' | 'custom' | 'micro';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  pillarId: PillarId;
  difficulty: TaskDifficulty;
  estimatedMinutes: number;
  scheduledTime?: string;
  status: TaskStatus;
  xp: number;
  notes?: string;
  dayNumber: number;
  date: string; // YYYY-MM-DD
  isMiniTask?: boolean; // For Tough Day Mode
  completedAt?: string;
  postponedReason?: string;
}

export interface UserProfile {
  name: string;
  birthYear?: number;
  height?: number; // cm
  initialWeight?: number; // kg
  currentWeight?: number; // kg
  targetWeight?: number; // kg
  mainGoals: string[];
  selectedPillars: PillarId[];
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
  skillsExperience: 'beginner' | 'intermediate' | 'advanced';
  dailyAvailableMinutes: number;
  sleepTime: string;
  wakeTime: string;
  booksAndSkillsGoal: string;
  habitsToBuild: string[];
  habitsToBreak: string[];
  typicalChallenges: string[];
  difficultyPreference: 'gentle' | 'moderate' | 'rigorous';
  restDays: string[];
  physicalNotes?: string;
  journeyStartDate: string; // YYYY-MM-DD
  journeyTargetEndDate: string; // YYYY-MM-DD
  isJourneyStarted: boolean;
  isContinuationMode?: boolean;
  smartGradingEnabled: boolean;
  inAppRemindersEnabled: boolean;
  sealedLetterWritten: boolean;
  sealedLetterText?: string;
  simulatedDayOffset?: number; // Used only for testing journey milestones without altering real clock
}

export interface XPRecord {
  id: string;
  timestamp: string;
  amount: number;
  reason: string;
  category: PillarId | 'challenge' | 'reading' | 'review' | 'system';
  referenceId?: string; // To prevent double scoring
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  pillarId?: PillarId;
  xpReward: number;
  unlockedAt?: string;
  category: 'milestone' | 'consistency' | 'reading' | 'skill' | 'recovery' | 'general';
}

export interface StageContract {
  stageNumber: number; // 1 to 8
  stageTitle: string;
  mainGoal: string;
  topThreeGoals: [string, string, string];
  whatToImprove: string;
  whatToStopOrReduce: string;
  minimumAcceptableStandard: string;
  anticipatedObstacles: string;
  toughDayPlan: string;
  chosenReward: string;
  signedAt?: string;
  version: number;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  status: 'to_read' | 'reading' | 'completed' | 'paused';
  startDate?: string;
  finishDate?: string;
  totalPages?: number;
  currentPage?: number;
  rating?: number; // 1-5
  notes?: string;
  quotes: string[];
  keyIdeas: string[];
  practicalApplication?: string;
  isTaskCreated?: boolean;
}

export interface SkillProject {
  id: string;
  stageNumber: number;
  skillName: string;
  targetOutcome: string;
  whyChosen: string;
  currentLevel: string;
  subTasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  estimatedHours: number;
  notesAndResources: string;
  obstaclesFaced?: string;
  completedAt?: string;
  evidenceNotes?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  dayNumber: number;
  energyLevel: number; // 1-5
  mood: 'excellent' | 'good' | 'neutral' | 'tired' | 'stressed';
  whatWentWell: string;
  whatWasDifficult: string;
  whatILearnedAboutMyself: string;
  habitToUnderstand: string;
  whatCanIAdjustTomorrow: string;
  gratitude: string;
  valuesLived: string;
  freeNotes: string;
  associatedPillar?: PillarId;
}

export interface StageReviewReport {
  id: string;
  stageNumber: number;
  stageTitle: string;
  completedAt: string;
  completionRatePercent: number;
  totalTasksCompleted: number;
  totalTasksPostponed: number;
  improvedHabits: string[];
  stubbornHabits: string[];
  activitySummary: string;
  currentWeight?: number;
  booksProgressSummary: string;
  skillsProgressSummary: string;
  unlockedAchievementsCount: number;
  keyLesson: string;
  nextStageGoal: string;
  personalNotes: string;
}

export interface ProgressPhoto {
  id: string;
  stageNumber: number; // 0 for day 1, 1-8 for stages
  dayNumber: number;
  date: string;
  dataUrl: string; // compressed base64
  notes?: string;
  sizeBytes: number;
}

export interface PersonalChallenge {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  difficulty: TaskDifficulty;
  pillarId: PillarId;
  successCriteria: string;
  expectedMinutesPerDay: number;
  optionalReward?: string;
  status: 'available' | 'active' | 'completed' | 'dismissed';
  acceptedAt?: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  xpCost: number;
  linkedMilestone?: string;
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface TimeBlock {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: 'work' | 'fitness' | 'reading' | 'skill' | 'sleep' | 'personal' | 'habits';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  actualMinutes?: number;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface NewExperience {
  id: string;
  title: string;
  whyDoIt: string;
  excitementLevel: number; // 1-5
  estimatedCost?: string;
  timeCommitment: string;
  status: 'planned' | 'in_progress' | 'completed';
  reflectionNotes?: string;
  completedAt?: string;
}

export interface RelapseRecord {
  id: string;
  date: string;
  dayNumber: number;
  reasons: string[];
  microStepChosen: string;
  preventionPlan: string;
  resolved: boolean;
}

export interface ToughDayLog {
  id: string;
  date: string;
  dayNumber: number;
  energyScore: number; // 1-5
  reason: string;
  miniTasksCompleted: number;
  notes?: string;
}

export interface SmartAdaptationProposal {
  id: string;
  type: 'reduce_difficulty' | 'split_task' | 'suggest_rest' | 'step_up' | 'reorder';
  title: string;
  explanation: string;
  actionPayload: any;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface BackupData {
  schemaVersion: number;
  exportedAt: string;
  appName: string;
  profile: UserProfile;
  tasks: TaskItem[];
  xpLog: XPRecord[];
  achievements: AchievementItem[];
  contracts: StageContract[];
  books: BookItem[];
  projects: SkillProject[];
  journal: JournalEntry[];
  reviews: StageReviewReport[];
  photos: ProgressPhoto[];
  challenges: PersonalChallenge[];
  rewards: RewardItem[];
  timeBlocks: TimeBlock[];
  experiences: NewExperience[];
  relapses: RelapseRecord[];
  toughDays: ToughDayLog[];
}
