// src/hooks/useAutoLogout.js
import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

const INACTIVITY_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

export const useAutoLogout = () => {
  const { isAuthenticated, logout } = useAuth();
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isAuthenticated) {
      lastActivityRef.current = Date.now();
      timeoutRef.current = setTimeout(() => {
        logout();
        alert('You have been logged out due to inactivity.');
      }, INACTIVITY_TIMEOUT);
    }
  };

  const handleActivity = () => {
    if (isAuthenticated) {
      resetTimeout();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      resetTimeout();

      // Activity events to monitor
      const events = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click'
      ];

      // Add event listeners
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      // Cleanup function
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
      };
    }
  }, [isAuthenticated]);

  // Check for inactivity on component mount and visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
          logout();
          alert('You have been logged out due to inactivity.');
        } else {
          resetTimeout();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  return { resetTimeout };
};