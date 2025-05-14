const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
// Import OBS WebSocket v5 - using the default export
const OBSWebSocket = require('obs-websocket-js').default;
const Jimp = require('jimp');
const axios = require('axios');
const FormData = require('form-data');
const tmi = require('tmi.js');
const express = require('express');
const http = require('http');
let io;

let mainWindow;
const exampleConfigPath = path.join(__dirname, '../config.example.json');
const configPath = path.join(app.getPath('userData'), 'config.json');
const logsDir = path.join(path.dirname(app.getAppPath()), 'logs');

// Track recent chat commands for throttling
let twitchRequestLog = [];

function log(message) {
  console.log(message);
  // Send to renderer process for display
  if (mainWindow) mainWindow.webContents.send('log', message);
  
  // Ensure logs directory exists
  if (!fs.existsSync(logsDir)) {
    try {
      fs.mkdirSync(logsDir, { recursive: true });
    } catch (err) {
      console.error(`Failed to create logs directory: ${err.message}`);
      return;
    }
  }
  
  // Write to log file with timestamp and formatted message
  try {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    fs.appendFileSync(path.join(logsDir, `app-${now.toISOString().split('T')[0]}.log`), `[${formattedDate}] ${message}
`);
  } catch (err) {
    console.error(`Failed to write to log file: ${err.message}`);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 1200,
    title: 'IRLshots',
    autoHideMenuBar: true, // Hide menu bar by default
    frame: true, // Keep the window frame for dragging
    backgroundColor: '#242339', // Match the app's background color
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Remove application menu completely
  mainWindow.setMenu(null);
  
  // Ensure the window title is set correctly
  mainWindow.on('page-title-updated', (event) => {
    // Prevent the default title from being used (usually from HTML)
    event.preventDefault();
    // Force the title to be IRLshots
    mainWindow.setTitle('IRLshots');
  });
  
  // Also set the title after the window is created
  mainWindow.setTitle('IRLshots');
  
  // In production, use the bundled renderer code
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/renderer/index.html'));
  } else {
    // In development, use the dev server for hot reloading
    // But we'll check if we're running from the compiled executable first
    if (process.env.NODE_ENV === 'development') {
      mainWindow.loadURL('http://localhost:3000');
    } else {
      // If dev but not running through npm script, still use the bundled code
      mainWindow.loadFile(path.join(__dirname, '../dist/renderer/index.html'));
    }
  }
}

// Check for single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log('Another instance is already running. Quitting.');
  app.quit();
} else {
  // We are the first instance - continue initialization
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.webContents.send('log', 'Second instance attempted - focusing this window instead');
    }
  });

  app.whenReady().then(() => {
    createWindow();
    
    // Setup Twitch chat listener
    try {
      if (!fs.existsSync(configPath)) fs.copyFileSync(exampleConfigPath, configPath);
      const startupConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      
      // Start the browser source server
      startBrowserServer(startupConfig);
      
      // Set up Twitch if enabled
      if (startupConfig.twitch && startupConfig.twitch.enabled) {
        const twitchClient = new tmi.Client({ 
          identity: { 
            username: startupConfig.twitch.username, 
            password: startupConfig.twitch.oauthToken 
          }, 
          channels: [startupConfig.twitch.channel] 
        });
        
        twitchClient.connect()
          .then(() => log('Connected to Twitch chat'))
          .catch(err => log('Twitch chat error: ' + err.message));
          
        // Register Twitch chat message handler
        twitchClient.on('message', handleTwitchMessage);
      }
    } catch (err) {
      log('Error during startup: ' + err.message);
    }
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('load-config', async () => {
  try {
    if (!fs.existsSync(configPath)) {
      fs.copyFileSync(exampleConfigPath, configPath);
    }
    const data = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    log('Error loading config: ' + err.message);
    return null;
  }
});

ipcMain.handle('save-config', async (event, config) => {
  try {
    log('Saving config: ' + JSON.stringify(config.obs));
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (err) {
    log('Error saving config: ' + err.message);
    return false;
  }
});

// Reusable function for capturing a Polaroid snapshot
async function doTakePolaroid(config) {
  const obs = new OBSWebSocket();
  let imageData; // Declare at function scope so it's available throughout the function
  try {
    // v5 connection format according to docs
    log(`Connecting to OBS at ws://${config.obs.host}:${config.obs.port}`);
    await obs.connect(`ws://${config.obs.host}:${config.obs.port}`, config.obs.password);
    log('Connected to OBS');
    
    // Log available API calls for debugging
    if (!config.captureSource) {
      log('ERROR: No capture source specified');
      return { success: false, error: 'No capture source specified' };
    }
    log(`Taking screenshot of source: ${config.captureSource}`);
    
    // Use TakeSourceScreenshot API call - log the exact request
    // In OBS WebSocket v5, the API is 'GetSourceScreenshot' not 'TakeSourceScreenshot'
    const requestParams = { 
      sourceName: config.captureSource,
      imageFormat: 'png',
      imageWidth: config.imageWidth || 0,
      imageHeight: config.imageHeight || 0
    };
    log(`Request params: ${JSON.stringify(requestParams)}`);
    
    // Initialize a variable to hold the base64 image data
    let capturedImageData = null;
    
    try {
      // In OBS WebSocket v5, the correct API is 'SaveSourceScreenshot' not 'GetSourceScreenshot'
      log('Using SaveSourceScreenshot API - this is the correct one for OBS WebSocket v5');
      
      // Create a temporary file to save the screenshot
      const tmpFilePath = path.join(app.getPath('temp'), `obs-screenshot-${Date.now()}.png`);
      log(`Saving screenshot to temporary file: ${tmpFilePath}`);
      
      // Use the correct API call with minimum dimensions required by OBS WebSocket v5
      const response = await obs.call('SaveSourceScreenshot', {
        sourceName: config.captureSource,
        imageFormat: 'png',
        imageFilePath: tmpFilePath,
        imageWidth: config.imageWidth || 1280,  // 16:9 aspect ratio - HD resolution
        imageHeight: config.imageHeight || 720  // 16:9 aspect ratio - HD resolution
      });
      
      log('Screenshot saved to temporary file');
      
      // Read the saved file and convert to base64
      const imageBuffer = fs.readFileSync(tmpFilePath);
      capturedImageData = imageBuffer.toString('base64');
      
      // Clean up temporary file
      fs.unlinkSync(tmpFilePath);
      log('Temporary file deleted');
      log(`Screenshot response: ${JSON.stringify(response)}`);
      
      // No need to check for imageData in response since we're reading from file
      // Set the function-level imageData variable
      imageData = capturedImageData;
      log('Screenshot taken successfully');
    } catch (screenshotErr) {
      log(`Screenshot error: ${screenshotErr.message}`);
      throw screenshotErr;
    }
    
    // Skip template composition - we'll do this in the browser with CSS
    log('Skipping template compositing - using browser-based Polaroid effect');
    // Generate a timestamp for file naming, if saving is enabled
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    
    // Save the raw screenshot to disk if outputFolder is set
    if (config.outputFolder && config.outputFolder !== 'path/to/output/folder') {
      try {
        const filePath = path.join(config.outputFolder, `polaroid_${timestamp}.png`);
        fs.mkdirSync(config.outputFolder, { recursive: true });
        fs.writeFileSync(filePath, Buffer.from(imageData, 'base64'));
        log(`Saved raw screenshot to ${filePath}`);
      } catch (saveErr) {
        log(`Warning: Could not save to output folder: ${saveErr.message}`);
        // Continue even if saving fails - it's not critical
      }
    }
    
    // Send the image directly to the browser source for display
    // The browser will handle the Polaroid styling with CSS
    if (io) {
      log('Sending screenshot to browser source');
      io.emit('newSnapshot', { 
        imageData: imageData,
        animationDelay: config.animationDelay || 5000,
        animationDirection: config.animationDirection || 'left',
        timestamp: now.toLocaleString()
      });
    } else {
      log('WARNING: WebSocket server not initialized, cannot send to browser source');
    }
    
    // Send to Discord if enabled
    if (config.discord && config.discord.enabled && config.discord.webhookUrl) {
      try {
        log('Sending screenshot to Discord webhook');
        // Create a FormData to send the image to Discord
        const formData = new FormData();
        
        // Convert base64 to buffer
        const buffer = Buffer.from(imageData, 'base64');
        
        // Create a payload with the username and avatar
        const payload = {
          username: 'IRLshots Bot',
          content: `New screenshot taken at ${now.toLocaleString()}`
        };
        
        // Add the payload as part of form-data
        formData.append('payload_json', JSON.stringify(payload));
        
        // Add the file
        formData.append('file', buffer, {
          filename: `polaroid_${timestamp}.png`,
          contentType: 'image/png'
        });
        
        // Send to Discord webhook
        await axios.post(config.discord.webhookUrl, formData, {
          headers: formData.getHeaders()
        });
        
        log('Successfully sent image to Discord');
      } catch (discordErr) {
        log(`Error sending to Discord: ${discordErr.message}`);
      }
    }
    obs.disconnect();
    return { success: true, imageData };
  } catch (err) {
    log('Error: ' + err.message);
    return { success: false, error: err.message };
  }
}

ipcMain.handle('take-polaroid', (event, config) => doTakePolaroid(config));

// Reusable function for test animation
async function doTestAnimation(config) {
  try {
    // Generate a test pattern
    log('Creating test image for browser source');
    
    // Create a simple colored rectangle as test image
    const width = config.imageWidth || 800;
    const height = config.imageHeight || 600;
    
    // Create a new Jimp image with blue background
    const image = new Jimp(width, height, 0x3498dbff); // Blue color
    
    // Add some text using Jimp
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    await image.print(font, width/2 - 150, height/2 - 50, 'Test Image');
    await image.print(font, width/2 - 150, height/2 + 20, new Date().toLocaleString());
    
    // Convert to base64
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    const base64Data = buffer.toString('base64');
    
    // Send to browser source
    if (io) {
      log('Sending test image to browser source');
      io.emit('testAnimation', { 
        imageData: base64Data,
        animationDelay: config.animationDelay || 5000,
        animationDirection: config.animationDirection || 'left'
      });
      return { success: true };
    } else {
      throw new Error('WebSocket server not initialized');
    }
  } catch (err) {
    log('Test animation error: ' + err.message);
    return { success: false, error: err.message };
  }
}

ipcMain.handle('test-animation', (event, config) => doTestAnimation(config));

// connect to OBS and list sources
ipcMain.handle('connect-obs', async (event, config) => {
  const obs = new OBSWebSocket();
  try {
    log('Connect OBS handler called with config');
    await obs.connect(`ws://${config.obs.host}:${config.obs.port}`, config.obs.password);
    log(`Connected to OBS at ${config.obs.host}:${config.obs.port}`);
    
    // Get scenes list
    const { scenes } = await obs.call('GetSceneList');
    log(`Found ${scenes.length} scenes`);
    
    // Get list of inputs (sources) that can be captured
    const { inputs } = await obs.call('GetInputList');
    log(`Found ${inputs.length} inputs`);
    
    // Get all scene items to map sources to scenes
    const sourcesByScene = {};
    const enhancedSources = [];
    
    // Process scenes and their items
    for (const scene of scenes) {
      try {
        const { sceneItems } = await obs.call('GetSceneItemList', { sceneName: scene.sceneName });
        
        // Add scene items to the scene map
        sceneItems.forEach(item => {
          const sourceName = item.sourceName;
          const sourceType = item.sourceType;
          
          enhancedSources.push({
            name: sourceName,
            type: sourceType,
            scene: scene.sceneName
          });
        });
      } catch (sceneErr) {
        log(`Error getting items for scene ${scene.sceneName}: ${sceneErr.message}`);
      }
    }
    
    // Add inputs that may not be in scenes
    inputs.forEach(input => {
      if (!enhancedSources.some(source => source.name === input.inputName)) {
        enhancedSources.push({
          name: input.inputName,
          type: 'OBS_SOURCE_TYPE_INPUT',
          inputKind: input.inputKind
        });
      }
    });
    
    log(`Processed ${enhancedSources.length} total sources with scene information`);
    
    return {
      scenes,
      sources: enhancedSources
    };
  } catch (err) {
    log(`OBS connection error: ${err.message}`);
    throw err;
  }
});

// File/folder pickers for renderer
ipcMain.handle('select-template', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }]
  });
  return canceled ? null : filePaths[0];
});

ipcMain.handle('select-output-folder', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return canceled ? null : filePaths[0];
});

// Handle Twitch chat messages
async function handleTwitchMessage(channel, userstate, message, self, config) {
  if (self) return;

  // Get the current config
  const startupConfig = config || JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  // Get the configured command without any ! prefix for consistency
  const configuredCommand = startupConfig.twitch.command.replace(/^!+/, '');
  // Extract the actual command from the message
  const messageCommand = message.trim().split(' ')[0].replace(/^!+/, '');
  
  // Check if the command matches (case insensitive)
  if (messageCommand.toLowerCase() === configuredCommand.toLowerCase()) {
    // Check for request throttling to prevent spam
    const now = Date.now();
    const recentRequests = twitchRequestLog.filter(time => now - time < 10000); // Last 10 seconds
    
    if (recentRequests.length >= 3) {
      // Too many requests in the past 10 seconds, throttle
      log(`Throttling !${configuredCommand} from ${userstate.username} - too many recent requests (${recentRequests.length})`);
      return;
    }
    
    // Add current request to the log
    twitchRequestLog.push(now);
    // Keep only recent requests in the log
    twitchRequestLog = twitchRequestLog.filter(time => now - time < 60000);
    
    // Check user permission based on config setting
    const permissions = startupConfig.twitch.permissions || { everyone: true };
    let hasPermission = false;
    
    // Check if user has permission based on their badges
    if (permissions.everyone) {
      hasPermission = true;
    } else {
      const hasBroadcasterBadge = userstate.badges && userstate.badges.broadcaster === '1';
      const hasModeratorBadge = userstate.badges && userstate.badges.moderator === '1';
      const hasVipBadge = userstate.badges && userstate.badges.vip === '1';
      const hasSubscriberBadge = userstate.badges && userstate.badges.subscriber !== undefined;
      
      hasPermission = 
        (permissions.broadcaster && hasBroadcasterBadge) ||
        (permissions.moderator && (hasModeratorBadge || hasBroadcasterBadge)) ||
        (permissions.vip && (hasVipBadge || hasModeratorBadge || hasBroadcasterBadge)) ||
        (permissions.subscriber && (hasSubscriberBadge || hasVipBadge || hasModeratorBadge || hasBroadcasterBadge));
    }
    
    if (hasPermission) {
      log(`Chat command !${configuredCommand} triggered by ${userstate.username} (${userstate.badges ? Object.keys(userstate.badges).join(', ') : 'no badges'})`);
      await doTakePolaroid(startupConfig);
    }
  }
}

// Browser source HTTP+WebSocket server
function startBrowserServer(config) {
  const expApp = express();
  const server = http.createServer(expApp);
  io = require('socket.io')(server, { cors: { origin: '*' } });
  expApp.use(express.static(path.join(__dirname, '../public/browser')));
  const port = config.wsPort || 3456;
  server.listen(port, () => log(`Browser Source Server listening on http://localhost:${port}`));
}

// This duplicate code has been removed and merged into the main app.whenReady() handler above