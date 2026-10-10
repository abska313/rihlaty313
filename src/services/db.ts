/**
 * ABSKA — 214 | IndexedDB Database Service
 * 100% Client-side local storage with automatic fallback to localStorage.
 */

import {
  AchievementItem,
  BackupData,
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
} from '../types';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CHALLENGES,
  INITIAL_CONTRACTS,
  INITIAL_REWARDS,
} from './sampleData';

const DB_NAME = 'abska_214_db';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

function isIndexedDBAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

export function openDatabase(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('tasks')) {
        const s = db.createObjectStore('tasks', { keyPath: 'id' });
        s.createIndex('date', 'date', { unique: false });
        s.createIndex('dayNumber', 'dayNumber', { unique: false });
        s.createIndex('status', 'status', { unique: false });
      }
      if (!db.objectStoreNames.contains('xpLog')) {
        const s = db.createObjectStore('xpLog', { keyPath: 'id' });
        s.createIndex('referenceId', 'referenceId', { unique: false });
      }
      if (!db.objectStoreNames.contains('achievements')) {
        db.createObjectStore('achievements', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('contracts')) {
        db.createObjectStore('contracts', { keyPath: 'stageNumber' });
      }
      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('projects')) {
        const s = db.createObjectStore('projects', { keyPath: 'id' });
        s.createIndex('stageNumber', 'stageNumber', { unique: false });
      }
      if (!db.objectStoreNames.contains('journal')) {
        const s = db.createObjectStore('journal', { keyPath: 'id' });
        s.createIndex('date', 'date', { unique: false });
        s.createIndex('dayNumber', 'dayNumber', { unique: false });
      }
      if (!db.objectStoreNames.contains('reviews')) {
        db.createObjectStore('reviews', { keyPath: 'stageNumber' });
      }
      if (!db.objectStoreNames.contains('photos')) {
        const s = db.createObjectStore('photos', { keyPath: 'id' });
        s.createIndex('stageNumber', 'stageNumber', { unique: false });
      }
      if (!db.objectStoreNames.contains('challenges')) {
        db.createObjectStore('challenges', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('rewards')) {
        db.createObjectStore('rewards', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('timeBlocks')) {
        const s = db.createObjectStore('timeBlocks', { keyPath: 'id' });
        s.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains('experiences')) {
        db.createObjectStore('experiences', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('relapses')) {
        db.createObjectStore('relapses', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('toughDays')) {
        db.createObjectStore('toughDays', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Generic transaction helpers
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    const raw = localStorage.getItem(`abska_${storeName}`);
    return raw ? JSON.parse(raw) : [];
  }
}

async function putItemToStore<T>(storeName: string, item: T): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // LocalStorage fallback
    const items = await getAllFromStore<any>(storeName);
    const key = (item as any).id ?? (item as any).key ?? (item as any).stageNumber;
    const idx = items.findIndex((x) => (x.id ?? x.key ?? x.stageNumber) === key);
    if (idx >= 0) items[idx] = item;
    else items.push(item);
    localStorage.setItem(`abska_${storeName}`, JSON.stringify(items));
  }
}

async function deleteItemFromStore(storeName: string, key: IDBValidKey): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const items = await getAllFromStore<any>(storeName);
    const filtered = items.filter((x) => (x.id ?? x.key ?? x.stageNumber) !== key);
    localStorage.setItem(`abska_${storeName}`, JSON.stringify(filtered));
  }
}

// User Profile Operations
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction('profile', 'readonly');
      const store = tx.objectStore('profile');
      const req = store.get('current_user');
      req.onsuccess = () => {
        if (req.result && req.result.data) {
          resolve(req.result.data);
        } else {
          resolve(DEFAULT_USER_PROFILE);
        }
      };
      req.onerror = () => resolve(DEFAULT_USER_PROFILE);
    });
  } catch {
    const raw = localStorage.getItem('abska_user_profile');
    return raw ? JSON.parse(raw) : DEFAULT_USER_PROFILE;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('profile', 'readwrite');
      const store = tx.objectStore('profile');
      const req = store.put({ key: 'current_user', data: profile });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    localStorage.setItem('abska_user_profile', JSON.stringify(profile));
  }
}

// Tasks Operations
export const getTasks = () => getAllFromStore<TaskItem>('tasks');
export const saveTask = (task: TaskItem) => putItemToStore<TaskItem>('tasks', task);
export const deleteTask = (id: string) => deleteItemFromStore('tasks', id);

// XP Log Operations
export const getXPLog = () => getAllFromStore<XPRecord>('xpLog');
export async function addXPRecord(record: XPRecord): Promise<boolean> {
  // Prevent double scoring if referenceId is provided
  if (record.referenceId) {
    const existing = await getXPLog();
    const duplicate = existing.some((x) => x.referenceId === record.referenceId);
    if (duplicate) return false;
  }
  await putItemToStore<XPRecord>('xpLog', record);
  return true;
}

// Achievements Operations
export async function getAchievements(): Promise<AchievementItem[]> {
  const items = await getAllFromStore<AchievementItem>('achievements');
  if (items.length === 0) {
    // Seed initial achievements
    for (const ach of INITIAL_ACHIEVEMENTS) {
      await putItemToStore('achievements', ach);
    }
    return INITIAL_ACHIEVEMENTS;
  }
  return items;
}
export const saveAchievement = (ach: AchievementItem) => putItemToStore<AchievementItem>('achievements', ach);

// Contracts Operations
export async function getContracts(): Promise<StageContract[]> {
  const items = await getAllFromStore<StageContract>('contracts');
  if (items.length === 0) {
    for (const c of INITIAL_CONTRACTS) {
      await putItemToStore('contracts', c);
    }
    return INITIAL_CONTRACTS;
  }
  return items;
}
export const saveContract = (c: StageContract) => putItemToStore<StageContract>('contracts', c);

// Books Operations
export const getBooks = () => getAllFromStore<BookItem>('books');
export const saveBook = (book: BookItem) => putItemToStore<BookItem>('books', book);
export const deleteBook = (id: string) => deleteItemFromStore('books', id);

// Projects Operations
export const getProjects = () => getAllFromStore<SkillProject>('projects');
export const saveProject = (p: SkillProject) => putItemToStore<SkillProject>('projects', p);
export const deleteProject = (id: string) => deleteItemFromStore('projects', id);

// Journal Operations
export const getJournalEntries = () => getAllFromStore<JournalEntry>('journal');
export const saveJournalEntry = (entry: JournalEntry) => putItemToStore<JournalEntry>('journal', entry);
export const deleteJournalEntry = (id: string) => deleteItemFromStore('journal', id);

// Reviews Operations
export const getReviews = () => getAllFromStore<StageReviewReport>('reviews');
export const saveReview = (r: StageReviewReport) => putItemToStore<StageReviewReport>('reviews', r);

// Photos Operations
export const getPhotos = () => getAllFromStore<ProgressPhoto>('photos');
export const savePhoto = (p: ProgressPhoto) => putItemToStore<ProgressPhoto>('photos', p);
export const deletePhoto = (id: string) => deleteItemFromStore('photos', id);

// Challenges Operations
export async function getChallenges(): Promise<PersonalChallenge[]> {
  const items = await getAllFromStore<PersonalChallenge>('challenges');
  if (items.length === 0) {
    for (const ch of INITIAL_CHALLENGES) {
      await putItemToStore('challenges', ch);
    }
    return INITIAL_CHALLENGES;
  }
  return items;
}
export const saveChallenge = (ch: PersonalChallenge) => putItemToStore<PersonalChallenge>('challenges', ch);

// Rewards Operations
export async function getRewards(): Promise<RewardItem[]> {
  const items = await getAllFromStore<RewardItem>('rewards');
  if (items.length === 0) {
    for (const r of INITIAL_REWARDS) {
      await putItemToStore('rewards', r);
    }
    return INITIAL_REWARDS;
  }
  return items;
}
export const saveReward = (r: RewardItem) => putItemToStore<RewardItem>('rewards', r);
export const deleteReward = (id: string) => deleteItemFromStore('rewards', id);

// Time Blocks Operations
export const getTimeBlocks = () => getAllFromStore<TimeBlock>('timeBlocks');
export const saveTimeBlock = (tb: TimeBlock) => putItemToStore<TimeBlock>('timeBlocks', tb);
export const deleteTimeBlock = (id: string) => deleteItemFromStore('timeBlocks', id);

// Experiences Operations
export const getExperiences = () => getAllFromStore<NewExperience>('experiences');
export const saveExperience = (exp: NewExperience) => putItemToStore<NewExperience>('experiences', exp);
export const deleteExperience = (id: string) => deleteItemFromStore('experiences', id);

// Relapses Operations
export const getRelapseRecords = () => getAllFromStore<RelapseRecord>('relapses');
export const saveRelapseRecord = (r: RelapseRecord) => putItemToStore<RelapseRecord>('relapses', r);

// Tough Days Operations
export const getToughDays = () => getAllFromStore<ToughDayLog>('toughDays');
export const saveToughDay = (td: ToughDayLog) => putItemToStore<ToughDayLog>('toughDays', td);

// Export Complete Backup
export async function exportFullBackup(): Promise<BackupData> {
  const [
    profile,
    tasks,
    xpLog,
    achievements,
    contracts,
    books,
    projects,
    journal,
    reviews,
    photos,
    challenges,
    rewards,
    timeBlocks,
    experiences,
    relapses,
    toughDays,
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

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    appName: 'ABSKA — 214',
    profile,
    tasks,
    xpLog,
    achievements,
    contracts,
    books,
    projects,
    journal,
    reviews,
    photos,
    challenges,
    rewards,
    timeBlocks,
    experiences,
    relapses,
    toughDays,
  };
}

// Validate Backup file before restoring
export function validateBackupData(data: any): { valid: boolean; error?: string; summary?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'الملف غير صالح أو فارغ' };
  }
  if (data.appName !== 'ABSKA — 214' && !data.schemaVersion) {
    return { valid: false, error: 'الملف لا ينتمي لبيانات ABSKA 214 المعتمدة' };
  }
  if (!data.profile || typeof data.profile !== 'object') {
    return { valid: false, error: 'بيانات الملف تفتقر إلى ملف المستخدم الأساسي' };
  }

  const tasksCount = Array.isArray(data.tasks) ? data.tasks.length : 0;
  const journalCount = Array.isArray(data.journal) ? data.journal.length : 0;
  const booksCount = Array.isArray(data.books) ? data.books.length : 0;
  const photosCount = Array.isArray(data.photos) ? data.photos.length : 0;

  return {
    valid: true,
    summary: `نسخة من تاريخ: ${new Date(data.exportedAt || Date.now()).toLocaleDateString('ar-EG')} | مهام: ${tasksCount} | مذكرات: ${journalCount} | كتب: ${booksCount} | صور: ${photosCount}`,
  };
}

// Restore Full Backup safely
export async function importFullBackup(data: BackupData): Promise<void> {
  const val = validateBackupData(data);
  if (!val.valid) throw new Error(val.error);

  await saveUserProfile(data.profile);

  // Clear and rewrite stores
  const db = await openDatabase();
  const storesToReplace: (keyof BackupData)[] = [
    'tasks',
    'xpLog',
    'achievements',
    'contracts',
    'books',
    'projects',
    'journal',
    'reviews',
    'photos',
    'challenges',
    'rewards',
    'timeBlocks',
    'experiences',
    'relapses',
    'toughDays',
  ];

  for (const sName of storesToReplace) {
    const list = data[sName];
    if (Array.isArray(list)) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(sName as string, 'readwrite');
        const store = tx.objectStore(sName as string);
        store.clear();
        for (const item of list) {
          store.put(item);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }
  }
}

// Factory Reset
export async function resetAllData(): Promise<void> {
  const db = await openDatabase();
  const stores = [
    'profile',
    'tasks',
    'xpLog',
    'achievements',
    'contracts',
    'books',
    'projects',
    'journal',
    'reviews',
    'photos',
    'challenges',
    'rewards',
    'timeBlocks',
    'experiences',
    'relapses',
    'toughDays',
  ];
  for (const s of stores) {
    await new Promise<void>((resolve) => {
      const tx = db.transaction(s, 'readwrite');
      tx.objectStore(s).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }
  localStorage.clear();
}
