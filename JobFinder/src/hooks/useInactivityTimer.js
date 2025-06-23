import { useEffect, useRef } from 'react';

export const useInactivityTimer = (timeoutMinutes = 240) => { // 4 hours
  const timeoutRef = useRef(null);
  const timeoutDuration = timeoutMinutes * 60 * 1000;
  
  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        alert('Session expired due to inactivity. Please log in again.');
        window.location.href = '/login';
      }, timeoutDuration);
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });
    
    resetTimer(); // Start the timer
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [timeoutDuration]);
};