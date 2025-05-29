import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';

const INACTIVITY_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours

export const useAutoLogout = () => {
  const { logout } = useAuth();
  const timeoutRef = useRef(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      logout();
      alert('You have been logged out due to inactivity.');
    }, INACTIVITY_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    resetTimeout();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }, [resetTimeout]);
};