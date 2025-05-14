/**
 * Service for configuration management
 * 
 * This service handles loading, saving, and updating configuration settings
 */

const loadConfig = async () => {
  try {
    const config = await window.api.loadConfig();
    
    // Initialize twitch permissions if not already set
    if (config.twitch && config.twitch.permissionLevel && !config.twitch.permissions) {
      // Convert old permissionLevel to new permissions format
      const permLevel = config.twitch.permissionLevel;
      config.twitch.permissions = {
        everyone: permLevel === 'everyone',
        subscriber: permLevel === 'subscriber',
        vip: permLevel === 'vip',
        moderator: permLevel === 'moderator',
        broadcaster: permLevel === 'broadcaster'
      };
    } else if (config.twitch && !config.twitch.permissions) {
      config.twitch.permissions = { everyone: true };
    }
    
    return config;
  } catch (error) {
    console.error('Load config error:', error);
    throw error;
  }
};

const saveConfig = async (config) => {
  try {
    const result = await window.api.saveConfig(config);
    return result;
  } catch (error) {
    console.error('Save config error:', error);
    throw error;
  }
};

/**
 * Helper function to update a nested config property using a path string
 * Example: updateConfigProperty(config, 'twitch.enabled', true)
 */
const updateConfigProperty = (config, path, value) => {
  const newConfig = { ...config };
  const parts = path.split('.');
  let current = newConfig;
  
  // Navigate to the proper nesting level
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  
  // Set the value
  current[parts[parts.length - 1]] = value;
  
  return newConfig;
};

export default {
  loadConfig,
  saveConfig,
  updateConfigProperty
};
