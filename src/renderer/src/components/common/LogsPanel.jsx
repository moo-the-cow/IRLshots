import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

const LogsPanel = ({ expanded, setExpanded }) => {
  const { logs } = useContext(AppContext);

  return (
    <div className={`bg-gradient-to-r from-[#1e1b2e] to-[#242339] text-gray-200 p-4 rounded-t-2xl shadow-inner overflow-hidden flex flex-col transition-all duration-300 ${expanded ? 'h-80' : 'h-32'} border-t border-l border-r border-purple-900/30`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-[#94a3b8] flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Application Logs
        </h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-[#94a3b8] hover:text-white p-1 rounded-md hover:bg-[#60a5fa]/20 transition-colors"
            title={expanded ? 'Collapse logs' : 'Expand logs'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[rgb(239,68,68)]"></div>
            <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
            <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar bg-[rgba(17,24,39,0.4)] rounded-lg p-2 shadow-inner border border-gray-800/50">
        <div className="font-mono text-xs space-y-1">
          {logs.map((log, i) => (
            <div 
              key={i} 
              className="py-1 px-2 hover:bg-[#60a5fa]/10 transition-colors rounded border-l-2 border-l-purple-500/30 shadow-sm my-1"
              style={{
                background: 'linear-gradient(to right, rgba(30, 27, 46, 0.3), transparent)'
              }}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsPanel;
