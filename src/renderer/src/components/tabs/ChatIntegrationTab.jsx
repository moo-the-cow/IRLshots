import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';

const ChatIntegrationTab = () => {
  const { config, updateConfig } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('twitch'); // 'twitch' or 'kick'

  return (
    <div className="bg-[rgba(17,24,39,0.4)] rounded-2xl shadow-md p-8 border border-gray-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
      <div className="relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Chat Integration
      </h2>
      
      {/* Tab Selection */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('twitch')}
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'twitch'
              ? 'text-[#60a5fa] border-b-2 border-[#60a5fa] -mb-px'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Twitch
        </button>
        <button
          onClick={() => setActiveTab('kick')}
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'kick'
              ? 'text-[#60a5fa] border-b-2 border-[#60a5fa] -mb-px'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Kick.com
        </button>
      </div>

      {/* Twitch Tab Content */}
      <div className={`space-y-6 ${activeTab === 'twitch' ? 'block' : 'hidden'}`}>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableTwitch"
            checked={config.twitch?.enabled || false}
            onChange={e => updateConfig('twitch.enabled', e.target.checked)}
            className="h-4 w-4 text-[#60a5fa] focus:ring-[#60a5fa] rounded"
          />
          <label htmlFor="enableTwitch" className="ml-2 block text-sm text-white">
            Enable Twitch Integration
          </label>
        </div>
        
        {config.twitch?.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Channel
              </label>
              <input
                type="text"
                value={config.twitch?.channel || ''}
                onChange={e => updateConfig('twitch.channel', e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-[#2d2b42] text-white focus:ring focus:ring-[#60a5fa] focus:border-[#60a5fa]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Username
              </label>
              <input
                type="text"
                value={config.twitch?.username || ''}
                onChange={e => updateConfig('twitch.username', e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-[#2d2b42] text-white focus:ring focus:ring-[#60a5fa] focus:border-[#60a5fa]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                OAuth Token
              </label>
              <input
                type="password"
                value={config.twitch?.oauthToken || ''}
                onChange={e => updateConfig('twitch.oauthToken', e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-[#2d2b42] text-white focus:ring focus:ring-[#60a5fa] focus:border-[#60a5fa]"
                placeholder="oauth:xxxxxxx"
              />
              <p className="text-xs text-gray-400 mt-1">
                Generate a token at <a href="https://twitchapps.com/tmi/" target="_blank" rel="noreferrer" className="text-[#60a5fa] hover:underline">https://twitchapps.com/tmi/</a>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Command
              </label>
              <input
                type="text"
                value={config.twitch?.command || '!irlshot'}
                onChange={e => updateConfig('twitch.command', e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-[#2d2b42] text-white focus:ring focus:ring-[#60a5fa] focus:border-[#60a5fa]"
                placeholder="!irlshot"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Permission Levels
              </label>
              <div className="space-y-2 mt-2 p-3 border border-gray-700 rounded bg-[rgba(17,24,39,0.4)] backdrop-blur-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="everyone"
                    checked={config.twitch?.permissions?.everyone || false}
                    onChange={e => {
                      const newPermissions = { ...config.twitch?.permissions || {} };
                      newPermissions.everyone = e.target.checked;
                      // If everyone is checked, disable other options
                      if (e.target.checked) {
                        newPermissions.subscriber = false;
                        newPermissions.vip = false;
                        newPermissions.moderator = false;
                        newPermissions.broadcaster = false;
                      }
                      updateConfig('twitch.permissions', newPermissions);
                    }}
                    className="h-4 w-4 text-[#60a5fa] focus:ring-[#60a5fa] rounded"
                  />
                  <label htmlFor="everyone" className="ml-2 block text-sm text-white">
                    Everyone
                  </label>
                </div>
                
                <div className={`${config.twitch?.permissions?.everyone ? 'opacity-50' : ''}`}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="subscriber"
                      checked={config.twitch?.permissions?.subscriber || false}
                      onChange={e => {
                        const newPermissions = { ...config.twitch?.permissions || {} };
                        newPermissions.subscriber = e.target.checked;
                        if (e.target.checked) newPermissions.everyone = false;
                        updateConfig('twitch.permissions', newPermissions);
                      }}
                      disabled={config.twitch?.permissions?.everyone}
                      className="h-4 w-4 text-[#60a5fa] focus:ring-[#60a5fa] rounded"
                    />
                    <label htmlFor="subscriber" className="ml-2 block text-sm text-white">
                      Subscribers
                    </label>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="vip"
                      checked={config.twitch?.permissions?.vip || false}
                      onChange={e => {
                        const newPermissions = { ...config.twitch?.permissions || {} };
                        newPermissions.vip = e.target.checked;
                        if (e.target.checked) newPermissions.everyone = false;
                        updateConfig('twitch.permissions', newPermissions);
                      }}
                      disabled={config.twitch?.permissions?.everyone}
                      className="h-4 w-4 text-[#60a5fa] focus:ring-[#60a5fa] rounded"
                    />
                    <label htmlFor="vip" className="ml-2 block text-sm text-white">
                      VIPs
                    </label>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="moderator"
                      checked={config.twitch?.permissions?.moderator || false}
                      onChange={e => {
                        const newPermissions = { ...config.twitch?.permissions || {} };
                        newPermissions.moderator = e.target.checked;
                        if (e.target.checked) newPermissions.everyone = false;
                        updateConfig('twitch.permissions', newPermissions);
                      }}
                      disabled={config.twitch?.permissions?.everyone}
                      className="h-4 w-4 text-[#60a5fa] focus:ring-[#60a5fa] rounded"
                    />
                    <label htmlFor="moderator" className="ml-2 block text-sm text-white">
                      Moderators
                    </label>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="broadcaster"
                      checked={config.twitch?.permissions?.broadcaster || false}
                      onChange={e => {
                        const newPermissions = { ...config.twitch?.permissions || {} };
                        newPermissions.broadcaster = e.target.checked;
                        if (e.target.checked) newPermissions.everyone = false;
                        updateConfig('twitch.permissions', newPermissions);
                      }}
                      disabled={config.twitch?.permissions?.everyone}
                      className="h-4 w-4 text-[#60a5fa] focus:ring-[#60a5fa] rounded"
                    />
                    <label htmlFor="broadcaster" className="ml-2 block text-sm text-white">
                      Broadcaster Only
                    </label>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Select who is allowed to use the command in chat. If 'Everyone' is enabled, all other options are disabled.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Kick.com Tab Content */}
      <div className={`space-y-6 ${activeTab === 'kick' ? 'block' : 'hidden'}`}>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableKick"
            checked={config.kick?.enabled || false}
            onChange={e => updateConfig('kick.enabled', e.target.checked)}
            className="h-4 w-4 text-[#60a5fa] focus:ring-[#60a5fa] rounded"
          />
          <label htmlFor="enableKick" className="ml-2 block text-sm text-white">
            Enable Kick.com Integration
          </label>
        </div>
        
        {config.kick?.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Channel
              </label>
              <input
                type="text"
                value={config.kick?.channel || ''}
                onChange={e => updateConfig('kick.channel', e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-[#2d2b42] text-white focus:ring focus:ring-[#60a5fa] focus:border-[#60a5fa]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Username
              </label>
              <input
                type="text"
                value={config.kick?.username || ''}
                onChange={e => updateConfig('kick.username', e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-[#2d2b42] text-white focus:ring focus:ring-[#60a5fa] focus:border-[#60a5fa]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Auth Token
              </label>
              <input
                type="password"
                value={config.kick?.authToken || ''}
                onChange={e => updateConfig('kick.authToken', e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-[#2d2b42] text-white focus:ring focus:ring-[#60a5fa] focus:border-[#60a5fa]"
                placeholder="Auth token..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Kick.com integration is a placeholder and will be implemented in a future update.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Command
              </label>
              <input
                type="text"
                value={config.kick?.command || '!irlshot'}
                onChange={e => updateConfig('kick.command', e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-[#2d2b42] text-white focus:ring focus:ring-[#60a5fa] focus:border-[#60a5fa]"
                placeholder="!irlshot"
              />
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default ChatIntegrationTab;
