import React, { createContext, useState, useEffect } from 'react';
import ObsService from '../services/ObsService';
import ConfigService from '../services/ConfigService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [obsConnected, setObsConnected] = useState(false);
  const [sceneList, setSceneList] = useState([]);
  const [sourcesByScene, setSourcesByScene] = useState({});

  // Load config on startup
  useEffect(() => {
    window.api.onLog(msg => setLogs(prev => [...prev, msg]));
    // Use ConfigService to load configuration
    ConfigService.loadConfig()
      .then(cfg => {
        setConfig(cfg);
        
        // Auto-connect to OBS if enabled
        if (cfg.autoConnect) {
          window.api.onLog('Auto-connecting to OBS...');
          setTimeout(() => {
            connectToObs().catch(err => {
              window.api.onLog(`Auto-connect failed: ${err.message}`);
            });
          }, 1000); // Small delay to ensure UI is ready
        }
      })
      .catch(err => window.api.onLog(`Error loading config: ${err.message}`));
  }, []);

  // Function to update config using ConfigService
  const updateConfig = (path, value) => {
    const newConfig = ConfigService.updateConfigProperty(config, path, value);
    // Update state without automatically saving to disk
    setConfig(newConfig);
  };

  // Save config to disk using ConfigService
  const saveConfig = async () => {
    if (config) {
      try {
        console.log('Saving config with language:', config.language);
        await window.api.saveConfig(config);
        window.api.onLog('Configuration saved');
      } catch (error) {
        window.api.onLog(`Error saving configuration: ${error.message}`);
      }
    }
  };

  // Function to handle OBS connection using ObsService
  const connectToObs = async () => {
    try {
      // Ensure we have a valid OBS configuration
      if (!config.obs || !config.obs.host) {
        window.api.onLog('Missing OBS configuration. Using default values.');
        // Set default values if missing
        updateConfig('obs', {
          host: 'localhost',
          port: 4455,
          password: ''
        });
      }
      
      const obsConfig = config.obs || {
        host: 'localhost',
        port: 4455,
        password: ''
      };
      
      window.api.onLog(`Connecting to OBS at ${obsConfig.host}:${obsConfig.port}`);
      const result = await ObsService.connectToObs(obsConfig);
      
      if (result.sources && result.sources.length) {
        // Structure sources by scene
        const sourceMap = {};
        const scenes = [];
        
        // Extract scenes and organize sources by scene
        result.scenes.forEach(scene => {
          const sceneName = scene.sceneName;
          scenes.push(sceneName);
          sourceMap[sceneName] = [];
        });
        
        // Process all sources
        result.sources.forEach(source => {
          // Add to appropriate scene
          if (source.scene && sourceMap[source.scene]) {
            sourceMap[source.scene].push(source);
          }
        });
        
        setSceneList(scenes);
        setSourcesByScene(sourceMap);
        setObsConnected(true);
        
        // Set first source as default if not already set
        if (!config.captureSource && result.sources.length > 0) {
          updateConfig('captureSource', result.sources[0].name);
        }
        
        window.api.onLog(`OBS connected. ${result.sources.length} sources loaded across ${scenes.length} scenes.`);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'No sources found. Check if OBS is running with websocket enabled'
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Function to take a polaroid using ObsService
  const takePolaroid = async () => {
    if (!obsConnected) return { success: false, error: "OBS not connected" };
    
    try {
      const result = await ObsService.takePolaroid(config);
      if (result.success) {
        window.api.onLog('Polaroid taken');
        return { success: true };
      } else {
        window.api.onLog('Error taking polaroid: ' + result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      window.api.onLog('Error taking polaroid: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  // Function to test animation using ObsService
  const testAnimation = async () => {
    if (!obsConnected) return { success: false, error: "OBS not connected" };
    
    try {
      const result = await ObsService.testAnimation(config);
      if (result.success) {
        window.api.onLog('Animation test successful');
        return { success: true };
      } else {
        window.api.onLog('Animation test error: ' + result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      window.api.onLog('Animation test error: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  // Value object to provide through the context
  const value = {
    config,
    logs,
    activeTab,
    setActiveTab,
    obsConnected,
    sceneList,
    sourcesByScene,
    updateConfig,
    saveConfig,
    connectToObs,
    takePolaroid,
    testAnimation
  };

  return config ? (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl font-semibold animate-pulse">Loading...</div>
    </div>
  );
};

export default AppProvider;