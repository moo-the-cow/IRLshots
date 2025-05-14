/**
 * Service for OBS WebSocket API communication
 * 
 * This service handles all interactions with OBS WebSocket,
 * making it easier to maintain and extend the application
 */

// Note: Using the default export syntax that fixed the OBS WebSocket connection issues
const connectToObs = async (obsConfig) => {
  try {
    // Make sure we're passing the complete obsConfig object with host, port, and password
    if (!obsConfig || !obsConfig.host) {
      return { success: false, error: 'Invalid OBS configuration: missing host' };
    }
    // The main process expects a full config object with the obs property
    const fullConfig = { obs: obsConfig };
    const result = await window.api.connectObs(fullConfig);
    return result;
  } catch (error) {
    console.error('OBS Connection error:', error);
    return { success: false, error: error.message };
  }
};

const takePolaroid = async (config) => {
  try {
    const result = await window.api.takePolaroid(config);
    return { success: true, result };
  } catch (error) {
    console.error('Take polaroid error:', error);
    return { success: false, error: error.message };
  }
};

const testAnimation = async (config) => {
  try {
    const result = await window.api.testAnimation(config);
    return { success: true, result };
  } catch (error) {
    console.error('Test animation error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  connectToObs,
  takePolaroid,
  testAnimation
};
