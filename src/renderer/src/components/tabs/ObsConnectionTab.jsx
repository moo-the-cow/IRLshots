import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import { Toggle, Button, Input, Select } from '../common/StyledInputs';

const ObsConnectionTab = () => {
  const { 
    config, 
    updateConfig, 
    obsConnected, 
    connectToObs, 
    takePolaroid, 
    testAnimation,
    sceneList,
    sourcesByScene
  } = useContext(AppContext);
  
  const { t } = useContext(LanguageContext);
  
  const [connectionError, setConnectionError] = useState('');
  // Initialize filters with null scene if not selected yet
  const [sourceFilter, setSourceFilter] = useState({
    scene: config.selectedScene || null,
    type: 'All Types'
  });
  
  // When scene list changes, update selected scene if previously selected
  useEffect(() => {
    if (sceneList && sceneList.length > 0) {
      // If we have previously selected scene and it's in the list, select it
      if (config.selectedScene && sceneList.includes(config.selectedScene)) {
        setSourceFilter(prev => ({ ...prev, scene: config.selectedScene }));
      } else {
        // Otherwise select the first scene
        setSourceFilter(prev => ({ ...prev, scene: sceneList[0] }));
        updateConfig('selectedScene', sceneList[0]);
      }
    }
  }, [sceneList]);

  // Filter sources based on scene and type filters
  const getFilteredSources = () => {
    if (!sceneList || sceneList.length === 0 || !sourceFilter.scene) return [];
    
    // Get sources for the selected scene
    const sceneSources = sourcesByScene[sourceFilter.scene] || [];
    
    // Apply type filter if needed
    if (sourceFilter.type !== 'All Types') {
      return sceneSources.filter(src => src.type === sourceFilter.type);
    }
    
    return sceneSources;
  };

  const handleConnectObs = async () => {
    setConnectionError('');
    try {
      const result = await connectToObs();
      if (!result.success) {
        setConnectionError(result.error || 'Failed to connect to OBS');
      }
    } catch (error) {
      setConnectionError(`Connection failed: ${error.message}`);
    }
  };

  const handleSceneChange = (sceneName) => {
    setSourceFilter(prev => ({ ...prev, scene: sceneName }));
    updateConfig('selectedScene', sceneName);
  };

  return (
    <div className="bg-[rgba(17,24,39,0.4)] rounded-2xl shadow-md p-8 border border-gray-800 backdrop-blur-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t('obsTab.title')}
        </h2>

        {!obsConnected ? (
          <div className="bg-[rgba(17,24,39,0.3)] p-6 rounded-xl shadow-inner border border-gray-800">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Input
                label={t('obsTab.host')}
                type="text"
                value={config.obs?.host || 'localhost'}
                onChange={e => updateConfig('obs.host', e.target.value)}
              />
              <Input
                label={t('obsTab.port')}
                type="number"
                value={config.obs?.port || 4455}
                onChange={e => updateConfig('obs.port', parseInt(e.target.value) || 4455)}
              />
              <Input
                label={t('obsTab.password')}
                type="password"
                value={config.obs?.password || ''}
                onChange={e => updateConfig('obs.password', e.target.value)}
              />
            </div>
            
            {/* Auto-connect toggle */}
            <div className="mb-6">
              <Toggle
                label={t('obsTab.autoConnect')}
                checked={config.autoConnect || false}
                onChange={e => updateConfig('autoConnect', e.target.checked)}
              />
            </div>

            {connectionError && (
              <div className="bg-red-500/20 border border-red-600/40 text-white px-4 py-3 rounded-lg mb-6">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{t('obsTab.connectionError', { error: connectionError })}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleConnectObs}
              variant="primary"
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {t('obsTab.connect')}
            </Button>
          </div>
        ) : (
          <>
            {/* Browser Source URL */}
            <div className="mt-5 mb-6 p-4 border border-gray-700 rounded-lg bg-[rgba(17,24,39,0.4)] backdrop-blur-sm">
              <h3 className="font-semibold mb-2 text-white flex items-center">
                <span className="mr-2">📺</span>
                Browser Source URL
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`http://localhost:${config.wsPort || 3456}`}
                  className="flex-grow p-2 border border-gray-700 rounded bg-[#2d2b42] text-white text-sm"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`http://localhost:${config.wsPort || 3456}`);
                    window.api.onLog('Browser source URL copied to clipboard');
                  }}
                  variant="secondary"
                  className="text-sm"
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Add this URL as a Browser Source in OBS to display the Polaroids
              </p>
            </div>

            {/* Scene Selection */}
            <div className="mt-6 mb-4 p-4 border border-gray-700 rounded-lg bg-[rgba(17,24,39,0.4)] backdrop-blur-sm">
              <h3 className="font-semibold mb-3 text-white">{t('obsTab.scene')}</h3>
              <Select
                value={sourceFilter.scene || ''}
                onChange={e => handleSceneChange(e.target.value)}
                options={sceneList.map(scene => ({ value: scene, label: scene }))}
              />
            </div>

            {/* Source Selection */}
            {sourceFilter.scene && (
              <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-[rgba(17,24,39,0.4)] backdrop-blur-sm">
                <h3 className="font-semibold mb-3 text-white">{t('obsTab.source')}</h3>
                <Select
                  value={config.captureSource || ''}
                  onChange={e => updateConfig('captureSource', e.target.value)}
                  options={getFilteredSources().map(src => ({ 
                    value: src.name, 
                    label: src.name
                  }))}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                onClick={takePolaroid}
                variant="success"
                className="flex items-center gap-2"
                disabled={!config.captureSource}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('obsTab.takeScreenshot')}
              </Button>
                            
              <Button
                onClick={testAnimation}
                variant="info"
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('obsTab.testButton')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ObsConnectionTab;
