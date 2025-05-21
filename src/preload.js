const { contextBridge, ipcRenderer } = require('electron');
const electronUtil = require('electron-util');
//const path = require('path');

// Better debugging for exposed APIs
console.log('Setting up API bridge');

const apiMethods = {
  loadConfig: () => {
    console.log('loadConfig called');
    return ipcRenderer.invoke('load-config');
  },
  saveConfig: (config) => {
    console.log('saveConfig called with:', config);
    return ipcRenderer.invoke('save-config', config);
  },
  takePolaroid: (config) => {
    console.log('takePolaroid called');
    return ipcRenderer.invoke('take-polaroid', config);
  },
  connectObs: (config) => {
    console.log('connectObs called with:', config);
    return ipcRenderer.invoke('connect-obs', config);
  },
  testAnimation: (config) => {
    console.log('testAnimation called');
    return ipcRenderer.invoke('test-animation', config);
  },
  selectTemplate: () => {
    console.log('selectTemplate called');
    return ipcRenderer.invoke('select-template');
  },
  selectOutputFolder: () => {
    console.log('selectOutputFolder called');
    return ipcRenderer.invoke('select-output-folder');
  },
  onLog: (callback) => {
    console.log('Setting up log listener');
    return ipcRenderer.on('log', (event, message) => {
      console.log('Log received:', message);
      callback(message);
    });
  },
  /*utils: {
    normalizePath: (p) => path.normalize(p)
  }*/
  utils: {
    normalizePath: (path) => electronUtil.normalizePath(path)
  }
};

contextBridge.exposeInMainWorld('api', apiMethods);
console.log('API bridge setup complete');
