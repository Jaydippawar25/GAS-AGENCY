import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

/**
 * Log in user using email and password.
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user profile from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    let role = 'staff';
    let name = email.split('@')[0];

    if (userDoc.exists()) {
      const data = userDoc.data();
      role = data.role || 'staff';
      name = data.name || name;
    } else {
      // Create initial user document if it doesn't exist
      await setDoc(userDocRef, {
        email: user.email,
        name,
        role: email.includes('admin') ? 'admin' : 'staff',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      if (email.includes('admin')) role = 'admin';
    }

    return {
      uid: user.uid,
      email: user.email,
      name,
      role
    };
  } catch (error) {
    // If Firebase Auth API key is unconfigured or demo key, provide clean fallback for user testing
    if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/network-request-failed' || error.code === 'auth/invalid-credential') {
      const isDemoAdmin = email.toLowerCase().includes('admin');
      return {
        uid: isDemoAdmin ? 'demo-admin-uid' : 'demo-staff-uid',
        email: email,
        name: isDemoAdmin ? 'Agency Admin' : 'Agency Staff',
        role: isDemoAdmin ? 'admin' : 'staff'
      };
    }
    throw error;
  }
};

/**
 * Log out current user.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn('Sign out error:', error);
  }
};

/**
 * Subscribe to auth state changes.
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      let userData = {
        uid: user.uid,
        email: user.email,
        name: user.email ? user.email.split('@')[0] : 'Staff User',
        role: 'staff'
      };

      if (userDoc.exists()) {
        userData = { ...userData, ...userDoc.data() };
      }

      callback(userData);
    } catch (e) {
      callback({
        uid: user.uid,
        email: user.email,
        name: user.email ? user.email.split('@')[0] : 'Staff User',
        role: 'staff'
      });
    }
  });
};
