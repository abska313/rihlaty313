import { STAGES_DEFINITIONS, StageDefinition } from '../services/sampleData';
import { UserProfile } from '../types';

export function getJourneyDayInfo(profile: UserProfile): {
  currentDay: number;
  remainingDays: number;
  progressPercent: number;
  currentStage: StageDefinition;
  isCompleted: boolean;
  isStarted: boolean;
} {
  if (!profile.isJourneyStarted) {
    return {
      currentDay: 1,
      remainingDays: 214,
      progressPercent: 0,
      currentStage: STAGES_DEFINITIONS[0],
      isCompleted: false,
      isStarted: false,
    };
  }

  const start = new Date(profile.journeyStartDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  const rawDiffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  let day = rawDiffDays + 1;

  if (profile.simulatedDayOffset) {
    day += profile.simulatedDayOffset;
  }

  // Ensure minimum is day 1
  if (day < 1) day = 1;

  const isCompleted = day > 214;
  const clampedDay = Math.min(214, Math.max(1, day));
  const remainingDays = Math.max(0, 214 - clampedDay);
  const progressPercent = Math.min(100, Math.round((clampedDay / 214) * 100));

  let currentStage = STAGES_DEFINITIONS[0];
  for (const s of STAGES_DEFINITIONS) {
    if (clampedDay >= s.startDay && clampedDay <= s.endDay) {
      currentStage = s;
      break;
    }
  }

  return {
    currentDay: clampedDay,
    remainingDays,
    progressPercent,
    currentStage,
    isCompleted,
    isStarted: true,
  };
}

export function formatArabicDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Image compressor for local IndexedDB storage
 * Scales large photos to max 900px, JPEG 0.72 quality
 */
export async function compressImageFile(file: File): Promise<{ dataUrl: string; sizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 900;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
        const sizeBytes = Math.round((dataUrl.length * 3) / 4);
        resolve({ dataUrl, sizeBytes });
      };
      img.onerror = () => reject(new Error('فشل قراءة ملف الصورة'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('فشل تحميل الصورة'));
    reader.readAsDataURL(file);
  });
}
