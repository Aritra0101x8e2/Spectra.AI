
// Utility for storing and retrieving retina data in localStorage

interface RetinaData {
  id: string;
  timestamp: number;
  imageData: string;
  patterns: number[];
  signaturePoints: {x: number, y: number, intensity: number}[];
  matchScore?: number;
}

const STORAGE_KEY = 'retina_guardian_data';

export const saveRetinaData = (data: RetinaData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save retina data:', error);
  }
};

export const getStoredRetinaData = (): RetinaData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to retrieve retina data:', error);
    return null;
  }
};

export const hasStoredRetinaData = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

export const clearRetinaData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
