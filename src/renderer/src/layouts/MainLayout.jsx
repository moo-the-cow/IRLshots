import React, { useState } from 'react';
import LogsPanel from '../components/common/LogsPanel';

const MainLayout = ({ children, tabs, saveButton }) => {
  const [logsExpanded, setLogsExpanded] = useState(false);
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#242339] to-[#1a1a2e] text-white">
      <header className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6 rounded-b-2xl shadow-xl border-b border-purple-500/30 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-1">
            <span className="text-[rgb(168,85,247)]">
              [<span className="text-white font-bold">IRL</span><span className="text-white font-normal italic">shots</span><span className="text-[rgb(239,68,68)]">]</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white font-semibold ml-2 uppercase tracking-wider">BETA</span>
          </h1>
          <div className="flex items-center gap-3">
            {/* Save button passed as a prop */}
            {saveButton}
          </div>
        </div>
        <div className="flex space-x-2 mt-6">
          {tabs}
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 space-y-6">
        {children}
      </main>
      
      <LogsPanel expanded={logsExpanded} setExpanded={setLogsExpanded} />
    </div>
  );
};

export default MainLayout;
