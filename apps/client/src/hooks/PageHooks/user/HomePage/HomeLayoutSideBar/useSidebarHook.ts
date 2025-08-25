import  { useState } from 'react';

export const useSidebarHook = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return { isExpanded, setIsExpanded };
};
