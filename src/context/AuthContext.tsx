import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  deleteUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { addPromptToSession } from '../hooks/useSessionTracking';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  subscription: 'free' | 'plus' | 'pro';
  generationsToday: number;
  totalGenerations: number;
  lastGenerationDate?: string;
}

interface Generation {
  uid: string;
  userId: string;
  prompt: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: string;
  tags?: string[];
}

interface GuestProfile {
  generationsToday: number;
  lastGenerationDate: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  trackGeneration: (prompt: string, title: string, content: string, wordCount: number, tags?: string[]) => Promise<void>;
  canGenerate: () => boolean;
  getRemainingGenerations: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const GENERATION_LIMITS = {
    free: 2,
    plus: 999999, // unlimited
    pro: 999999,  // unlimited
  };

  // LocalStorage keys
  const GUEST_STORAGE_KEY = 'smutme_guest_limits';

  // Get guest profile from localStorage
  const getGuestProfile = (): GuestProfile => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        const profile = JSON.parse(stored) as GuestProfile;
        // Reset if new day
        const today = new Date().toDateString();
        const lastDate = new Date(profile.lastGenerationDate).toDateString();
        if (lastDate !== today) {
          return { generationsToday: 0, lastGenerationDate: new Date().toISOString() };
        }
        return profile;
      }
    } catch (error) {
      console.warn('Failed to read guest profile:', error);
    }
    return { generationsToday: 0, lastGenerationDate: new Date().toISOString() };
  };

  // Save guest profile to localStorage
  const saveGuestProfile = (profile: GuestProfile) => {
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.warn('Failed to save guest profile:', error);
    }
  };

  const resetDailyCountIfNeeded = async (profile: UserProfile) => {
    const today = new Date().toDateString();
    const lastDate = profile.lastGenerationDate ? new Date(profile.lastGenerationDate).toDateString() : null;

    if (lastDate !== today) {
      const updatedProfile = {
        ...profile,
        generationsToday: 0,
        lastGenerationDate: new Date().toISOString(),
      };
      
      try {
        const userRef = doc(db, 'users', profile.uid);
        await setDoc(userRef, updatedProfile, { merge: true });
        setUserProfile(updatedProfile);
        return updatedProfile;
      } catch (error) {
        console.warn('Could not reset daily count:', error);
        setUserProfile(updatedProfile);
        return updatedProfile;
      }
    }
    return profile;
  };

  const createUserProfile = async (user: User, displayName?: string) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: displayName || user.displayName || 'User',
          createdAt: new Date().toISOString(),
          subscription: 'free',
          generationsToday: 0,
          totalGenerations: 0,
          lastGenerationDate: new Date().toISOString(),
        };

        await setDoc(userRef, profile);
        setUserProfile(profile);
      } else {
        const profile = userSnap.data() as UserProfile;
        const resetProfile = await resetDailyCountIfNeeded(profile);
        setUserProfile(resetProfile);
      }
    } catch (error) {
      console.warn('Firestore not configured yet. Using basic profile:', error);
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: displayName || user.displayName || 'User',
        createdAt: new Date().toISOString(),
        subscription: 'free',
        generationsToday: 0,
        totalGenerations: 0,
        lastGenerationDate: new Date().toISOString(),
      };
      setUserProfile(profile);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    await createUserProfile(userCredential.user, displayName);
  };

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Track login analytics
    try {
      const sessionId = localStorage.getItem('sessionId') || 'unknown';
      const today = new Date().toISOString().split('T')[0];
      await addDoc(collection(db, 'analytics'), {
        type: 'login',
        sessionId: sessionId,
        userId: result.user.uid,
        email: result.user.email,
        method: 'email',
        timestamp: new Date().toISOString(),
        date: today,
      });
    } catch (error) {
      console.warn('Failed to track login analytics:', error);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user);
    
    // Track login analytics
    try {
      const sessionId = localStorage.getItem('sessionId') || 'unknown';
      const today = new Date().toISOString().split('T')[0];
      await addDoc(collection(db, 'analytics'), {
        type: 'login',
        sessionId: sessionId,
        userId: result.user.uid,
        email: result.user.email,
        method: 'google',
        timestamp: new Date().toISOString(),
        date: today,
      });
    } catch (error) {
      console.warn('Failed to track login analytics:', error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const deleteAccount = async () => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      // Delete user document from Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await deleteDoc(userRef);
      
      // Delete user from Authentication
      await deleteUser(currentUser);
      
      setUserProfile(null);
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  };

  const trackGeneration = async (prompt: string, title: string, content: string, wordCount: number, tags?: string[]) => {
    // Get current session ID from localStorage
    const sessionId = localStorage.getItem('sessionId') || 'unknown';
    
    // Add prompt to session document
    try {
      await addPromptToSession(
        prompt,
        currentUser?.uid || 'guest',
        currentUser?.email || userProfile?.email || null
      );
    } catch (error) {
      console.warn('Failed to add prompt to session:', error);
    }
    
    // Also track prompt separately for analytics (optional - can be removed if you only want it in session)
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      await addDoc(collection(db, 'analytics'), {
        type: 'prompt',
        prompt: prompt,
        sessionId: sessionId,
        userId: currentUser?.uid || 'guest',
        email: currentUser?.email || userProfile?.email || null,
        isGuest: !currentUser,
        timestamp: new Date().toISOString(),
        date: today,
      });
    } catch (error) {
      console.warn('Failed to track prompt analytics:', error);
    }

    // Track for authenticated users
    if (currentUser && userProfile) {
      try {
        // 1. Save generation as subcollection under user
        const generation: Generation = {
          uid: `gen_${Date.now()}`,
          userId: currentUser.uid,
          prompt,
          title,
          content,
          wordCount,
          createdAt: new Date().toISOString(),
          tags: tags || [],
        };

        console.log('📝 Saving generation to Firestore subcollection...');
        // Save to users/{userId}/generations/{generationId}
        const userGenerationsRef = collection(db, 'users', currentUser.uid, 'generations');
        await addDoc(userGenerationsRef, generation);
        console.log('✅ Generation saved to Firestore subcollection');

        // 2. Update user profile with new counts
        const newGenerationsToday = (userProfile.generationsToday || 0) + 1;
        const newTotalGenerations = (userProfile.totalGenerations || 0) + 1;
        
        const updatedProfile: UserProfile = {
          ...userProfile,
          generationsToday: newGenerationsToday,
          totalGenerations: newTotalGenerations,
          lastGenerationDate: new Date().toISOString(),
        };

        console.log('📝 Updating user profile:', {
          old: { generationsToday: userProfile.generationsToday, totalGenerations: userProfile.totalGenerations },
          new: { generationsToday: newGenerationsToday, totalGenerations: newTotalGenerations }
        });

        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, updatedProfile, { merge: true });
        console.log('✅ User profile updated in Firestore');
        
        setUserProfile(updatedProfile);
        console.log('✅ Local userProfile state updated');
      } catch (error) {
        console.error('❌ Firestore error:', error);
        // Update local profile even if Firestore fails
        const updatedProfile: UserProfile = {
          ...userProfile,
          generationsToday: (userProfile.generationsToday || 0) + 1,
          totalGenerations: (userProfile.totalGenerations || 0) + 1,
          lastGenerationDate: new Date().toISOString(),
        };
        setUserProfile(updatedProfile);
      }
    } else {
      // Track for guest users in localStorage
      console.log('👤 Tracking generation for guest user');
      const guestProfile = getGuestProfile();
      const updatedGuest: GuestProfile = {
        generationsToday: guestProfile.generationsToday + 1,
        lastGenerationDate: new Date().toISOString(),
      };
      saveGuestProfile(updatedGuest);
      console.log('✅ Guest profile updated in localStorage:', updatedGuest);
    }
  };

  const canGenerate = (): boolean => {
    if (userProfile) {
      const limit = GENERATION_LIMITS[userProfile.subscription];
      return (userProfile.generationsToday || 0) < limit;
    }
    // Check guest limits
    const guestProfile = getGuestProfile();
    return guestProfile.generationsToday < GENERATION_LIMITS.free;
  };

  const getRemainingGenerations = (): number => {
    if (userProfile) {
      const limit = GENERATION_LIMITS[userProfile.subscription];
      const remaining = limit - (userProfile.generationsToday || 0);
      return Math.max(0, remaining);
    }
    // Return guest remaining
    const guestProfile = getGuestProfile();
    const remaining = GENERATION_LIMITS.free - guestProfile.generationsToday;
    return Math.max(0, remaining);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const profile = userSnap.data() as UserProfile;
            const resetProfile = await resetDailyCountIfNeeded(profile);
            setUserProfile(resetProfile);
          } else {
            await createUserProfile(user);
          }
        } catch (error) {
          console.warn('Firestore error, using fallback profile:', error);
          // Fallback profile
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'User',
            createdAt: new Date().toISOString(),
            subscription: 'free',
            generationsToday: 0,
            totalGenerations: 0,
            lastGenerationDate: new Date().toISOString(),
          });
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
    deleteAccount,
    trackGeneration,
    canGenerate,
    getRemainingGenerations,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
