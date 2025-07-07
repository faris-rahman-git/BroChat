import { useEffect } from 'react';

const useMidnightUpdater = (callback: () => void) => {
  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0); // 12:00 AM

    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    const timer = setTimeout(() => {
      callback(); // Refresh your message labels here
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [callback]);
};

export default useMidnightUpdater;
