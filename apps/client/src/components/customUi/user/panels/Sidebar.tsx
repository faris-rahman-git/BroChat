import SidebarLogo from '../elements/sidebar/SidebarLogo';
import TopButtons from '../elements/sidebar/TopButtons';
import BottomButtons from '../elements/sidebar/BottomButtons';
import React, { useState } from 'react';

export function Sidebar({}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav
      className={`h-screen select-none bg-white shadow-[0px_0px_24px_#00000014] z-10 transition-all duration-200 py-4 px-2
      ${isExpanded ? 'w-48' : 'w-16'} flex flex-col justify-between`}
    >
      <div className="inline-flex flex-col gap-6 relative">
        <SidebarLogo />
        <TopButtons setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
      </div>

      <BottomButtons isExpanded={isExpanded} />
    </nav>
  );
}

export default React.memo(Sidebar);
