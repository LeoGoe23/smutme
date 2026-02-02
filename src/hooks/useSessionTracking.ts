import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLocation } from 'react-router-dom';

// Global function to add prompt to current session
export const addPromptToSession = async (prompt: string, userId: string, email: string | null) => {
  const sessionId = localStorage.getItem('sessionId');
  if (!sessionId) return;
  
  try {
    const sessionDocRef = doc(db, 'analytics', sessionId);
    await setDoc(sessionDocRef, {
      prompts: arrayUnion({
        prompt: prompt,
        timestamp: new Date().toISOString(),
        userId: userId,
        email: email,
      }),
    }, { merge: true });
    
    if (window.location.hostname === 'localhost') {
      console.log('📝 Prompt added to session:', sessionId);
    }
  } catch (error) {
    if (window.location.hostname === 'localhost') {
      console.warn('Failed to add prompt to session:', error);
    }
  }
};

export const useSessionTracking = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Persist sessionId across reloads using localStorage
  const getOrCreateSessionId = () => {
    const stored = localStorage.getItem('sessionId');
    const storedTime = localStorage.getItem('sessionStartTime');
    const now = Date.now();
    
    // If session is older than 30 minutes, create new session
    if (stored && storedTime && (now - parseInt(storedTime)) < 30 * 60 * 1000) {
      return { sessionId: stored, sessionStart: parseInt(storedTime) };
    }
    
    // Create new session
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', newSessionId);
    localStorage.setItem('sessionStartTime', now.toString());
    return { sessionId: newSessionId, sessionStart: now };
  };
  
  const { sessionId, sessionStart } = getOrCreateSessionId();
  const sessionIdRef = useRef<string>(sessionId);
  const sessionStartRef = useRef<number>(sessionStart);
  const lastActivityRef = useRef<number>(Date.now());
  const pagesVisitedRef = useRef<string[]>([location.pathname]);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reloadCountRef = useRef<number>(0);

  // Track page visits
  useEffect(() => {
    const currentPage = location.pathname;
    if (!pagesVisitedRef.current.includes(currentPage)) {
      pagesVisitedRef.current.push(currentPage);
    }
    lastActivityRef.current = Date.now();
    reloadCountRef.current += 1; // Track reloads
  }, [location.pathname]);

  // Track user activity (mouse move, click, scroll)
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('keypress', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('keypress', updateActivity);
    };
  }, []);

  // Save/Update session periodically
  useEffect(() => {
    const saveSession = async () => {
      const now = Date.now();
      const duration = Math.floor((now - sessionStartRef.current) / 1000); // seconds
      const timeSinceLastActivity = Math.floor((now - lastActivityRef.current) / 1000);

      // Only save if user was active in last 5 minutes
      if (timeSinceLastActivity > 300) {
        if (window.location.hostname === 'localhost') console.log('⏸️ Session inactive, not saving');
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Use setDoc with session ID as document ID to update same document
        const sessionDocRef = doc(db, 'analytics', sessionIdRef.current);
        
        await setDoc(sessionDocRef, {
          type: 'session',
          sessionId: sessionIdRef.current,
          userId: currentUser?.uid || 'guest',
          email: currentUser?.email || null,
          isGuest: !currentUser,
          startTime: new Date(sessionStartRef.current).toISOString(),
          lastActivity: new Date(lastActivityRef.current).toISOString(),
          duration: duration,
          pagesVisited: pagesVisitedRef.current,
          pageCount: pagesVisitedRef.current.length,
          reloadCount: reloadCountRef.current,
          prompts: [], // Initialize empty prompts array
          timestamp: new Date().toISOString(),
          date: today,
          status: 'active',
        }, { merge: true }); // Merge to update existing doc
        
        if (window.location.hostname === 'localhost') {
          console.log('📊 Session updated:', duration, 'seconds,', reloadCountRef.current, 'reloads');
        }
      } catch (error) {
        if (window.location.hostname === 'localhost') console.warn('Failed to track session:', error);
      }
    };

    // Initial save
    saveSession();

    // Update session every 2 minutes
    trackingIntervalRef.current = setInterval(saveSession, 120000);

    // Save on unmount
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
      saveSession();
    };
  }, [currentUser]);

  // Mark session as ended on page unload
  useEffect(() => {
    const handleUnload = async () => {
      const now = Date.now();
      const duration = Math.floor((now - sessionStartRef.current) / 1000);

      // Try to update session status to 'ended'
      try {
        const sessionDocRef = doc(db, 'analytics', sessionIdRef.current);
        await setDoc(sessionDocRef, {
          status: 'ended',
          endTime: new Date(now).toISOString(),
          duration: duration,
          timestamp: new Date().toISOString(),
        }, { merge: true });
      } catch (error) {
        // Silently fail on unload
      }

      if (window.location.hostname === 'localhost') {
        console.log('📊 Session ended:', duration, 'seconds');
      }
      
      // Clear localStorage on actual exit (not reload)
      if (performance.navigation.type !== 1) {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('sessionStartTime');
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [currentUser]);
};
