import {
  AchievementItem,
  PersonalChallenge,
  PillarMeta,
  RewardItem,
  StageContract,
  UserProfile,
} from '../types';

export const PILLARS_LIST: PillarMeta[] = [
  {
    id: 'fitness',
    name: 'الجسم واللياقة',
    description: 'بناء عادة حركة صحية، طاقة بدنية مستدامة، وتحسين النشاط اليومي.',
    iconName: 'Activity',
    color: '#922D48',
  },
  {
    id: 'discipline',
    name: 'الانضباط والاستمرارية',
    description: 'ترسيخ الالتزام بالعهود، تقليل التسويف، وبناء العزيمة اليومية.',
    iconName: 'ShieldCheck',
    color: '#6D1028',
  },
  {
    id: 'knowledge',
    name: 'المعرفة والقراءة',
    description: 'تغذية العقل بالقراءة الهادفة وتطبيق المفاهيم في الواقع العملي.',
    iconName: 'BookOpen',
    color: '#B03A58',
  },
  {
    id: 'skills',
    name: 'المهارات والمشاريع',
    description: 'اكتساب مهارات ملموسة وتنفيذ مشاريع تطبيقية خطوة بخطوة.',
    iconName: 'Wrench',
    color: '#801832',
  },
  {
    id: 'time',
    name: 'تنظيم الوقت والحياة',
    description: 'إدارة الأولويات، الحد من المشتتات، واستثمار الساعات بوعي.',
    iconName: 'Clock',
    color: '#9E2A47',
  },
  {
    id: 'self_discovery',
    name: 'اكتشاف الذات والسلوك',
    description: 'فهم الدوافع، تأمل السلوكيات، وتدوين الملاحظات الصادقة مع النفس.',
    iconName: 'Compass',
    color: '#6D1028',
  },
  {
    id: 'spiritual',
    name: 'العادات الشخصية والروحية',
    description: 'السكينة النفسية، الامتنان، والعادات القيمية التي تعزز الاتزان الداخلي.',
    iconName: 'HeartHandshake',
    color: '#A82D4F',
  },
];

export interface StageDefinition {
  stageNumber: number;
  title: string;
  subtitle: string;
  startDay: number;
  endDay: number;
  theme: string;
  coreObjective: string;
}

export const STAGES_DEFINITIONS: StageDefinition[] = [
  {
    stageNumber: 1,
    title: 'المرحلة الأولى: التأسيس',
    subtitle: 'التعرّف على النفس وبناء الروتين الواقعي',
    startDay: 1,
    endDay: 30,
    theme: 'التأسيس والوعي',
    coreObjective: 'رسم نقطة البداية، تثبيت الحد الأدنى من الالتزام اليومي، وفهم المعوقات دون قسوة.',
  },
  {
    stageNumber: 2,
    title: 'المرحلة الثانية: الانضباط',
    subtitle: 'تطوير الالتزام ومواجهة التسويف',
    startDay: 31,
    endDay: 60,
    theme: 'الانضباط والتحكم',
    coreObjective: 'بناء مناعة ضد التأجيل، ترتيب أولويات اليوم، ورفع جودة التركيز.',
  },
  {
    stageNumber: 3,
    title: 'المرحلة الثالثة: الجسم والحركة',
    subtitle: 'تعزيز الحيوية والطاقة والنشاط البدني',
    startDay: 61,
    endDay: 90,
    theme: 'الصحة والحيوية',
    coreObjective: 'ترسيخ نمط حركة آمن ومنتظم، تحسين جودة النوم، ومتابعة النشاط تدريجيًا.',
  },
  {
    stageNumber: 4,
    title: 'المرحلة الرابعة: المعرفة',
    subtitle: 'القراءة الهادفة والتطبيق العملي',
    startDay: 91,
    endDay: 120,
    theme: 'العقل والبصيرة',
    coreObjective: 'إتمام قراءة نوعية، استخلاص الأفكار الجوهرية، وتحويلها إلى ممارسة يومية.',
  },
  {
    stageNumber: 5,
    title: 'المرحلة الخامسة: المهارات',
    subtitle: 'التعلّم بالممارسة وإنجاز مشروع حقيقي',
    startDay: 121,
    endDay: 150,
    theme: 'الإتقان والإنتاج',
    coreObjective: 'صقل مهارة محددة، تقسيمها إلى مراحل، وتقديم نتيجة عملية تثبت التعلم.',
  },
  {
    stageNumber: 6,
    title: 'المرحلة السادسة: التوسع والتجربة',
    subtitle: 'خوض آفاق جديدة واختبار المرونة',
    startDay: 151,
    endDay: 180,
    theme: 'الاستكشاف والتحسين',
    coreObjective: 'تجربة أنشطة غير مألوفة، تدقيق إدارة الوقت، وتحسين الروتين بمزيد من المرونة.',
  },
  {
    stageNumber: 7,
    title: 'المرحلة السابعة: التثبيت',
    subtitle: 'ترسيخ المكتسبات والاستعداد للاستدامة',
    startDay: 181,
    endDay: 210,
    theme: 'الثبات والنضج',
    coreObjective: 'تحويل العادات الإيجابية إلى هوية طبيعية، وتأكيد القدرة على مواجهة التحديات بهدوء.',
  },
  {
    stageNumber: 8,
    title: 'المرحلة الختامية: الإغلاق والتحوّل',
    subtitle: 'جني الثمار وفتح رسالة الذات',
    startDay: 211,
    endDay: 214,
    theme: 'التتويج والعبور',
    coreObjective: 'المراجعة الشاملة للرحلة، قراءة رسالة اليوم الأول، وصياغة خطة الاستمرار لما بعد 214 يومًا.',
  },
];

export const INITIAL_CONTRACTS: StageContract[] = STAGES_DEFINITIONS.map((stage) => ({
  stageNumber: stage.stageNumber,
  stageTitle: stage.title,
  mainGoal: stage.coreObjective,
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
}));

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach_step_one',
    title: 'الخطوة الأولى',
    description: 'بدء رحلة الـ 214 يومًا وتوثيق العهد الشخصي.',
    icon: 'Flag',
    xpReward: 100,
    category: 'milestone',
  },
  {
    id: 'ach_first_task',
    title: 'حجر الأساس',
    description: 'إتمام أول مهمة يومية مسجلة في التطبيق.',
    icon: 'CheckCircle',
    xpReward: 50,
    category: 'consistency',
  },
  {
    id: 'ach_streak_3',
    title: 'شرارة الاستمرار',
    description: 'الاستمرار لـ 3 أيام متتالية دون انقطاع.',
    icon: 'Flame',
    xpReward: 150,
    category: 'consistency',
  },
  {
    id: 'ach_streak_7',
    title: 'أسبوع كامل من الثبات',
    description: 'الوصول إلى سلسلة استمرار 7 أيام بنجاح.',
    icon: 'Zap',
    xpReward: 300,
    category: 'consistency',
  },
  {
    id: 'ach_streak_30',
    title: 'شهر من الإرادة',
    description: 'الوصول إلى 30 يومًا من الإنجاز والوعي.',
    icon: 'Award',
    xpReward: 1000,
    category: 'consistency',
  },
  {
    id: 'ach_first_book',
    title: 'قارئ واعٍ',
    description: 'إتمام قراءة أول كتاب وتدوين خلاصته وتطبيقه العملي.',
    icon: 'BookOpen',
    xpReward: 400,
    category: 'reading',
  },
  {
    id: 'ach_knowledge_applier',
    title: 'المعرفة الحية',
    description: 'تحويل فكرة من كتاب إلى مهمة عملية حقيقية في خطتك.',
    icon: 'Lightbulb',
    xpReward: 250,
    category: 'reading',
  },
  {
    id: 'ach_skill_project_done',
    title: 'صانع المهارة',
    description: 'إنجاز مشروع مهارة كامل خطوة بخطوة.',
    icon: 'Cpu',
    xpReward: 600,
    category: 'skill',
  },
  {
    id: 'ach_tough_day_warrior',
    title: 'الصمود الهادئ',
    description: 'تفعيل وضع اليوم الصعب وإنجاز الحد الأدنى دون استسلام.',
    icon: 'Shield',
    xpReward: 200,
    category: 'recovery',
  },
  {
    id: 'ach_resilient_return',
    title: 'العودة الشجاعة',
    description: 'النهوض والعودة إلى المسار بعد تعثر أو انقطاع.',
    icon: 'RotateCcw',
    xpReward: 350,
    category: 'recovery',
  },
  {
    id: 'ach_journal_master',
    title: 'مرآة الروح',
    description: 'كتابة 10 تأملات في دفتر اكتشاف الذات.',
    icon: 'Compass',
    xpReward: 300,
    category: 'general',
  },
  {
    id: 'ach_stage_1_done',
    title: 'تأسيس متين',
    description: 'إكمال المرحلة الأولى واعتماد تقريرها المرحلي.',
    icon: 'Crown',
    xpReward: 800,
    category: 'milestone',
  },
  {
    id: 'ach_halfway',
    title: 'منتصف الطريق',
    description: 'الوصول إلى اليوم 107 في الرحلة مع ثبات العزيمة.',
    icon: 'Compass',
    xpReward: 1500,
    category: 'milestone',
  },
  {
    id: 'ach_time_organized',
    title: 'سيد الوقت',
    description: 'تخطيط يوم كامل بمخطط الوقت وتسجيل النتائج الفعلية.',
    icon: 'Clock',
    xpReward: 200,
    category: 'general',
  },
  {
    id: 'ach_new_experience',
    title: 'روح الاستكشاف',
    description: 'خوض تجربة جديدة من قائمة التجارب وتوثيق أثرها.',
    icon: 'Sparkles',
    xpReward: 250,
    category: 'general',
  },
  {
    id: 'ach_transformation_complete',
    title: 'بطل الـ 214 يومًا',
    description: 'الوصول إلى خط النهاية وفتح رسالة اليوم الأول بنجاح.',
    icon: 'Trophy',
    xpReward: 5000,
    category: 'milestone',
  },
];

export const INITIAL_CHALLENGES: PersonalChallenge[] = [
  {
    id: 'ch_1',
    title: 'تحدي الاستيقاظ المنتظم 7 أيام',
    description: 'الاستيقاظ في نفس التوقيت لمدة أسبوع كامل لتثبيت الساعة البيولوجية.',
    durationDays: 7,
    difficulty: 'medium',
    pillarId: 'time',
    successCriteria: 'تسجيل وقت الاستيقاظ المحدد لمدة 7 أيام متتالية.',
    expectedMinutesPerDay: 10,
    status: 'available',
  },
  {
    id: 'ch_2',
    title: 'تحدي الـ 10 صفحات يوميًا',
    description: 'قراءة 10 صفحات يوميًا من كتابك المختار مع تدوين فكرة واحدة ملهمة.',
    durationDays: 14,
    difficulty: 'easy',
    pillarId: 'knowledge',
    successCriteria: 'إكمال 14 يومًا من القراءة وتدوين 14 فكرة.',
    expectedMinutesPerDay: 20,
    status: 'available',
  },
  {
    id: 'ch_3',
    title: 'تحدي المشي والتنفس 20 دقيقة',
    description: 'المشي الخفيف في الهواء الطلق دون هاتف أو مشتتات.',
    durationDays: 10,
    difficulty: 'easy',
    pillarId: 'fitness',
    successCriteria: 'إتمام 10 أيام من المشي الذهني الواعي.',
    expectedMinutesPerDay: 20,
    status: 'available',
  },
  {
    id: 'ch_4',
    title: 'ساعة التركيز العميق (Deep Work)',
    description: 'العمل على مشروع المهارة لمدة 60 دقيقة في جلسة مغلقة ودون إشعارات.',
    durationDays: 5,
    difficulty: 'hard',
    pillarId: 'skills',
    successCriteria: 'تنفيذ 5 جلسات تركيز عميق موثقة.',
    expectedMinutesPerDay: 60,
    status: 'available',
  },
  {
    id: 'ch_5',
    title: 'تحدي الامتنان الثلاثي',
    description: 'كتابة 3 أمور أصيلة تشعر بالامتنان لوجودها في حياتك كل مساء.',
    durationDays: 14,
    difficulty: 'easy',
    pillarId: 'spiritual',
    successCriteria: 'تسجيل 14 تدوينة امتنان في دفتر اكتشاف الذات.',
    expectedMinutesPerDay: 5,
    status: 'available',
  },
  {
    id: 'ch_6',
    title: 'تحدي صيام المشتتات الرقمية',
    description: 'تخصيص ساعتين قبل النوم دون شاشات واستبدالها بالقراءة أو الاسترخاء.',
    durationDays: 7,
    difficulty: 'medium',
    pillarId: 'self_discovery',
    successCriteria: 'الالتزام بـ 7 ليالٍ خالية من الشاشات قبل النوم.',
    expectedMinutesPerDay: 120,
    status: 'available',
  },
  {
    id: 'ch_7',
    title: 'تحدي تحضير الغد الليلة',
    description: 'كتابة أهم 3 أولويات لليوم التالي قبل الخلود إلى الفراش.',
    durationDays: 10,
    difficulty: 'easy',
    pillarId: 'discipline',
    successCriteria: 'تنظيم 10 أيام متتالية مسبقًا.',
    expectedMinutesPerDay: 10,
    status: 'available',
  },
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew_1',
    title: 'مشاهدة فيلم ملهم في عطلة الأسبوع',
    description: 'أمسية هادئة لمشاهدة فيلم وثائقي أو سينمائي راقٍ دون تأنيب ضمير.',
    xpCost: 500,
    isRedeemed: false,
  },
  {
    id: 'rew_2',
    title: 'اقتناء كتاب جديد للمرحلة القادمة',
    description: 'شراء كتاب كنت تطمح لقراءته مكافأةً على إتمام هدف معرفي.',
    xpCost: 800,
    isRedeemed: false,
  },
  {
    id: 'rew_3',
    title: 'نزهة صباحية أو قهوة في مكان مفضل',
    description: 'ساعة استرخاء وتأمل شخصي في الهواء الطلق.',
    xpCost: 400,
    isRedeemed: false,
  },
  {
    id: 'rew_4',
    title: 'أداة أو ملحق يخدم مشروع المهارة',
    description: 'استثمار بسيط في أداة تزيد من إنتاجيتك واستمتاعك بالتعلم.',
    xpCost: 1200,
    isRedeemed: false,
  },
];

export interface UserRank {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
}

export const RANKS_TABLE: UserRank[] = [
  { level: 1, title: 'المبتدئ الواعي', minXP: 0, maxXP: 299 },
  { level: 2, title: 'الساعي المثابر', minXP: 300, maxXP: 799 },
  { level: 3, title: 'صاحب الإرادة', minXP: 800, maxXP: 1499 },
  { level: 4, title: 'المنضبط الهادئ', minXP: 1500, maxXP: 2499 },
  { level: 5, title: 'المتأمل البنّاء', minXP: 2500, maxXP: 3999 },
  { level: 6, title: 'الحكيم المنجز', minXP: 4000, maxXP: 5999 },
  { level: 7, title: 'المحارب الصامد', minXP: 6000, maxXP: 8499 },
  { level: 8, title: 'رائد التحوّل الشامل', minXP: 8500, maxXP: 999999 },
];

export function calculateUserRank(totalXP: number): { rank: UserRank; progressPercent: number } {
  for (let i = 0; i < RANKS_TABLE.length; i++) {
    const r = RANKS_TABLE[i];
    if (totalXP >= r.minXP && (totalXP <= r.maxXP || i === RANKS_TABLE.length - 1)) {
      const range = r.maxXP - r.minXP;
      const current = totalXP - r.minXP;
      const progressPercent = Math.min(100, Math.max(0, Math.round((current / range) * 100)));
      return { rank: r, progressPercent };
    }
  }
  return { rank: RANKS_TABLE[0], progressPercent: 0 };
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'صاحب العزيمة',
  mainGoals: ['بناء عادة القراءة والتعلم', 'تعزيز اللياقة البدنية والنشاط', 'تنظيم الوقت وتقليل التشتت'],
  selectedPillars: ['fitness', 'discipline', 'knowledge', 'skills', 'time', 'self_discovery', 'spiritual'],
  activityLevel: 'moderate',
  skillsExperience: 'beginner',
  dailyAvailableMinutes: 60,
  sleepTime: '23:00',
  wakeTime: '06:30',
  booksAndSkillsGoal: 'قراءة 6 كتب ذات أثر، وإتقان أساسيات مهارة جديدة مفيدة.',
  habitsToBuild: ['القراءة اليومية 20 دقيقة', 'المشي والحركة', 'تدوين الأفكار والمشاعر'],
  habitsToBreak: ['التصفح العشوائي للهاتف في الصباح والمساء', 'التسويف المفرط للمهام الأساسية'],
  typicalChallenges: ['التسويف', 'تقلب المزاج والطاقة'],
  difficultyPreference: 'gentle',
  restDays: ['الجمعة'],
  physicalNotes: 'البدء تدريجيًا برفق دون إجهاد مفرط.',
  journeyStartDate: new Date().toISOString().split('T')[0],
  journeyTargetEndDate: new Date(Date.now() + 213 * 86400000).toISOString().split('T')[0],
  isJourneyStarted: false,
  smartGradingEnabled: true,
  inAppRemindersEnabled: true,
  sealedLetterWritten: false,
};
