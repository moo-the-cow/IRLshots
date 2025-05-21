import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import { Input, Toggle, Button, Select } from '../common/StyledInputs';
const SettingsTab = () => {
  const { config, updateConfig } = useContext(AppContext);
  const { t, changeLanguage, getAvailableLanguages } = useContext(LanguageContext);
  const path = window.require('path');
  
  // Function to handle selecting an output folder
  const selectOutputFolder = async () => {
    try {
      const result = await window.api.selectOutputFolder();
      if (result && !result.canceled && result.filePaths && result.filePaths[0]) {
        const normalizedPath = path.normalize(result.filePaths[0]);
        updateConfig('outputFolder', normalizedPath);
      }
    } catch (error) {
      window.api.onLog(`Error selecting output folder: ${error.message}`);
    }
  };
  
  // Handle language change
  const handleLanguageChange = async (lang) => {
    console.log(`SettingsTab: Switching language to ${lang}`);
    // First update the config
    updateConfig('language', lang);
    // Then change the UI language
    const success = changeLanguage(lang);
    console.log(`Language change success: ${success}`);
    // Force an immediate save of the config
    await window.api.saveConfig(config);
    window.api.onLog(`Language changed to ${lang}. App restart may be required.`);
  };
  
  // Get available languages for dropdown
  const languageOptions = Object.entries(getAvailableLanguages()).map(([code, name]) => ({
    value: code,
    label: name
  }));

  return (
    <div className="bg-[rgba(17,24,39,0.4)] rounded-2xl shadow-md p-8 border border-gray-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t('settingsTab.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Settings Section */}
          <div className="bg-[rgba(17,24,39,0.3)] p-4 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-white">{t('settingsTab.imageSettings')}</h3>
            <div className="space-y-4">
              <Input
                label={t('settingsTab.imageWidth')}
                type="number"
                value={config.imageWidth || 1280}
                onChange={e => updateConfig('imageWidth', parseInt(e.target.value) || 1920)}
              />
              
              <Input
                label={t('settingsTab.imageHeight')}
                type="number"
                value={config.imageHeight || 720}
                onChange={e => updateConfig('imageHeight', parseInt(e.target.value) || 1080)}
              />
              
              <Toggle
                label={t('settingsTab.saveScreenshots')}
                checked={config.saveScreenshots || false}
                onChange={e => updateConfig('saveScreenshots', e.target.checked)}
              />
              
              {/* Output Folder Selection */}
              {config.saveScreenshots && (
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t('settingsTab.outputFolder')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={config.outputFolder || ''}
                      readOnly
                      className="flex-grow px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg shadow-sm text-white"
                    />
                    <Button
                      onClick={selectOutputFolder}
                      variant="secondary"
                      className="whitespace-nowrap"
                    >
                      {t('settingsTab.selectFolder')}
                    </Button>
                  </div>
                </div>
              )}
              
              <Input
                label={t('settingsTab.animationDelay')}
                type="number"
                value={config.animationDelay || 5000}
                onChange={e => updateConfig('animationDelay', parseInt(e.target.value) || 5000)}
              />
            </div>
          </div>
          
          {/* Other Settings Section */}
          <div className="space-y-6">
            {/* Discord Settings */}
            <div className="bg-[rgba(17,24,39,0.3)] p-4 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-white">{t('settingsTab.discordSettings')}</h3>
              <div className="space-y-4">
                <Toggle
                  label={t('settingsTab.sendToDiscord')}
                  checked={config.sendToDiscord || false}
                  onChange={e => updateConfig('sendToDiscord', e.target.checked)}
                />
                
                {config.sendToDiscord && (
                  <Input
                    label={t('settingsTab.discordWebhook')}
                    type="text"
                    value={config.discordWebhook || ''}
                    onChange={e => updateConfig('discordWebhook', e.target.value)}
                  />
                )}
              </div>
            </div>
            
            {/* Browser Source Settings */}
            <div className="bg-[rgba(17,24,39,0.3)] p-4 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-white">{t('settingsTab.browserSource')}</h3>
              <div className="space-y-4">
                <Input
                  label={t('settingsTab.wsPort')}
                  type="number"
                  value={config.wsPort || 3456}
                  onChange={e => updateConfig('wsPort', parseInt(e.target.value) || 3456)}
                />
              </div>
            </div>
            
            {/* Language Settings */}
            <div className="bg-[rgba(17,24,39,0.3)] p-4 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-white">{t('settingsTab.language')}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('settingsTab.language')}
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      variant={config.language === 'en' ? 'primary' : 'secondary'}
                      onClick={() => handleLanguageChange('en')}
                    >
                      English
                    </Button>
                    <Button
                      variant={config.language === 'ja' ? 'primary' : 'secondary'}
                      onClick={() => handleLanguageChange('ja')}
                    >
                      日本語
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        // Force reset language to English
                        localStorage.setItem('irl-language', 'en');
                        updateConfig('language', 'en');
                        window.api.saveConfig({...config, language: 'en'});
                        window.location.reload();
                      }}
                    >
                      Reset to English
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-amber-400">{t('settingsTab.restartRequired')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
