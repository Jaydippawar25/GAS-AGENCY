import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { INITIAL_SETTINGS } from '../firebase/seedData';
import { withTimeout } from '../utils/promiseUtils';

let memorySettings = { ...INITIAL_SETTINGS };

/**
 * Fetch agency settings with safety timeout.
 */
export const getAgencySettings = async () => {
  const fetchTask = (async () => {
    const docRef = doc(db, 'settings', 'agency');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      memorySettings = { ...INITIAL_SETTINGS, ...data };
      return memorySettings;
    }
    return INITIAL_SETTINGS;
  })();

  return withTimeout(fetchTask, memorySettings, 1200);
};

/**
 * Update agency settings.
 */
export const updateAgencySettings = async (updatedFields) => {
  const newSettings = {
    ...memorySettings,
    ...updatedFields,
    refillDurationDays: Number(updatedFields.refillDurationDays) || 25,
    defaultMinimumStock: Number(updatedFields.defaultMinimumStock) || 15,
    updatedAt: new Date()
  };

  memorySettings = newSettings;

  setDoc(doc(db, 'settings', 'agency'), {
    ...newSettings,
    updatedAt: serverTimestamp()
  }, { merge: true }).catch(console.warn);

  return { success: true, settings: memorySettings };
};
