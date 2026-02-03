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
  
  // Persist sessionId across reloads using sessionStorage (not localStorage)
  const getOrCreateSessionId = () => {
    // Use sessionStorage instead of localStorage - clears when tab closes
    const stored = sessionStorage.getItem('sessionId');
    const storedTime = sessionStorage.getItem('sessionStartTime');
    
    if (stored && storedTime) {
      return { sessionId: stored, sessionStart: parseInt(storedTime) };
    }
    
    // Create new session only when truly new
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', newSessionId);
    sessionStorage.setItem('sessionStartTime', Date.now().toString());
    return { sessionId: newSessionId, sessionStart: Date.now() };
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

      // Only save if:
      // 1. User was active in last 5 minutes
      // 2. Session duration is at least 10 seconds (avoid spam)
      if (timeSinceLastActivity > 300) {
        if (window.location.hostname === 'localhost') console.log('⏸️ Session inactive, not saving');
        return;
      }
      
      if (duration < 10) {
        if (window.location.hostname === 'localhost') console.log('⏸️ Session too short, waiting...');
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
          durationSeconds: duration,
          durationMinutes: Math.floor(duration / 60),
          pagesVisited: pagesVisitedRef.current,
          pageCount: pagesVisitedRef.current.length,
          reloadCount: reloadCountRef.current,
          timestamp: new Date().toISOString(),
          date: today,
          status: 'active',
        }, { merge: true }); // Merge to update existing doc
        
        if (window.location.hostname === 'localhost') {
          console.log('📊 Session updated:', Math.floor(duration / 60), 'min', reloadCountRef.current, 'reloads');
        }
      } catch (error) {
        if (window.location.hostname === 'localhost') console.warn('Failed to track session:', error);
      }
    };

    // Save after 10 seconds first time
    const initialTimeout = setTimeout(saveSession, 10000);

    // Then update every 2 minutes
    trackingIntervalRef.current = setInterval(saveSession, 120000);

    // Save on unmount
    return () => {
      clearTimeout(initialTimeout);
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

      // Only save if session was at least 10 seconds
      if (duration < 10) return;

      // Try to update session status to 'ended'
      try {
        const sessionDocRef = doc(db, 'analytics', sessionIdRef.current);
        await setDoc(sessionDocRef, {
          status: 'ended',
          endTime: new Date(now).toISOString(),
          durationSeconds: duration,
          durationMinutes: Math.floor(duration / 60),
          timestamp: new Date().toISOString(),
        }, { merge: true });
      } catch (error) {
        // Silently fail on unload
      }

      if (window.location.hostname === 'localhost') {
        console.log('📊 Session ended:', Math.floor(duration / 60), 'minutes');
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [currentUser]);
};
